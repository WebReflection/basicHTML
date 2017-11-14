const handler = {
  has(target, property) {
    switch (property) {
      case 'cssText': return true;
    }
    return target.hasOwnProperty(property);
  },
  get(target, property, receiver) {
    switch (property) {
      case 'cssText': return target.toString();
    }
    return target[property];
  },
  set(target, property, value) {
    switch (property) {
      case 'cssText':
        for (var key in target) delete target[key];
        value.split(';').forEach(pair => {
          const kv = pair.split(':');
          const key = toProperty((kv[0] || '').trim());
          if (key) target[key] = kv[1].trim();
        });
        break;
      default:
        target[property] = value;
        break;
    }
    return true;
  }
};

module.exports = class CSSStyleDeclaration {
  constructor() {
    return new Proxy(this, handler);
  }
  toString() {
    return Object.keys(this).reduce(
      (css, key) => css + toStyle(key) + ':' + this[key] + ';',
      ''
    );
  }
};

function toProperty(key) {
  return key.replace(/-([^-])/g, ($0, $1) => $1.toUpperCase());
}

function toStyle(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}