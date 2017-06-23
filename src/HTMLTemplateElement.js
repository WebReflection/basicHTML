const HTMLElement = require('./HTMLElement');

// interface HTMLTemplateElement // https://html.spec.whatwg.org/multipage/scripting.html#htmltemplateelement
module.exports = class HTMLTemplateElement extends HTMLElement {

  constructor(ownerDocument, name) {
    super(ownerDocument, name).isCustomElement = false;
  }

  get content() {
    const fragment = this.ownerDocument.createDocumentFragment();
    fragment.childNodes = this.childNodes;
    return fragment;
  }

};
