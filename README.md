# parse-katex
Parses all math sections (marked by $ ... $ for inline equations, and $$ ... $$ for display mode) inside HTML code with KaTeX.

To use simply include it and then call the function renderLaTeX like such:

    var math = require('parse-katex');
        console = require('console');
        
    console.log(math.renderLaTeX("<p>This is a sentence with an equation $a^2 + b^2 = c^2$</p>"));
    
