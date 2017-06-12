const afterChanges = dtl => {
  const el = dtl._ownerElement;
  const attr = el.getAttributeNode('class');
  if (attr) {
    if (attr.value !== dtl.value) {
      attr.value = dtl.value;
    }
  } else if (dtl.value) {
    el.setAttribute('class', dtl.value);
  }
};

// interface DOMTokenList // https://dom.spec.whatwg.org/#interface-domtokenlist
module.exports = class DOMTokenList extends Array {

  constructor(ownerElement) {
    super();
    this._ownerElement = ownerElement;
  }

  item(i) {
    return this[i];
  }

  contains(token) {
    return this.includes(token);
  }

  add(...tokens) {
    this.splice(0, this.length, ...new Set(this.concat(tokens)));
    afterChanges(this);
  }

  remove(...tokens) {
    this.push(...this.splice(0, this.length)
                    .filter(token => !tokens.includes(token)));
    afterChanges(this);
  }

  replace(token, newToken) {
    const i = this.indexOf(token);
    if (i < 0) this.add(newToken);
    else this[i] = newToken;
    afterChanges(this);
  }

  toggle(token, force) {
    let result = false;
    if (this.contains(token)) {
      if (force) result = true;
      else this.remove(token);
    } else {
      if (arguments.length < 2 || force) {
        result = true;
        this.add(token);
      }
    }
    return result;
  }

  get value() {
    return this.join(' ');
  }

  set value(className) {
    this.splice(0, this.length);
    this.add(...String(className || '').trim().split(/\s+/));
    afterChanges(this);
  }

};
