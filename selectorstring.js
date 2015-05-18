
module.exports = SelectorString
function SelectorString(args){
   //maps place holder names to their id and positions
   this.placeHolders = {}
   this.numPlaceHolders = 0
   //maps place holder ids to placeholder names
   this.ids = []
   //maps positions to ids
   this.positions = []
   this.hierarchy = []

   var unnamedCount = 0
   var phID = 0
   for(var i = 0; i < args.length; i++){
     var positions = []
     var split = args[i].split('$')
     this.hierarchy[i] =  [format(split[0])]
     for(var j = 1; j < split.length; j++){
       var placeHolder = split[j].split(' ')[0]
       this.hierarchy[i].push(format(split[j].split(' ').slice(1).join(' ')))
       if(placeHolder === '')
         placeHolder = unnamedCount++

       if(this.placeHolders[placeHolder] === undefined){
         this.placeHolders[placeHolder] = {'id' :  phID, 'positions' : []}
         this.ids[phID] = placeHolder
         phID++
       }

       positions.push(this.placeHolders[placeHolder].id)
       this.placeHolders[placeHolder].positions.push({'level' : i, 'index' : j-1})
     }
     this.positions.push(positions)
   }
   this.numPlaceHolders = phID

}

SelectorString.prototype.getPlaceHolderIndex = function(placeholder){
  if(this.placeHolders[placeholder] === undefined)
    return false

  return this.placeHolders[placeholder].id
}

SelectorString.prototype.getHash = function(base){
  if(base === undefined)
    base = 0

  var hashStructure = []
  for(var i = 0; i < this.hierarchy.length; i++){
    var level = this.hierarchy[i][0]
    for(var j = 0; j < this.positions[i].length; j++){
      level += ' $' + (this.positions[i][j] + base) + ' ' + this.hierarchy[i][j+1]
    }
    hashStructure.push(format(level))
  }
  return hashStructure
}

SelectorString.prototype.getFilledString = function(values){
  var hashStructure = []
  for(var i = 0; i < this.hierarchy.length; i++){
    var level = this.hierarchy[i][0]
    for(var j = 0; j < this.positions[i].length; j++){
      var id = this.positions[i][j]
      //if the right values are not given, return false
      if(values[id] === undefined)
        return false
      var cls = values[id]
      level += ' $' + cls + ' ' + this.hierarchy[i][j+1]
    }
    hashStructure.push(format(level))
  }
  return hashStructure
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
