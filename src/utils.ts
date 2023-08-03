export const d = (ms: number) => {
  ms = ms * 1000.468
  console.log(ms)
  const msRules = {
    s: 1000,
    mn: 60000,
    hr: 3600000,
  }
  let time = { l: 0, r: 0, u: 'ms' }
  for (const [u, t] of Object.entries(msRules)) {
    if (ms / t >= 1) {
      time.l = u !== 's' ? Math.trunc(ms / t) : ms / t
      time.r = u !== 's' ? (ms % t) / 1000 : 0
      time.u = u
    }
  }
  const left = !Number.isInteger(time.l) ? `${time.l.toFixed(3)}` : `${time.l}`
  const right = time.r ? `.${time.r}` : ''
  console.log(time)
  return `${left}${right}${time.u}`
}
