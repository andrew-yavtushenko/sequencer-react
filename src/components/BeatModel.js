var utils = require('./Utils');
var Line = require('./LineModel');
var cloneDeep = require('lodash/lang/cloneDeep');
var uuid = require('./uuid');

function Beat (properties) {
  this.beat = properties.beat;
  this.noteValue = properties.noteValue;
  this.lines = [];
  this.currentSubDivision = properties.currentSubDivision;
  this.availableSubDivisions = properties.availableSubDivisions;
  this.id = properties.id;
  this.tempo = properties.tempo;
  this.tempoIsCustom = false;
  this.isStopped = true;

  return this;
}

Beat.restore = function (beatData) {
  var restored = new this.prototype.constructor(beatData);

  if (beatData.tempoIsCustom) {
    restored.setCustomTempo(beatData.tempo);
  }

  for (var i = 0; i < beatData.lines.length; i++) {
    restored.lines.push(beatData.lines[i]);
  }

  return restored;
};

Beat.prototype.releaseCustomTempo = function(tempo) {
  this.tempoIsCustom = false;
  this.tempo = tempo;
};

Beat.prototype.setCustomTempo = function(tempo) {
  this.tempoIsCustom = true;
  this.tempo = tempo;
};

Beat.prototype.setGeneralTempo = function(tempo) {
  if (!this.tempoIsCustom) {
    this.tempo = tempo;
  }
};

Beat.prototype.start = function() {
  if (this.isStopped) {
    this.isStopped = false;
    for (var i = 0, il = this.lines.length; i < il; i++) {
      this.lines[i].start();
    }
  }
};

Beat.prototype.stop = function() {
  this.isStopped = true;
  for (var i = 0, il = this.lines.length; i < il; i++) {
    this.lines[i].stop();
  }
};

Beat.prototype.addLine = function(bufferIdx, subDivision) {
  var notes = utils.buildLineNotes(this, bufferIdx, subDivision);
  var newLine = new Line(notes, bufferIdx, subDivision);
  this.lines.push(newLine);
  return newLine;
};

Beat.prototype.removeLine = function (index) {
  this.lines.splice(index, 1);
};

Beat.prototype.updateLine = function (lineIndex, propName, propVal) {

  if (propName === 'bufferIdx') {
    this.lines[lineIndex].changeBuffer(propVal);
  } else if (propName === 'subDivision') {
    var notes = utils.buildLineNotes(this, this.lines[lineIndex].bufferIdx, propVal);
    var newLine = new Line(notes, this.lines[lineIndex].bufferIdx, propVal);
    this.lines.splice(lineIndex, 1, newLine);
  }

  return this.lines[lineIndex];
};

Beat.prototype.clone = function (full) {
  var clone = new this.constructor(this);
  clone.id = full ? uuid.create().hex : this.id;

  for (var i = 0; i < this.lines.length; i++) {
    var line = this.lines[i];
    clone.addLine(line.bufferIdx, line.subDivision);
    for (var j = 0; j < line.notes.length; j++) {
      clone.lines[i].notes[j] = cloneDeep(line.notes[j]);
    }
  }
  return clone;
};

module.exports = Beat;

