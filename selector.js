
var count = 1

module.exports = Selector
function Selector(){

   this.children = {}
   this.childrenOrders = {}
   this.styles = {}
   this.styleOrders = {}
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
  

   if(i !== arguments.length){
     this.style(arguments[i])
   }

   if(this.placeHolders.length <= 1){
     this.id = 0
   } else {
     this.id = count++
   }
}


Selector.prototype.setId = function(id){
  this.id = "custom" + id
  return this
}

var selectorUnitNum = 0
Selector.prototype.nest = function(){
  if(typeof arguments[0] === 'string'){

    this.children[arguments[0]] = arguments[1]
    this.childrenOrders[arguments[0]] = false

  } else if(Array.isArray(arguments[0])){
    for(var i = 0; i < arguments[0].length; i++){
      this.children[arguments[i][0]] = arguments[i][1]
      this.childrenOrders[arguments[i][0]] = {
        'unit' : selectorUnitNum, 
        'order' : i
      }
    }
    selectorUnitNum++
  } else {
    console.error("bad nesting input")
  }
  return this
}

var styleUnitNum = 0

Selector.prototype.style = function(){
  if(typeof arguments[1] === 'string'){
    this.styles[arguments[0]] = arguments[1]
    this.styleOrders[arguments[0]] = false
  } else {
    for(var i = 0; i < arguments.length; i++){

      if(Array.isArray(arguments[i])){
        for(var j = 0; j < arguments[i].length; j++){
          var keys = Object.keys(arguments[i][j])
          for(var k = 0; k < keys.length; k++){
            this.styles[keys[k]] = arguments[i][j][keys[k]]
            this.styleOrders[keys[k]] = {
              'unit' : styleUnitNum,
              'order' : j
            }
          }
        }
        styleUnitNum++

      } else if(typeof arguments[i] === 'object'){
        var keys = Object.keys(arguments[i])
        for(var j = 0; j < keys.length; j++){
          this.styles[keys[j]] = arguments[i][keys[j]]
          this.styleOrders[keys[j]] = false
        }
      }
    }
  }
  return this
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
    return false
  }
}


Selector.prototype.getStructures = function(){
  var strippedHierarchy = []
  for(var i = 0; i < this.hierarchy.length; i++){
    strippedHierarchy.push(this.hierarchy[i].replace(/\$[^\s]*/g, '$'))
  }
  
  var ret = []

  var styles = {'noOrder' : {}}
  var keys = Object.keys(this.styles)
  for(var i = 0; i < keys.length; i++){
    var order = this.styleOrders[keys[i]]
    if(order === undefined || order === false){
      styles['noOrder'][keys[i]] = this.styles[keys[i]]
    } else {
      if(styles[order.unit] === undefined)
        styles[order.unit] = {}

      styles[order.unit][order.order] = [keys[i], this.styles[keys[i]]]
    }
  }

  var keys =  Object.keys(styles['noOrder'])
  for(var i = 0; i < keys.length; i++){
    ret.push(strippedHierarchy.concat([keys[i], styles['noOrder'][keys[i]]]))
  }
 
  var keys = Object.keys(styles)
  for(var i = 0; i < keys.length; i++){
    if(!isNaN(keys[i])){
      var orderKeys = Object.keys(styles[keys[i]]).sort()
      var styleString = ''
      for(var j = 0; j < orderKeys.length; j++){
        var style = styles[keys[i]][orderKeys[j]]
        styleString += style[0] + ':' + style[1] + ';' 
      }
      ret.push(strippedHierarchy.concat([styleString]))
    }
  }

  for(var i = 0; i < ret.length; i++){
    console.log(ret[i])
  }
}




