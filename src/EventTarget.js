const Event = require('./Event');

const getHandler = (self, handler) =>
  handler.handleEvent ?
    e => handler.handleEvent(e) :
    e => handler.call(self, e);

const getOnce = (self, type, handler, options) =>
  e => {
    self.removeEventListener(type, handler, options);
    getHandler(self, handler)(e);
  };

// interface EventTarget // https://dom.spec.whatwg.org/#eventtarget
module.exports = class EventTarget {

  constructor() {
    this._eventTarget = Object.create(null);
  }

  addEventListener(type, handler, options) {
    const listener = this._eventTarget[type] || (this._eventTarget[type] = {
      handlers: [],
      callbacks: []
    });
    const i = listener.handlers.indexOf(handler);
    if (i < 0) {
      listener.callbacks[listener.handlers.push(handler) - 1] =
        options && options.once ?
          getOnce(this, type, handler, options) :
          getHandler(this, handler);
    }
  }

  removeEventListener(type, handler, options) {
    const listener = this._eventTarget[type];
    if (listener) {
      const i = listener.handlers.indexOf(handler);
      if (-1 < i) {
        listener.handlers.splice(i, 1);
        listener.callbacks.splice(i, 1);
        if (listener.handlers.length < 1) {
          delete this._eventTarget[type];
        }
      }
    }
  }

  dispatchEvent(event) {
    const type = event.type;
    let node = this;
    event.target = node;
    event.currentTarget = node;
    event.eventPhase = Event.AT_TARGET;
    do {
      if (type in node._eventTarget) {
        node._eventTarget[type].callbacks.some(
          cb => (cb(event), event.cancelImmediateBubble)
        );
      }
      event.eventPhase = Event.BUBBLING_PHASE;
    } while (!event.cancelBubble && (node = node.parentNode));
  }

};
