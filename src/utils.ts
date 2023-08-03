export const d = (millis: number) => {
  console.log(millis)
  if (millis < 1000) return `${millis}ms`
  if (millis < 60000) return `${millis / 1000}s`
  if (millis < 3600000) {
    const mn: number = Math.trunc(millis / 60000)
    const sDec: number = millis % 60000 / 1000
    const s: number = Math.trunc(millis % 60000 / 1000)
    let ms: string = sDec.toString().substring(sDec.toString().indexOf('.'))
    ms = ms !== '0' ? ms : ''
    return `${mn}mn ${s}${ms}s`
  }
  const hr: number = Math.trunc(millis / 3600000)
  const mn: number = Math.trunc(millis % 60000)
  const sDec: number = millis % 60000 / 1000
  const s: number = Math.trunc(millis % 60000 / 1000)
  let ms: string = sDec.toString().substring(sDec.toString().indexOf('.'))
  ms = ms !== '0' ? ms : ''
  return `${hr}hr ${mn}mn ${s}${ms}s`
}

// 734ms

// 37.429s

// 28mn 53.131s

// 1hr 46mn 12.458s