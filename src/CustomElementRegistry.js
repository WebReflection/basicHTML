// CAVEAT: Custom Elements MUST be defined upfront
//         There is no instance upgrade since it's
//         not possible to reproduce it procedurally.

const broadcast = require('broadcast');

module.exports = class CustomElementRegistry {

  constructor() {
    this._registry = Object.create(null);
  }

  define(name, constructor, options) {
    const NAME = name.toUpperCase();
    if (NAME in this._registry)
      throw new Error(name + ' already defined');
    this._registry[NAME] = constructor;
    broadcast.that(NAME, constructor);
  }

  get(name) {
    return this._registry[name.toUpperCase()] || null;
  }

  whenDefined(name) {
    return broadcast.when(name.toUpperCase());
  }

};
