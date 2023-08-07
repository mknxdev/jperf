beforeAll(() => {
  Object.defineProperty(navigator, 'userAgent', {
    value: '<jest>',
    writable: true,
  })
})
