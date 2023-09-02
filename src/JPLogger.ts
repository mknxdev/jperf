import { Mode, ComputedTest, TestStep } from './types'
import { d } from './utils'
import { PKG_BRAND, MODE_CONSOLE, MODE_HTML } from './constants'
import JPDOMProxy from './JPDOMProxy'

export default class JPLogger {
  _dom: JPDOMProxy
  _mode: Mode = 'console'
  _verbose: boolean = false
  _displayHardwareDetails: boolean = false
  _hwDetails = undefined
  _tests: ComputedTest[] = []

  constructor(verbose: boolean, hardwareDetails: boolean, hwDetails, mode: Mode, selector: string | HTMLElement) {
    this._dom = new JPDOMProxy(verbose, selector)
    this._mode = mode
    this._verbose = verbose
    this._displayHardwareDetails = hardwareDetails
    this._hwDetails = hwDetails
  }
  _formatOutput(output: string): string {
    const parts = output.split('\r\n')
    const maxLineLength = parts.reduce((max, line) => {
      const autosizing = line.charAt(0) === '+' || line.charAt(0) === '|'
      if (autosizing && line.length > max) max = line.length
      return max
    }, 0)
    return parts
      .map((part, i) => {
        const autosizing = part.charAt(0) === '+' || part.charAt(0) === '|'
        if (part.charAt(0) === '+')
          for (let i = 0; i < maxLineLength; i++) part += '-'
        if (autosizing) {
          const remaining = maxLineLength - part.length
          for (let i = 0; i < remaining; i++) part += ' '
          if (part.charAt(0) !== '+') part += ' '
          if (i) part += part.charAt(0) === '+' ? '+' : '|'
        }
        if (i === parts.length - 1)
          part = part.substring(0, part.indexOf('\r\n'))
        return part
      })
      .join('\r\n')
  }
  _logToConsole(): void {
    let output = `${PKG_BRAND}\r\n`
    if (this._displayHardwareDetails) {
      const { os, architecture, cpus, memory } = this._hwDetails
      let details = ''
      if (cpus) details += `, ${cpus} core${cpus > 1 ? 's' : ''}`
      if (memory) details += `, ${memory}`
      output += `[${os} ${architecture}${details}]\r\n`
    }
    output += `\r\n+\r\n`
    if (this._tests.length)
      for (const test of this._tests) {
        output += `| ${test.name}\r\n|\r\n| > Runtime: ${d(test.runtime)}\r\n`
        if (this._verbose) {
          for (const [i, step] of test.steps.entries())
            output += `|   - [step ${i}] ${d(step.runtime)} (${Math.round(step.percentage)}%)\r\n`
        }
        output += `+\r\n`
      }
    else output += `| No ran tests.\r\n+\r\n`
    output = this._formatOutput(output)
    console.log(output)
  }
  _logToHTML(): void {
    this._dom.render(this._tests)
  }
  addTest(name: string, runtime: number, steps: TestStep[] = []): void {
    this._tests.push({ name, runtime, steps })
  }
  log(): void {
    if (this._mode === MODE_CONSOLE) this._logToConsole()
    if (this._mode === MODE_HTML) this._logToHTML()
  }
}
