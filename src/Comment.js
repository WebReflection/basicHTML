const CharacterData = require('./CharacterData');

module.exports = class Comment extends CharacterData {
  constructor(ownerDocument, comment) {
    super(ownerDocument, comment);
    this.nodeType = 8;
    this.nodeName = '#comment';
  }
};
