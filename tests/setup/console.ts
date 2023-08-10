const cLog = jest.fn((msg) => msg)
const cError = jest.fn((msg) => msg)

beforeAll(() => {
  console.log = cLog
  console.error = cError
})
afterEach(() => {
  cLog.mockClear()
  cError.mockClear()
})
