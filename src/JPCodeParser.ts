export default class JPCodeParser {

  constructor() {
    
  }

  _cleanFn(fn: Function): string {
    const rgx = /^((function *([a-zA-Z0-9]+ *)?)?\(([a-zA-Z0-9]+ *)*(, *[a-zA-Z0-9]+ *)*\)( *=>)? *\{)/gi
    const pattern = [...fn.toString().matchAll(rgx)][0][0]
    let code = fn.toString()
    code = code.substring(pattern.length)
    code = code.substring(0, code.length - 1)
    return code.trim()
  }

  extractLinesFromFn(fn: Function): string[] {
    let code: string = this._cleanFn(fn)
    return code
      .split('\r\n')
      .reduce((newParts: string[], part) => newParts.concat(part.split('\r')), [])
      .reduce((newParts: string[], part) => newParts.concat(part.split('\n')), [])
      .reduce((newParts: string[], part) => {
        let parts = part.split(';')
        // parts = parts.reduce((newParts, p) => {
        //   if (p.search(/(for|while) *[(].*/gi) !== -1) {
        //     let statement = newParts.shift()
        //     if (!newParts[0].includes(')')) statement += `; ${newParts.shift()}`
        //     const rgxEndStatement = /\) *[\r\n{}]? */gi
        //     if (newParts[0].search(rgxEndStatement) !== -1) {
        //       const pattern = newParts[0].match(rgxEndStatement)[0]
        //       statement += pattern
        //       newParts[0] = newParts[0].substring(
        //         newParts[0].indexOf(pattern) + pattern.length
        //       )
        //       newParts.splice(0, 0, statement)
        //     }
        //     return newParts
        //   }
        //   console.log(p);
          
        //   return newParts
        // }, parts)
        return newParts.concat(parts)
      }, [])
      .map(part => part.trim())
  }
}
