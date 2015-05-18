
var count = 1

module.exports = Selector
function Selector(){

   this.indexedChildren = {}
   this.immediateChildren = []
   this.placeHolders = []
   this.hierarchy = []
   this.styled = false

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
    this.indexedChildren[arguments[0]] = arguments[1]
  } else {
    this.immediateChildren.push(arguments[0])
  }

  return this
}

Selector.prototype.style = function(style, value){
  this.styled = true
  return this.nest(new Selector(style, value))
}

Selector.prototype.isStyled = function(){
  if(this.styled)
    return true
  
  for(var i = 0; i < this.immediateChildren.length; i++){
    if(this.immediateChildren[i].isStyled())
      return true
  }
  var keys = Object.keys(this.indexedChildren)
  for(var i = 0; i < keys.length; i++){
    if(this.indexedChildren[keys[i]].isStyled())
      return true
  }
  return false
}

//returns false if this is not an existing path
Selector.prototype.getPlaceHolderIndex = function(path){
  if(path.length > 1){
    if(this.indexedChildren[path[0]] === undefined)
      return false

    return this.placeHolders.length + this.indexedChildren[path[0]].getPlaceHolderIndex(path.slice(1))
  } else {
    for(var i = 0; i < this.placeHolders.length; i++){
      if(this.placeHolders[i] === path[0])
        return i
    }
    for(var j = 0; j < immediateChildren.length; j++){
      var index = this.immediateChildren[j].getPlaceHolderIndex(path)
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

  var keys = Object.keys(this.indexedChildren)
  if(keys.length === 0 && this.immediateChildren.length === 0){
    ret = [strippedHierarchy]
  } else {
    for(var i = 0; i < this.immediateChildren.length; i++){
      var childStructures = this.immediateChildren[i].getStructures()
      for(var j = 0; j < childStructures.length; j++){
        ret.push(strippedHierarchy.concat(childStructures[j]))
      }
    }
    for(var i = 0; i < keys.length; i++){
      var childStructures = this.indexedChildren[keys[i]].getStructures()
      for(var j = 0; j < childStructures.length; j++){
        ret.push(strippedHierarchy.concat(childStructures[j]))
      }
    }
   
  }

  return ret
}




