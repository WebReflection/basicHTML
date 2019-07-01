const HTMLElement = require('./HTMLElement');
const Image = require('./Image');

module.exports = function ImageFactory(document, ...size) {
  const [width, height] = size;
  let img = document.createElement('img');
  if (img.constructor === HTMLElement)
    img = new Image(document);
  switch (size.length) {
    case 1:
      img.width = width;
      img.height = width;
      return img;
    case 2:
      img.width = width;
      img.height = height;
      return img;
  }
  return img;
};
