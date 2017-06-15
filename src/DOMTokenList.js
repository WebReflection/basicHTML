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
    const current = this.length;
    const adding = tokens.length;
    if (adding === 1) {
      const token = tokens[0];
      for (let i = 0; i < current; i++) {
        if (this[i] === token) return;
      }
      this.push(token);
    } else {
      main: for (let i = 0; i < adding; i++) {
        for (let j = 0; j < current; j++) {
          if (this[j] === tokens[i]) continue main;
        }
        this.push(tokens[i]);
      }
    }
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
    const tokens = String(className || '').trim().split(/\s+/);

    const previous = this.length;
    const next = tokens.length;
    const empty = previous === 0;

    let existing, i;
    for (i = 0, existing = 0; i < next; i++) {
      if (this[i] === tokens[i]) {
        existing += 1;
        continue;
      }
      this[i] = tokens[i];
    }
    const unchanged = empty === false && existing === previous;
    if (unchanged) return;

    const trim = previous > next;
    if (trim === true) {
      const overflow = previous - next;
      this.splice(next, overflow);
    }
    afterChanges(this);
  }

};
