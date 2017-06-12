const Node = require('./Node');

module.exports = class CharacterData extends Node {
  constructor(ownerDocument, data) {
    super(ownerDocument);
    this.data = data;
  }
};
