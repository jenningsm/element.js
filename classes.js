
var nameGen = require('./selectorname.js')

module.exports = function(elementSets){
  var setToIndices = {}
  for(var i = 0; i < elementSets.length; i++){
    var setHash = elementSets[i].sort().join(',')
    if(setToIndices[setHash] === undefined)
      setToIndices[setHash] = []

    setToIndices[setHash].push(i)
  }
  
  var indexToClass = {}
  var sets = Object.keys(setToIndices)
  for(var i = 0; i < sets.length; i++){
    var indices = setToIndices[sets[i]]
    for(var j = 0; j < indices.length; j++){
      indexToClass[indices[j]] = nameGen(i)
    }
  }
  
  var ret = []
  var indices = Object.keys(indexToClass).sort()
  for(var i = 0; i < indices.length; i++){
    ret.push(indexToClass[indices[i]])
  }
  return ret
}
