
module.exports.embedJS = function(){
  this.flags.embedJS = true;
  return this;
}

module.exports.embedCSS = function(){
  this.flags.embedCSS = true;
  return this;
}
