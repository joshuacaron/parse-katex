var katex = require('katex')
var fs = require('fs')
var _ = require('lodash')

var parseExpression = function(raw, delimit, delimitEscaped, mathMode) {
  var lines = raw.split('\n')
  var output = ''
  for (var j = 0; j < lines.length; j++) {
    var parsedLine = ''

    // Split on delimiters if they are not escaped
    var pattern = '((?!\\\\).{1})' + _.escapeRegExp(delimitEscaped)
    var regex = new RegExp(pattern, 'g')
    var splitLine = lines[j].split(regex)

    // Add the characters before the delimitter to the previous line
    var l = 1
    while (l < splitLine.length) {
      splitLine[l - 1] += splitLine[l]
      splitLine.splice(l, 1)
      ;++l
    }

    if (splitLine.length > 1 && splitLine.length % 2 === 1) {
      // If there were matches and the code is well-formed, parse each math section (odd indices)
      for (var i = 0; i < splitLine.length; ++i) {
        if (i % 2 === 0) {
          parsedLine += splitLine[i]
        } else {
          try {
            parsedLine += katex.renderToString(splitLine[i],{displayMode: mathMode})
          }
          // Render unformatted text if there is an error
          catch (err) {
            parsedLine += '<p style=\"text-align:center;\">' + delimitEscaped + splitLine[i] + delimitEscaped + '</p>'
          }
        }
      }
    } else {
      // If the LaTeX isn't wellformed (need matched $$s and at least 2), don't parse the line.
      parsedLine = lines[j]
    }
    // Sum up the resulting lines and add newlines back in
    output += j < lines.length - 1 ? parsedLine + '\n' : parsedLine
  }
  return output
}

var renderLaTeX = function(unparsed) {
  // Need to parse for $$ first so it doesn't cause problems when check for $
  var parsed = parseExpression(unparsed, '$$', '\$\$', true)
  parsed = parseExpression(parsed, '$', '\$', false)

  // Remove final newlines, to minimize the code
  parsed = parsed.replace(/\n/g, '')

  // Render escaped dollar signs back to $
  parsed = parsed.replace(/\\\$/g, '$')
  return parsed
}

var templateEngine = function(filePath, options, callback) {
  var cssFile = '<link rel=\"stylesheet\" type=\"text/css\" href=\"//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min.css\">'

  return fs.readFile(filePath, function(err, content) {
    if (err) return callback(new Error(err))
      
    var rendered = renderLaTeX(content.toString())
    rendered = rendered.replace('</head>', cssFile + '</head>')
    return callback(null, rendered)
  })
}

module.exports = 
{ renderLaTeX: renderLaTeX
, render: renderLaTeX
, templateEngine: templateEngine
}