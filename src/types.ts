export type TestData = {
  name: string
  index: number
  fn?: Function;
  start: number;
  end: number;
  time: number;
  processed: boolean
}
export type TickTestData = {
  name: string
  index: number
  start: number
  end: number
  time: number
}
export type TestAnalysis = {
  version: string
  global: {
    runtime:  number
  },
  tests: {
    name: string,
    runtime: number,
    steps: { runtime: number; percentage: number }[]
  }[]
}

export type Mode = 'console' | 'html'
export type UserConfig = {
  autorun?: boolean
  verbose?: boolean
  hardwareDetails?: boolean
  anonymousTestName?: string
  anonymousTestIndex?: number
  mode?: Mode
  selector?: string | Element
}
export type Config = {
  autorun: boolean
  verbose: boolean
  hardwareDetails: boolean
  anonymousTestName: string
  anonymousTestIndex: number
  mode: Mode
  selector: string | Element
}