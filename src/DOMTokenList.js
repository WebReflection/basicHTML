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
    const current = this.length;
    const removing = tokens.length;
    if (removing === 1) {
      const token = tokens[0];
      for (let i = current - 1; i >= 0; i--) {
        if (this[i] === token) {
          this.splice(i, 1);
          break;
        }
        if (i === 0) return;
      }
    } else {
      main: for (let i = 0; i < removing; i++) {
        for (let j = current - 1; j >= 0; j--) {
          if (this[j] === tokens[i]) {
            this.splice(j, 1);
            continue main;
          }
        }
      }
    }
    afterChanges(this);
  }

  replace(token, newToken) {
    for (let i = 0, n = this.length; i < n; i++) {
      if (this[i] === token) {
        this[i] = newToken;
        return afterChanges(this);
      }
    }
    this.add(newToken);
  }

  toggle(token, force) {
    let result = false, index = -1, length = this.length;
    for (let i = 0; i < length; i++) {
      if (this[i] === token) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      if (force) {
        result = true;
      } else {
        this.splice(index, 1);
        afterChanges(this);
      }
    } else {
      if (arguments.length < 2 || force) {
        result = true;
        this[length] = token;
        afterChanges(this);
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
