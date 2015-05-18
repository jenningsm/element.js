
var SelectorString = require('./selectorstring.js')

module.exports = Selector
function Selector(){

   this.indexedChildren = {}
   this.immediateChildren = []
   this.styled = false

   this.selectorString = new SelectorString(arguments)
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

Selector.prototype.getFilledStructure = function(values){
   
}

Selector.prototype.getPlaceHolderIndex = function(path){
  if(path.length === 1){
    var index = this.selectorString.getPlaceHolderIndex(path[0])
    if(index !== false)
      return index
  
    for(var i = 0; i < immediateChildren.length; i++){
      var index = this.immediateChildren[i].getPlaceHolderIndex(path)
      if(index !== false)
        return index
    }
    return false
  } else {
    if(this.indexedChildren[path[0]] === undefined)
      return false
    return this.selectorString.numPlaceHolders + this.indexedChildren[path[0]].getPlaceHolderIndex(path.slice(1))
  }
}

Selector.prototype.getStructures = function(base){
  if(base === undefined)
    base = 0

  var hierarchyHash = this.selectorString.getHash(base)
  base += this.selectorString.numPlaceHolders
  
  var ret = []

  var keys = Object.keys(this.indexedChildren)
  if(keys.length === 0 && this.immediateChildren.length === 0){
    ret = [hierarchyHash]
  } else {
    for(var i = 0; i < this.immediateChildren.length; i++){
      var childStructures = this.immediateChildren[i].getStructures(base)
      for(var j = 0; j < childStructures.length; j++){
        ret.push(hierarchyHash.concat(childStructures[j]))
      }
    }
    for(var i = 0; i < keys.length; i++){
      var childStructures = this.indexedChildren[keys[i]].getStructures(base)
      for(var j = 0; j < childStructures.length; j++){
        ret.push(hierarchyHash.concat(childStructures[j]))
      }
    }
   
  }

  return ret
}

