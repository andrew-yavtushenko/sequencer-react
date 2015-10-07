function emitNote (bufferIdx, gain, patternId, lineId, noteId, duration) {
  if (gain > 0) {
    var data = JSON.stringify({
      callName: 'emitNote',
      payload: [bufferIdx, gain, patternId, lineId, noteId, duration]
    });
    postMessage(data);
  }
}