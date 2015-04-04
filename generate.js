
var cssify = require('./cssify.js');
var selectorName = require('./csscompile.js').selectorName;

function generate(shared, legible){

  var sharedScript = shareVars(this, shared);

  var iter = this.iterator();
  var i;
  while((i = iter()) !== null){
    i.applyChildStyles();
  }
  var ssheet = cssify(this, legible);
  var html = toHTML(this, legible === undefined ? legible : '');

  return {'html' : html, 'css' : ssheet, 'js' : sharedScript};
}

module.exports = generate;

//////////////////////////////////////////////////////////

function shareVars(element, shared){
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
    if(element.instance(shared[sharedVars[i]])){
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
      sharedScript += "'" + sharedVars[i] + "':" + JSON.stringify(shared[sharedVars[i]]) + ",";
    }
  }
  if(i > 0){
    sharedScript = sharedScript.substring(0, sharedScript.length - 1) + '}}();';
  } else {
    sharedScript = '';
  }
  return sharedScript;
}

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

