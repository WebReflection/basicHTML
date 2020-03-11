const HTMLElement = require('./HTMLElement');
const {COMMENT_NODE} = HTMLElement;

module.exports = class HTMLNoComments extends HTMLElement {

  appendChild(node) {
    super.appendChild(
      node.nodeType === COMMENT_NODE ?
        this.ownerDocument.createTextNode(`<!--${node.textContent}-->`) :
        node
    );
  }

};
