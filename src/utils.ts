// Numbers

const S_DIVIDER = 1000
const MN_DIVIDER = 60000
const HR_DIVIDER = 3600000

export const d = (millis: number) => {
  if (millis < S_DIVIDER) return `${millis}ms`
  if (millis < MN_DIVIDER) return `${millis / S_DIVIDER}s`
  if (millis < HR_DIVIDER) {
    const mn: number = Math.trunc(millis / MN_DIVIDER)
    const remainingS = millis % MN_DIVIDER
    const s: number = remainingS / S_DIVIDER
    return `${mn}mn ${s}s`
  }
  const hr: number = Math.trunc(millis / HR_DIVIDER)
  const remainingMn = millis % HR_DIVIDER
  const mn: number = Math.trunc(remainingMn / MN_DIVIDER)
  const remainingS = remainingMn % MN_DIVIDER
  const s: number = remainingS / S_DIVIDER
  return `${hr}hr ${mn}mn ${s}s`
}