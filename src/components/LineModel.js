function Line (notes, bufferIdx, subDivision) {
  this.bufferIdx = bufferIdx;
  this.subDivision = subDivision;
  this._threshold = 0.200;
  this.notes = notes;
  this._noteTime = 0.0;
  this._rhythmIndex = 0;
  this._isStopped = true;
}

Line.prototype.changeBuffer = function (bufferIdx) {
  this.bufferIdx = bufferIdx;
  for (var i = 0; i < this.notes.length; i++) {
    this.notes[i].bufferIdx = bufferIdx;
  }
};

Line.prototype.updateVolume = function(noteIdx) {
  function changeNoteVolume(volume) {
    if (volume === 0) {
      return 0.33;
    } else if (volume === 0.33) {
      return 0.66;
    } else if (volume === 0.66) {
      return 1;
    } else {
      return 0;
    }
  }

  this.notes[noteIdx].volume = changeNoteVolume(this.notes[noteIdx].volume);
  return this.notes[noteIdx].volume;
};

Line.prototype.start = function () {
  this._noteTime = 0;
  this._isStopped = false;
};

Line.prototype.stop = function () {
  this._noteTime = 0;
  this._rhythmIndex = 0;
  this._isStopped = true;
};

module.exports = Line;
