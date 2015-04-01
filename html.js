

/*
  tag: the tag of the element
  attributes: the attributes for the tag. either a dictionary of attribute value pairs, or a string representing an attribute.
  value: only defined if attributes is a string. if defined, is the value for the attribute
*/
function Element(tag, attributes, value){
  this.tag = tag;
  this.contentData = [];
  this.contentList = [];
  this.attributes = {};
  this.styles = {};
  this.childStyles = [];

  if(attributes !== undefined){
    if(value === undefined){
      this.attributes = attributes;
    } else {
      this.attributes[attributes] = value;
    }
  }
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
    var content = currgen[0].contentList;
    for(var i = 0; i < content.length; i++){
      if(typeof content[i] !== 'string'){
        nextgen.push(content[i]);
      }
    }
    return currgen.splice(0, 1)[0];
  }
}

var gen = require('./generate.js');
Element.prototype.generate = gen.generate;
Element.prototype.toHTML = gen.toHTML;

Element.prototype.content = require('./content.js');

var sty = require('./styles.js');
Element.prototype.style = sty.style;
Element.prototype.childStyle = sty.childStyle;
Element.prototype.applyChildStyles = sty.applyChildStyles;

Element.prototype.attribute = require('./attributes.js');


module.exports = Element;
