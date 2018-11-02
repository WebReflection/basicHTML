const utils = require('./src/utils');
const CustomElementRegistry = require('./src/CustomElementRegistry');
const Document = require('./src/Document');
const HTMLElement = require('./src/HTMLElement');
const HTMLUnknownElement = require('./src/HTMLUnknownElement');
module.exports = {
  Attr: require('./src/Attr'),
  CharacterData: require('./src/CharacterData'),
  Comment: require('./src/Comment'),
  CustomElementRegistry: CustomElementRegistry,
  CustomEvent: require('./src/CustomEvent'),
  Document: Document,
  DocumentFragment: require('./src/DocumentFragment'),
  DocumentType: require('./src/DocumentType'),
  DOMStringMap: require('./src/DOMStringMap'),
  DOMTokenList: require('./src/DOMTokenList'),
  Element: require('./src/Element'),
  Event: require('./src/Event'),
  EventTarget: require('./src/EventTarget'),
  HTMLElement: HTMLElement,
  HTMLUnknownElement: HTMLUnknownElement,
  HTMLHtmlElement: require('./src/HTMLHtmlElement'),
  HTMLTemplateElement: require('./src/HTMLTemplateElement'),
  Node: require('./src/Node'),
  Text: require('./src/Text'),
  init: (options) => {
    if (!options) options = {};
    const window = options.window ||
      (typeof self === 'undefined' ? global : self);
    window.customElements = options.customElements ||
      new CustomElementRegistry();
    window.document = new Document(window.customElements);
    window.window = window;
    window.HTMLElement = HTMLElement;
    window.HTMLUnknownElement = HTMLUnknownElement;
    if (options.selector) {
      const $ = options.selector.$;
      const selector = options.selector.module ?
        options.selector.module(window) :
        require(options.selector.name);
      utils.querySelectorAll = function querySelectorAll(css) {
        return $(selector, this, css);
      };
    }
    return window;
  }
};
