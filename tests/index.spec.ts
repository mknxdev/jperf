import { UserConfig } from '@src/types'
import { test, expect } from '@jest/globals'
import JPerf from '@src/JPerf'
import jperf from '@src/index'

describe('index', () => {
  test('entrypoint', () => {
    // valid
    expect(jperf()).toBeInstanceOf(JPerf)
    expect(jperf({})).toBeInstanceOf(JPerf)
    expect(jperf({ autorun: true })).toBeInstanceOf(JPerf)
    expect(jperf({ autorun: false })).toBeInstanceOf(JPerf)
    expect(jperf({ verbose: true })).toBeInstanceOf(JPerf)
    expect(jperf({ verbose: false })).toBeInstanceOf(JPerf)
  })
})
