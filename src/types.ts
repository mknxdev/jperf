export type TestData = { name: string; fn: Function; time: number; processed: boolean }
export type TestAnalysis = {
  version: string
  tests: { runtime: number }[]
}

export type UserConfig = {
  autorun?: boolean
  verbose?: boolean
}
export type Config = {
  autorun: boolean
  verbose: boolean
}