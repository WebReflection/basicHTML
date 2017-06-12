const Node = require('./Node');

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
