import { UserConfig } from './types'

export const validConfig = (config: UserConfig): boolean => {
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

export const validTest = (
  nameOrFn: string | Function,
  fn?: Function,
): boolean => {
  let error: string
  try {
    // nameOrFn
    if (!nameOrFn) error = `First argument of '.test' method is required.`
    if (nameOrFn && !['string', 'function'].includes(typeof nameOrFn))
      error = `First argument of '.test' method must be a string or function.`
    // fn
    if (nameOrFn && typeof nameOrFn === 'string') {
      if (!fn)
        error = `A function is required for '.test' method as second argument.`
    }
    if (error) throw new Error(`jTester: ${error}`)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
