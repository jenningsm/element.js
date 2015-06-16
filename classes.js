
var nameGen = require('./selectorname.js')

module.exports = function(elementSets){
  var setToIndices = {}
  var keys = Object.keys(elementSets)
  for(var i = 0; i < keys.length; i++){
    var setHash = elementSets[keys[i]].sort().join(',')
    if(setToIndices[setHash] === undefined)
      setToIndices[setHash] = []

    setToIndices[setHash].push(keys[i])
  }
  
  var indexToClass = {}
  var sets = Object.keys(setToIndices)
  for(var i = 0; i < sets.length; i++){
    var indices = setToIndices[sets[i]]
    for(var j = 0; j < indices.length; j++){
      indexToClass[indices[j]] = nameGen(i)
    }
  }
  
  var ret = {}
  var indices = Object.keys(indexToClass)
  for(var i = 0; i < indices.length; i++){
    ret[indices[i]] = indexToClass[indices[i]]
  }
  return ret
}
