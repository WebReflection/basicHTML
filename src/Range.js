// WARNING: this class is incomplete !!!

// interface Text // https://dom.spec.whatwg.org/#text
module.exports = class Range {

  deleteContents() {
    const parentNode = this._[0].parentNode;
    while (this._.length) {
      parentNode.removeChild(this._.pop());
    }
  }

  setStartBefore(node) {
    this._ = [node];
  }

  setEndAfter(node) {
    let el = this._[0];
    while (el !== node) {
      el = el.nextSibling;
      this._.push(el);
    }
  }

};
