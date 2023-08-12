export default class JPCodeParser {

  constructor() {
    
  }

  _cleanFn(fn: Function) {
    const rgx = /^((function *([a-zA-Z0-9]+ *)?)?\(([a-zA-Z0-9]+ *)*(, *[a-zA-Z0-9]+ *)*\)( *=>)? *\{)/gi
    const pattern = [...fn.toString().matchAll(rgx)][0][0]
    let code = fn.toString()
    code = code.substring(pattern.length)
    code = code.substring(0, code.length - 1)
    return code.trim()
  }

  extractLinesFromFn(fn: Function) {
    console.log(fn, this._cleanFn(fn));
    
    return
  }
}
