
var cssify = require('./cssify.js');
var selectorName = require('./csscompile.js').selectorName;

function generate(shared, legible){

  var sharedScript = this.shareVars(shared);

  var iter = this.iterator();
  var i;
  while((i = iter()) !== null){
    i.applyChildStyles();
  }
  var ssheet = cssify(this, legible);
  var html = this.toHTML(legible === undefined ? legible : '');

  return {'html' : html, 'css' : ssheet, 'js' : sharedScript};
}

function shareVars(shared){
  var sharedVars = Object.keys(shared);
  var sharedScript = 
        'var pbr = function(){' +
           'function get(id){' +
              'return function(){' + 
                 'return document.getElementById(id)' + 
              '}' + 
            '}\n' +
            'return {';
  var newids = 0;
  for(var i = 0; i < sharedVars.length; i++){
    if(shared[sharedVars[i]].constructor.name === this.constructor.name){
      var id;
      var el = shared[sharedVars[i]];
      if(el.attributes.id !== undefined){
        id = el.attributes.id;
      } else {
        id = selectorName(newids);
        newids++;
        el.attribute('id', id);
      }
      sharedScript += "'" + sharedVars[i] + "': get('" + id + "'),";
    } else {
      sharedScript += "'" + sharedVars[i] + "':'" + shared[sharedVars[i]].toString() + "',";
    }
  }
  if(i > 0){
    sharedScript = sharedScript.substring(0, sharedScript.length - 1) + '}}();';
  } else {
    sharedScript = '';
  }
  return sharedScript;
}

function toHTML(spaces){
  var indent = (spaces === undefined ? '' : spaces);
  var newline = (spaces === undefined ? '' : '\n');
  var open = indent + "<" + this.tag;
  if(this.classes !== undefined){
    this.attributes['class'] = this.classes;
  }
  var akeys = Object.keys(this.attributes);
  for(var i = 0; i < akeys.length; i++){
    open += " " + akeys[i] + '="' + this.attributes[akeys[i]] + '"';
  }
  open += ">" + newline;
 
  var content = '';
  for(var i = 0; i < this.contentList.length; i++){
    if(typeof this.contentList[i] === 'string'){
      content += (spaces === undefined ? '' : '  ') + indent + this.contentList[i] + newline;
    } else {
      content += this.contentList[i].toHTML(spaces === undefined ? spaces : spaces + '  ') + newline;
    }
  }

  var close = indent + "</" + this.tag + ">";

  return open + content + close;
}

module.exports.generate = generate;
module.exports.toHTML = toHTML;
module.exports.shareVars = shareVars;
