function emitNote (bufferIdx, gain, patternId, lineId, noteId) {
  console.log(gain);
  if (gain > 0) {
    var data = JSON.stringify({
      callName: 'emitNote',
      payload: [bufferIdx, gain, patternId, lineId, noteId]
    });
    postMessage(data);
  }
}