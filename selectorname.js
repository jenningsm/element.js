
var startchars = 26;
var numchars = 36;

module.exports = function(i){
  for(var length = 2; i >= startchars * Math.pow(numchars, length-1); length++){
    i -= startchars * Math.pow(numchars, length-1);
  }

  var chars = [];

  chars.unshift(Math.floor(i % startchars));
  i /= startchars;
  length--;

  while (length > 0){
    chars.unshift(Math.floor(i % numchars));
    i /= numchars;
    length--;
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

