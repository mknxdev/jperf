import JTester from './JTester'
import { UserConfig, Config } from './types'

const validConfig = (config: UserConfig): boolean => {
  if (!config) return true
  let error: string
  try {
    // config
    if (config && typeof config !== 'object')
      error = `Config must be an object.`
    // config.autorun
    if (config.autorun && typeof config.autorun !== 'boolean')
      error = `'autorun' option must be a boolean.`
    // config.verbose
    if (config.verbose && typeof config.verbose !== 'boolean')
      error = `'verbose' option must be a boolean.`
    if (error) throw new Error(`jTester: ${error}`)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
const fillConfigDefaults = (config: UserConfig): Config => {
  const conf = config || {}
  return {
    autorun: conf.autorun !== undefined ? config.autorun : true,
    verbose: conf.verbose !== undefined ? config.verbose : false
  }
}

export default function (config: UserConfig) {
  if (validConfig(config)) {
    return new JTester(fillConfigDefaults(config))
  }
}
