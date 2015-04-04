
module.exports = generate;

var shareVars = require('./share.js');
var cssify = require('./cssify.js');
var applyChildStyles = require('./styles.js').applyChildStyles;

function generate(shared, legible){

  var sharedScript = shareVars(shared, this.instance);

  var iter = this.iterator();
  var i;
  while((i = iter()) !== null){
    applyChildStyles(i);
  }
  var ssheet = cssify(this, legible);
  var html = toHTML(this, legible === undefined ? legible : '');

  return {'html' : html, 'css' : ssheet, 'js' : sharedScript};
}



//////////////////////////////////////////////////////////

function toHTML(element, spaces){
  var indent = (spaces === undefined ? '' : spaces);
  var newline = (spaces === undefined ? '' : '\n');
  var open = indent + "<" + element.tag;
  if(element.classes !== undefined){
    element.attributes['class'] = element.classes;
  }
  var akeys = Object.keys(element.attributes);
  for(var i = 0; i < akeys.length; i++){
    open += " " + akeys[i] + '="' + element.attributes[akeys[i]] + '"';
  }
  open += ">" + newline;
 
  var content = '';
  for(var i = 0; i < element.contentList.length; i++){
    if(typeof element.contentList[i] === 'string'){
      content += (spaces === undefined ? '' : '  ') + indent + element.contentList[i] + newline;
    } else {
      content += toHTML(element.contentList[i], spaces === undefined ? spaces : spaces + '  ') + newline;
    }
  }

  var close = indent + "</" + element.tag + ">";

  return open + content + close;
}

