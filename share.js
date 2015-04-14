
module.exports = shareVars;

var selectorName = require('./selectorname.js')

//isElement is a function that tests whether a given object is an element
function shareVars(element, isElement){
  var sharedScript = 
        'var pbr = function(){' +
           'function get(id){' +
              'return function(){' + 
                 'return document.getElementById(id)' + 
              '}' + 
            '}' +
            'return ';

  sharedScript += shareString(element, isElement);
  sharedScript += ' }();';

  return sharedScript;
}

var newids = 0;
//isElement is a function that tests whether a given object is an element
function shareString(element, isElement){
  var ret = '';
  if(isElement(element)){
    var id;
    if(element.attributes.id !== undefined){
      id = element.attributes.id;
    } else {
      id = selectorName(newids);
      newids++;
      element.attribute('id', id);
    }
    return "get('" + id + "')";

  } else if(Array.isArray(element)){
    ret = '[';
    for(var i = 0; i < element.length; i++){
      ret += shareString(element[i], isElement) + ',';
    }
    if(i > 0){//remove the trailing comma
      ret = ret.substring(0, ret.length - 1);
    }
    ret += ']'
    return ret

  } else if(element !== null & typeof element === 'object'){
    ret = '{';
    var keys = Object.keys(element);
    for(var i = 0; i < keys.length; i++){
      ret += keys[i] + ':';
      ret += shareString(element[keys[i]], isElement) + ',';
    }
    if(i > 0){//remove the trailing comma
      ret = ret.substring(0, ret.length - 1);
    }
    ret += '}';
    return ret

  } else if(element === null){
    return 'null';

  } else if(typeof element === 'string') {
    return "'" + element + "'";
  } else {
    return element
  }
}
