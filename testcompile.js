
var compile = require('./csscompile');

function testName(i){
  console.log(i, compile.selectorName(i));
}

function testNames(){
  var names = {};
  var failed = false;
  for(var i = 0; i < 10000; i++){
    var name = compile.selectorName(i);
    if(name in names || name.length < 2 || name.charCodeAt(0) < 'a'.charCodeAt(0) || name.charCodeAt(0) > 'z'.charCodeAt(0)){
      failed = true;
      var message = (name in names ? "repeat" : "failure");
      console.error("First " + message + ": " + name + " at " + i);
      break;
    }
    names[name] = true;
  }
  if(failed){
    console.log("Failure!");
  } else {
    console.log("Success!");
  }
  console.log("Tested first " + Object.keys(names).length);
}


function testCompile(){
  var test = [[], ["a", "b"], ["a", "b"], ["a", "c", "b", "d", "e", "f"], ["a", "c", "b", "d", "e"], ["d"]];
  var t2 = [[], [], ['a', 'b', 'c'], []];
  var t3 = [];
  var testingNow = t2;
  var a = compile.compile(testingNow);
  console.log(testingNow);
  console.log(a["elements"]);
  console.log(createStyleSheet(a["styles"]));
}

testCompile();

function createStyleSheet(classes){
  var stylesheet = '';
  for(cls in classes){
    if(classes.hasOwnProperty(cls)){
      stylesheet += '.' + cls + '{\n';
      for(var j = 0; j < classes[cls].length; j++){
        stylesheet += "  " + classes[cls][j] + ';\n';
      }
      stylesheet += '}\n';
    }
  }
  return stylesheet;
} 
