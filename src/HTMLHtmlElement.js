const Parser = require('htmlparser2').Parser;
const {VOID_ELEMENT} = require('./utils');

const parseInto = (node, html) => {
  const document = node.ownerDocument;
  const content = new Parser({
    onopentagname(name) {
      switch (name) {
        case 'html': break;
        case 'head':
        case 'body':
          node.replaceChild(document.createElement(name), document[name]);
          node = document[name];
          break;
        default:
          if (VOID_ELEMENT.test(node.nodeName)) node = node.parentNode;
          node = node.appendChild(document.createElement(name));
          break;
      }
    },
    onattribute(name, value) {
      node.setAttribute(name, value);
    },
    oncomment(data) {
      node.appendChild(document.createComment(data));
    },
    ontext(text) {
      node.appendChild(document.createTextNode(text));
    },
    onclosetag(name) {
      switch (name) {
        case 'html': break;
        default:
          if (node.nodeName === name)
            node = node.parentNode;
          break;
      }
    }
  }, {
    decodeEntities: true,
    xmlMode: true
  });
  content.write(html);
  content.end();
};

const Element = require('./Element');
const HTMLElement = require('./HTMLElement');

// interface HTMLHtmlElement // https://html.spec.whatwg.org/multipage/semantics.html#htmlhtmlelement
module.exports = class HTMLHtmlElement extends HTMLElement {

  get innerHTML() {
    const document = this.ownerDocument;
    return document.head.outerHTML + document.body.outerHTML;
  }

  set innerHTML(html) {
    this.textContent = '';
    parseInto(this, html);
  }

};
