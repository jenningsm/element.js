
var cc = require('./csscompile');

function createStyleSheet(classes, legible){
  var newline = (legible === undefined ? '' : '\n');
  var indent = (legible === undefined ? '' : '  ');
  var stylesheet = '';
  for(cls in classes){
    if(classes.hasOwnProperty(cls)){
      stylesheet += '.' + cls + '{' + newline;
      for(var j = 0; j < classes[cls].length; j++){
        stylesheet += indent + classes[cls][j] + ';' + newline;
      }
      stylesheet += '}' + newline;
    }
  }
  return stylesheet;
} 

function format(string){
   string = string.replace(/^\s*/g, '');
   string = string.replace(/\s*$/g, '');
   string = string.replace(/\s+/g, ' ');
   return string;
}

function cssify(root, legible){
  var elements = [];
  var iter = root.iterator();
  var el;
  while((el = iter()) !== null){
    var keys = Object.keys(el.styles);
    var styles = [];
    for(var i = 0 ; i < keys.length; i++){
      styles.push(format(keys[i]) + ":" + format(el.styles[keys[i]]));
    }
    elements.push(styles);
  }

  var a = cc.compile(elements);

  var classes = a['elements'];
  var iter = root.iterator();
  for(var i = 0; i < classes.length; i++){
    var el = iter();
    if(classes[i].length !== 0){
      el.classes = classes[i].join(' ');
    }
  }

  return createStyleSheet(a['styles'], legible); 
}

module.exports = cssify;
