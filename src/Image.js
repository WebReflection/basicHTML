const HTMLElement = require('./HTMLElement');
const {image, descriptors} = require('./ImagePrototype');

class Image extends HTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'img');
    image.set(this, {});
  }
}

Object.defineProperties(Image.prototype, descriptors);

module.exports = Image;
