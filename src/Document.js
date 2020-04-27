const CustomElementRegistry = require('./CustomElementRegistry');
const Event = require('./Event');
const CustomEvent = require('./CustomEvent');
const Node = require('./Node');
const DocumentType = require('./DocumentType');
const Attr = require('./Attr');
const CSSStyleDeclaration = require('./CSSStyleDeclaration');
const Comment = require('./Comment');
const DocumentFragment = require('./DocumentFragment');
const HTMLElement = require('./HTMLElement');
const HTMLHtmlElement = require('./HTMLHtmlElement');
const HTMLStyleElement = require('./HTMLStyleElement');
const HTMLTemplateElement = require('./HTMLTemplateElement');
const HTMLTextAreaElement = require('./HTMLTextAreaElement');
const Range = require('./Range');
const Text = require('./Text');
const TreeWalker = require('./TreeWalker');

const headTag = el => el.nodeName === 'head';
const bodyTag = el => el.nodeName === 'body';

const createElement = (self, name, is) => {
  const Class = self.customElements.get(is) || HTMLElement;
  return new Class(self, name);
};

const getFoundOrNull = result => {
  if (result) {
    const el = findById.found;
    findById.found = null;
    return el;
  } else {
    return null;
  }
};

function findById(child) {'use strict';
  return child.id === this ?
          !!(findById.found = child) :
          child.children.some(findById, this);
}

// interface Document // https://dom.spec.whatwg.org/#document
module.exports = class Document extends Node {

  constructor(customElements = new CustomElementRegistry()) {
    super(null);
    this.nodeType = Node.DOCUMENT_NODE;
    this.nodeName = '#document';
    this.appendChild(new DocumentType());
    this.documentElement = new HTMLHtmlElement(this, 'html');
    this.appendChild(this.documentElement);
    this.customElements = customElements;
    Object.freeze(this.childNodes);
  }

  createAttribute(name) {
    const attr = new Attr(
      {ownerDocument: this},
      name,
      name === 'style' ?
        new CSSStyleDeclaration() :
        null
    );
    attr.ownerElement = null;
    return attr;
  }

  createAttributeNS(_, name) {
    return this.createAttribute(name);
  }

  createComment(comment) {
    return new Comment(this, comment);
  }

  createDocumentFragment() {
    return new DocumentFragment(this);
  }

  createElement(name, options) {
    switch (name) {
      case 'style':
        return new HTMLStyleElement(this, name);
      case 'template':
        return new HTMLTemplateElement(this, name);
      case 'textarea':
        return new HTMLTextAreaElement(this, name);
      case 'canvas':
      case 'img':
        try {
          const file = name === 'img' ? './HTMLImageElement' : './HTMLCanvasElement';
          const Constructor = require(file);
          return new Constructor(this);
        }
        catch (o_O) {}
      default:
        const extending = 1 < arguments.length && 'is' in options;
        const el = createElement(this, name, extending ? options.is : name);
        if (extending)
          el.setAttribute('is', options.is);
        return el;
    }
  }

  createElementNS(ns, name) {
    if (ns === 'http://www.w3.org/1999/xhtml') {
      return this.createElement(name);
    }
    return new HTMLElement(this, name + ':' + ns);
  }

  createEvent(name) {
    switch (name) {
      case 'Event':
        return new Event();
      case 'CustomEvent':
        return new CustomEvent();
      default:
        throw new Error(name + ' not implemented');
    }
  }

  createRange() {
    return new Range;
  }

  createTextNode(text) {
    return new Text(this, text);
  }

  createTreeWalker(root, whatToShow) {
    return new TreeWalker(root, whatToShow);
  }

  getElementsByTagName(name) {
    const html = this.documentElement;
    return /html/i.test(name) ?
      [html] :
      (name === '*' ? [html] : []).concat(html.getElementsByTagName(name));
  }

  getElementsByClassName(name) {
    const html = this.documentElement;
    return (html.classList.contains(name) ? [html] : [])
            .concat(html.getElementsByClassName(name));
  }

  importNode(node) {
    return node.cloneNode(!!arguments[1]);
  }

  toString() {
    return this.childNodes[0] + this.documentElement.outerHTML;
  }

  get defaultView() {
    return global;
  }

  get head() {
    const html = this.documentElement;
    return  this.documentElement.childNodes.find(headTag) ||
            html.insertBefore(this.createElement('head'), this.body);
  }

  get body() {
    const html = this.documentElement;
    return  html.childNodes.find(bodyTag) ||
            html.appendChild(this.createElement('body'));
  }

  // interface NonElementParentNode // https://dom.spec.whatwg.org/#nonelementparentnode
  getElementById(id) {
    const html = this.documentElement;
    return html.id === id ? html : getFoundOrNull(html.children.some(findById, id));
  }

  // interface ParentNode @ https://dom.spec.whatwg.org/#parentnode
  get children() {
    return [this.documentElement];
  }

  get firstElementChild() {
    return this.documentElement;
  }

  get lastElementChild() {
    return this.documentElement;
  }

  get childElementCount() {
    return 1;
  }

  prepend() { throw new Error('Only one element on document allowed.'); }
  append() { this.prepend(); }

  querySelector(css) {
    return this.documentElement.querySelector(css);
  }

  querySelectorAll(css) {
    return this.documentElement.querySelectorAll(css);
  }

};
