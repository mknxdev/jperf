import { UserConfig, Config } from './types'
import JPerf from './JPerf'
import { validConfig } from './validator'

const fillConfigDefaults = (config: UserConfig): Config => {
  const conf = config || {}
  return {
    autorun: conf.autorun !== undefined ? config.autorun : true,
    verbose: conf.verbose !== undefined ? config.verbose : false,
  }
}

export default function (config: UserConfig = {}) {
  if (validConfig(config)) {
    return new JPerf(fillConfigDefaults(config))
  }
}
