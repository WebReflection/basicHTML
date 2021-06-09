const { Document } = require("../");

const document = new Document();

// attributes
document.documentElement.setAttribute("lang", "en");

// common accessors
document.documentElement.innerHTML = `
  <head></head>
  <body style="--foo: bar"></body>
`;
document.body.textContent = "Hello basicHTML";

// basic querySelector / querySelectorAll
document
  .querySelector("head")
  .appendChild(document.createElement("title")).textContent = "HTML on NodeJS";

// toString() necessary to read, it's a Buffer
console.log(document.toString());