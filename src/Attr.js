const utils = require('./utils');
const Node = require('./Node');

// interface Attr // https://dom.spec.whatwg.org/#attr
module.exports = class Attr extends Node {

  constructor(ownerElement, name, value = null) {
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
    const oldValue = this._value;
    const isNull = _value == null;
    if (!isNull) _value = String(_value);
    if (oldValue !== _value) {
      this._value = _value;
      if (this.ownerElement) {
        switch (this.name) {
          case 'class':
            const cl = this.ownerElement.classList;
            if (isNull) {
              cl.splice(0, cl.length);
            } else {
              cl.value = _value;
            }
            break;
        }
        utils.notifyAttributeChanged(
          this.ownerElement,
          this.name, oldValue, _value
        );
      }
    }
  }

};
