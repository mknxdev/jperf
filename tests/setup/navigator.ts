beforeAll(() => {
  Object.defineProperty(
    globalThis.navigator,
    'userAgent',
    ((value) => ({
      get() {
        return value
      },
      set(v) {
        value = v
      },
    }))(window.navigator.userAgent),
  )
})
afterEach(() => {})
