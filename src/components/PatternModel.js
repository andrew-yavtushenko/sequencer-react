var utils = require('./Utils');
var Line = require('./LineModel');

function Pattern (properties) {
  this.name = properties.name;
  this.beat = properties.beat;
  this.noteValue = properties.noteValue;
  this.lines = [];
  this.currentSubDivision = properties.currentSubDivision;
  this.availableSubDivisions = properties.availableSubDivisions;
  this.id = properties.id;
  this.tempo = properties.tempo;
  this.customTempo = false;
  this.isStopped = true;
  return this;
}

Pattern.prototype.releaseCustomTempo = function(tempo) {
  this.customTempo = false;
  this.tempo = tempo;
};

Pattern.prototype.setCustomTempo = function(tempo) {
  this.customTempo = true;
  this.tempo = tempo;
};

Pattern.prototype.setTempo = function(tempo) {
  var isSet = true;
  if (this.customTempo === false) {
    this.tempo = tempo;
  } else {
    isSet = false;
  }
  return isSet;
};

Pattern.prototype.start = function() {
  if (this.isStopped) {
    this.isStopped = false;
    for (var i = 0, il = this.lines.length; i < il; i++) {
      this.lines[i].start();
    }
  }
};

Pattern.prototype.stop = function() {
  this.isStopped = true;
  for (var i = 0, il = this.lines.length; i < il; i++) {
    this.lines[i].stop();
  }
};

Pattern.prototype.addLine = function(bufferIdx, subDivision) {
  var notes = utils.buildLineNotes(this, bufferIdx, subDivision);
  var newLine = new Line(notes, bufferIdx, subDivision);
  this.lines.push(newLine);
};

module.exports = Pattern;

