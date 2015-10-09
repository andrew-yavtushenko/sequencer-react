
function findPattern (patternId, pattern) {
  return pattern.id === patternId;
}

function Track (trackData) {
  for (var key in trackData) {
    this[key] = trackData[key];
  }

  this.patternIndex = 0;
  this.loopsIndex = 0;

  for (var i = 0; i < this.patterns.length; i++) {
    this.patterns[i] = this.patterns[i].isLoop ? new Loop(this.patterns[i]) : new Pattern(this.patterns[i]);
  }

  return this;
}

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

Track.prototype.advancePattern = function() {
  this.loops[this.loopsIndex].advance();
  this.patternIndex++;
  if (this.patternIndex === this.patterns.length) {
    this.patternIndex = 0;
  }
};

Track.prototype.advanceLoop = function() {
  this.loopsIndex++;
  if (this.loopsIndex === this.loops.length) {
    this.loopsIndex = 0;
  }
};

Track.prototype.check = function(currentTime) {
  var currentPattern = this.patterns[this.patternIndex];
  var currentLoop = this.loops[this.loopsIndex];

  if (currentLoop.hasPattern(currentPattern)) {
    currentLoop.start();
  } else {
    currentLoop.stop();
    this.advanceLoop();
  }

  currentPattern.start();

  var currentPatternIsStopped = currentPattern.check(currentTime);

  if (currentPatternIsStopped) this.advancePattern();

  return currentPatternIsStopped;
};

Track.prototype.getPattern = function(patternId) {
  return this.patterns.find(findPattern.bind(this, patternId));
};

Track.prototype.stop = function() {
  if (!this.isPlaying) return;

  this.isPlaying = true;
  this.patternIndex = 0;
  for (var i = 0, il = this.patterns.length; i < il; i++) {
    this.patterns[i].stop();
  }
};
