# parse-katex
Parses all HTML code and renders all LaTeX code (marked by $ ... $ for inline equations, and $$ ... $$ for display mode) to properly formatted expressions using [KaTeX](https://github.com/Khan/KaTeX).

The benefit to using this package is you can pre-render all math content (when it is called from the database for instance) and serve it to the user as pure HTML, which is faster, doesn't cause the page to flicker/rearrange on load, and doesn't need them to have JavaScript enabled.

There is also an Express.js template engine for serving views in an Express app.

To install, run `npm install --save parse-katex`.

Then, to use simply include it, and then call the function `renderLaTeX` (or `render` which is an alias) like such:

    var katex = require('parse-katex');
    var console = require('console');
        
    console.log(katex.renderLaTeX("<p>This is a sentence with an equation $a^2 + b^2 = c^2$</p>"));

On the user facing page, you still need to include the KaTeX CSS file (you *don't* need to include the KaTeX JavaScript file) to cause it to render properly. You can include it like this:

    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.2.0/katex.min.css">

To use the Express.js template engine, simply use the `katex.templateEngine` function to declare the engine. The following example shows a minimal setup to render KaTeX in html files (note that the stylesheet is automatically appended to the head when using the template engine so there is no need to include it manually).

    var express = require('express');
    var katex = require('parse-katex');

    var app = express();

    app.engine('html', katex.templateEngine);
    app.set('view engine', 'html');

    app.get('/', function(req, res, next) {
      return res.render('index');
    });

    app.listen(3000);