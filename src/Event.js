const getTime = () => {
  const time = process.hrtime();
  return time[0] * 1000000 + time[1] / 1000;
};

// interface Event // https://dom.spec.whatwg.org/#event
class Event {

  constructor(type, eventInitDict = {
    bubbles: false,
    cancelable: false,
    composed: false
  }) {
    if (type) this.initEvent(
      type,
      eventInitDict.bubbles,
      eventInitDict.cancelable
    );
    this.composed = eventInitDict.composed;
    this.isTrusted = false;
    this.defaultPrevented = false;
    this.cancelBubble = false;
    this.cancelImmediateBubble = false;
    this.eventPhase = Event.NONE;
    this.timeStamp = getTime();
  }

  initEvent(type, bubbles, cancelable) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
  }

  stopPropagation() {
    this.cancelBubble = true;
  }

  stopImmediatePropagation() {
    this.cancelBubble = true;
    this.cancelImmediateBubble = true;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

}

Event.NONE = 0;
Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

module.exports = Event;
