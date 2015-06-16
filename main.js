var katex = require('katex');
var fs = require('fs');

var renderLaTeX = function(x){ 
  // Split into lines, since can't split LaTeX code over lines anyway, then any errors make the rest of the code still rendered.
  var lines = x.split("\n");
  var output = "";
  for(var j = 0; j < lines.length; j++){
    var lineTemp = "";
    var line = "";
    
    // First split by $$ so it doesn't mess up when splitting by $ later.
    var splitDisplay = lines[j].split("$$");
    if(splitDisplay.length > 1 && splitDisplay.length % 2 === 1){
      for(var i = 0; i<splitDisplay.length; ++i){
        //Because of the way split works, all even indices are regular text, and odd are code that needs to be rendered.
        if(i % 2 === 0){
          lineTemp += splitDisplay[i];
        }
        else {
          try{lineTemp += katex.renderToString(splitDisplay[i],{displayMode:true});}
          // Render unformatted text if there is an error
          catch(err){lineTemp += "<p style=\"text-align:center;\">\$\$" + splitDisplay[i] + '\$\$</p>';}
        }
      }
    }
    else {
      // If the LaTeX isn't wellformed (need matched $$s and at least 2), don't parse the line.
      lineTemp = lines[j];
    }
 
    // Repeat the process for inline math using $ ... $ to delimit
    var splitInline = lineTemp.split(/((?!\\).{1})\$/g);

    var l= 1
    while(l < splitInline.length){
      splitInline[l-1] += splitInline[l]
      splitInline.splice(l, 1)
      ;++l
    }


    if(splitInline.length > 1 && splitInline.length % 2 === 1){
      for(var k = 0; k < splitInline.length; ++k){
        if(k % 2 === 0){
          line += splitInline[k];
        }
        else {
          try{line += katex.renderToString(splitInline[k]);}
          catch(err){line += '$' + splitInline[k] + '$';}
        }
      }
    }
    else {
      line = lineTemp;
    }
 
    // Sum all the lines back up.
    output += line;
  }
  
  // Render escaped dollar signs back to $
  output = output.replace(/\\\$/g,"$");
  return output;
}

var templateEngine = function(filePath, options, callback) {
  return fs.readFile(filePath, function(err, content) {
    var rendered;
    if (err) {
      return callback(new Error(err));
    }
    rendered = renderLaTeX(content.toString());
    rendered = rendered.replace("</head>", "<link rel=\"stylesheet\" type=\"text/css\" href=\"//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min.css\"></head>");
    return callback(null, rendered);
  });
};


module.exports = {renderLaTeX: renderLaTeX, render: renderLaTeX, templateEngine: templateEngine};