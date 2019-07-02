const image = new WeakMap;

module.exports = {
  image,
  descriptors: [
    'alt',
    'height',
    'src',
    'title',
    'width'
  ].reduce((descriptors, key) => {
    descriptors[key] = {
      configurable: true,
      get() { return image.get(this)[key]; },
      set(value) {
        this.setAttribute(key, value);
        image.get(this)[key] = value;
      }
    };
    return descriptors;
  }, {})
};
