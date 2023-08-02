import JTester from './JTester'

export default function (configOrFn: Function) {
  if (typeof configOrFn === 'function') {
    const jt = new JTester({})
    jt.addTestFn(configOrFn)
    jt.run()
  }
  return new JTester(configOrFn)
}
