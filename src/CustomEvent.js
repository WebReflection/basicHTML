const Event = require('./Event');

module.exports = class CustomEvent extends Event {
  constructor(type, eventInitDict = {
    bubbles: false,
    cancelable: false,
    composed: false,
    detail: null
  }) {
    super(type, eventInitDict);
    this.detail = detail;
  }
};
