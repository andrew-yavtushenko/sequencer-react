function buildLineNotes (pattern, bufferIdx, subDivision) {
  var arrLength = Math.ceil(pattern.beat * subDivision / pattern.noteValue);

  var arr = new Array(0);

  for (var i = 0; i < arrLength; i++) {
    arr.push(i);
  }

  var notes = arr.map(function (num, key) {
    var correctNote;
    if (pattern.beat * subDivision % pattern.noteValue !== 0 &&
        ++key * subDivision > Math.floor(pattern.beat * subDivision / pattern.noteValue) * subDivision) {
      correctNote = pattern.availableSubDivisions.find(function (availableSubDivision) {
        if (availableSubDivision === subDivision * 2) {
          return availableSubDivision;
        }
      });
    } else {
      correctNote = subDivision;
    }
    return {
      value: correctNote,
      volume: 0,
      bufferIdx: bufferIdx,
      isCurrent: false
    };
  });
  return notes;
}

module.exports = {
  buildLineNotes: buildLineNotes
};
