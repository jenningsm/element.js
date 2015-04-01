
// used the same way as style, except for attributes instead of styles
function att(attribute, value){

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

module.exports = att;
