const Node = require('./Node');
const ChildNode = require('./ChildNode');

// interface CharacterData // https://dom.spec.whatwg.org/#characterdata
module.exports = class CharacterData extends Node.implements(ChildNode) {
  constructor(ownerDocument, data) {
    super(ownerDocument);
    this.data = data;
  }
};
