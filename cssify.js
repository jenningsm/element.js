
var classGen = require('./classes.js')
var compile = require('./csscompile');


module.exports = function(root, legible){
  var styleChains = {}
  var iter = root.iterator();
  var el;
  //for every element
  for(var j = 0; (el = iter()) !== null; j++){
    //for every selector
    for(var i = 0; i < el.selectors.length; i++){

      if(el.selectors[i].selector.isStyled()){
        var elChains = el.selectors[i].selector.getStructures()
  
        //for every style chain
        for(var k = 0; k < elChains.length; k++){
          var hash = elChains[k].join('?')
          var chain = styleChains[hash]
          var position = el.selectors[i].position
          if(chain === undefined)
            chain = {'structure' : elChains[k], 'placeFillers' : []}
  
          if(chain.placeFillers[position] === undefined)
            chain.placeFillers[position] = []
  
          //push the index of this element onto the list of indices of elements
          //that fill this position in this style chain
          chain.placeFillers[position].push(j)
  
          styleChains[hash] = chain
        }
      }
    }
  }
  //to be filled with sets of elements. each set will
  //get a class assigned to it
  var elementSets = []
  var keys = Object.keys(styleChains)
  for(var i = 0; i < keys.length; i++){
    elementSets = elementSets.concat(styleChains[keys[i]].placeFillers)
  }

  //get the classes for each set
  var classes = classGen(elementSets)

  //assign the classes to the elements
  var elementsToClasses = []
  for(var i = 0; i < elementSets.length; i++){
    var elements = elementSets[i]
    var cls = classes[i]
    for(var j = 0; j< elements.length; j++){
      var element = elements[j]
      if(elementsToClasses[element] === undefined)
        elementsToClasses[element] = []

      elementsToClasses[element].push(cls)
    }
  }
  var iter = root.iterator();
  for(var i = 0, el; (el = iter()) !== null; i++){
    if(elementsToClasses[i] !== undefined && elementsToClasses[i].length !== 0)
      el.classes = removeDuplicates(elementsToClasses[i]).join(' ')
  }

  var chains = []
  var count = 0
  for(var i = 0; i < keys.length; i++){
    var style = styleChains[keys[i]]
    for(var j = 0; j < style.placeFillers.length; j++){
      style.placeFillers[j] = classes[count++]
    }
    chains.push(fillPlaceHolders(styleChains[keys[i]].structure, styleChains[keys[i]].placeFillers))
  }

  return generateStyleSheet(chains)
}

function removeDuplicates(array){
  var table = {}
  for(var i = 0; i < array.length; i++){
    table[array[i]] = true
  }
  return Object.keys(table)
}

function generateStyleSheet(styleChains, indent){
  if(indent === undefined)
    indent = ''
  var tops = {}
  var styleString = ''
  for(var i = 0; i < styleChains.length; i++){
      tops[styleChains[i][0]] = define(tops[styleChains[i][0]], []) 
      tops[styleChains[i][0]].push(styleChains[i].slice(1))
  }
  var keys = Object.keys(tops)
  for(var i = 0; i < keys.length; i++){
    styleString += indent +  keys[i] + ' {\n'
    for(var j = 0; j < tops[keys[i]].length; j++){
      var chain = tops[keys[i]][j]
      if(chain.length === 2){
        styleString += indent + '  ' +  chain[0] + ':' + chain[1] + ';\n'
      } else if(chain.length > 2){
        styleString += generateStyleSheet([chain], indent + '  ')
      }
    }
    styleString += indent + '}\n'
  }
  return styleString
}

function define(item, to){
  if(item === undefined)
    return to
  return item
}

function fillPlaceHolders(structure, classes){

  for(var i = 0; i < structure.length; i++){
    var split = structure[i].split('$')
    for(var j = 1; j < split.length; j++){
      var spaced = split[j].split(' ')
      var index = spaced[0]
      split[j] = ['.' + classes[index]].concat(spaced.slice(1)).join(' ')
    }
    structure[i] = split.join('')
  }

/*  for(var i = 0, j = 0; j < classes.length; i++){
    var split = structure[i].split('$')
    for(k = 1; k < split.length; k++){
      split[k] = '.' + classes[j] + split[k]
      j++
    }
    structure[i] = split.join('')
  }*/
  return structure
}



function format(string){
   //remove spaces at beginning
   string = string.replace(/^\s*/g, '');
   //remove spaces at end
   string = string.replace(/\s*$/g, '');
   //remove repeated spaces
   string = string.replace(/\s+/g, ' ');
   return string;
}

