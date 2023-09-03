import { Output } from './types'
import { version } from '../package.json'

export const PKG_VERSION: string = version
export const PKG_BRAND: string = `jPerf v${PKG_VERSION}`

export const SYS_MODE_WEBBROWSER: string = 'wb'
export const SYS_MODE_NODEJS: string = 'njs'
export const SYS_MODE_UNKNOWN: string = 'unknown'

export const OUTPUT_CONSOLE: Output = 'console'
export const OUTPUT_HTML: Output = 'html'
export const DEFAULT_OUTPUT: Output = OUTPUT_CONSOLE

export const ANONYMOUS_TEST_NAME: string = '(anonymous)'
export const ANONYMOUS_TEST_IDX: number = 0