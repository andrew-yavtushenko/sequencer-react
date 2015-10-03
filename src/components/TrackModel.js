var Pattern = require('./PatternModel');
var uuid = require('./uuid');
var settings = require('./Settings');

var defaultTrackName = 'New track';
var defaultPatternName = 'Untitled Pattern';
var trackCounter = 0;

function Track (name) {
  this.tempo = 120;
  this.counter = 0;
  this.isPlaying = false;
  this.id = uuid.create().hex;
  this.patterns = [];
  this.name = name || defaultTrackName + ' ' + trackCounter++;

  return this;
}

Track.prototype.editName = function (newName) {
  this.name = newName;
};

Track.prototype.releaseCustomTempo = function (patternId) {
  this.getPattern(patternId).releaseCustomTempo(this.tempo);
};

Track.prototype.setCustomTempo = function (tempo, patternId) {
  this.getPattern(patternId).setCustomTempo(tempo);
};

Track.prototype.setTempo = function(tempo) {
  this.tempo = tempo;
  for (var i = 0; i < this.patterns.length; i++) {
    if (this.patterns[i].customTempo === false) {
      this.patterns[i].setTempo(tempo);
    }
  }
};

Track.prototype.createPattern = function (beat, noteValue, name) {
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

    var newPattern = new Pattern({
      availableSubDivisions: availableSubDivisions,
      currentSubDivision: availableSubDivisions[0],
      beat: beat,
      noteValue: noteValue,
      id: uuid.create().hex,
      tempo: this.tempo,
      name: name || defaultPatternName + ' ' + parseInt(this.patterns.length + 1)
    });

    this.patterns.push(newPattern);
    return newPattern;
  }
};

Track.prototype.deletePattern = function(patternId) {
  if (!this.isPlaying) {
    var thisPattern = this.getPattern(patternId);
    idx = this.patterns.indexOf(thisPattern);
    this.patterns.splice(idx, 1);
    return true;
  } else {
    console.error('you can\'t modify track while playing');
    return false;
  }
};

Track.prototype.getPattern = function(patternId) {

  function findPattern (pattern) {
    return pattern.id === patternId;
  }

  return this.patterns.find(findPattern);
};

Track.prototype.start = function() {
  if (this.isPlaying) {
    return;
  }
  this.isPlaying = false;
};

Track.prototype.stop = function() {
  if (!this.isPlaying) {
    return;
  }
  this.isPlaying = true;
};

module.exports = Track;
