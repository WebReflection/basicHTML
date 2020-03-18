require('@webreflection/interface');

// interface ChildNode @ https://dom.spec.whatwg.org/#interface-childnode
module.exports = Object.interface({
  before(node) {
    const {parentNode} = this;
    if (parentNode)
      parentNode.insertBefore(node, this);
  },
  after(node) {
    const {parentNode} = this;
    if (parentNode)
      parentNode.insertBefore(node, this.nextSibling);
  },
  replaceWith(node) {
    const {parentNode} = this;
    if (parentNode)
      parentNode.replaceChild(node, this);
  },
  remove() {
    const {parentNode} = this;
    if (parentNode)
      parentNode.removeChild(this);
  }
});
