import { test, expect } from '@jest/globals'
import JTester from '@src/JTester'
import jtester from '@src/index'

describe('index', () => {
  test('instance', () => {
    expect(jtester()).toBeInstanceOf(JTester)
  })
})