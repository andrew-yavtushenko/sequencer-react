'use strict';

var uuid = require('./uuid');
var settings = require('./Settings');
var Beat = require('./BeatModel');

function findBeat (beatId, beat) {
  return beat.id === beatId;
}

function Pattern (props) {
  this.name = props.name;
  this.tempo = props.tempo;
  this.id = uuid.create().hex;
  this.counter = props.counter || 1;
  this.beats = [];
  this.beatsIndex = 0;
  this.loopIndex = 0;
  this.isStopped = true;
  this.tempoIsCustom = false;

  return this;
}

Pattern.restore = function (patternData) {
  var restored = new this.prototype.constructor(patternData);

  if (patternData.tempoIsCustom) {
    restored.setCustomTempo(patternData.tempo);
  }

  for (var i = 0; i < patternData.beats.length; i++) {
    restored.beats.push(Beat.restore(patternData.beats[i]));
  }
  return restored;
};

Pattern.prototype.setCounter = function (counter) {
  this.counter = counter;
};

Pattern.prototype.start = function () {
  if (this.isStopped === false) { return; }
  this.isStopped = false;
};

Pattern.prototype.stop = function () {
  this.isStopped = true;
  this.loopIndex = 0;
  this.beatsIndex = 0;
};

Pattern.prototype.editName = function (newName) {
  this.name = newName;
};

Pattern.prototype.createBeat = function (beat, noteValue, tempoIsCustom) {
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

    if (tempoIsCustom) {
      newBeat.setCustomTempo(tempoIsCustom);
    }

    this.beats.push(newBeat);
    return newBeat;
  }
};

Pattern.prototype.saveBeat = function (newBeat) {
  var index = this.beats.indexOf(newBeat);
  if (index !== -1) {
    this.beats[index] = newBeat;
  } else {
    this.beats.push(newBeat);
  }
  return this;
};

Pattern.prototype.duplicateBeat = function (beat) {
  var position = this.beats.indexOf(beats);

  this.beats.splice(position + 1, 0, beat.clone(true));
  return this;
};

Pattern.prototype.updateBeat = function (updatedBeat) {
  var beat = this.getBeat(updatedBeat.id);
  var index = this.beats.indexOf(beat);
  this.beats[index] = updatedBeat;
  return this;
};

Pattern.prototype.deleteBeat = function(beatId) {
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

Pattern.prototype.insertBeat = function (beat, position) {
  this.beats.splice(position, 0, beat.clone(true));
  return this;
};

Pattern.prototype.moveBeat = function (newIndex, oldIndex) {
  this.beats.move(newIndex, oldIndex);
  return this;
};

Pattern.prototype.getBeat = function(beatId) {
  return this.beats.find(findBeat.bind(this, beatId));
};

Pattern.prototype.releaseCustomTempo = function (tempo) {
  this.tempoIsCustom = false;
  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].releaseCustomTempo(tempo);
  }
};

Pattern.prototype.setCustomTempo = function (tempo) {
  this.tempoIsCustom = true;
  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].setCustomTempo(tempo);
  }
};

Pattern.prototype.setGeneralTempo = function(tempo) {

  if (this.tempoIsCustom) {
    return false;
  }

  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].setGeneralTempo(tempo);
  }
};

Pattern.prototype.clone = function (full) {
  var clone = new this.constructor(this);
  clone.id = full ? uuid.create().hex : this.id;

  for (var i = 0; i < this.beats.length; i++) {
    clone.saveBeat(this.beats[i].clone(full));
  }

  return clone;
};

module.exports = Pattern;

