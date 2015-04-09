
module.exports = shareVars;

var selectorName = require('./csscompile.js').selectorName;

//test is a function that tests whether an object is one of our Element objects
function shareVars(shared, test){
  var sharedScript = 
        'var pbr = function(){' +
           'function get(id){' +
              'return function(){' + 
                 'return document.getElementById(id)' + 
              '}' + 
            '}' +
            'return ';

  sharedScript += substitutedString(shared, test);
  sharedScript += ' }();';

  return sharedScript;
}

//test is a function that tests whether an object is one of our Element objects
var newids = 0;
function substitutedString(shared, test){
  var ret = '';
  if(test(shared)){
    var id;
    if(shared.attributes.id !== undefined){
      id = shared.attributes.id;
    } else {
      id = selectorName(newids);
      newids++;
      shared.attribute('id', id);
    }
    ret = "get('" + id + "')";

  } else if(Array.isArray(shared)){
    ret = '[';
    for(var i = 0; i < shared.length; i++){
      ret += substitutedString(shared[i], test) + ',';
    }
    if(i > 0){//remove the trailing comma
      ret = ret.substring(0, ret.length - 1);
    }
    ret += ']';

  } else if(shared !== null & typeof shared === 'object'){
    ret = '{';
    var keys = Object.keys(shared);
    for(var i = 0; i < keys.length; i++){
      ret += keys[i] + ':';
      ret += substitutedString(shared[keys[i]], test) + ',';
    }
    if(i > 0){//remove the trailing comma
      ret = ret.substring(0, ret.length - 1);
    }
    ret += '}';

  } else if(shared === null){
    ret = 'null';

  } else if(typeof shared === 'string') {
    ret = "'" + shared + "'";
  } else {
    ret = shared;
  }
  return ret;
}
