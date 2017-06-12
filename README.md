# basicHTML

A NodeJS based, standard oriented, HTML implementation.

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


### Todo

  * improve the code coverage
  * test possible hooks for NativeScript element as Custom Element <sub>(nativeHTML related)</sub>


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