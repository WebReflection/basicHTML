const Node = require('./Node');
const CharacterData = require('./CharacterData');

// interface Text // https://dom.spec.whatwg.org/#text
module.exports = class Text extends CharacterData {
  constructor(ownerDocument, text) {
    super(ownerDocument, text);
    this.nodeType = Node.TEXT_NODE;
    this.nodeName = '#text';
  }
};
