const Parser = require('htmlparser2').Parser;
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

const utils = require('./utils');
const HTMLElement = require('./HTMLElement');

// interface HTMLHtmlElement // https://html.spec.whatwg.org/multipage/semantics.html#htmlhtmlelement
module.exports = class HTMLHtmlElement extends HTMLElement {

  constructor(ownerDocument, name) {
    super(ownerDocument, name).isCustomElement = false;
  }

  set innerHTML(html) {
    this.childNodes
        .splice(0, this.childNodes.length)
        .forEach(utils.disconnectChild);
    parseInto(this, html);
  }

};
