import { d } from './utils'
import { PKG_VERSION } from './constants'

export default class JPLogger {
  _verboseMode: boolean = false
  _displayHardwareDetails: boolean = false
  _hwDetails = undefined
  _tests = []

  constructor(verbose: boolean, hardwareDetails: boolean, hwDetails) {
    this._verboseMode = verbose
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
  addTest(id: string, time: number, steps = []): void {
    this._tests.push({ id, time, steps })
  }
  log(): void {
    const brand = `jPerf v${PKG_VERSION}`
    let output = `${brand}\r\n`
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
        output += `| ${test.id}\r\n|\r\n| > Runtime: ${d(test.time)}\r\n`
        if (this._verboseMode) {
          for (const [i, step] of test.steps.entries())
            output += `|   - [step ${i}] ${d(step.runtime)} (${Math.round(step.percentage)}%)\r\n`
        }
        output += `+\r\n`
      }
    else output += `| No ran tests.\r\n+\r\n`
    output = this._formatOutput(output)
    console.log(output)
  }
}
