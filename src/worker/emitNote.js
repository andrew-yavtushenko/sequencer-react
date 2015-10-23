function emitNote (props) { //eslint-disable-line no-unused-vars
  if (props.gain > 0) {
    var data = JSON.stringify({
      callName: 'emitNote',
      payload: [props.bufferIdx, props.gain, props.patternId, props.beatId, props.lineId, props.noteId, props.duration]
    });
    postMessage(data);
  }
}
