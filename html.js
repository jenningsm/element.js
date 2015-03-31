
var cssify = require('./cssify.js');

/*
  tag: the tag of the element
  attributes: the attributes for the tag. either a dictionary of attribute value pairs, or a string representing an attribute.
  value: only defined if attributes is a string. if defined, is the value for the attribute
*/
function Element(tag, attributes, value){
  this.tag = tag;
  this.styles = {};
  this.content = [];

  if(attributes !== undefined){
    if(checkAttributes(attributes) === -1){
       return;
    }
    if(value === undefined){
      this.attributes = attributes;
    } else {
      this.attributes = {};
      this.attributes[attributes] = value;
    }
  } else {
    this.attributes = {};
  }
}

Element.prototype.generate = function(legible){
  var ssheet = cssify(this);
  var html = this.toHTML(legible === undefined ? legible : '');

  return {'html' : html, 'css' : ssheet};
}

Element.prototype.toHTML = function(spaces){
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
  for(var i = 0; i < this.content.length; i++){
    if(typeof this.content[i] === 'string'){
      content += '  ' + indent + this.content[i] + "\n";
    } else {
      content += this.content[i].toHTML(spaces === undefined ? spaces : spaces + '  ') + "\n";
    }
  }

  var close = indent + "</" + this.tag + ">";

  return open + content + close;
}

/*
  set the style of an element. This function may be used in two ways:

    style may be a string, in which case it represents a particular style, and value, which must
    also be a string, represents the value for that style

    otherwise, style is a dictionary whose keys are styles and whose values are the corresponding values

*/
Element.prototype.style = function(style, value){
  if(value === undefined){
    var keys = Object.keys(style);
    for(var i = 0; i < keys.length; i++){
      this.styles[keys[i]] = style[keys[i]];
    }
  } else {
    this.styles[style] = value;
  }
  return this;
}

// used the same way as style, except for attributes instead of styles
Element.prototype.attribute = function(attribute, value){

  if(checkAttributes(attribute) === -1){
    return;
  }

  if(value === undefined){
    var keys = Object.keys(attribute);
    for(var i = 0; i < keys.length; i++){
      this.attributes[keys[i]] = attribute[keys[i]];
    }
  } else {
    this.attributes[attribute] = value;
  }
  return this;
}

//append content to the end of element's content
Element.prototype.appendContent = function(content){
  this.content.push(content);
  return this;
}

//insert content. if no position is specified, insert at beginning, else
//insert at position specified, or end if longer than length
Element.prototype.insertContent = function(content, position){
  if(position === undefined){
    position = 0;
  }
  position = Math.min(position, this.content.length);
  this.content.splice(position, 0, content);
  return this;
}

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

module.exports = Element;
