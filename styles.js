
module.exports.style = function(){
  var args = [this.overwrite, ''];
  for(var i = 0; i < arguments.length; i++){
    args.push(arguments[i]);
  }
  addStyles.apply(this, args);
  return this;
}

module.exports.pseudoStyle = function(prefix){
  var args = [this.overwrite, prefix + '?'];
  for(var i = 1; i < arguments.length; i++){
    args.push(arguments[i]);
  }
  addStyles.apply(this, args);
  return this;
}

function addStyles(overwrite, prefix){
  if(arguments.length === 4 && typeof arguments[3] !== 'object'){
    var a = {}
    a[arguments[2]] = arguments[3]
    arguments[2] = a
    arguments[3] = undefined
  }

  for(var i = 2; arguments[i] !== undefined; i++){
    var keys = Object.keys(arguments[i]);
    for(var j = 0; j < keys.length; j++){
      var style = (prefix + keys[j]).replace(/\s/g, '')
      if(overwrite || this.styles[style] === undefined){
        this.styles[style] = arguments[i][keys[j]].toString();
      }
    }
  }
}
