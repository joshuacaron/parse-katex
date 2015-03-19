# parse-katex
Parses all HTML code and renders all LaTeX code (marked by $ ... $ for inline equations, and $$ ... $$ for display mode) to properly formatted expressions using [KaTeX](https://github.com/Khan/KaTeX).

The benefit to using this package is you can pre-render all math content (when it is called from the database for instance) and serve it to the user as pure HTML, which is faster, doesn't cause the page to flicker/rearrange on load, and doesn't need them to have JavaScript enabled.

To install, run `npm install --save parse-katex`.

Then, to use simply include it, and then call the function `renderLaTeX` like such:

    var math = require('parse-katex');
     console = require('console');
        
    console.log(math.renderLaTeX("<p>This is a sentence with an equation $a^2 + b^2 = c^2$</p>"));

On the user facing page, you still need to include the KaTeX CSS file (you *don't* need to include the KaTeX JavaScript file) to cause it to render properly. You can include it like this:

    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.2.0/katex.min.css">

    
