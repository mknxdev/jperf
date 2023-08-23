import JPLogger from './JPLogger'
import { TestData, TickTestData, TestAnalysis, Config } from './types'
import { PKG_VERSION } from './constants'
import { getRunningMode, getHardwareDetails } from './utils'
import { validTest } from './validator'

export default class JPerf {
  _mode: string = getRunningMode()
  _hwDetails = getHardwareDetails()
  _config: Config
  _testData: TestData[] = []
  _testDataSteps = {}
  _tickedTest: TickTestData = {
    name: undefined,
    start: undefined,
    end: undefined,
    time: undefined,
  }
  _logger: JPLogger

  constructor(config: Config) {
    this._config = config
    this._logger = new JPLogger(config.verbose, this._hwDetails)
  }
  _defineTestStep = (testName: string): void => {
    this._testDataSteps[testName].push(new Date())
  }
  _resetTickedTest(): void {
    this._tickedTest.name = undefined
    this._tickedTest.start = undefined
    this._tickedTest.end = undefined
    this._tickedTest.time = undefined
  }
  _getComputedTestSteps(testName: string) {
    const test = this._testData.filter((t) => t.name === testName)[0]
    const steps = this._testDataSteps[testName].map(s => s.getTime())
    if (steps.length) steps.push(test.end)
    return steps.map((s, i) => {
      return {
        runtime: !i ? s - test.start : s - steps[i - 1]
      }
    })
  }
  _getFormattedAnalysis(): TestAnalysis {
    return {
      version: PKG_VERSION,
      tests: this._testData.map((test) => ({
        name: test.name,
        runtime: test.time,
      })),
    }
  }
  _formatAnalysisAsJSON() {
    return JSON.stringify(this._getFormattedAnalysis())
  }
  _formatAnalysisAsXML() {
    const analysis = this._getFormattedAnalysis()
    let output: string = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <analysis>
        <version>${analysis.version}</version>
        <tests>
    `.trim()
    for (const test of this._testData)
      output += `
        <test>
          <name>${test.name}</name>
          <runtime>${test.time}</runtime>
        </test>
      `.trim()
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
      const index: number = anonymousTestIndex + this._testData.length
      const name =
        typeof nameOrFn === 'function'
          ? `${anonymousTestName} #${index}`
          : nameOrFn
      const test: TestData = {
        fn: func,
        name,
        start: 0,
        end: 0,
        time: 0,
        processed: false,
      }
      this._testData.push(test)
      this._testDataSteps[name] = []
      if (this._config.autorun) this.run()
      return this
    }
  }
  run(): JPerf {
    this._testData = this._testData.map((test) => {
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
  tick(testName?: string): void {
    const { anonymousTestName, anonymousTestIndex } = this._config
    const index: number = anonymousTestIndex + this._testData.length
    const name = testName || `${anonymousTestName} #${index}`
    if (!this._tickedTest.start) {
      this._tickedTest.name = name
      this._tickedTest.start = new Date().getTime()
    } else {
      this._tickedTest.end = new Date().getTime()
      this._testData.push({
        name: this._tickedTest.name,
        start: this._tickedTest.start,
        end: this._tickedTest.end,
        time: this._tickedTest.end - this._tickedTest.start,
        processed: true
      })
      this._tickedTest.name = name
      this._tickedTest.start = new Date().getTime()
    }
  }
  showAnalysis(): JPerf {
    for (const [_, test] of this._testData.entries())
      if (test.processed) {
        if (this._config.verbose)
          this._logger.addTest(
            test.name,
            test.time,
            test.fn,
            this._getComputedTestSteps(test.name)
          )
        else
          this._logger.addTest(test.name, test.time, test.fn)
      }
    this._logger.log()
    return this
  }
  log(): JPerf {
    return this.showAnalysis()
  }
  getAnalysis(format = 'js'): TestAnalysis | string {
    return {
      js: this._getFormattedAnalysis(),
      json: this._formatAnalysisAsJSON(),
      xml: this._formatAnalysisAsXML(),
    }[format]
  }
}
