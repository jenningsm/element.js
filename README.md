# element.js

This is a node library I'm developing for generating html and css in javascript. It's experimental and I'm
still not sure if it's a really good idea, but I've used in two projects so far and have enjoyed it. It's
also still in development; not all the features are there yet.

Here's how it works: For any html element you want to add to your html document, you create an Element
object. The Element constructor takes as an argument the name of the tag for the html element you want to
create. You then add whatever content you want to add to that element, including other elements, and once
your done you cann generate() on that element and get the generated html and css for your page.

Each element object has the following methods:

elem.style(styles) : 
  styles : an object literal contaning css styles.

  This call applies the styles in styles to elem.

elem.attribute(attrs) :
  attrs : an object literal containing html attributes.

  This call applies thoseattributes to elem.

elem.content(cont) : 
  cont: may be a string, number, or Element object.

  This call inserts cont into the element object.

element.generate(sharedVars, legible) : 
  sharedVars : an object literal containing any objects to share with the client-side code as described
               below. 
  legible    : a boolean dictating whether the generated html and css should be human-readable or 
               minified.
                   
  returns the generated css, html, and javascript.



In addition to generating the html and css for your page, you may also share information with the
client-side javascript. You can share any object, including Element objects, by including them
in the sharedVars parameter of the generate function. The sharedVars parameter will be passed to
the client-side as an object called pbr (I don't know why I chose this name). If you include any
Element Objects in sharedVars, they will automatically be replaced by functions that return the
DOM node for that element.

