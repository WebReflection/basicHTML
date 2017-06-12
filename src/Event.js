const getTime = () => {
  const time = process.hrtime();
  return time[0] * 1000000 + time[1] / 1000;
};

class Event {

  constructor(type, eventInitDict = {
    bubbles: false,
    cancelable: false,
    composed: false
  }) {
    this.type = type;
    this.isTrusted = false;
    this.defaultPrevented = false;
    this.cancelBubble = false;
    this.cancelImmediateBubble = false;
    this.bubbles = eventInitDict.bubbles;
    this.cancelable = eventInitDict.cancelable;
    this.composed = eventInitDict.composed;
    this.eventPhase = Event.NONE;
    this.timeStamp = getTime();
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
