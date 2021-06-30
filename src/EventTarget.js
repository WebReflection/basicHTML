const Event = require('./Event');

const {defineProperty} = Object;

const crawlUp = node =>
  node.parentNode ||
  (node.nodeType === node.DOCUMENT_NODE ? node.defaultView : null);

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

  static init(self) {
    self._eventTarget = Object.create(null);
    if (self instanceof EventTarget)
      return;
    const et = EventTarget.prototype;
    self.addEventListener = et.addEventListener;
    self.removeEventListener = et.removeEventListener;
    self.dispatchEvent = et.dispatchEvent;
  }

  constructor() {
    EventTarget.init(this);
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
    /* istanbul ignore next */
    if (!event.target) defineProperty(event, 'target', {get: () => node});
    /* istanbul ignore next */
    if (!event.currentTarget) defineProperty(event, 'currentTarget', {get: () => node});
    /* istanbul ignore next */
    if (!event.eventPhase) defineProperty(event, 'eventPhase', {configurable: true, value: Event.AT_TARGET});
    do {
      if (type in node._eventTarget) {
        [...node._eventTarget[type].callbacks].some(
          cb => (cb(event), event.cancelImmediateBubble)
        );
      }
      defineProperty(event, 'eventPhase', {configurable: true, value: Event.BUBBLING_PHASE});
    } while (event.bubbles && !event.cancelBubble && (node = crawlUp(node)));
    return !event.defaultPrevented;
  }

};
