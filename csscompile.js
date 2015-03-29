
var startchars = 26;
var numchars = 36;
function selectorName(i){
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

module.exports.selectorName = selectorName;

/*
  compiles css. the styles arguments is an array of arrays.
  each member of that array represents an element, and each
  member of those arrays is a style that has been assigned
  to that element.
*/
function compileCSS(styles){
  //el is shorthand for element

  //create a mapping that, for each style, maps that style
  //to to every element it occurs in 
  var styleToEl = {};
  for(var i = 0; i < styles.length; i++){
    for (var j = 0; j < styles[i].length; j++){
      styleToEl[styles[i][j]] = [];
    }
  }
  for(var i = 0; i < styles.length; i++){
    for (var j = 0; j < styles[i].length; j++){
      styleToEl[styles[i][j]].push(i);
    }
  }

  //create a mapping from each possible set of elements to
  //all the styles that occur in each of those elements and
  //only in each of those elements
  var elListToStyle = {};
  var keys = Object.keys(styleToEl);
  for(var i = 0; i < keys.length; i++){
    elListToStyle[styleToEl[keys[i]].join()] = [styleToEl[keys[i]], []];
  }
  for(var i = 0; i < keys.length; i++){
    elListToStyle[styleToEl[keys[i]].join()][1].push(keys[i]);
  }

  var keys = Object.keys(elListToStyle);
  var partition = [];
  for(var i = 0; i < keys.length; i++){
    partition.push(elListToStyle[keys[i]]);
  }

  //partition represents a partition of the set of all styles
  //into sets of mutually occuring styles. No style in a set will ever
  //appear in an element without every other style in that set also
  //appearing in that element.
  //
  //Each two element array in partition represents a set of the partiion. 
  //The first element of each of these is an array of indices to elements in 
  //which the set belongs, and the second element is an array of the styles
  //that make up that set.

  //asign a class name to each partition as the third element of each set
  for(var i = 0; i < partition.length; i++){
    partition[i].push(selectorName(i));
  }

  //create a mapping from each element to all the class names it should have
  var elToClass = [];
  for(var i = 0; i < styles.length; i++){
    elToClass.push([]);
  }
  for(var i = 0; i < partition.length; i++){
    for(var j = 0; j < partition[i][0].length; j++){
      elToClass[partition[i][0][j]].push(partition[i][2]);
    }
  }

  //create a mapping from each class to all the styles it contains
  var classToStyle = {};
  for(var i = 0; i < partition.length; i++){
    classToStyle[partition[i][2]] = partition[i][1]; 
  }

  return { "elements" : elToClass, "styles" : classToStyle };

}

module.exports.compile = compileCSS;
