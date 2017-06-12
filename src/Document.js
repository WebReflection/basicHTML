const Event = require('./Event');
const Node = require('./Node');
const DocumentType = require('./DocumentType');
const Attr = require('./Attr');
const Comment = require('./Comment');
const DocumentFragment = require('./DocumentFragment');
const HTMLElement = require('./HTMLElement');
const Text = require('./Text');

const freeze = Object.freeze;

function findById(child) {'use strict';
  return child.id === this || child.children.find(findById, this);
}

module.exports = class Document extends Node {

  constructor() {
    super(null);
    this.nodeType = 9;
    this.nodeName = '#document';
    this.appendChild(new DocumentType());
    this.documentElement = this.createElement('html');
    this.appendChild(this.documentElement);
    freeze(this.childNodes);
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
    return new HTMLElement(this, name);
  }

  createElementNS(ns, name) {
    return new HTMLElement(this, name + ':' + ns);
  }

  createEvent(type) {
    return new Event(type, {bubbles: true, cancelable: true});
  }

  createTextNode(text) {
    return new Text(this, text);
  }

  getElementsByTagName(name) {
    return /html/i.test(name) ?
      this.documentElement :
      this.documentElement.getElementsByTagName(name);
  }

  getElementsByClassName(name) {
    const html = this.documentElement;
    return (html.classList.contains(name) ? [html] : [])
            .concat(html.getElementsByClassName(name));
  }

  toString() {
    return this.childNodes[0] + this.documentElement.outerHTML;
  }

  // interface NonElementParentNode // https://dom.spec.whatwg.org/#nonelementparentnode
  getElementById(id) {
    const html = this.documentElement;
    return html.id === id ? [html] : html.children.find(findById, id) || null;
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
