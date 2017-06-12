// only shared functions or constants

function addAttribute(attr) {
  this.setAttribute(attr.name, attr.value);
}

function injectNode(node) {
  switch (node.nodeName) {
    case '#text':
      this.appendChild(this.ownerDocument.createTextNode(node.value));
      break;
    case '#comment':
      this.appendChild(this.ownerDocument.createComment(node.data));
      break;
    default:
      const el = this.ownerDocument.createElement(node.nodeName);
      node.attrs.forEach(addAttribute, el);
      node.childNodes.forEach(injectNode, el);
      this.appendChild(el);
      break;
  }
}

module.exports = {
  addAttribute,
  injectNode
};
