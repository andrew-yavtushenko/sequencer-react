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
  var isStopped = this.lines[0].check(currentTime, this.tempo, this.id, 0);
  if (isStopped) {
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
Pattern.prototype.clone = function (full) {
  var clone = new this.constructor(this);
  clone.id = full ? uuid.create().hex : this.id;

  for (var i = 0; i < this.lines.length; i++) {
    var line = this.lines[i];
    clone.addLine(line.bufferIdx, line.subDivision);
    for (var j = 0; j < line.notes.length; j++) {
      var str = JSON.stringify(line.notes[j]);
      clone.lines[i].notes[j] = JSON.parse(str);
    }
  }
  return clone;
};
