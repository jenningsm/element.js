

/*
  tag: the tag of the element
  attributes: the attributes for the tag. either a dictionary of attribute value pairs, or a string representing an attribute.
  value: only defined if attributes is a string. if defined, is the value for the attribute
*/
function Element(tag, attributes, value){

  this.contentList = [];
  this.attributes = {};
  this.styles = {};
  this.childStyles = [];
  this.flags = {};

  if(tag !== undefined){
    this.tag = tag;
  } else {
    this.tag = null;
    this.capture();
  }

  if(attributes !== undefined){
    if(value === undefined){
      this.attributes = attributes;
    } else {
      this.attributes[attributes] = value;
    }
  }
}

Element.prototype.instance = function(v){
  return (v instanceof Element);
}

Element.prototype.iterator = function (){
  var currgen = [this];
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
    for(var i = 0; i < currgen[0].contentList.length; i++){
      if(typeof currgen[0].contentList[i] !== 'string'){
        nextgen.push(currgen[0].contentList[i]);
      }
    }
    return currgen.splice(0, 1)[0];
  }
}

Element.prototype.capture = function(){
  this.flags.capture = true;
  return this;
}

Element.prototype.generate = require('./generate.js');

Element.prototype.content = require('./content.js');

var sty = require('./styles.js');
Element.prototype.style = sty.style;
Element.prototype.childStyle = sty.childStyle;

Element.prototype.attribute = require('./attributes.js');

var embed = require('./embed.js');
Element.prototype.embedJS = embed.embedJS;
Element.prototype.embedCSS = embed.embedCSS;

module.exports = Element;
