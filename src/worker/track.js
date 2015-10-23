
function findPattern (patternId, pattern) {
  return pattern.id === patternId;
}

function Track (trackData) {
  for (var key in trackData) {
    this[key] = trackData[key];
  }

  this.patternIndex = 0;

  for (var i = 0; i < this.patterns.length; i++) {
    var patternData = this.patterns[i];
    this.patterns[i] = new Pattern(patternData);

  }
  this.onFinishCallback = function () {};
  this.hasReachedFinish = false;
  return this;
}


Track.prototype.whenFinished = function (fn) {
  this.onFinishCallback = fn;
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
    if (this.patterns[i].tempoIsCustom === false) {
      this.patterns[i].setGeneralTempo(tempo);
    }
  }
};

Track.prototype.advancePattern = function() {
  this.patternIndex++;
  if (this.patternIndex === this.patterns.length) {
    this.hasReachedFinish = true;
  }
};

Track.prototype.getPattern = function(patternId) {
  return this.patterns.find(findPattern.bind(this, patternId));
};

Track.prototype.start = function () {
  console.profile('track');
  this.hasReachedFinish = false;
  this.patternIndex = 0;
  this.process();
};

Track.prototype.process = function () {
  var currentPattern = this.patterns[this.patternIndex];
  currentPattern.whenFinished(this.processPattern.bind(this));
  currentPattern.start();
};

Track.prototype.processPattern = function () {
  this.advancePattern();
  this.hasReachedFinish
    ? this.onFinishCallback()
    : this.process();

};

Track.prototype.stop = function() {
  for (var i = 0, il = this.patterns.length; i < il; i++) {
    this.patterns[i].stop();
  }
};
