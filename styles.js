
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

function applyChildStyles(element){

  for(var i = 0; i < element.contentList.length; i++){
    for(var j = 0; j < element.childStyles.length; j++){
      if(element.instance(element.contentList[i])){
        if(typeof element.childStyles[j] === 'function'){
          element.contentList[i].style(element.childStyles[j](i));
        } else {
          element.contentList[i].style(element.childStyles[j]);
        }
      }
    }
  }

  return element;
}

module.exports.style = s;
module.exports.childStyle = childStyle;
module.exports.applyChildStyles = applyChildStyles;
