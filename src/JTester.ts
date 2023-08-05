import JTLogger from './JTLogger'
import { Config } from './types'

type TestData = { fn: Function; time: number, processed: boolean }

export default class JTester {
  _logger: JTLogger = new JTLogger()
  _config: Config
  _testData: TestData[] = []

  constructor(config: Config) {
    this._config = config
  }
  test(fn: Function = undefined): JTester {
    const test: TestData = {
      fn,
      time: 0,
      processed: false,
    }
    this._testData.push(test)
    if (this._config.autorun) this.run()
    return this
  }
  run(): JTester {
    this._testData = this._testData.map((test) => {
      if (!test.processed) {
        const start = new Date().getTime()
        test.fn()
        const end = new Date().getTime()
        test.time = end - start
        test.processed = true
      }
      return test
    })
    return this
  }
  showAnalysis(): JTester {
    for (const [i, test] of this._testData.entries())
      if (test.processed)
        this._logger.addTest(`Test #${i + 1}`, test.time, test.fn)
    this._logger.log()
    return this
  }
  getAnalysis() {

  }
}
