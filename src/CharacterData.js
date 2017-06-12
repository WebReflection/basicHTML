const Node = require('./Node');

// interface CharacterData // https://dom.spec.whatwg.org/#characterdata
module.exports = class CharacterData extends Node {
  constructor(ownerDocument, data) {
    super(ownerDocument);
    this.data = data;
  }
};
