
module.exports = generate;

var shareVars = require('./share.js');
var cssify = require('./cssify.js');
var applyChildStyles = require('./styles.js').applyChildStyles;

function generate(shared, legible){
  //the order in which each these calls are made is very important

  var sharedScript = shareVars(shared, this.instance);

  var iter = this.iterator();
  var i;
  while((i = iter()) !== null){
    applyChildStyles(i);
  }
  var styles = cssify(this, legible);

  // the 'this.constructor' awkwardness needs to be fixed
  var embeddedCSS = new this.constructor('style').content(styles);
  var embeddedJS = new this.constructor('script').content(sharedScript);

  styles = (appendAt(this, 'embedCSS', embeddedCSS) ? null : styles)
  sharedScript = (appendAt(this, 'embedJS', embeddedJS) ? null : sharedScript)

  var html = toHTML(this, '', legible !== true ? '' : '  ');

  var ret = {'html' : html};
  if(styles !== null){
    ret.css = styles;
  }
  if(sharedScript !== null){
    ret.js = sharedScript;
  }

  return ret
}



//////////////////////////////////////////////////////////

//iterates through element and appends insert at the first
//element with the property flag defined
//returns false if there is no such element, else returns true
function appendAt(element, flag, insert){
  var iter, item;
  iter = element.iterator();
  while((item = iter()) !== null){
    if(item.flags[flag] !== undefined){
      item.content(insert);
      return true;
    }
  }
  return false;
}

function toHTML(element, indent, tab){
  var newline = (tab === '' ? '' : '\n');
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
      content += tab + indent + element.contentList[i].replace(/\n/g, '\n' + tab + indent) + newline;
    } else {
      content += toHTML(element.contentList[i], indent + tab, tab) + newline;
    }
  }

  var close = indent + "</" + element.tag + ">";

  return open + content + close;
}

