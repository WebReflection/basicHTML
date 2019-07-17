const escape = require('html-escaper').escape;

const Attr = require('./Attr');
const Element = require('./Element');
const DOMStringMap = require('./DOMStringMap');
const CSSStyleDeclaration = require('./CSSStyleDeclaration');

const {setPrototypeOf} = Object;

// interface HTMLElement // https://html.spec.whatwg.org/multipage/dom.html#htmlelement
class HTMLElement extends Element {
  constructor(ownerDocument, name) {
    super(ownerDocument, name);
    this.dataset = new DOMStringMap(this);
    this.style = new CSSStyleDeclaration();
    const style = new Attr(this, 'style', this.style);
    this.attributes.push(style);
    this.attributes.style = style;
    this.__isCE = -1;
  }
  get isCustomElement() {
    if (this.__isCE < 0) {
      this.__isCE = 0;
      const is = this.getAttribute('is') || this.nodeName;
      const ceName = -1 < is.indexOf('-');
      if (ceName) {
        const Class = this.ownerDocument.customElements.get(is);
        if (Class) {
          this.__isCE = 1;
          setPrototypeOf(this, Class.prototype);
        }
      }
    }
    return this.__isCE === 1;
  }
}

[
  'click',
  'focus',
  'blur'
].forEach(type => {
  Object.defineProperty(HTMLElement.prototype, type, {
    configurable: true,
    value: function () {
      const {ownerDocument} = this;
      ownerDocument.activeElement = type === 'blur' ? null : this;
      const event = ownerDocument.createEvent('Event');
      event.initEvent(type, true, true);
      this.dispatchEvent(event);
    }
  });
});

[
  'title',
  'lang',
  'translate',
  'dir',
  'hidden',
  'tabIndex',
  'accessKey',
  'draggable',
  'spellcheck',
  'contentEditable'
].forEach(name => {
  const lowName = name;
  Object.defineProperty(HTMLElement.prototype, name, {
    configurable: true,
    get() { return this.getAttribute(lowName); },
    set(value) { this.setAttribute(lowName, value); }
  });
});

// HTMLElement implements GlobalEventHandlers;
// HTMLElement implements DocumentAndElementEventHandlers;

[
  'onabort',
  'onblur',
  'oncancel',
  'oncanplay',
  'oncanplaythrough',
  'onchange',
  'onclick',
  'onclose',
  'oncontextmenu',
  'oncuechange',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onfocus',
  'oninput',
  'oninvalid',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onload',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onmousedown',
  'onmouseenter',
  'onmouseleave',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onpause',
  'onplay',
  'onplaying',
  'onprogress',
  'onratechange',
  'onreset',
  'onresize',
  'onscroll',
  'onseeked',
  'onseeking',
  'onselect',
  'onshow',
  'onstalled',
  'onsubmit',
  'onsuspend',
  'ontimeupdate',
  'ontoggle',
  'onvolumechange',
  'onwaiting',
  'onauxclick',
  'ongotpointercapture',
  'onlostpointercapture',
  'onpointercancel',
  'onpointerdown',
  'onpointerenter',
  'onpointerleave',
  'onpointermove',
  'onpointerout',
  'onpointerover',
  'onpointerup'
].forEach(ontype => {
  let _value = null;
  const type = ontype.slice(2);
  Object.defineProperty(HTMLElement.prototype, ontype, {
    configurable: true,
    get() {
      return _value;
    },
    set(value) {
      if (!value) {
        if (_value) {
          value = _value;
          _value = null;
          this.removeEventListener(type, value);
        }
        this.removeAttribute(ontype);
      } else {
        _value = value;
        this.addEventListener(type, value);
        this.setAttribute(ontype, 'return (' + escape(
          JS_SHORTCUT.test(value) && !JS_FUNCTION.test(value) ?
            ('function ' + value) :
            ('' + value)
        ) + ').call(this, event)');
      }
    }
  });
});

// helpers
const JS_SHORTCUT = /^[a-z$_]\S*?\(/;
const JS_FUNCTION = /^function\S*?\(/;

module.exports = HTMLElement;
