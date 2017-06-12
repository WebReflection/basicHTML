const Node = require('./Node');

module.exports = class Attr extends Node {

  constructor(ownerElement, name, value) {
    super(ownerElement.ownerDocument);
    this.ownerElement = ownerElement;
    this.name = name;
    this.nodeType = 2;
    this.nodeName = name;
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(_value) {
    this._value = _value;
    if (this.ownerElement) {
      switch (this.name) {
        case 'class':
          this.ownerElement.classList.value = _value;
          break;
      }
    }
  }

};
