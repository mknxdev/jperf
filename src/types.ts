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
export type RawTestStepsContainer = Record<string, RawTestSteps>
export type RawTestSteps = Date[]
export type TestStep = {
  index: number
  runtime: number
  percentage: number
}
export type ComputedTest = {
  name: string,
  runtime: number
  steps: TestStep[]
}
export type TestAnalysis = {
  version: string
  global: {
    runtime:  number
  },
  tests: ComputedTest[]
}

export type Mode = 'console' | 'html'
export type UserConfig = {
  autorun?: boolean
  verbose?: boolean
  hardwareDetails?: boolean
  anonymousTestName?: string
  anonymousTestIndex?: number
  mode?: Mode
  selector?: string | HTMLElement
}
export type Config = {
  autorun: boolean
  verbose: boolean
  hardwareDetails: boolean
  anonymousTestName: string
  anonymousTestIndex: number
  mode: Mode
  selector: string | HTMLElement
}