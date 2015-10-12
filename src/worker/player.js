var _player;
var currentTrack;

function initPlayer () { //eslint-disable-line no-unused-vars

  function start () {
    Ticker.start(currentTrack);
  }

  function stop () {
    Ticker.stop(currentTrack);
  }

  function setTrack (data) {
    console.log('setTrack', data);
    //currentTrack = new Track(data.track);
  }

  function setNoteVolume (data) {
    currentTrack.getPattern(data.patternId).lines[data.lineId].setNoteVolume(data.noteId, data.volume);
  }

  function setTrackTempo (data) {
    currentTrack.setTempo(data.tempo);
  }

  function setPatternCustomTempo (data) {
    currentTrack.setCustomTempo(data.tempo, data.patternId);
  }

  function releasePatternCustomTempo (data) {
    currentTrack.releaseCustomTempo(data.patternId);
  }

  if (!_player) {
    _player = {
      start: start,
      stop: stop,
      setTrack: setTrack,
      setNoteVolume: setNoteVolume,
      setTrackTempo: setTrackTempo,
      setPatternCustomTempo: setPatternCustomTempo,
      releasePatternCustomTempo: releasePatternCustomTempo
    };
  }

  return _player;
}
