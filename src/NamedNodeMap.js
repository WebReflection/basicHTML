module.exports = class NamedNodeMap extends Array {
  constructor(ownerElement) {
    super();
    this.ownerElement = ownerElement;
  }
  getNamedItem(name) {
    return this.ownerElement.getAttributeNode(name);
  }
  setNamedItem(attr) {
    return this.ownerElement.setAttributeNode(attr);
  }
  removeNamedItem(name) {
    return this.ownerElement.removeAttribute(name);
  }
  item(index) {
    return this[index] || null;
  }
};
