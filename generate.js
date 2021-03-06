
module.exports.generate = generate;
module.exports.generateNoCSS = generateNoCSS;

var shareVars = require('./share.js');
var cssify = require('./cssify.js');

function generate(shared, legible){
  //the order in which each these calls are made is very important

  var sharedScript = shareVars(shared, this.instance);

  var styles = cssify(this, legible)
  var embeddedCSS = new this.constructor('style').content(styles);
  styles = (appendAt(this, 'embedCSS', embeddedCSS) ? null : styles)

  var embeddedJS = new this.constructor('script').content(sharedScript);

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

function generateNoCSS(shared, legible){
  //the order in which each these calls are made is very important

  var sharedScript = shareVars(shared, this.instance);
  var embeddedJS = new this.constructor('script').content(sharedScript);
  sharedScript = (appendAt(this, 'embedJS', embeddedJS) ? null : sharedScript)

  var html = toHTML(this, '', legible !== true ? '' : '  ');

  var ret = {'html' : html};
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
  var newline = (tab === '' ? '' : '\n')
  var nextTab = tab;
  var selfClosing = false;

  var open;
  if(element.tag !== null){
    selfClosing = (element.tag.slice(-1) === '/');
  
    open = indent + "<"
    if(selfClosing){
      open += element.tag.slice(0, -1)
    } else {
      open += element.tag
    }
    if(element.classes !== undefined){
      element.attributes['class'] = element.classes;
    }
    var akeys = Object.keys(element.attributes);
    for(var i = 0; i < akeys.length; i++){
      open += " " + akeys[i]
      if(element.attributes[akeys[i]] !== undefined){
        open += '="' + element.attributes[akeys[i]] + '"'
      }
    }
    if(selfClosing){
      open += '/';
    }
    open += ">";
   
    if(element.contentList.length !== 0){
      open += newline;
    }
  } else {
    tab = '';
    open = '';
  }

  var content = '';
  for(var i = 0; i < element.contentList.length; i++){
    if(typeof element.contentList[i] === 'string'){
      content += tab + indent + element.contentList[i].replace(/\n/g, '\n' + tab + indent) + newline;
    } else {
      content += toHTML(element.contentList[i], indent + tab, nextTab) + newline;
    }
  }

  var close = '';
  if(element.tag !== null){
    if(!selfClosing){
      if(element.contentList.length !== 0){
        close += indent;
      }
      close += "</" + element.tag + ">";
    }
  }

  return open + content + close;
}

