function findBeat (beatId, beat) {
  return beat.id === beatId;
}


function Pattern (properties) {

  for (var key in properties) {
    this[key] = properties[key];
  }

  for (var i = 0; i < this.beats.length; i++) {
    var beatData = this.beats[i];
    this.beats[i] = new Beat(beatData);
  }

  this.beatsIndex = 0;
  this.loopIndex = 0;
  this.onFinishCallback = function () {};
  this.hasReachedFinish = false;

  return this;
}


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

Pattern.prototype.advanceBeat = function() {
  this.beatsIndex++;
  if (this.beatsIndex === this.beats.length) {
    this.advancePattern();
    this.beatsIndex = 0;
  }
};

Pattern.prototype.advancePattern = function () {
  this.loopIndex++;
  if (this.loopIndex === this.counter) {
    this.hasReachedFinish = true;
  }
};

Pattern.prototype.start = function () {
  this.hasReachedFinish = false;
  this.loopIndex = 0;
  this.beatsIndex = 0;
  this.process();
};

Pattern.prototype.process = function () {
  var currentBeat = this.beats[this.beatsIndex];
  currentBeat.whenFinished(this.processBeat.bind(this));
  currentBeat.start(this.id);
};

Pattern.prototype.processBeat = function () {
  this.advanceBeat();
  this.hasReachedFinish
    ? this.onFinishCallback()
    : this.process();
};

Pattern.prototype.stop = function () {
  this.hasReachedFinish = true;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].stop();
  }
};

Pattern.prototype.whenFinished = function (fn) {
  this.onFinishCallback = fn;
};
