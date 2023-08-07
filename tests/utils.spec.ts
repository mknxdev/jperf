import { test, expect } from '@jest/globals'
import { SYS_MODE_NODEJS, SYS_MODE_WEBBROWSER } from '@src/constants'
import { d, size, getRunningMode, getHardwareDetails } from '@src/utils'

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

  // test('getHardwareDetails', () => {
  //   // Hardware
  //   Object.defineProperty(navigator, 'hardwareConcurrency', { value: 16 })
  //   Object.defineProperty(navigator, 'memory', {
  //     value: { jsHeapSizeLimit: 4294705152 }
  //   })
  //   expect(getHardwareDetails().cpus).toBe(16)
  //   // Software
  //   // - Win10
  //   const UA_W10_64 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_W10_64 })
  //   expect(getHardwareDetails().os).toBe('Windows')
  //   expect(getHardwareDetails().architecture).toBe('64-bit')
  //   const UA_W10_8664 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_W10_8664 })
  //   expect(getHardwareDetails().os).toBe('Windows')
  //   expect(getHardwareDetails().architecture).toBe('64-bit')
  //   const UA_W10_32 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x32) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_W10_32 })
  //   expect(getHardwareDetails().os).toBe('Windows')
  //   expect(getHardwareDetails().architecture).toBe('32-bit')
  //   // - Linux
  //   const UA_LNX_64 = 'Mozilla/5.0 (X11; Ubuntu; Linux x64; rv:15.0) Gecko/20100101 Firefox/15.0.1'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_LNX_64 })
  //   expect(getHardwareDetails().os).toBe('Linux')
  //   expect(getHardwareDetails().architecture).toBe('64-bit')
  //   const UA_LNX_8664 = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_LNX_8664 })
  //   expect(getHardwareDetails().os).toBe('Linux')
  //   expect(getHardwareDetails().architecture).toBe('64-bit')
  //   const UA_LNX_32 = 'Mozilla/5.0 (X11; Ubuntu; Linux x32; rv:15.0) Gecko/20100101 Firefox/15.0.1'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_LNX_32 })
  //   expect(getHardwareDetails().os).toBe('Linux')
  //   expect(getHardwareDetails().architecture).toBe('32-bit')
  //   // - Mac
  //   const UA_MAC_64 = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_MAC_64 })
  //   expect(getHardwareDetails().os).toBe('Mac')
  //   expect(getHardwareDetails().architecture).toBe('64-bit')
  //   // - ChromeOS
  //   const UA_CROS_64 = 'Mozilla/5.0 (X11; CrOS x64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_CROS_64 })
  //   expect(getHardwareDetails().os).toBe('Chrome OS')
  //   expect(getHardwareDetails().architecture).toBe('64-bit')
  //   const UA_CROS_8664 = 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_CROS_8664 })
  //   expect(getHardwareDetails().os).toBe('Chrome OS')
  //   expect(getHardwareDetails().architecture).toBe('64-bit')
  //   const UA_CROS_32 = 'Mozilla/5.0 (X11; CrOS x32 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36'
  //   Object.defineProperty(navigator, 'userAgent', { value: UA_CROS_32 })
  //   expect(getHardwareDetails().os).toBe('Chrome OS')
  //   expect(getHardwareDetails().architecture).toBe('32-bit')
  // })
})
