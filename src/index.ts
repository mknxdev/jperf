import JTester from './JTester'
import { UserConfig, Config } from './types'

const validConfig = (config: UserConfig): boolean => {
  return true
}
const fillConfigDefaults = (config: UserConfig): Config => {
  const conf = config || {}
  return {
    autorun: conf.autorun !== undefined ? config.autorun : true
  }
}

export default function (config: UserConfig) {
  if (validConfig(config)) {
    return new JTester(fillConfigDefaults(config))
  }
}
