const utils = require('./src/utils');
const CustomElementRegistry = require('./src/CustomElementRegistry');
const Document = require('./src/Document');
const EventTarget = require('./src/EventTarget');
const HTMLElement = require('./src/HTMLElement');
const HTMLUnknownElement = require('./src/HTMLUnknownElement');
const CustomEvent = require('./src/CustomEvent');
const Image = require('./src/ImageFactory');
const NodeFilter = require('./src/NodeFilter');
const TreeWalker = require('./src/TreeWalker');

module.exports = {
  Attr: require('./src/Attr'),
  CharacterData: require('./src/CharacterData'),
  Comment: require('./src/Comment'),
  CustomElementRegistry: CustomElementRegistry,
  CustomEvent: CustomEvent,
  Document: Document,
  DocumentFragment: require('./src/DocumentFragment'),
  DocumentType: require('./src/DocumentType'),
  DOMStringMap: require('./src/DOMStringMap'),
  DOMTokenList: require('./src/DOMTokenList'),
  Element: require('./src/Element'),
  Event: require('./src/Event'),
  EventTarget: EventTarget,
  HTMLElement: HTMLElement,
  HTMLUnknownElement: HTMLUnknownElement,
  HTMLHtmlElement: require('./src/HTMLHtmlElement'),
  HTMLTemplateElement: require('./src/HTMLTemplateElement'),
  Image: Image,
  Node: require('./src/Node'),
  Text: require('./src/Text'),
  NodeFilter: NodeFilter,
  TreeWalker: TreeWalker,
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
    window.CustomEvent = CustomEvent;
    window.Image = function (...args) {
      return Image(window.document, ...args);
    };
    EventTarget.init(window);
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
