const CustomElementRegistry = require('./CustomElementRegistry');
const Event = require('./Event');
const Node = require('./Node');
const DocumentType = require('./DocumentType');
const Attr = require('./Attr');
const Comment = require('./Comment');
const DocumentFragment = require('./DocumentFragment');
const HTMLElement = require('./HTMLElement');
const HTMLHtmlElement = require('./HTMLHtmlElement');
const HTMLTemplateElement = require('./HTMLTemplateElement');
const Text = require('./Text');

const headTag = el => el.nodeName === 'head';
const bodyTag = el => el.nodeName === 'body';

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
    const attr = new Attr({ownerDocument: this}, name, null);
    attr.ownerElement = null;
    return attr;
  }

  createComment(comment) {
    return new Comment(this, comment);
  }

  createDocumentFragment() {
    return new DocumentFragment(this);
  }

  createElement(name) {
    switch (name) {
      case 'template':
        return new HTMLTemplateElement(this, name);
      default:
        const CE = this.customElements.get(name);
        return CE ? new CE(this, name) : new HTMLElement(this, name);
    }
  }

  createElementNS(ns, name) {
    return new HTMLElement(this, name + ':' + ns);
  }

  createEvent(name) {
    if (name !== 'Event') throw new Error(name + ' not implemented');
    return new Event();
  }

  createTextNode(text) {
    return new Text(this, text);
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

  toString() {
    return this.childNodes[0] + this.documentElement.outerHTML;
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
