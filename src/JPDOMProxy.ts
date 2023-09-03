import { ComputedTest } from "./types"
import { PKG_BRAND } from "./constants"
import { d } from './utils'

export default class JPDOMProxy {
  _verbose: boolean
  _root: HTMLElement
  _testsRoot: HTMLElement

  constructor(verbose: boolean, selector: string | HTMLElement) {
    this._verbose = verbose
    this._root = typeof selector === 'string' ? document.querySelector(selector) : selector
    if (this._root)
      this._init()
  }
  _init(): void {
    this._root.classList.add('jf-root')
    this._root.style.backgroundColor = '#eeeeee'
    this._root.style.fontFamily = 'Courier, monospace'
    this._root.innerHTML = `
      <div class="jf-container" style="padding: 6px; border: 1px solid #bbbbbb">
        <div class="jf-header" style="padding-bottom: 6px; text-align: center; font-size: 15px">
          ${PKG_BRAND}
        </div>
        <div class="jf-tests"></div>
      </div>
    `.trim()
    this._testsRoot = document.querySelector('.jf-tests')
  }
  render(tests: ComputedTest[]): void {
    if (this._testsRoot)
      for (const [i, test] of tests.entries()) {
        const container = document.createElement('div')
        let html = `
          <div class="jf-test" style="${i !== 0 ? 'margin-top: 4px;' : ''}border: 1px solid #bbbbbb; font-size: 14px">
            <div style="padding: 2px; text-align: center; background: #e5c839; border-bottom: 1px solid #bbbbbb">${test.name}</div>
            <div style="display: flex; font-size: 12px">
              <div class="jf-test-info" style="flex: 0 0 50%; padding: 4px;">
                Runtime: ${d(test.runtime)}
              </div>`.trim()
        if (this._verbose && test.steps.length) {
          html += `<div class="jf-test-steps" style="flex: 0 0 50%; padding: 4px; border-left: 1px solid #ddd">`
          for (const step of test.steps)
            html += `
              <div class="jf-test-step">
                step ${step.index}: ${d(step.runtime)} (${Math.round(step.percentage)}%)
              </div>
            `.trim()
          html += `</div>`
        }
        html += `</div>
          </div>
        `.trim()
        container.innerHTML = html
        this._testsRoot.append(container)
      }
  }
}