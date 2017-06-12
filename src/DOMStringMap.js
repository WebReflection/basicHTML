const HYPHENIZE = /(^|[a-z])([A-Z]+)/g;

const hyphen = k => 'data-' + String(k).replace(HYPHENIZE, '$1-$2').toLowerCase();

const DOMStringMapHandler = {

  has(target, property) {
    return target._ownerElement.hasAttribute(hyphen(property));
  },

  get(target, property) {
    target._ownerElement.getAttribute(hyphen(property));
  },

  set(target, property, value) {
    target._ownerElement.setAttribute(hyphen(property), value);
  }

};

module.exports = function DOMStringMap(ownerElement) {'use strict';
  this._ownerElement = ownerElement;
  return new Proxy(this, DOMStringMapHandler);
};
