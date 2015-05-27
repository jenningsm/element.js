# element.js

This is a node library I'm developing for generating html and css in javascript. It's experimental and I'm
still not sure if it's a really good idea, but I've used in two projects so far and have enjoyed it. It's
also still in development; not all the features are there yet.

The element constructor takes a string as it's argument, which specifies the html tag for that element.

The element object has four basic functions:

style(): add a style to this element
attribute(): add an attribute to this element
content(): add content to this element. Content may be text or it may be other element objects.
generate(): Generate the css and html for this element and all its children.

I know this documentation is very poor, I'm hoping to flesh it out in the future when its interface is
finalized.
