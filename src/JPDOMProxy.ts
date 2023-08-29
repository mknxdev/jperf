export default class JPDOMProxy {
  _root: Element

  constructor(selector: string | Element) {
    this._root = typeof selector === 'string' ? document.querySelector(selector) : selector
    console.log(this._root);
    
  }
  _mount(): void {

  }
  render(tests): void {

  }
}