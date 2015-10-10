
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
    this.patterns[i] = patternData.isLoop ? new Loop(patternData) : new Pattern(patternData);
  }

  return this;
}

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

Track.prototype.advanceItem = function() {
  this.patternIndex++;
  if (this.patternIndex === this.patterns.length) {
    this.patternIndex = 0;
  }
};

Track.prototype.check = function (currentTime) {
  var currentItem = this.patterns[this.patternIndex];

  return currentItem.isLoop ? this.checkLoop(currentItem, currentTime) : this.checkPattern(currentItem, currentTime);
};

Track.prototype.checkPattern = function (currentItem, currentTime) {
  currentItem.start();

  currentItem.check(currentTime);

  if (currentItem.isStopped) {
    this.advanceItem();
  }

  return currentItem.isStopped;
};

Track.prototype.checkLoop = function (currentItem, currentTime) {
  currentItem.start();

  var loopCheck = currentItem.check(currentTime);

  if (loopCheck.isStopped) {
    this.advanceItem();
  }

  return loopCheck.timeToDrop;
};

Track.prototype.getPattern = function(patternId) {
  return this.patterns.find(findPattern.bind(this, patternId));
};

Track.prototype.stop = function() {
  if (!this.isPlaying) {
    return;
  }

  this.isPlaying = true;
  this.patternIndex = 0;
  for (var i = 0, il = this.patterns.length; i < il; i++) {
    this.patterns[i].stop();
  }
};
