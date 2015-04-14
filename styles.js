
/*
  set the style of an element. This function may be used in two ways:

    style may be a string, in which case it represents a particular style, and value, which must
    also be a string, represents the value for that style

    otherwise, style is a dictionary whose keys are styles and whose values are the corresponding values
*/
module.exports.style = function(){
  var args = [''];
  for(var i = 0; i < arguments.length; i++){
    args.push(arguments[i]);
  }
  addStyles.apply(this, args);
  return this;
}

module.exports.pseudoStyle = function(prefix){
  var args = [prefix + '?'];
  for(var i = 1; i < arguments.length; i++){
    args.push(arguments[i]);
  }
  addStyles.apply(this, args);
  return this;
}

function addStyles(prefix){
  if(arguments.length === 3 && typeof arguments[2] === 'string'){
    this.styles[(prefix + arguments[1]).replace(/\s/g, '')] = arguments[2];
  } else {
    for(var i = 1; i < arguments.length; i++){
      var keys = Object.keys(arguments[i]);
      for(var j = 0; j < keys.length; j++){
        this.styles[(prefix + keys[j]).replace(/\s/g, '')] = arguments[i][keys[j]];
      }
    }
  }
}
