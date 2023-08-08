import { test, expect } from '@jest/globals'
import JTLogger from '@src/JTLogger'

let jtlogger: JTLogger

describe('JTLogger', () => {
  test('.log', () => {
    jtlogger = new JTLogger(true, {})
    jtlogger.log()
    expect(console.log).toHaveBeenCalledTimes(1)
  })
})