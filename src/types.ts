export type TestData = {
  name: string
  fn?: Function;
  start: number;
  end: number;
  time: number;
  processed: boolean
}
export type TickTestData = {
  name: string
  start: number
  end: number
  time: number
}
export type TestAnalysis = {
  version: string
  tests: {
    name: string,
    runtime: number,
    steps: { runtime: number }[]
  }[]
}

export type UserConfig = {
  autorun?: boolean
  verbose?: boolean
  hardwareDetails?: boolean
  anonymousTestName?: string
  anonymousTestIndex?: number
}
export type Config = {
  autorun: boolean
  verbose: boolean
  hardwareDetails: boolean
  anonymousTestName: string
  anonymousTestIndex: number
}