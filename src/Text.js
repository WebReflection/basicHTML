const CharacterData = require('./CharacterData');

module.exports = class Text extends CharacterData {
  constructor(ownerDocument, text) {
    super(ownerDocument, text);
    this.nodeType = 3;
    this.nodeName = '#text';
  }
};
