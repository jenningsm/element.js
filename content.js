
/*
  Adds content to an element. Each argument may be either a function,
  an array, an Element, a string, or a number.

  If an argument is a function, it will be called with an index that
  starts at 0 and is incremented each time the function is called, until
  the function returns null. Each object the function returns should be
  either an Element, a string, or a number, and each will be added to the
  content list.

  If an argument is an array, each element of that array should be either
  an Element, string, or number, and each will be added to the content
  list.

  If the arguments is an Element, string, or number, it will be added to
  the content list.
*/
module.exports = function(){

  if(this.capturor !== undefined){
    this.capturor.content.apply(this.capturor, arguments)
    return this
  }

  var args = []
  for(var i = 0; i < arguments.length; i++){
    args.push(arguments[i])
  }

  for(var i = 0; i < args.length; i++){
    if(typeof args[i] === 'function'){
      var item, j = 0, arr = []
      while((item = args[i](j++)) !== null){
        arr.push(item)
      }
      args[i] = arr;
    } else if(!Array.isArray(args[i])){
      args[i] = [args[i]];
    }

    for(var j = 0; j < args[i].length; j++){
      if(this.instance(args[i][j])      ||
         typeof args[i][j] === 'string' ||
         typeof args[i][j] === 'number'){

        this.contentList.push(args[i][j])

        if(this.instance(args[i][j])     &&
           args[i][j].flags.capture === true){

          this.capturor = args[i][j]

        }

      } else {
        //ERROR
        console.error('bad content input: ', typeof args[i][j])
      }
    }
  }
  return this;
}

