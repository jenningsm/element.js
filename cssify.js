
var classGen = require('./classes.js')
var compile = require('./csscompile');


module.exports = function(roots, legible){

  if(!Array.isArray(roots)){
    roots = [roots]
  }

  //hash all identical styles together, keeping track of which
  //elements occur in which placeholders

  var styles = {}
  for(var l = 0; l < roots.length; l++){
    root = roots[l]
    var iter = root.iterator(), el;
    //for every element
    for(var j = 0; (el = iter()) !== null; j++){
      //for every selector belonging to that element
      for(var i = 0; i < el.selectors.length; i++){
        //if the selector is styled
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
            style.spots[position].push([l,j].join('?'))
    
            styles[hash] = style 
          }
        }
      }
    }
  }

  //group elements by the placeholders they occur in
  //an element may appear in multiple groups

  var elementSets = []
  var keys = Object.keys(styles)
  for(var i = 0; i < keys.length; i++){
    elementSets = elementSets.concat(styles[keys[i]].spots)
  }

  //get a class for each group
  var classes = classGen(elementSets)

  //create mapping from elements to the classes that
  //should be assigned to them
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
  //assign these classes to the elements
  for(var k = 0; k < roots.length; k++){
    var root = roots[k]
    var iter = root.iterator();
    for(var i = 0, el; (el = iter()) !== null; i++){
      var index = k + '?' + i
      if(elementsToClasses[index] !== undefined && elementsToClasses[index].length !== 0){
        if(el.attributes['class'] === undefined) {
          el.attributes['class'] = ''
        } else {
          el.attributes['class'] = el.attributes['class'] + ' '
        }
        el.classes = el.attributes['class'] + removeDuplicates(elementsToClasses[index]).join(' ')
      }
    }
  }

  //get the style chains with placeholders replaced by the appropriate classes
  var chains = []
  var count = 0
  for(var i = 0; i < keys.length; i++){
    var style = styles[keys[i]]
    for(var j = 0; j < style.spots.length; j++){
      style.spots[j] = classes[count++]
    }
    chains.push(fillPlaceHolders(styles[keys[i]].style, styles[keys[i]].spots))
  }

  //generate the style sheet and return it
  return generateStyleSheet(chains, '', (legible ? '  ' : ''))
}

function removeDuplicates(array){
  var table = {}
  for(var i = 0; i < array.length; i++){
    table[array[i]] = true
  }
  return Object.keys(table)
}

function generateStyleSheet(styleChains, indent, tab){

  var tab, newline
  if(tab !== ''){
    newline = '\n'
  } else {
    newline = ''
  }

  var tops = {}
  var styleString = ''
  for(var i = 0; i < styleChains.length; i++){
      tops[styleChains[i][0]] = define(tops[styleChains[i][0]], []) 
      tops[styleChains[i][0]].push(styleChains[i].slice(1))
  }
  var keys = Object.keys(tops)
  for(var i = 0; i < keys.length; i++){
    styleString += indent +  keys[i] + '{' + newline
    for(var j = 0; j < tops[keys[i]].length; j++){
      var chain = tops[keys[i]][j]
      if(chain.length === 2){
        styleString += indent + tab +  chain[0] + ':' + chain[1] + ';' + newline
      } else if(chain.length > 2){
        styleString += generateStyleSheet([chain], indent + tab, tab)
      }
    }
    styleString += indent + '}' + newline
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

