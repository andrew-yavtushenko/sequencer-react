'use strict';

var uuid = require('./uuid');
var settings = require('./Settings');
var Beat = require('./PatternModel');

function findBeat (beatId, beat) {
  return beat.id === beatId;
}

function Loop (name, beats, counter) {
  this.name = name;
  this.id = uuid.create().hex;
  this.counter = counter || 1;
  this.beats = beats;
  this.beatsIndex = 0;
  this.loopIndex = 0;
  this.isLoop = true;
  this.isStopped = true;
  this.tempoIsCustom = false;

  return this;
}

Loop.prototype.setCounter = function (counter) {
  this.counter = counter;
};

Loop.prototype.start = function () {
  if (this.isStopped === false) { return; }
  this.isStopped = false;
};

Loop.prototype.stop = function () {
  this.isStopped = true;
  this.loopIndex = 0;
  this.beatsIndex = 0;
};

Loop.prototype.editName = function (newName) {
  this.name = newName;
};

Loop.prototype.createBeat = function (beat, noteValue, customTempo) {
  if (this.isPlaying) {
    console.error('you can\'t modify track while playing');
    return false;
  } else {
    var availableSubDivisions = settings.subDivision.reduce(function (result, subDivision) {
      if (subDivision >= noteValue) {
        result.push(subDivision);
      }
      return result;
    }, []);

    var newBeat = new Beat({
      availableSubDivisions: availableSubDivisions,
      currentSubDivision: availableSubDivisions[0],
      beat: beat,
      noteValue: noteValue,
      id: uuid.create().hex,
      tempo: this.tempo
    });

    if (customTempo) {
      newBeat.setCustomTempo(customTempo);
    }
    return newBeat;
  }
};

Loop.prototype.saveBeat = function (newBeat) {
  var index = this.beats.indexOf(newBeat);
  if (index !== -1) {
    this.beats[index] = newBeat;
  } else {
    this.beats.push(newBeat);
  }
  return this;
};

Loop.prototype.duplicateBeat = function (beat) {
  var position = this.beats.indexOf(beats);
  var newBeat = beat.clone(true);

  this.beats.splice(position + 1, 0, newBeat);
  return this;
};

Loop.prototype.updateBeat = function (updatedBeat) {
  var beat = this.getBeat(updatedBeat.id);
  var index = this.beats.indexOf(beat);
  this.beats[index] = updatedBeat;
  return this;
};

Loop.prototype.deleteBeat = function(beatId) {
  if (!this.isPlaying) {
    var thisBeat = this.getBeat(beatId);
    var index = this.beats.indexOf(thisBeat);
    this.beats.splice(index, 1);
    return true;
  } else {
    console.error('you can\'t modify track while playing');
    return false;
  }
};

Loop.prototype.insertBeat = function (beat, position) {
  this.beats.splice(position, 1, beat);
  return this;
};

Loop.prototype.getBeat = function(beatId) {
  return this.beats.find(findBeat.bind(this, beatId));
};

Loop.prototype.releaseCustomTempo = function (tempo) {
  this.tempoIsCustom = false;
  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].releaseCustomTempo(tempo);
  }
};

Loop.prototype.setCustomTempo = function (tempo) {
  this.tempoIsCustom = true;
  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].setCustomTempo(tempo);
  }
};

Loop.prototype.setGeneralTempo = function(tempo) {

  if (this.tempoIsCustom) {
    return false;
  }

  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].setGeneralTempo(tempo);
  }
};

Loop.prototype.clone = function (full) {
  var clone = new this.constructor(this.name, this.beats, this.counter);
  clone.id = full ? uuid.create().hex : this.id;

  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i] = this.beats[i].clone(true);
  }

  return clone;
};

module.exports = Loop;

