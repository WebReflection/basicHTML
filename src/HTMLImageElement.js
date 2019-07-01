const {Image} = require('canvas');

const HTMLElement = require('./HTMLElement');
const {image, descriptors} = require('./ImagePrototype');

class HTMLImageElement extends HTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'img');
    image.set(this, new Image());
  }
  get onload() {
    return image.get(this).onload;
  }
  set onload(callback) {
    image.get(this).onload = callback;
  }
  get onerror() {
    return image.get(this).onerror;
  }
  set onerror(callback) {
    image.get(this).onerror = callback;
  }
}

Object.defineProperties(HTMLImageElement.prototype, descriptors);

module.exports = HTMLImageElement;
