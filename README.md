# basicHTML

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC) [![Build Status](https://travis-ci.org/WebReflection/basicHTML.svg?branch=master)](https://travis-ci.org/WebReflection/basicHTML) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/basicHTML/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/basicHTML?branch=master) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate)

A NodeJS based, standard oriented, HTML implementation.

<img alt="viperHTML logo" src="https://webreflection.github.io/hyperHTML/logo/basichtml.svg" width="116" height="81">

**work in progress**

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


#### About current caveats ...

  * since `v0.2`, the property `nodeName` is **case-sensitive** to make _basicHTML_ compatible with _XML_ projects too
  * `el.querySelectorAll(css)` works with `tagName`, `#id`, or `.className`. More complex selectors are right now not planned.
  * `el.querySelector(css)` is not optimized and will return just index `0` of the whole collection. However, selecting a lot is not the goal of this library.
  * `el.getElementsByTagName` as well as `el.getElementsByClassName` and `el.getElementsById` are all available. The latter is the fastest one of the trio.
  * all collections are basically just arrays. You should use official DOM methods to mutate them. As example, do not ever `childNodes.push(new Node)` 'cause that's not what you could do on the DOM. The whole point here is to provide a Web like env, not to write defensive code for NodeJS or other non strictly Web environments.
  * most historical properties and standards are most likely not implemented


### Todo

  * test possible hooks for NativeScript element as Custom Element <sub><sup>(nativeHTML related)</sup></sub>


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

Please bear in mind this is a work in progress, and it's not aiming to become a fully standard compliant implementation of the whole WebIDL based specifications, there are other projects for that.

