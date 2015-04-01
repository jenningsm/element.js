
//set the content of an element
function content(){
  var args = [];
  for(var i = 0; i < arguments.length; i++){
    args.push(arguments[i]);
  }

  this.contentData = this.contentData.concat(contentHelper(args));
  this.contentList = flatten(this.contentData);
  return this;
}

function contentHelper(content){
  var ret;
  if(Array.isArray(content)){
    ret = [];
    for(var i = 0; i < content.length; i++){
      ret = ret.concat(contentHelper(content[i]));
    }
  } else if (typeof content === 'function') {
    ret = [];
    for(var i = 0, item; (item = content(i)) !== null; i++){
      ret.push(item);
    }
  } else {
    ret = [content];
  }
  return ret;
}

function flatten(arr){
  if(!Array.isArray(arr)){
    return [arr];
  } else {
    var ret = [];
    for(var i = 0; i < arr.length; i++){
      ret = ret.concat(flatten(arr[i]));
    }
    return ret;
  }
}

module.exports = content;
