
var cc = require('./csscompile');

function createStyleSheet(classes){
  var stylesheet = '';
  for(cls in classes){
    if(classes.hasOwnProperty(cls)){
      stylesheet += '.' + cls + '{\n';
      for(var j = 0; j < classes[cls].length; j++){
        stylesheet += "  " + classes[cls][j] + ';\n';
      }
      stylesheet += '}\n';
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

function iterator(root){
  var currgen = [root];
  var nextgen = [];
  return function(){
    if(currgen.length === 0){
      if(nextgen.length === 0){
        return null;
      } else {
        currgen = nextgen;
        nextgen = [];
      }
    }
    for(var i = 0; i < currgen[0].content.length; i++){
      if(typeof currgen[0].content[i] !== 'string'){
        nextgen.push(currgen[0].content[i]);
      }
    }
    return currgen.splice(0, 1)[0];
  }
}

function cssify(root){
  var elements = [];
  var iter = iterator(root);
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
  var iter = iterator(root);
  for(var i = 0; i < classes.length; i++){
    if(classes[i].length !== 0){
      iter().classes = classes[i].join(' ');
    }
  }

  return createStyleSheet(a['styles']); 

}

function createHTML(element){
  var open = "<" + element.tag;
  if(element.classes !== undefined){
    element.attributes['class'] = element.classes;
  }
  var akeys = Object.keys(element.attributes);
  for(var i = 0; i < akeys.length; i++){
    open += " " + akeys[i] + '="' + element.attributes[akeys[i]] + '"';
  }
  open += ">\n";
 
  var content = '';
  for(var i = 0; i < element.content.length; i++){
    if(typeof element.content[i] === 'string'){
      open += element.content[i] + "\n";
    } else {
      open += createHTML(element.content[i]) + "\n";
    }
  }

  var close = "</" + element.tag + ">";

  return open + content + close;
}

function generate(root){
  var ssheet = cssify(root);
  var html = createHTML(root);

  return {'html' : html, 'css' : ssheet};
}

module.exports.generate = generate;

/*
  tag: the tag of the element
  attributes: the attributes for the tag. either a dictionary of attribute value pairs, or a string representing an attribute.
  value: only defined if attributes is a string. if defined, is the value for the attribute
*/
function element(tag, attributes, value){
  var el = {};
  el.tag = tag;
  el.styles = {};
  el.content = [];


  if(attributes !== undefined){
    if(checkAttributes(attributes) === -1){
       return;
    }

    if(value === undefined){
      el.attributes = attributes;
    } else {
      el.attributes = { attributes : value };
    }
  } else {
    el.attributes = {};
  }

  return el;
}

module.exports.element = element;

/*
  set the style of an element. This function may be used in two ways:

    style may be a string, in which case it represents a particular style, and value, which must
    also be a string, represents the value for that style

    otherwise, style is a dictionary whose keys are styles and whose values are the corresponding values

*/
function style(element, style, value){
  if(value === undefined){
    var keys = Object.keys(style);
    for(var i = 0; i < keys.length; i++){
      element.styles[keys[i]] = style[keys[i]];
    }
  } else {
    element.styles[style] = value;
  }
  return element;
}

module.exports.style = style;

// used the same way as style, except for attributes instead of styles
function attribute(element, attribute, value){

  if(checkAttributes(attribute) === -1){
    return;
  }

  if(value === undefined){
    var keys = Object.keys(attribute);
    for(var i = 0; i < keys.length; i++){
      element.attributes[keys[i]] = attribute[keys[i]];
    }
  } else {
    element.attributes[attribute] = value;
  }
  return element;
}

module.exports.attribute = attribute;

//append content to the end of element's content
function appendContent(element, content){
  element.content.push(content);
  return element;
}

module.exports.appendContent = appendContent;

//insert content. if no position is specified, insert at beginning, else
//insert at position specified, or end if longer than length
function insertContent(element, content, position){
  if(position === undefined){
    position = 0;
  }
  position = Math.min(position, element.content.length);
  element.content.splice(position, 0, content);
  return element;
}

module.exports.insertContent = insertContent;

function checkAttribute(attribute){
  if(attribute === 'class'){
    console.error("ERROR: You may not set the class property of an element");
    return -1;
  }
  if(attribute === 'style'){
    console.warn("WARNING: Are you sure you want to set the style attribute?");
    return 1;
  }
  return 0;
}

function checkAttributes(attributes){
  var c = 0;
  if(typeof attributes !== 'string'){
    var keys = Object.keys(attributes);
    for(var i = 0; i < keys.length; i++){
      c = checkAttribute(keys[i]);
      if(c === -1){
        return -1;
      }
    }
  } else {
    c = checkAttribute(attributes);
  }
  return c;
}

