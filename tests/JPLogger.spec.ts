import { test, expect } from '@jest/globals'
import JPLogger from '@src/JPLogger'

let jtlogger: JPLogger

describe('JPLogger', () => {
  test('.log', () => {
    jtlogger = new JPLogger(true, false, {})
    let consoleLog = console.log
    const consoleLogMock = jest.fn((_) => undefined)
    console.log = consoleLogMock
    jtlogger.log()
    expect(console.log).toHaveBeenCalledTimes(1)
    consoleLogMock.mockRestore()
    console.log = consoleLog
  })
})
