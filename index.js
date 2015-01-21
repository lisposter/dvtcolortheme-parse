var fs = require('fs');
var plist = require('plist');

module.exports = exports.parse = function (file) {
  var colorscheme = plist.parse(fs.readFileSync(file, 'utf8'));
  var syntaxColors = colorscheme.DVTSourceTextSyntaxColors;
  delete colorscheme.DVTSourceTextSyntaxColors;
  var syntaxFonts = colorscheme.DVTSourceTextSyntaxFonts;
  delete colorscheme.DVTSourceTextSyntaxFonts;

  return {
    misc: process(colorscheme),
    syntax: process(syntaxColors),
    fonts: syntaxFonts
  }

};


function process(obj) {
  Object.keys(obj).forEach(function(key) {
    if (key.toLowerCase().indexOf('color') >=0 || key.toLowerCase().indexOf('xcode.syntax.') >= 0) {
      obj[key] = 'rgba(' + obj[key].split(' ').map(function (itm, idx) {
        return idx === 3 ? itm : (itm * 255).toFixed();
      }).join(', ') + ')';
    }
  })

  return obj;
}

