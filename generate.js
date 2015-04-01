
var cssify = require('./cssify.js');

function generate(legible){
  var iter = this.iterator();
  var i;
  while((i = iter()) !== null){
    i.applyChildStyles();
  }
  var ssheet = cssify(this);
  var html = this.toHTML(legible === undefined ? legible : '');

  return {'html' : html, 'css' : ssheet};
}

function toHTML(spaces){
  var indent = (spaces === undefined ? '' : spaces);
  var open = indent + "<" + this.tag;
  if(this.classes !== undefined){
    this.attributes['class'] = this.classes;
  }
  var akeys = Object.keys(this.attributes);
  for(var i = 0; i < akeys.length; i++){
    open += " " + akeys[i] + '="' + this.attributes[akeys[i]] + '"';
  }
  open += ">\n";
 
  var content = '';
  for(var i = 0; i < this.contentList.length; i++){
    if(typeof this.contentList[i] === 'string'){
      content += '  ' + indent + this.contentList[i] + "\n";
    } else {
      content += this.contentList[i].toHTML(spaces === undefined ? spaces : spaces + '  ') + "\n";
    }
  }

  var close = indent + "</" + this.tag + ">";

  return open + content + close;
}

module.exports.generate = generate;
module.exports.toHTML = toHTML;
