const parse = require('parse5').parse;

const utils = require('./utils');
const HTMLElement = require('./HTMLElement');

// interface HTMLHtmlElement // https://html.spec.whatwg.org/multipage/semantics.html#htmlhtmlelement
module.exports = class HTMLHtmlElement extends HTMLElement {

  constructor(ownerDocument, name) {
    super(ownerDocument, name).isCustomElement = false;
  }

  set innerHTML(html) {
    this.childNodes
        .splice(0, this.childNodes.length)
        .forEach(utils.disconnectChild);
    parse(html).childNodes[0].childNodes.forEach(utils.injectNode, this);
  }

};
