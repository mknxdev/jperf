import { test, expect } from '@jest/globals'
import { UserConfig } from '@src/types'
import { validConfig, validTest } from '@src/validator'

describe('utils', () => {
  test('validConfig', () => {
    // valid
    expect(validConfig()).toBeTruthy()
    expect(validConfig({})).toBeTruthy()
    expect(validConfig({ autorun: true })).toBeTruthy()
    expect(validConfig({ autorun: false })).toBeTruthy()
    expect(validConfig({ verbose: true })).toBeTruthy()
    expect(validConfig({ verbose: true })).toBeTruthy()
    // invalid
    expect(validConfig(true as unknown as UserConfig)).toBeFalsy()
    expect(validConfig(false as unknown as UserConfig)).toBeFalsy()
    expect(validConfig('' as unknown as UserConfig)).toBeFalsy()
    expect(validConfig(42 as unknown as UserConfig)).toBeFalsy()
    expect(validConfig((() => {}) as unknown as UserConfig)).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(5)
  })

  test('validTest', () => {
    // valid
    expect(validTest(() => {})).toBeTruthy()
    expect(validTest('test', () => {})).toBeTruthy()
    // invalid
    expect(validTest(undefined)).toBeFalsy()
    expect(validTest('test')).toBeFalsy()
    expect(validTest(true as unknown as Function)).toBeFalsy()
    expect(validTest(false as unknown as Function)).toBeFalsy()
    expect(validTest(42 as unknown as Function)).toBeFalsy()
    expect(validTest('test', 'test' as unknown as Function)).toBeFalsy()
    expect(validTest('test', true as unknown as Function)).toBeFalsy()
    expect(validTest('test', false as unknown as Function)).toBeFalsy()
    expect(validTest('test', 42 as unknown as Function)).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(9)
  })
})