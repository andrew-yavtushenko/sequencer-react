var _player;
var currentTrack;

function initPlayer () { //eslint-disable-line no-unused-vars
  var autoplay = true;
  function start () {
    currentTrack.whenFinished(function () {
      console.profileEnd('track');
      if (autoplay) {
        currentTrack.start();
      }
    });
    currentTrack.start();
  }

  function stop () {
    currentTrack.stop();
  }

  function setTrack (data) {
    currentTrack = new Track(data.track);
  }

  function setNoteVolume (data) {
    currentTrack.getPattern(data.patternId).getBeat(data.beatId).lines[data.lineId].setNoteVolume(data.noteId, data.volume);
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
