var katex = require('katex');

renderLaTeX = function(x){
  // Useless character that is unlikely to be typed. Need to hame some method to escape legitimate dollar signs.
  x = x.replace(/\\\$/g,"Ž");
 
  // Split into lines, since can't split LaTeX code over lines anyway, then any errors make the rest of the code still rendered.
  lines = x.split("\n");
  output = "";
  for(j=0;j<lines.length;j++){
    lineTemp = "";
    line = "";
    
    // First split by $$ so it doesn't mess up when splitting by $ later.
    splitDisplay = lines[j].split("$$");
    if(splitDisplay.length>1 && splitDisplay.length%2==1){
      for(i=0;i<splitDisplay.length;++i){
        //Because of the way split works, all even indices are regular text, and odd are code that needs to be rendered.
        if(i%2==0){
          lineTemp += splitDisplay[i];
        }
        else {
          try{lineTemp += katex.renderToString(splitDisplay[i],{displayMode:true});}
          // Render unformatted text if there is an error
          catch(err){lineTemp += "<p style=\"text-align:center;\">ŽŽ" + splitDisplay[i] + 'ŽŽ</p>';}
        }
      }
    }
    else {
      // If the LaTeX isn't wellformed (need matched $$s and at least 2), don't parse the line.
      lineTemp = lines[j];
    }
 
    // Repeat the process for inline math using $ ... $ to delimit
    splitInline = lineTemp.split("$");
    if(splitInline.length>1 && splitInline.length%2==1){
      for(k=0;k<splitInline.length;++k){
        if(k%2==0){
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
  output = output.replace(/Ž/g,"$");
  return output;
}

module.exports.renderLaTeX = renderLaTeX;