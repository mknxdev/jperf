import { version } from '../package.json'

export const PKG_VERSION = version
export const PKG_BRAND = `jPerf v${PKG_VERSION}`

export const SYS_MODE_WEBBROWSER = 'wb'
export const SYS_MODE_NODEJS = 'njs'
export const SYS_MODE_UNKNOWN = 'unknown'

export const OUTPUT_CONSOLE = 'console'
export const OUTPUT_HTML = 'html'
export const DEFAULT_OUTPUT = OUTPUT_CONSOLE

export const ANONYMOUS_TEST_NAME = '(anonymous)'
export const ANONYMOUS_TEST_IDX = 0