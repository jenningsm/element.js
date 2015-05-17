
var count = 1

function Selector(/* topBlock, nextBlock, ... bottomBlock */){

   this.children = {}
   this.placeHolders = []
   this.hierarchy = []
   this.styles = {}

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
}

Selector.prototype.nest = function(selector, index){
  children[index] = selector
  return this
}

//returns false if this is not a valid path
Selector.placeHolderPathIndex = function(path){
  if(path.length > 1){
    if(children[path[0]] === undefined)
      return false

    return placeHolders.length + children[path[0]].placeHolderPathIndex(path.slice(1))
  } else {
    for(var i = 0; i < placeHolders.length; i++){
      if(placeHolders[i] === path[0])
        return i
    }
    return false
  }
}

//styles may either be an associative array of styles,
//or an array of of associative arrays of styles that need to be
//in order
Selector.prototype.style = function(styles){

}
