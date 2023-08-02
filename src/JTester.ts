import JTLogger from './JTLogger'
import { Config } from './types'

export default class JTester {
  _logger: JTLogger = new JTLogger()
  _config: Config
  _testData: { fn: Function; time: number }[] = []

  constructor(config: Config) {
    this._config = config
  }
  test(fn: Function = undefined) {
    const test = {
      fn,
      time: 0
    }
    const start = new Date().getTime()
    test.fn()
    const end = new Date().getTime()
    test.time = end - start
    this._testData.push(test)
  }
  tick(): void {

  }
  showAnalysis(): void {
    for (const [i, test] of this._testData.entries())
      this._logger.addTest(`Test #${i + 1}`, test.time, test.fn)
    this._logger.log()
  }
}
