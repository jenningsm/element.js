
function checkAttributes(attributes, value){
  if(Array.isArray(attributes[0])){
    for(var i = 0; i < attributes.length; i++){
      if(attributes[i][0] === 'class'){
        console.error("ERROR: You may not set the class property of an element");
        return -1;
      }
      if(attributes[i][0] === 'style'){
        console.warn("WARNING: Are you sure you want to set the style attribute?");
        return 1;
      }
    }
  } else {
    
    if(!Array.isArray(attribute)){
      attributes = [attributes, value];
    }

    if(attributes[0] === 'class'){
      console.error("ERROR: You may not set the class property of an element");
      return -1;
    }
    if(attributes[0] === 'style'){
      console.warn("WARNING: Are you sure you want to set the style attribute?");
      return 1;
    }
  }
  return 0;
}

/*
  tag: the tag of the element
  attributes: an array of attribute-value pairs, in the form an array, or just a single attribute-value pair
*/
function element(tag, attributes){
  var el = {};
  el.tag = tag;
  el.styles = [];
  el.content = [];

  if(checkAttributes(attributes) === -1){
     return;
  }

  if(attributes !== undefined){
    if(Array.isArray(attributes[0]){
      el.attributes = attributes;
    } else {
      el.attributes = [attributes];
    }
  } else {
    el.attributes = [];
  }

  return el;
}

/*
  set the style of an element. This function may be used in three ways:

    style may be an array of two element arrays, in which case the value parameter will be undefined.
    Each of the top level arrays
    is a style to apply, the first of the two elements within each of these arrays
    is the particular style to apply (e.g. 'width', 'background'), and the second
    is the value for that style (e.g. '20%', 'black')

    style may be a two element array, in which case its two elements are the particular style
    and its value. the value parameter will be undefined in this case

    style may be a string, in which case it represents a particular style, and value, which will
    also be a string, represents the value

*/
function style(element, style, value){
  if(value === undefined){
    if(Array.isArray(style[0])){
       element.styles = element.styles.concat(style);
    } else {
       element.styles = element.styles.concat([style]);
    }
  } else {
    element.styles = element.styles.concat([style, value]);
  }
  return element;
}


// used the same way as style, except for attributes instead of styles
function attribute(element, attribute, value){

  if(checkAttributes(attribute, value) === -1){
    return;
  }

  if(value === undefined){
    if(Array.isArray(style[0])){
       element.attributes = element.styles.concat(attibute);
    } else {
       element.attributes = element.styles.concat([attribute]);
    }
  } else {
    element.attributes = element.styles.concat([attribute, value]);
  }
  return element;
}

//append content to the end of element's content
function appendContent(element, content){
  element.content.push(content);
  return element;
}

//insert content. if no position is specified, insert at beginning, else
//insert at position specified, or end if longer than length
function insertContent(element, content, position){
  if(position === undefined){
    position = 0;
  }
  position = Math.min(position, element.content.length);
  element.content.splice(position, 0, content);
  return element;
}
