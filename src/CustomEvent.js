const Event = require('./Event');

// interface CustomEvent // https://dom.spec.whatwg.org/#customevent
module.exports = class CustomEvent extends Event {
  constructor(type, eventInitDict = {
    bubbles: false,
    cancelable: false,
    composed: false,
    detail: null
  }) {
    super(type, eventInitDict);
    this.detail = eventInitDict.detail;
  }

  initCustomEvent(type, bubbles, cancelable, detail) {
    this.initEvent(type, bubbles, cancelable);
    this.detail = detail;
  }
};
