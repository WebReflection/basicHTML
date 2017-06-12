// shared constants
const connect = (parentNode, child) => {
  if (
    child.isCustomElement && 'connectedCallback' in child &&
    parentNode && parentNode.nodeType !== 11
  ) {
    child.connectedCallback();
  }
};

const connectChild = child => connect(child.parentNode, child);

const disconnect = (parentNode, child) => {
  if (
    child.isCustomElement && 'disconnectedCallback' in child &&
    parentNode && parentNode.nodeType !== 11
  ) {
    child.disconnectedCallback();
  }
};

const disconnectChild = child => disconnect(child.parentNode, child);

const notifyAttributeChanged = (el, name, oldValue, newValue) => {
  if (
    el.isCustomElement &&
    'attributeChangedCallback' in el &&
    el.constructor.observedAttributes.includes(name)
  ) {
    el.attributeChangedCallback(name, oldValue, newValue);
  }
};

// shared functions
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
  connect,
  connectChild,
  disconnect,
  disconnectChild,
  injectNode,
  notifyAttributeChanged
};
