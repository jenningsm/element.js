
//set the contentList of an element
module.exports = function(){

  var args = [];
  for(var i = 0; i < arguments.length; i++){
    args.push(arguments[i]);
  }

  if(this.capturor !== undefined){
    this.capturor.content(args)
    return this
  }

  var el = this;
  function leafTest(object){
    return (el.instance(object) || typeof object === 'string')
  }

  var items = flatten(args, leafTest);
  for(var i = 0; i < items.length; i++){
    if(this.instance(items[i]) && items[i].flags.capture === true){
      this.capturor = items[i];
    }
  }
  this.contentList = this.contentList.concat(items);

  return this;
}

function flatten(object, leafTest){

  if(leafTest(object)){
    return [object]
  } else if(Array.isArray(object)){
    var ret = [];
    for(var i = 0; i < object.length; i++){
      ret = ret.concat(flatten(object[i], leafTest))
    }
    return ret
  } else if(typeof object === 'function'){
    var ret = [];
    for(var j = 0, item; (item = object(j)) !== null; j++){
      ret = ret.concat(flatten(item, leafTest))
    }
    return ret
  } else if(object !== null && typeof object === 'object'){
    var ret = [];
    var keys = Object.keys(object);
    for(var j = 0; j < keys.length; j++){
      ret = ret.concat(flatten(object[keys[j]], leafTest))
    }
    return ret
  } else {
    return [object]
  }
}
