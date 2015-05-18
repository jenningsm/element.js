
var Selector = require('./selector.js')

/*
  tag: the tag of the element
  attributes: the attributes for the tag. either a dictionary of attribute value pairs, or a string representing an attribute.
  value: only defined if attributes is a string. if defined, is the value for the attribute
*/
function Element(tag, attributes, value){

  this.contentList = [];
  this.attributes = {};
  this.flags = {};
  this.overwrite = true

  var sel = new Selector('$')
  this.selectors = [{'selector' : sel, 'position' : sel.getPlaceHolderIndex([0])}]

  if(tag !== undefined){
    this.tag = tag;
  } else {
    this.tag = null;
  }

  if(attributes !== undefined){
    this.attribute(attributes, value)
  }
}

Element.prototype.style = function(style){
  this.selectors[0]['selector'].style(arguments[0], arguments[1])
  return this
}

Element.prototype.assign = function(selector, path){
  this.selectors.push({'selector' : selector, 'position' : selector.getPlaceHolderIndex(path)})
  return this
}

Element.prototype.share = function(data){
  this.sharedData = data
  return this
}

Element.prototype.instance = function(v){
  return (v instanceof Element);
}

Element.prototype.capture = function(){
  this.flags.capture = true;
  return this;
}

Element.prototype.iterator = require('./iterator.js');


Element.prototype.attribute = require('./attributes.js');

var embed = require('./embed.js');
Element.prototype.embedJS = embed.embedJS;
Element.prototype.embedCSS = embed.embedCSS;

Element.prototype.content = require('./content.js');

Element.prototype.generate = require('./generate.js');

module.exports = Element;
