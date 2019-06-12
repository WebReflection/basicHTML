const HTMLElement = require('./HTMLElement');

// interface HTMLTemplateElement // https://html.spec.whatwg.org/multipage/scripting.html#htmltemplateelement
module.exports = class HTMLTemplateElement extends HTMLElement {

  get content() {
    const fragment = this.ownerDocument.createDocumentFragment();
    fragment.childNodes = this.childNodes;
    return fragment;
  }

};
