
var startchars = 26;
var numchars = 36;
function className(i){
  for(var length = 2; i >= startchars * Math.pow(numchars, length-1); length++){
    i -= startchars * Math.pow(numchars, length-1);
  }

  var chars = [];

  chars.push(Math.floor(i % startchars));
  i /= startchars;
  length--;

  while (length > 0){
    chars.push(Math.floor(i % numchars));
    i /= numchars;
    length--;
  } 

  if(chars.length === 1){
    chars.push(0);
  }
  
  var name = '';
  var a = 'a'.charCodeAt(0);
  var zero = '0'.charCodeAt(0);
  for(var j = 0; j < chars.length; j++){
    if(chars[j] < startchars){
      name += String.fromCharCode(a + chars[j]);
    } else {
      name += String.fromCharCode(zero + chars[j] - startchars);
    }
  }

  return name;
}

function testName(i){
  console.log(i, className(i));
}

function compileCSS(styles){

  //create a set of all styles. this gets rid of duplicates
  var styleSet = {};
  for(var i = 0; i < styles.length; i++){
    for (var j = 0; j < styles[i].length; j++){
      styleSet[styles[i][j]] = true;
    }
  }

  //turn the set into an ordered list
  var styleList = styleSet.keys();

  //index the styles of each element
  var hashes = [];
  for(var i = 0; i < styles.length; i++){
    var hash = {};
    for(var j = 0; j < styles[i].length; j++){
      hash[styles[i][j]] = true;
    }
    hashes.push(hash);
  }

   /*
     For every pair of styles, determine if there is at least one element in which one of styles occurs and the other doesn't.
     If there is no such element, match those styles. create a set of partitions of collectively matched styles
   */

   var partitions = [];

   var matched = [];
   for(var i = 0; i < styleList.length; i++){
     matched.push(false);
   }

   for(var i = 0; i < styleList.length; i++){
     if(!matched[i]){
       var partition = [i];
       for(var j = i + 1; j < styleList.length; j++){
         var match = true;
         for(var k = 0; k < hashes.length; k++){
           var first = (styleList[i] in hashes[k]);
           var second = (styleList[j] in hashes[k]);
           if(first !== second){
             match = false;
             break;
           }
         }
         if(match){
           partition.push(j);
           matched[j] = true;
         }
       }
       partitions.push(partition);
     }
   }

   

}
