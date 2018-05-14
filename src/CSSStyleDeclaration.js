const handler = {
  has(target, property) {
    switch (property) {
      case 'cssText':
      case 'ownerElement':
        return true;
    }
    return _.get(target).props.hasOwnProperty(property);
  },
  get(target, property, receiver) {
    switch (property) {
      case 'cssText': return target.toString();
      case 'ownerElement': return _.get(target).ownerElement;
    }
    return _.get(target).props[property];
  },
  set(target, property, value) {
    const {props} = _.get(target);
    switch (property) {
      case 'cssText':
        for (const key in props) delete props[key];
        (value || '').split(';').forEach(pair => {
          const kv = pair.split(':');
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
  constructor(ownerElement) {
    _.set(this, {
      ownerElement,
      props: {}
    });
    return new Proxy(this, handler);
  }
  toString() {
    const {props} = _.get(this);
    return Object.keys(props).reduce(
      (css, key) => css + toStyle(key) + ':' + props[key] + ';',
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
