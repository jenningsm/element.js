
module.exports = SelectorString
function SelectorString(selectorList){

  //maps placeholders to their placeholder ids
  this.placeHolders = {}
  this.selectorStrings = []
  this.numPlaceHolders = 0

  var numUnnamed = 0
  for(var i = 0; i < selectorList.length; i++){
    var places = selectorList[i].split('$')
    for(var j = 1; j < places.length; j++){
      var placeHolder
      var holderEnd = places[j].search(/[^a-z]/)
      if(holderEnd === -1)
        holderEnd = places[j].length

      if(holderEnd === 0){
        placeHolder = numUnnamed++
        places[j] = placeHolder + places[j]
      } else {
        placeHolder = places[j].substr(0, holderEnd)  
      }
      if(this.placeHolders[placeHolder] === undefined){
        this.placeHolders[placeHolder] = this.numPlaceHolders++
      }
    }
    this.selectorStrings.push(places.join('$'))
  }

}

SelectorString.prototype.getPlaceHolderIndex = function(placeholder){
  if(this.placeHolders[placeholder] === undefined){
    return false
  }

  return this.placeHolders[placeholder]
}

SelectorString.prototype.getHash = function(base){
  if(base === undefined)
    base = 0

  var ret = []

  for(var j = 0; j < this.selectorStrings.length; j++){
    var string = this.selectorStrings[j]
    var keys = Object.keys(this.placeHolders)
    for(var i = 0; i < keys.length; i++){
      string = string.replace('$' + keys[i], '$' + (this.placeHolders[keys[i]] + base))
    }
    ret.push(string)
  }

  return ret
}
