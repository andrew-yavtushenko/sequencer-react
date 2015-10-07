var Pattern = require('./PatternModel');
var uuid = require('./uuid');
var settings = require('./Settings');
var utils = require('./Utils');

var defaultTrackName = 'New track';
var defaultPatternName = 'Untitled Pattern';
var duplicateRegex = /^(.*)+\s+copy\s*(\d+)?$/i;
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

Track.prototype.movePattern = function (oldIndex, newIndex) {
  if (newIndex >= this.patterns.length) {
    var k = newIndex - this.patterns.length;
    while ((k--) + 1) {
      this.patterns.push(undefined);
    }
  }
  this.patterns.splice(newIndex, 0, this.patterns.splice(oldIndex, 1)[0]);
  return this; // for testing purposes
};

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

Track.prototype.generateUniqueName = function (defaultName) {
  var regex = new RegExp('^' + defaultName + '\\s*(\\d+)?$', 'i');
  var collisions = this.patterns.reduce(function (numbers, p) {
    var match = p.name.trim().match(regex);
    if (match) { numbers[match[1] | 0] = true; }
    return numbers;
  }, {});

  var suffix = 0;
  while (collisions.hasOwnProperty(suffix)) {
    suffix++;
  }

  return suffix ? defaultName + ' ' + suffix : defaultName;
};

Track.prototype.updatePattern = function (updatedPattern) {
  var pattern = this.getPattern(updatedPattern.id);
  var index = this.patterns.indexOf(pattern);
  this.patterns[index] = updatedPattern;
  return this;
};

Track.prototype.clone = function (pattern) {
  var newPattern = utils.clone(pattern);
  newPattern.id = uuid.create().hex;
  return newPattern;
};

Track.prototype.duplicatePattern = function (pattern) {
  var position = this.patterns.indexOf(pattern);
  var newPattern = this.clone(pattern);
  var match = newPattern.name.match(duplicateRegex);
  var newName = match && match[1] || pattern.name;
  newPattern.name = this.generateUniqueName(newName + ' copy');

  this.patterns.splice(position + 1, 0, newPattern);
  return this;
};

Track.prototype.savePattern = function (newPattern) {
  var index = this.patterns.indexOf(newPattern);
  if (index !== -1) {
    this.patterns[index] = newPattern;
  } else {
    this.patterns.push(newPattern);
  }
  return this;
};

Track.prototype.createPattern = function (beat, noteValue, name, customTempo) {
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
      name: name || this.generateUniqueName(defaultPatternName)
    });

    if (customTempo) {
      newPattern.setCustomTempo(customTempo);
    }

    return newPattern;
  }
};

Track.prototype.deletePattern = function(patternId) {
  if (!this.isPlaying) {
    var thisPattern = this.getPattern(patternId);
    var idx = this.patterns.indexOf(thisPattern);
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
