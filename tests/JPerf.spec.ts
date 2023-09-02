import { test, expect } from '@jest/globals'
import { Config, TestAnalysis } from '@src/types'
import { PKG_VERSION } from '@src/constants'
import JPerf from '@src/JPerf'

const defaultConfig: Config = {
  autorun: true,
  verbose: false,
  hardwareDetails: false,
  anonymousTestName: 'anonymous',
  anonymousTestIndex: 0,
  selector: undefined,
  output: 'console',
}

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
    jperf = new JPerf(defaultConfig)
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
    jperf = new JPerf(defaultConfig)
    expect(jperf.run()).toEqual(jperf)
  })

  test('.showAnalysis', () => {
    // Empty
    jperf = new JPerf(defaultConfig)
    expect(jperf.showAnalysis()).toEqual(jperf)
    // 1 test
    jperf.test(() => {})
    jperf.showAnalysis()
  })

  test('.log', () => {
    // Empty
    jperf = new JPerf(defaultConfig)
    expect(jperf.log()).toEqual(jperf)
    // 1 test
    jperf.test(() => {})
    jperf.log()
  })

  test('.getAnalysis', () => {
    jperf = new JPerf(defaultConfig)
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
    const emptyOutput = {
      version: PKG_VERSION,
      global: { runtime: 0 },
      tests: [],
    }
    const emptyJson = JSON.parse(jperf.getAnalysis('json') as string)
    expect(emptyJson).toEqual(emptyOutput)
    // - XML
    const emptyXml = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <analysis>
          <version>${PKG_VERSION}</version>
          <global>
            <runtime>0</runtime>
          </global>
          <tests></tests>
        </analysis>
      `.trim()
      .replace(/>[ \r\n]*/gi, '>')
      .replace(/[ \r\n]*</gi, '<')
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
      global: { runtime: 0 },
      tests: [{ name: 'anonymous #0', runtime: 0, steps: [] }],
    }
    const oneTestJson = JSON.parse(jperf.getAnalysis('json') as string)
    expect(oneTestJson).toEqual(oneTestOutput)
    const oneTestXml = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <analysis>
        <version>${PKG_VERSION}</version>
        <global>
          <runtime>0</runtime>
        </global>
        <tests>
          <test>
            <name>anonymous #0</name>
            <runtime>0</runtime>
            <steps></steps>
          </test>
        </tests>
      </analysis>
    `.trim()
    .replace(/>[ \r\n]*/gi, '>')
    .replace(/[ \r\n]*</gi, '<')
    expect(jperf.getAnalysis('xml')).toBe(oneTestXml)
  })
})
