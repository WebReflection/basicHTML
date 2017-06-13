// CAVEAT: Custom Elements MUST be defined upfront
//         There is no instance upgrade since it's
//         not possible to reproduce it procedurally.

const broadcast = require('broadcast');

module.exports = class CustomElementRegistry {

  constructor() {
    this._registry = Object.create(null);
  }

  define(name, constructor, options) {
    if (name in this._registry)
      throw new Error(name + ' already defined');
    this._registry[name] = constructor;
    broadcast.that(name, constructor);
  }

  get(name) {
    return this._registry[name] || null;
  }

  whenDefined(name) {
    return broadcast.when(name);
  }

};
