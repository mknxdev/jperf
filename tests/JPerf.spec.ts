import { test, expect } from '@jest/globals'
import { TestAnalysis } from '@src/types'
import { PKG_VERSION } from '@src/constants'
import JPerf from '@src/JPerf'
// import JTLogger from '@src/JTLogger'

// const jtloggerMock = jest.mock('@src/JTLogger')

let consoleLog = console.log
let consoleLogMock
let jperf: JPerf

beforeAll(() => {
  consoleLogMock = jest.fn((_) => undefined)
  console.log = consoleLogMock
})
afterEach(() => {
  consoleLogMock.mockClear()
  jperf = undefined
})
afterAll(() => {
  consoleLogMock.mockRestore()
  console.log = consoleLog
})

describe('JPerf', () => {
  test('.test', () => {
    jperf = new JPerf({ autorun: true, verbose: false })
    expect(
      jperf.test(() => {
        const foo = 'bar'
      }),
    ).toEqual(jperf)
    expect(
      jperf.test('#test', () => {
        const baz = 'foofoo'
      }),
    ).toEqual(jperf)
  })
  test('.run', () => {
    jperf = new JPerf({ autorun: true, verbose: false })
    expect(jperf.run()).toEqual(jperf)
  })

  test('.showAnalysis', () => {
    // Empty
    jperf = new JPerf({ autorun: true, verbose: false })
    expect(jperf.showAnalysis()).toEqual(jperf)
    // 1 test
    jperf.test(() => {})
    jperf.showAnalysis()
  })

  test('.log', () => {
    // Empty
    jperf = new JPerf({ autorun: true, verbose: false })
    expect(jperf.log()).toEqual(jperf)
    // 1 test
    jperf.test(() => {})
    jperf.log()
  })

  test('.getAnalysis', () => {
    jperf = new JPerf({ autorun: true, verbose: false })
    // Empty
    // - JS
    const emptyJsDefault = jperf.getAnalysis() as TestAnalysis
    const emptyJs = jperf.getAnalysis('js') as TestAnalysis
    expect(emptyJsDefault).toHaveProperty('version')
    expect(emptyJsDefault).toHaveProperty('tests')
    expect(emptyJsDefault.tests.length).toBe(0)
    expect(emptyJs).toHaveProperty('version')
    expect(emptyJs).toHaveProperty('tests')
    expect(emptyJs.tests.length).toBe(0)
    // - JSON
    const emptyOutput = { version: PKG_VERSION, tests: [] }
    const emptyJson = JSON.parse(jperf.getAnalysis('json') as string)
    expect(emptyJson).toEqual(emptyOutput)
    // - XML
    const emptyXml = `
      <?xml version="1.0" encoding="UTF-8" ?><analysis><version>${PKG_VERSION}</version><tests></tests></analysis>
    `.trim()
    expect(jperf.getAnalysis('xml')).toBe(emptyXml)
    // 1 test
    jperf.test(() => {})
    // - JS
    const oneTestJsDefault = jperf.getAnalysis() as TestAnalysis
    const oneTestJs = jperf.getAnalysis('js') as TestAnalysis
    expect(oneTestJsDefault.tests.length).toBe(1)
    expect(oneTestJs.tests.length).toBe(1)
    // - JSON
    const oneTestOutput = {
      version: PKG_VERSION,
      tests: [{ name: 'anonymous #0', runtime: 0 }],
    }
    const oneTestJson = JSON.parse(jperf.getAnalysis('json') as string)
    expect(oneTestJson).toEqual(oneTestOutput)
    const oneTestXml = `
      <?xml version="1.0" encoding="UTF-8" ?><analysis><version>${PKG_VERSION}</version><tests><test><name>anonymous #0</name><runtime>0</runtime></test></tests></analysis>
    `.trim()
    expect(jperf.getAnalysis('xml')).toBe(oneTestXml)
  })
})
