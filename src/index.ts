import { UserConfig, Config } from './types'
import { DEFAULT_MODE, ANONYMOUS_TEST_NAME, ANONYMOUS_TEST_IDX } from './constants'
import JPerf from './JPerf'
import { validConfig } from './validator'

const fillConfigDefaults = (config: UserConfig): Config => {
  const conf = config || {}
  return {
    autorun: conf.autorun !== undefined ? config.autorun : true,
    verbose: conf.verbose !== undefined ? config.verbose : false,
    hardwareDetails: conf.hardwareDetails !== undefined ? config.hardwareDetails : false,
    anonymousTestName: conf.anonymousTestName !== undefined ? config.anonymousTestName : ANONYMOUS_TEST_NAME,
    anonymousTestIndex: conf.anonymousTestIndex !== undefined ? config.anonymousTestIndex : ANONYMOUS_TEST_IDX,
    mode: conf.mode || DEFAULT_MODE,
    element: conf.element || undefined
  }
}

export default function (config: UserConfig = {}) {
  if (validConfig(config)) {
    return new JPerf(fillConfigDefaults(config))
  }
}
