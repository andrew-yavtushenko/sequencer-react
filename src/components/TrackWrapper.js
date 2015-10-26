'use strict';

var Track = require('./TrackModel');
var dispatcher = require('./WorkerDispatcher');

function trackWrapper () {
  var currentTrack;
  var tracks = [];

  function restore (data, callback) {
    var currentTrack = Track.restore(data);
    console.log(currentTrack);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
      callback(currentTrack);
    });
  }

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

  function deletePattern (patternId, callback) {
    currentTrack.deletePattern(patternId);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
      callback(currentTrack);
    });
  }

  function changePatternCounter (patternId, counter, callback) {
    currentTrack.getPattern(patternId).setCounter(counter);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
      callback(currentTrack);
    });
  }

  function duplicatePattern (patternId, callback) {
    currentTrack.duplicatePattern(patternId);
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

  function updateNoteVolume (patternId, beatId, lineId, noteId, volume) {
    dispatcher.setNoteVolume(patternId, beatId, lineId, noteId, volume, function () {
      //something?
    });
  }

  function setTrackTempo (tempo, callback) {
    dispatcher.setTrackTempo(tempo, function () {
      currentTrack.setTempo(tempo);
      callback(tempo);
    });
  }
  function setPatternCustomTempo (tempo, patternId) {
    dispatcher.setPatternCustomTempo(tempo, patternId, function () {
      currentTrack.setCustomTempo(tempo, patternId);
    });

  }
  function releasePatternCustomTempo (patternId) {
    dispatcher.releasePatternCustomTempo(patternId, function () {
      currentTrack.releaseCustomTempo(patternId);
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

  function movePattern (oldIndex, newIndex, callback) {
    currentTrack.movePattern(oldIndex, newIndex);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
      callback(currentTrack);
    });
  }

  function createLoop (patternsToLoop, callback) {
    currentTrack.createLoop(patternsToLoop);
    dispatcher.setTrack(currentTrack, function () {
      console.log('track updated successfully');
      callback(currentTrack);
    });
  }

  return {
    restore: restore,
    changePatternCounter: changePatternCounter,
    createLoop: createLoop,
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
