const Node = require('./Node');
const CharacterData = require('./CharacterData');

// interface Text // https://dom.spec.whatwg.org/#text
module.exports = class Text extends CharacterData {
  constructor(ownerDocument, text) {
    super(ownerDocument, text);
    this.nodeType = Node.TEXT_NODE;
    this.nodeName = '#text';
  }

  get wholeText() {
    let text = this.textContent;
    let prev = this.previousSibling;
    while (prev && prev.nodeType === 3) {
      text = prev.textContent + text;
      prev = prev.previousSibling;
    }
    let next = this.nextSibling;
    while (next && next.nodeType === 3) {
      text = text + next.textContent;
      next = next.nextSibling;
    }
    return text;
  }

  set wholeText(val) {}
};
