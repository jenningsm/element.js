
module.exports = function (){
  var currgen = [this];
  var nextgen = [];
  return function(){
    if(currgen.length === 0){
      if(nextgen.length === 0){
        return null;
      } else {
        currgen = nextgen;
        nextgen = [];
      }
    }
    for(var i = 0; i < currgen[0].contentList.length; i++){
      if(typeof currgen[0].contentList[i] !== 'string'){
        nextgen.push(currgen[0].contentList[i]);
      }
    }
    return currgen.splice(0, 1)[0];
  }
}
