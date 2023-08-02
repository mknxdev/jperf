import JTester from './JTester'
import { UserConfig, Config } from './types'

const validConfig = (config: UserConfig): boolean => {
  return true
}
const fillConfigDefaults = (config: UserConfig): Config => {
  return {}
}

export default function (config: UserConfig) {
  if (validConfig(config)) {
    return new JTester(fillConfigDefaults(config))
  }
}
