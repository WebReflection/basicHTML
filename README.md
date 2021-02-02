# basicHTML

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/basicHTML/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/basicHTML?branch=master)
[![Build Status](https://travis-ci.org/WebReflection/basicHTML.svg?branch=master)](https://travis-ci.org/WebReflection/basicHTML)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)


## 📣 Announcement

Be aware there is a shiny new module called **[LinkeDOM](https://github.com/WebReflection/linkedom#readme)** which is completely different, but better than *basicHTML*, at pretty much everything.

All modules of mine are going to use *linkedom* instead, and *basicHTML* will be soon deprecated or put in maintainance mode.

Feel free to read the [related post](https://webreflection.medium.com/linkedom-a-jsdom-alternative-53dd8f699311) to know more about this decision.

- - -

A NodeJS based, standard oriented, HTML implementation.

<img alt="viperHTML logo" src="https://webreflection.github.io/hyperHTML/logo/basichtml.svg" width="116" height="81">


### Breaking V2 Changes

As the `canvas` module brought in ~100MB of dependency, and as it's not even a common use case, I've decided to move the `canvas` package into `devDependencies`, so that you need to explicitly include it when you use _basicHTML_.

```js
npm i basichtml canvas
```

By default, no `canvas` module will be installed at all.


### New in v1

Introduced optional [node-canvas](https://www.npmjs.com/package/canvas) dependency behind the `<canvas>` and `<img>` scene 🦄

  * automatic fallback if the `canvas` module doesn't build
  * provide canvas 2d API, with the ability to create real images
  * provide the `node-canvas` Image ability to react on `load` and `error` events

```js
const {Image, document} = require('basichtml').init({});

const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 200;

const ctx = canvas.getContext('2d');
ctx.moveTo(0, 0);
ctx.lineTo(320, 200);
ctx.stroke();

const img = new Image();
img.onload = () => {
  console.log(img.outerHTML);
};
img.src = canvas.toDataURL();
```


### New in 0.23

Custom Elements built-in extends are finally supported 🎉

```js
customElements.define('my-special-thing', MySpecialThing, {extends: 'div'});
document.createElement('div', {is: 'my-special-thing'});
```

### New `init(...)` in 0.13
```js
// easy way, introduced in 0.13
// pollutes by default the global with:
//  - window
//  - document
//  - customElements
//  - HTMLElement
// if a non global window is provided
// it will use it as defaultView
require('basichtml').init({
  // all properties are optional
  window: global,
  // in case you'd like to share a predefined
  // registry of Custom Elements
  customElements,
  // specify a different selector
  selector: {
    // use the module sizzle, it will be required
    // automatically
    name: 'sizzle',
    // or alternatively, use a module function
    module() {
      return require('sizzle');
    },
    // how to retrieve results => querySelectorAll
    $(Sizzle, element, css) {
      return Sizzle(css, element);
    }
  }
});
// returns the window itself
```


#### Good old way to init with basic selectors
```js
const {Document} = require('basichtml');

const document = new Document();

// attributes
document.documentElement.setAttribute('lang', 'en');

// common accessors
document.documentElement.innerHTML = `
  <head></head>
  <body></body>
`;
document.body.textContent = 'Hello basicHTML';

// basic querySelector / querySelectorAll
document.querySelector('head').appendChild(
  document.createElement('title')
).textContent = 'HTML on NodeJS';

// toString() necessary to read, it's a Buffer
console.log(document.toString());
```

Above log will produce an output like the following one.
```html
<!DOCTYPE html>
<html lang="en">
  <head><title>HTML on NodeJS</title></head>
  <body>Hello basicHTML</body>
</html>
```


### Features

  * create any amount of documents
  * document fragments, comments, text nodes, and elements
  * elements have classList and dataset too
  * Event and CustomEvent through add/removeEventListener and dispatchEvent
  * DOM Level 0 compatible events
  * Attributes compatible with Custom Elements reactions
  * arbitrary Custom Elements creation
  * customizable selector engine


#### Current caveats / exceptions

  * since `v0.2`, the property `nodeName` is **case-sensitive** to make _basicHTML_ compatible with _XML_ projects too
  * `el.querySelectorAll(css)` works with `tagName`, `#id`, or `.className`. You can use more complex selectors including 3rd party libraries such [Sizzle](https://github.com/jquery/sizzle), as shown in this [test example](https://github.com/WebReflection/basicHTML/blob/master/test/sizzle.js).
  * `el.querySelector(css)` is not optimized and will return just index `0` of the whole collection. However, selecting a lot is not the goal of this library.
  * `el.getElementsByTagName` as well as `el.getElementsByClassName` and `el.getElementsById` are all available. The latter is the fastest one of the trio.
  * all collections are basically just arrays. You should use official DOM methods to mutate them. As example, do not ever `childNodes.push(new Node)` 'cause that's not what you could do on the DOM. The whole point here is to provide a Web like env, not to write defensive code for NodeJS or other non strictly Web environments.
  * most historical properties and standards are most likely not implemented


### License
```
ISC License

Copyright (c) 2017, Andrea Giammarchi, @WebReflection

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```


#### What is this about?

This is an essential implementation of most common HTML operations without the necessary bloat brought in by the entire HTML specification.

The ideal scenario is together with [hyperHTML](https://github.com/WebReflection/hyperHTML) to be able to create DOM trees and objects capable of being updated, refreshed, related to any native component.

The perfect scenario would be to drive [NativeScript](https://www.nativescript.org/) components using a CustomElementRegistry like you would do on the Web for Custom Elements.

Please bear in mind this project is not aiming to become a fully standard compliant implementation of the whole WebIDL based specifications, there are other projects for that.
