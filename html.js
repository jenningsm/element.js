

/*
  tag: the tag of the element
  attributes: the attributes for the tag. either a dictionary of attribute value pairs, or a string representing an attribute.
  value: only defined if attributes is a string. if defined, is the value for the attribute
*/
function Element(tag, attributes, value){

  this.contentList = [];
  this.childFunctions = [];
  this.attributes = {};
  this.styles = {};
  this.flags = {};
  this.overwrite = true

  if(tag !== undefined){
    this.tag = tag;
  } else {
    this.tag = null;
  }

  if(attributes !== undefined){
    this.attribute(attributes, value)
  }
}

Element.prototype.instance = function(v){
  return (v instanceof Element);
}

Element.prototype.capture = function(){
  this.flags.capture = true;
  return this;
}

Element.prototype.childFunction = function(func){
  this.childFunctions.push(func);
  return this;
}

Element.prototype.iterator = require('./iterator.js');

var sty = require('./styles.js');
Element.prototype.style = sty.style;
Element.prototype.pseudoStyle = sty.pseudoStyle;

Element.prototype.attribute = require('./attributes.js');

var embed = require('./embed.js');
Element.prototype.embedJS = embed.embedJS;
Element.prototype.embedCSS = embed.embedCSS;

Element.prototype.content = require('./content.js');

Element.prototype.generate = require('./generate.js');

module.exports = Element;
