import { test, expect } from '@jest/globals'
import { TestAnalysis } from '@src/types'
import { PKG_VERSION } from '@src/constants'
import JPerf from '@src/JPerf'
// import JTLogger from '@src/JTLogger'

// const jtloggerMock = jest.mock('@src/JTLogger')

let jtester: JPerf

afterEach(() => {
  jtester = undefined
})

describe('JPerf', () => {
  test('.test', () => {
    jtester = new JPerf({ autorun: true, verbose: false })
    expect(
      jtester.test(() => {
        const foo = 'bar'
      }),
    ).toEqual(jtester)
  })
  test('.run', () => {
    jtester = new JPerf({ autorun: true, verbose: false })
    expect(jtester.run()).toEqual(jtester)
  })
  test('.showAnalysis', () => {
    // Empty
    jtester = new JPerf({ autorun: true, verbose: false })
    expect(jtester.showAnalysis()).toEqual(jtester)
    // 1 test
    jtester.test(() => {})
    jtester.showAnalysis()
  })
  test('.log', () => {
    // Empty
    jtester = new JPerf({ autorun: true, verbose: false })
    expect(jtester.log()).toEqual(jtester)
    // 1 test
    jtester.test(() => {})
    jtester.log()
  })
  test('.getAnalysis', () => {
    jtester = new JPerf({ autorun: true, verbose: false })
    // Empty
    // - JS
    const emptyJsDefault = jtester.getAnalysis() as TestAnalysis
    const emptyJs = jtester.getAnalysis('js') as TestAnalysis
    expect(emptyJsDefault).toHaveProperty('version')
    expect(emptyJsDefault).toHaveProperty('tests')
    expect(emptyJsDefault.tests.length).toBe(0)
    expect(emptyJs).toHaveProperty('version')
    expect(emptyJs).toHaveProperty('tests')
    expect(emptyJs.tests.length).toBe(0)
    // - JSON
    const emptyOutput = { version: PKG_VERSION, tests: [] }
    const emptyJson = JSON.parse(jtester.getAnalysis('json') as string)
    expect(emptyJson).toEqual(emptyOutput)
    // - XML
    const xmlEmpty = `
      <?xml version="1.0" encoding="UTF-8" ?><analysis><version>1.1.0</version><tests></tests></analysis>
    `.trim()
    expect(jtester.getAnalysis('xml')).toBe(xmlEmpty)
    // 1 test
    jtester.test(() => {})
    // - JS
    const oneTestJsDefault = jtester.getAnalysis() as TestAnalysis
    const oneTestJs = jtester.getAnalysis('js') as TestAnalysis
    expect(oneTestJsDefault.tests.length).toBe(1)
    expect(oneTestJs.tests.length).toBe(1)
    // - JSON
    const oneTestOutput = {
      version: PKG_VERSION,
      tests: [{ name: 'anonymous #0', runtime: 0 }],
    }
    const oneTestJson = JSON.parse(jtester.getAnalysis('json') as string)
    expect(oneTestJson).toEqual(oneTestOutput)
  })
})
