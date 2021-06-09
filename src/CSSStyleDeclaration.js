const handler = {
  has(target, property) {
    switch (property) {
      case 'cssText':
        return true;
    }
    return _.get(target).props.hasOwnProperty(property);
  },
  get(target, property, receiver) {
    switch (property) {
      case 'cssText': return target.toString();
      case 'getPropertyValue': return target.getPropertyValue.bind(_.get(target).props);
      case 'setProperty': return target.setProperty.bind(_.get(target).props);
    }
    return _.get(target).props[property];
  },
  set(target, property, value) {
    const rel = _.get(target);
    const {props} = rel;
    rel.value = ('' + value).trim();
    switch (property) {
      case 'cssText':
        for (const key in props) delete props[key];
        (value || '').split(';').forEach(pair => {
          const kv = pair.split(':');
          if (kv.length < 2)
            return;
          const key = toProperty((kv[0] || '').trim());
          if (key) {
            const value = kv[1].trim();
            props[key] = (key === '_hyper' ? ' ' : '') + value;
          }
        });
        break;
      default:
        props[property] = value;
        break;
    }
    return true;
  }
};

const _ = new WeakMap;

module.exports = class CSSStyleDeclaration {
  constructor() {
    _.set(this, {props: {}, value: ''});
    return new Proxy(this, handler);
  }
  getPropertyValue(key) {
    return this[key];
  }
  setProperty(key, value) {
    this[key] = value;
  }
  toString() {
    const {props, value} = _.get(this);
    return Object.keys(props).reduce(
      (css, key) => css + toStyle(key) + ':' + props[key] + ';',
      ''
    ) || value;
  }
};

function toProperty(key) {
  return key.replace(/(.?)-([^-])/g, ($0, $1, $2) => ($1 === '-' ? $0 : ($1 + $2.toUpperCase())));
}

function toStyle(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
