
/*
  set the style of an element. This function may be used in two ways:

    style may be a string, in which case it represents a particular style, and value, which must
    also be a string, represents the value for that style

    otherwise, style is a dictionary whose keys are styles and whose values are the corresponding values
*/
function style(){
  var args = [''];
  for(var i = 0; i < arguments.length; i++){
    args.push(arguments[i]);
  }
  addStyles.apply(this, args);
  return this;
}

function pseudoStyle(prefix){
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

module.exports.style = style;
module.exports.pseudoStyle = pseudoStyle;
module.exports.childStyle = childStyle;
module.exports.applyChildStyles = applyChildStyles;
