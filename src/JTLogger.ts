export default class JTLogger {
  _tests = []

  _formatOutput(output: string): string {
    const parts = output.split('\r\n')
    const maxLineLength = parts.reduce((max, line) => {
      if (line.length > max) max = line.length;
      return max
    }, 0)
    return parts
      .map((part, i) => {
        if (part.charAt(0) === '+')
          for (let i = 0; i < maxLineLength; i++)
            part += '-'
        const remaining = maxLineLength - part.length
        for (let i = 0; i < remaining; i++) part += ' '
        if (part.charAt(0) !== '+') part += ' '
        if (i) {
          part += part.charAt(0) === '+' ? '+' : '|'
        }
        if (i === parts.length - 1) part = part.substring(0, part.indexOf('\r\n'))
        return part
      })
      .join('\r\n')
  }
  addTest(id: string, time: number, fn: Function = undefined): void {
    this._tests.push({ id, time })
  }
  log(): void {
    let output = `JTester\r\n+\r\n`
    for (const test of this._tests)
      output += `| [${test.id}]\r\n|\r\n| Runtime: ${test.time}ms\r\n+\r\n`
    output = this._formatOutput(output)
    console.log(output)
  }
}