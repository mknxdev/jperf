type Config = {}

export default class JTester {
  _config: Config
  _testData: { fn: Function; time: number; ran: boolean }[] = []

  constructor(config: Config) {
    this._config = config
  }
  addTestFn(fn: Function) {
    this._testData.push({ fn, time: 0, ran: false })
  }
  run(): void {
    for (const test of this._testData) {
      const start = new Date().getTime()
      test.fn()
      const end = new Date().getTime()
      test.time = end - start
      test.ran = true
    }
  }
}
