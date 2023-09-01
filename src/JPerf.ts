import JPLogger from './JPLogger'
import { TestData, RawTestStepsContainer, TickTestData, TestAnalysis, Config, TestStep } from './types'
import { PKG_VERSION } from './constants'
import { getRunningMode, getHardwareDetails } from './utils'
import { validTest } from './validator'

export default class JPerf {
  _mode: string = getRunningMode()
  _hwDetails = getHardwareDetails()
  _config: Config
  _tests: TestData[] = []
  _testSteps: RawTestStepsContainer = {}
  _tickedTest: TickTestData = {
    name: undefined,
    index: 0,
    start: undefined,
    end: undefined,
    time: undefined,
  }
  _logger: JPLogger

  constructor(config: Config) {
    this._config = config
    this._logger = new JPLogger(
      config.verbose,
      config.hardwareDetails,
      this._hwDetails,
      config.mode,
      config.selector,
    )
  }
  _defineTestStep = (testName: string): void => {
    this._testSteps[testName].push(new Date())
  }
  _resetTickedTest(): void {
    this._tickedTest.name = undefined
    this._tickedTest.start = undefined
    this._tickedTest.end = undefined
    this._tickedTest.time = undefined
  }
  _getComputedTestSteps(testName: string): TestStep[] {
    const test = this._tests.filter((t) => t.name === testName)[0]
    const testSteps = this._testSteps[testName]
    const steps = testSteps ? testSteps.map(s => s.getTime()) : []
    if (steps.length) steps.push(test.end)
    return steps.map((s: number, i: number) => {
      const runtime = !i ? s - test.start : s - steps[i - 1]
      return {
        index: i,
        runtime,
        percentage: runtime / test.time * 100
      }
    })
  }
  _getComputedAnalysis(): TestAnalysis {
    return {
      version: PKG_VERSION,
      global: {
        runtime: this._tests.reduce((value, test) => {
          value += test.time
          return value
        }, 0)
      },
      tests: this._tests.map((test) => ({
        name: test.name,
        runtime: test.time,
        steps: this._getComputedTestSteps(test.name).map((step, i): TestStep => ({
          index: i,
          runtime: step.runtime,
          percentage: step.percentage,
        }))
      })),
    }
  }
  _formatAnalysisAsJSON() {
    return JSON.stringify(this._getComputedAnalysis())
  }
  _formatAnalysisAsXML() {
    const analysis = this._getComputedAnalysis()
    let output: string = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <analysis>
        <version>${analysis.version}</version>
        <global>
          <runtime>${analysis.global.runtime}</runtime>
        </global>
        <tests>
    `.trim()
    for (const test of analysis.tests) {
      output += `
        <test>
          <name>${test.name}</name>
          <runtime>${test.runtime}</runtime>
          <steps>`.trim()
      for (const step of test.steps)
        output += `
          <step>
            <runtime>${step.runtime}</runtime>
            <percentage>${step.percentage}</percentage>
          </step>
        `.trim()
      output += `</steps>
        </test>
      `.trim()
    }
    output += `
        </tests>
      </analysis>
    `.trim()
    output = output.replace(/>[ \r\n]*/gi, '>').replace(/[ \r\n]*</gi, '<')
    return output
  }
  test(nameOrFn: string | Function, fn?: Function): JPerf {
    if (validTest(nameOrFn, fn)) {
      const func = typeof nameOrFn === 'function' ? nameOrFn : fn
      const { anonymousTestName, anonymousTestIndex } = this._config
      const index: number = anonymousTestIndex + this._tests.length
      const name =
        typeof nameOrFn === 'function'
          ? `${anonymousTestName} #${index}`
          : nameOrFn
      const test: TestData = {
        fn: func,
        name,
        index,
        start: 0,
        end: 0,
        time: 0,
        processed: false,
      }
      this._tests.push(test)
      this._testSteps[name] = []
      if (this._config.autorun) this.run()
      return this
    }
  }
  tick(testName?: string): void {
    const { anonymousTestName, anonymousTestIndex } = this._config
    if (!this._tickedTest.start) {
      // start first test
      this._tickedTest.index = anonymousTestIndex
      this._tickedTest.name = testName || `${anonymousTestName} #${this._tickedTest.index}`
      this._testSteps[this._tickedTest.name] = []
      this._tickedTest.start = new Date().getTime()
    } else {
      // complete test
      this._tickedTest.index = anonymousTestIndex + this._tests.length
      this._tickedTest.name = testName || `${anonymousTestName} #${this._tickedTest.index}`
      this._tickedTest.end = new Date().getTime()
      this._tests.push({
        name: this._tickedTest.name,
        index: this._tickedTest.index,
        start: this._tickedTest.start,
        end: this._tickedTest.end,
        time: this._tickedTest.end - this._tickedTest.start,
        processed: true,
      })
      // Start new test
      this._tickedTest.index = anonymousTestIndex + this._tests.length
      this._tickedTest.name = testName || `${anonymousTestName} #${this._tickedTest.index}`
      this._testSteps[this._tickedTest.name] = []
      this._tickedTest.start = new Date().getTime()
    }
  }
  step(): void {
    this._defineTestStep(this._tickedTest.name)
  }
  _(): void {
    this.step()
  }
  run(): JPerf {
    this._tests = this._tests.map((test) => {
      if (!test.processed) {
        const start = new Date().getTime()
        test.fn(() => {
          this._defineTestStep(test.name)
        })
        const end = new Date().getTime()
        test.start = start
        test.end = end
        test.time = end - start
        test.processed = true
      }
      return test
    })
    return this
  }
  showAnalysis(): JPerf {
    for (const [_, test] of this._tests.entries())
      if (test.processed) {
        if (this._config.verbose)
          this._logger.addTest(
            test.name,
            test.time,
            this._getComputedTestSteps(test.name)
          )
        else
          this._logger.addTest(test.name, test.time)
      }
    this._logger.log()
    return this
  }
  log(): JPerf {
    return this.showAnalysis()
  }
  getAnalysis(format = 'js'): TestAnalysis | string {
    return {
      js: this._getComputedAnalysis(),
      json: this._formatAnalysisAsJSON(),
      xml: this._formatAnalysisAsXML(),
    }[format]
  }
}
