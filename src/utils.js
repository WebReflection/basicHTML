// shared constants
const connect = (parentNode, child) => {
  if (
    child.isCustomElement && 'connectedCallback' in child &&
    parentNode && parentNode.nodeType !== 11
  ) {
    child.connectedCallback();
  }
};

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

module.exports = {
  connect,
  disconnect,
  disconnectChild,
  notifyAttributeChanged
};
