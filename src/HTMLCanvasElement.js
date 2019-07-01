const HTMLElement = require('./HTMLElement');
const {createCanvas} = require('canvas');

const canvas = new WeakMap;

class HTMLCanvasElement extends HTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'canvas');
    canvas.set(this, createCanvas(300, 150));
  }
  get width() {
    return canvas.get(this).width;
  }
  set width(value) {
    this.setAttribute('width', value);
    canvas.get(this).width = value;
  }
  get height() {
    return canvas.get(this).height;
  }
  set height(value) {
    this.setAttribute('height', value);
    canvas.get(this).height = value;
  }
  getContext(type) {
    return canvas.get(this).getContext(type);
  }
  toDataURL(...args) {
    return canvas.get(this).toDataURL(...args);
  }
}

module.exports = HTMLCanvasElement;
