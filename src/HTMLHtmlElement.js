const HTMLElement = require('./HTMLElement');

// interface HTMLHtmlElement // https://html.spec.whatwg.org/multipage/semantics.html#htmlhtmlelement
module.exports = class HTMLHtmlElement extends HTMLElement {

  get innerHTML() {
    const document = this.ownerDocument;
    return document.head.outerHTML + document.body.outerHTML;
  }

  set innerHTML(html) {
    super.innerHTML = html;
  }

};
