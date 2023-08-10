import { test, expect } from '@jest/globals'
import JPLogger from '@src/JPLogger'

let jtlogger: JPLogger

describe('JPLogger', () => {
  test('.log', () => {
    jtlogger = new JPLogger(true, {})
    jtlogger.log()
    expect(console.log).toHaveBeenCalledTimes(1)
  })
})
