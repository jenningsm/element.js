
var classGen = require('./classes.js')
var compile = require('./csscompile');


module.exports = function(root, legible){
  var styles = {}
  var iter = root.iterator(), el;
  //for every element
  for(var j = 0; (el = iter()) !== null; j++){
    //for every selector
    for(var i = 0; i < el.selectors.length; i++){

      if(el.selectors[i].selector.isStyled()){
        var theseStyles = el.selectors[i].selector.getHashes()
  
        //for every style
        for(var k = 0; k < theseStyles.length; k++){
          var hash = theseStyles[k].join('?')
          var style = styles[hash]
          if(style === undefined)
            style = {'style' : theseStyles[k], 'spots' : []}
  
          var position = el.selectors[i].position
          if(style.spots[position] === undefined)
            style.spots[position] = []
  
          //push the index of this element onto the list of indices of elements
          //that fill this position in this style chain
          style.spots[position].push(j)
  
          styles[hash] = style 
        }
      }
    }
  }

  var elementSets = []
  var keys = Object.keys(styles)
  for(var i = 0; i < keys.length; i++){
    elementSets = elementSets.concat(styles[keys[i]].spots)
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
    var style = styles[keys[i]]
    for(var j = 0; j < style.spots.length; j++){
      style.spots[j] = classes[count++]
    }
    chains.push(fillPlaceHolders(styles[keys[i]].style, styles[keys[i]].spots))
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
      var pEnd = split[j].search(/[^0-9]/)
      if(pEnd === -1)
        pEnd = split[j].length
      var index = split[j].substr(0, pEnd)
      split[j] = '.' + classes[index] + split[j].substr(pEnd)
    }
    structure[i] = split.join('')
  }
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

