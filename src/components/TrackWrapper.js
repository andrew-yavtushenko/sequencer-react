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
    return currentTrack.getPattern(patternId).addLine(bufferId, subDivision);
  }

  function deletePattern (patternId) {
    currentTrack.deletePattern(patternId);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
    });
  }

  function duplicatePattern (pattern, callback) {
    currentTrack.duplicatePattern(pattern);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
      callback(currentTrack);
    });
    return currentTrack;
  }

  function updatePattern (updatedPattern, callback) {
    currentTrack.updatePattern(updatedPattern);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
      callback(currentTrack);
    });
  }

  function savePattern (pattern, callback) {
    currentTrack.savePattern(pattern);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
      callback(currentTrack);
    });
  }

  function createPattern (beat, noteValue, name, tempo) {
    return currentTrack.createPattern(beat, noteValue, name, tempo);
  }

  function updateNoteVolume (patternId, lineId, noteId, volume, callback) {
    dispatcher.setNoteVolume(patternId, lineId, noteId, volume, function () {
      callback('note volume updated', patternId, lineId, noteId, volume);
    });
  }

  function setTrackTempo (tempo, callback) {
    dispatcher.setTrackTempo(tempo, function () {
      currentTrack.setTempo(tempo);
      callback(tempo);
    });
  }
  function setPatternCustomTempo (tempo, patternId, callback) {
    dispatcher.setPatternCustomTempo(tempo, patternId, function () {
      currentTrack.setCustomTempo(tempo, patternId);
      if (callback) {
        callback(currentTrack);
      }
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

  function movePattern (oldIndex, newIndex) {
    currentTrack.movePattern(oldIndex, newIndex);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
    });
    return currentTrack;
  }

  return {
    updatePattern: updatePattern,
    savePattern: savePattern,
    movePattern: movePattern,
    duplicatePattern: duplicatePattern,
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
