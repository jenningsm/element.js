
//set the contentList of an element
function content(){

  for(var i = 0; i < arguments.length; i++){
    if((typeof arguments[i] === 'string') || this.instance(arguments[i])){
      this.contentList.push(arguments[i]);
    } else if(Array.isArray(arguments[i])){
      this.contentList = this.contentList.concat(arguments[i]);
    } else if(typeof arguments[i] === 'function'){
      for(var j = 0, item; (item = arguments[i](j)) !== null; j++){
        this.contentList.push(item);
      }
    } else if(arguments[i] !== null && typeof arguments[i] === 'object'){
      var keys = Object.keys(arguments[i]);
      for(var j = 0; j < keys.length; j++){
        this.contentList.push(arguments[i][keys[j]]);
      }
    } else {
      console.error("cannot insert ", arguments[i]);
    }
  }

  return this;
}

module.exports = content;
