import { test, expect } from '@jest/globals'
import { SYS_MODE_NODEJS, SYS_MODE_WEBBROWSER } from '@src/constants'
import { d, size, getRunningMode } from '@src/utils'

// Object.defineProperty(navigator, 'userAgent', () => {

// })

describe('utils', () => {
  test('d', () => {
    expect(d(841)).toEqual('841ms')
    expect(d(1000)).toEqual('1s')
    expect(d(4684)).toEqual('4.684s')
    expect(d(60000)).toEqual('1mn')
    expect(d(72000)).toEqual('1mn 12s')
    expect(d(72999)).toEqual('1mn 12.999s')
    expect(d(3600000)).toEqual('1hr')
    expect(d(3672999)).toEqual('1hr 1mn 12.999s')
  })

  test('size', () => {
    expect(size(1023)).toEqual({ value: 1023, unit: 'B' })
    expect(size(1024)).toEqual({ value: 1, unit: 'kB' })
    expect(size(1024 * 1024)).toEqual({ value: 1, unit: 'MB' })
    expect(size(1024 * 1024 * 1024)).toEqual({ value: 1, unit: 'GB' })
  })

  test('getRunningMode', () => {
    expect(getRunningMode()).toBe(SYS_MODE_WEBBROWSER)
    const tmpWindow = { ...global.window }
    const tmpNavigator = { ...global.navigator }
    delete global.window
    delete global.navigator
    expect(getRunningMode()).toBe(SYS_MODE_NODEJS)
    global.window = tmpWindow
    global.navigator = tmpNavigator
  })
})
