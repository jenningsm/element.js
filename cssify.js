
var cc = require('./csscompile');

module.exports = function(root, legible){
  var elements = [];
  var iter = root.iterator();
  var el;
  while((el = iter()) !== null){
    var keys = Object.keys(el.styles);
    var styles = [];
    for(var i = 0 ; i < keys.length; i++){
      styles.push(keys[i].replace(/\s/g, '') + ":" + format(el.styles[keys[i]]));
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

function createStyleSheet(classes, legible){
  var newline = (legible !== true ? '' : '\n');
  var indent = (legible !== true ? '' : '  ');
  var stylesheet = '';
  
  var classNames = Object.keys(classes);
  for(var i = 0; i < classNames.length; i++){
    var cls = classes[classNames[i]];

    var pseudoStyles = {}
    for(var j = 0; j < cls.length; j++){
      var style = cls[j].split('?')
      if(style.length === 1){
        style.push(style[0])
        style[0] = '';
      }

      if(pseudoStyles[style[0]] === undefined){
        pseudoStyles[style[0]] = [style[1]]
      } else {
        pseudoStyles[style[0]].push(style[1])
      }
    }

    var pseudoNames = Object.keys(pseudoStyles);
    for(var j = 0; j < pseudoNames.length; j++){
      stylesheet += '.' + classNames[i];
      if(pseudoNames[j] !== ''){
        stylesheet += "::" + pseudoNames[j];
      }
      stylesheet += '{' + newline;
      var styles = pseudoStyles[pseudoNames[j]];
      for(var k = 0; k < styles.length; k++){
       stylesheet += indent + styles[k] + ';' + newline
      }
      stylesheet += '}' + newline
    }
  }

  return stylesheet;
} 

function format(string){
   //remove spaces at beginning
   string = string.replace(/^\s*/g, '');
   //remove spaces at end
   string = string.replace(/\s*$/g, '');
   //remove repeated spaces
   string = string.replace(/\s+/g, ' ');
   return string;
}

