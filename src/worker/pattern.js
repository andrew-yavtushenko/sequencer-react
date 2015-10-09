function Pattern (patternData) {

  for (var key in patternData) {
    this[key] = patternData[key];
  }

  for (var i = 0; i < this.lines.length; i++) {
    this.lines[i] = new Line(this.lines[i]);
  }
  return this;
}

Pattern.prototype.releaseCustomTempo = function(tempo) {
  this.customTempo = false;
  this.tempo = tempo;
};

Pattern.prototype.setCustomTempo = function(tempo) {
  this.customTempo = true;
  this.tempo = tempo;
};

Pattern.prototype.setTempo = function(tempo) {
  this.tempo = tempo;
};

Pattern.prototype.check = function(currentTime) {
  if (this.lines[0].check(currentTime, this.tempo, this.id, 0)) {
    this.stop();
  } else {
    for (var i = 1, il = this.lines.length; i < il; i++) {
      this.lines[i].check(currentTime, this.tempo, this.id, i);
    }
  }
  return this.isStopped;
};

Pattern.prototype.start = function() {
  if (this.isStopped) {
    this.isStopped = false;
    for (var i = 0, il = this.lines.length; i < il; i++) {
      this.lines[i].start();
    }
  }
};

Pattern.prototype.stop = function() {
  this.isStopped = true;
  for (var i = 0, il = this.lines.length; i < il; i++) {
    this.lines[i].stop();
  }
};
