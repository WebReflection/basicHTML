const Node = require('./Node');

// interface DocumentType // https://dom.spec.whatwg.org/#documenttype
module.exports = class DocumentType extends Node {
  constructor(ownerDocument) {
    super(ownerDocument);
    this.nodeType = 10;
    this.name = 'html';
  }

  toString() {
    return '<!DOCTYPE ' + this.name + '>';
  }

};
