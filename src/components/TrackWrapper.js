'use strict';

var Track = require('./TrackModel');
var dispatcher = require('./WorkerDispatcher');

function trackWrapper () {
  var currentTrack;
  var tracks = [];

  function createTrack (name) {
    currentTrack = new Track(name);
    tracks.push(currentTrack);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
    });
    return currentTrack;
  }

  function changeTrack (track) {
    currentTrack = track;
  }

  function startPlayback () {
    dispatcher.setTrack(currentTrack, function () {
      dispatcher.startPlayback(function () {
        currentTrack.start();
      });
    });
  }

  function stopPlayback () {
    dispatcher.stopPlayback(function () {
      currentTrack.stop();
    });
  }

  function addLine (patternId, bufferId, subDivision) {
    currentTrack.getPattern(patternId).addLine(bufferId, subDivision);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
    });
  }

  function deletePattern (patternId) {
    currentTrack.deletePattern(patternId);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
    });
  }

  function createPattern (beat, noteValue) {
    var newPattern = currentTrack.createPattern(beat, noteValue);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
    });
    return newPattern;
  }

  function updateNoteVolume (patternId, lineId, noteId) {
    var volume = currentTrack.getPattern(patternId).lines[lineId].updateVolume(noteId);
    dispatcher.setNoteVolume(patternId, lineId, noteId, volume, function () {
      // console.log(arguments);
    });
  }

  function setTrackTempo (tempo) {
    dispatcher.setTrackTempo(tempo, function () {
      currentTrack.setTempo(tempo);
    });
  }
  function setPatternCustomTempo (tempo, patternId) {
    dispatcher.setPatternCustomTempo(tempo, patternId, function () {
      currentTrack.setCustomTempo(tempo, patternId);
    });

  }
  function releasePatternCustomTempo (tempo) {
    dispatcher.releasePatternCustomTempo(tempo, function () {
      currentTrack.releaseCustomTempo(tempo);
    });
  }

  function getCurrentTrack () {
    return currentTrack;
  }

  function getTrackById (trackId) {
    return tracks.find(function (track) {
      return track.id === trackId;
    });
  }

  function isValidToPlay () {
    return !!currentTrack.patterns.length;
  }

  function getTracks () {
    return tracks;
  }

  function changeTrackName (newName) {
    currentTrack.editName(newName);
    return currentTrack;
  }

  return {
    changeTrackName: changeTrackName,
    getTracks: getTracks,
    isValidToPlay: isValidToPlay,
    getTrackById: getTrackById,
    getCurrentTrack: getCurrentTrack,
    changeTrack: changeTrack,
    createTrack: createTrack,
    startPlayback: startPlayback,
    stopPlayback: stopPlayback,
    addLine: addLine,
    deletePattern: deletePattern,
    createPattern: createPattern,
    updateNoteVolume: updateNoteVolume,
    setTrackTempo: setTrackTempo,
    setPatternCustomTempo: setPatternCustomTempo,
    releasePatternCustomTempo: releasePatternCustomTempo
  };
}

module.exports = trackWrapper();
