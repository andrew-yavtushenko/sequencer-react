function Line (lineData) {
  for (var key in lineData) {
    this[key] = lineData[key];
  }
  this._rhythmIndex = 0;
}

Line.prototype.setNoteVolume = function(noteIdx, volume) {
  this.notes[noteIdx].volume = volume;
};

Line.prototype.start = function() {
  this._noteTime = 0;
  this._isStoped = false;
};

Line.prototype.stop = function() {
  this._noteTime = 0;
  this._rhythmIndex = 0;
  this._isStoped = true;
};

Line.prototype._scheduleNextNote = function (tempo) {

  if (this._rhythmIndex === this.notes.length) {
    this.stop();
  }

  this._noteDuration = timing.note(this.notes[this._rhythmIndex].value, tempo);
  this._noteTime += this._noteDuration;

  this._rhythmIndex++;
};

Line.prototype.check = function (currentTime, tempo, patternId, lineId) {
  if (this._noteTime <= currentTime + this._threshold) {
    var currentNoteIndex = this._rhythmIndex;
    this._scheduleNextNote(tempo);
    if (!this._isStoped) {
      emitNote(this.notes[currentNoteIndex].bufferIdx, this.notes[currentNoteIndex].volume, patternId, lineId, currentNoteIndex, this._noteDuration);
    }
  }
  return this._isStoped;
};

