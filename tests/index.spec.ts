import { UserConfig } from '@src/types'
import { test, expect } from '@jest/globals'
import JTester from '@src/JTester'
import jtester from '@src/index'

describe('index', () => {
  test('entrypoint', () => {
    // valid
    expect(jtester()).toBeInstanceOf(JTester)
    expect(jtester({})).toBeInstanceOf(JTester)
    expect(jtester({ autorun: true })).toBeInstanceOf(JTester)
    expect(jtester({ autorun: false })).toBeInstanceOf(JTester)
    expect(jtester({ verbose: true })).toBeInstanceOf(JTester)
    expect(jtester({ verbose: false })).toBeInstanceOf(JTester)
  })
})