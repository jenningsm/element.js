
//set the contentList of an element
function content(){

  for(var i = 0; i < arguments.length; i++){
    if(Array.isArray(arguments[i])){
      this.contentList = this.contentList.concat(arguments[i]);
    } else if(typeof arguments[i] === 'function'){
      for(var j = 0, item; (item = arguments[i](j)) !== null; j++){
        this.contentList.push(item);
      }
    } else if((typeof arguments[i] === 'string') || this.instance(arguments[i])){
      this.contentList.push(arguments[i]);
    } else {
      console.error("Unsupported contentList:", arguments[i]);
    }
  }

  return this;
}

module.exports = content;
