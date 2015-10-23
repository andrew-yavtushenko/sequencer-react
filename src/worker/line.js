function Line (lineData) {
  for (var key in lineData) {
    this[key] = lineData[key];
  }

  for (var i = 0; i < lineData.notes.length; i++) {
    this.notes[i] = lineData.notes[i];
  }
  this._rhythmIndex = 0;

  this.onFinishCallback = function () {};

  this.isOver = false;

  return this;
}

Line.prototype.setTempo = function (tempo) {
  this.tempo = tempo;
};

Line.prototype.whenFinished = function (fn) {
  this.onFinishCallback = fn;
};


Line.prototype.setNoteVolume = function(noteIdx, volume) {
  this.notes[noteIdx].volume = volume;
};

Line.prototype.start = function(props, lineId) {
  this.isOver = false;
  this.patternId = props.patternId;
  this.beatId = props.beatId;
  this.lineId = lineId;
  this._rhythmIndex = 0;
  this.processState();
};

Line.prototype.processState = function () {
  if (this.isOver) {
    this.onFinishCallback();
  } else {
    this.proceed();
  }
};

Line.prototype.proceed = function () {
  this._noteDuration = timing.note(this.notes[this._rhythmIndex].value, this.tempo);
  this.playNote();
  this.schedule();
  this.advanceNote();
};

Line.prototype.playNote = function () {
  var currentNoteIndex = this._rhythmIndex;

  emitNote({
    bufferIdx: this.notes[currentNoteIndex].bufferIdx,
    gain: this.notes[currentNoteIndex].volume,
    patternId: this.patternId,
    beatId: this.beatId,
    lineId: this.lineId,
    noteId: currentNoteIndex,
    duration: this._noteDuration
  });
};

Line.prototype.schedule = function () {
  this.timeoutId = self.setTimeout(this.processState.bind(this), this._noteDuration);
};

Line.prototype.advanceNote = function () {
  this._rhythmIndex++;
  if (this._rhythmIndex === this.notes.length) {
    this.finish();
    this.isOver = true;
  }
};


Line.prototype.finish = function () {
  this.isOver = true;
};

Line.prototype.stop = function() {
  self.clearTimeout(this.timeoutId);
  this.finish();
};

