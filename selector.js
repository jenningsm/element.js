
var count = 1

module.exports = Selector
function Selector(){

   this.children = {'' : []}
   this.placeHolders = []
   this.hierarchy = []

   var placeHolderCount = 0
   for(var i = 0; i < arguments.length && typeof arguments[i] === "string"; i++){
     this.hierarchy.push(arguments[i])
     
     //placeholders are immediately preceded by $
     //get each of these place holders
     var split = arguments[i].split('$')
     for(var j = 1; j < split.length; j++){
       var placeHolder = split[j].split(' ')[0]
       if(placeHolder === '')
         placeHolder = placeHolderCount++

       this.placeHolders.push(placeHolder)
     }
   }
}


Selector.prototype.nest = function(){
  if(arguments[1] !== undefined){
    this.children[arguments[0]] = arguments[1]
  } else {
    this.children[''].push(arguments[0])
  }

  return this
}

Selector.prototype.style = function(style, value){
  return this.nest(new Selector(style, value))
}

//returns false if this is not an existing path
Selector.prototype.getPlaceHolderIndex = function(path){
  if(path.length > 1){
    if(this.children[path[0]] === undefined)
      return false

    return this.placeHolders.length + this.children[path[0]].getPlaceHolderIndex(path.slice(1))
  } else {
    for(var i = 0; i < this.placeHolders.length; i++){
      if(this.placeHolders[i] === path[0])
        return i
    }
    for(var j = 0; j < children[''].length; j++){
      var index = this.children[''][j].getPlaceHolderIndex(path)
      if(index !== false)
        return this.placeHolders.length + index
    }
    return false
  }
}


Selector.prototype.getStructures = function(){
  var strippedHierarchy = []
  for(var i = 0; i < this.hierarchy.length; i++){
    strippedHierarchy.push(this.hierarchy[i].replace(/\$[^\s]*/g, '$'))
  }
  
  var ret = []

  var keys = Object.keys(this.children)
  if(keys.length === 1 && this.children[''].length === 0){
    ret = [strippedHierarchy]
  } else {
    for(var i = 0; i < this.children[''].length; i++){
      var childStructures = this.children[''][i].getStructures()
      for(var j = 0; j < childStructures.length; j++){
        ret.push(strippedHierarchy.concat(childStructures[j]))
      }
    }
    for(var i = 0; i < keys.length; i++){
      if(keys[i] !== ''){
        var childStructures = this.children[keys[i]].getStructures()
        for(var j = 0; j < childStructures.length; j++){
          ret.push(strippedHierarchy.concat(childStructures[j]))
        }
      }
    }
   
  }

  return ret
}




