
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
  applyStyleHelper(this.contentData, [], this.childStyles);
  return this;
}

function applyStyleHelper(arr, indices, styles){
  if(!Array.isArray(arr)){
    if(typeof arr !== 'string'){
      for(var i = 0; i < styles.length; i++){
        if(typeof styles[i] === 'function'){
          arr.style(styles[i].apply(this, indices));
        } else {
          arr.style(styles[i]);
        }
      }
    }
  } else {
    for(var i = 0; i < arr.length; i++){
      applyStyleHelper(arr[i], indices.concat([i]), styles);
    }
  }
}


module.exports.style = s;
module.exports.childStyle = childStyle;
module.exports.applyChildStyles = applyChildStyles;
