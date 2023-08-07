import { test, expect } from '@jest/globals'
import JTLogger from '@src/JTLogger'

let jtlogger: JTLogger

beforeEach(() => {
  console.log = jest.fn((msg) => msg)
})
afterEach(() => {
  jest.resetAllMocks()
})

describe('JTester', () => {
  test('.log', () => {
    jtlogger = new JTLogger(true, {})
    jtlogger.log()
    expect(console.log).toHaveBeenCalledTimes(1)
  })
})