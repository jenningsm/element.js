
/*
  set the style of an element. This function may be used in two ways:

    style may be a string, in which case it represents a particular style, and value, which must
    also be a string, represents the value for that style

    otherwise, style is a dictionary whose keys are styles and whose values are the corresponding values
*/
function s(style, value){
  if(value !== undefined && typeof value === 'string'){
    this.styles[style] = value;
  } else {
    for(var i = 0; i < arguments.length; i++){
      var keys = Object.keys(arguments[i]);
      for(var j = 0; j < keys.length; j++){
        this.styles[keys[j]] = arguments[i][keys[j]];
      }
    }
  }
  return this;
}

function childStyle(styler){
  this.childStyles.push(styler);
  return this;
}

function applyChildStyles(){

  for(var i = 0; i < this.contentList.length; i++){
    for(var j = 0; j < this.childStyles.length; j++){
      if(this.instance(this.contentList[i])){
        if(typeof this.childStyles[j] === 'function'){
          this.contentList[i].style(this.childStyles[j](i));
        } else {
          this.contentList[i].style(this.childStyles[j]);
        }
      }
    }
  }

  return this;
}

module.exports.style = s;
module.exports.childStyle = childStyle;
module.exports.applyChildStyles = applyChildStyles;
