function Track (trackData) {
  this.patternIndex = 0;
  for (var key in trackData) {
    this[key] = trackData[key];
  }

  for (var i = 0; i < this.patterns.length; i++) {
    this.patterns[i] = new Pattern(this.patterns[i]);
  }
  return this;
}

Track.prototype.editName = function (newName) {
  this.name = newName;
};

Track.prototype.releaseCustomTempo = function (patternId) {
  this.getPattern(patternId).releaseCustomTempo(this.tempo);
}

Track.prototype.setCustomTempo = function (tempo, patternId) {
  this.getPattern(patternId).setCustomTempo(tempo);
}

Track.prototype.setTempo = function(tempo) {
  this.tempo = tempo;
  for (var i = 0; i < this.patterns.length; i++) {
    if (this.patterns[i].customTempo === false) {
      this.patterns[i].setTempo(tempo);
    }
  }
};

Track.prototype.advancePattern = function(currentPattern) {
  currentPattern.stop();
  this.patternIndex++;
  if (this.patternIndex === this.patterns.length) {
    this.patternIndex = 0;
  }
};

Track.prototype.check = function(currentTime) {
  var currentPattern = this.patterns[this.patternIndex];
  currentPattern.start();

  var currentPatternIsStoped = currentPattern.check(currentTime);

  if (currentPatternIsStoped) this.advancePattern(currentPattern);

  return currentPatternIsStoped;
};

Track.prototype.getPattern = function(patternId) {

  function findPattern (pattern) {
    return pattern.id === patternId;
  }

  return this.patterns.find(findPattern);
};

Track.prototype.stop = function() {
  if (!this.isPlaying) return;

  this.isPlaying = true;
  this.patternIndex = 0;
  for (var i = 0, il = this.patterns.length; i < il; i++) {
    this.patterns[i].stop();
  }
};
