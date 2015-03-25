
/*
  tag: the tag of the element
  attributes: an array of attribute-value pairs, in the form an array
*/
function element(tag, attributes){
  var el = {};
  el.tag = tag;
  if(attributes !== undefined){
    el.attributes = attributes;
  } else {
    el.attributes = [];
  }
  el.styles = [];
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
