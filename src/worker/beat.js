function Beat (beatData) {

  for (var key in beatData) {
    this[key] = beatData[key];
  }

  for (var i = 0; i < this.lines.length; i++) {
    this.lines[i] = new Line(this.lines[i]);
  }
  for (var j = 0; j < this.lines.length; j++) {
    this.lines[j].setTempo(this.tempo);
  }
  this.onFinishCallback = function () {};
  this.hasReachedFinish = false;
  return this;
}

Beat.prototype.whenFinished = function (fn) {
  this.onFinishCallback = fn;
};

Beat.prototype.setLinesTempo = function (tempo) {
  for (var i = 0; i < this.lines.length; i++) {
    this.lines[i].setTempo(tempo);
  }
};

Beat.prototype.releaseCustomTempo = function(tempo) {
  this.tempoIsCustom = false;
  this.tempo = tempo;
  this.setLinesTempo(this.tempo);
};

Beat.prototype.setCustomTempo = function(tempo) {
  this.tempoIsCustom = true;
  this.tempo = tempo;
  this.setLinesTempo(this.tempo);
};

Beat.prototype.setGeneralTempo = function(tempo) {
  if (!this.tempoIsCustom) {
    this.tempo = tempo;
    this.setLinesTempo(this.tempo);
  }
};

Beat.prototype.start = function(patternId) {
  this.process(patternId);
};

Beat.prototype.process = function (patternId) {

  var props = {
    patternId: patternId,
    beatId: this.id
  };

  this.lines[0].whenFinished(this.finish.bind(this));

  for (var i = 0; i < this.lines.length; i++) {
    this.lines[i].start(props, i);
  }
};

Beat.prototype.finish = function () {
  this.finishLines();
  this.onFinishCallback();
};

Beat.prototype.finishLines = function() {
  for (var i = 0, il = this.lines.length; i < il; i++) {
    this.lines[i].stop();
  }
};

Beat.prototype.stop = function () {
  for (var i = 0, il = this.lines.length; i < il; i++) {
    this.lines[i].stop();
  }
};

Beat.prototype.clone = function (full) {
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
