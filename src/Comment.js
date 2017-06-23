const Node = require('./Node');
const CharacterData = require('./CharacterData');

// interface Comment // https://dom.spec.whatwg.org/#comment
module.exports = class Comment extends CharacterData {
  constructor(ownerDocument, comment) {
    super(ownerDocument, comment);
    this.nodeType = Node.COMMENT_NODE;
    this.nodeName = '#comment';
  }
};
