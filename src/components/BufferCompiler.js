var buffers = require('./Buffers');
var each = require('lodash/collection/each');
var size = require('lodash/collection/size');
var buffersCache;
var now;

var recorder = new Worker(require('../worker/recorder.js'));
window.recorder = recorder;

var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;

function noteTime (tempo, noteValue) {
  return (60 / tempo * 4000 / noteValue) | 0;
}

function recompileEmptyBuffer (buffer, noteDuration, receivedGain, callback) {
  var channels = buffer.numberOfChannels;
  var durationInSamples = buffer.length;
  var sampleRate = buffer.sampleRate;

  var duration = durationInSamples > noteDuration
    ? durationInSamples
    : noteDuration;

  var offlineContext = new OfflineContext(channels, duration, sampleRate);
  var emptyBuffer = offlineContext.createBuffer(channels, duration, sampleRate);
  callback(emptyBuffer);
}

function recompileBufferGain (buffer, noteDuration, gain, callback) {

  var channels = buffer.numberOfChannels;
  var durationInSamples = buffer.length;
  var sampleRate = buffer.sampleRate;

  var duration = Math.max(durationInSamples, noteDuration);

  var offlineContext = new OfflineContext(channels, duration, sampleRate);
  var emptyBuffer = offlineContext.createBuffer(channels, duration, sampleRate);

  var source = offlineContext.createBufferSource();
  var gainNode = offlineContext.createGain();

  for (var channel = 0; channel < channels; channel++) {
    //emptyBuffer.copyToChannel(buffer.getChannelData(channel), channel, 0);
    emptyBuffer.getChannelData(channel).set(buffer.getChannelData(channel));
  }

  source.buffer = emptyBuffer;
  gainNode.gain.value = gain;

  source.connect(gainNode);
  gainNode.connect(offlineContext.destination);
  source.start(0);

  offlineContext.oncomplete = function(event) {
    callback(event.renderedBuffer);
  };

  offlineContext.startRendering();
}

function recompileBuffer (buffer, noteDuration, receivedGain, callback) {
  return receivedGain
    ? recompileBufferGain(buffer, noteDuration, receivedGain, callback)
    : recompileEmptyBuffer(buffer, noteDuration, receivedGain, callback);
}

function createBuffersCache () {
  var bufferSources = {};
  var recompiledBuffersLength = 0;

  function setBuffer (name, buffer, noteDuration, gain) {
    bufferSources[name + gain] = {
      bufferIdx: name,
      buffer: buffer,
      gain: gain,
      noteDuration: noteDuration
    };
  }

  function checkRecompiledBuffers (bufferSource, callback, recompiledBuffer) {
    setBuffer(bufferSource.bufferIdx, recompiledBuffer, bufferSource.noteDuration, bufferSource.gain);
    recompiledBuffersLength++;
    if (recompiledBuffersLength === size(bufferSources)) {
      callback(bufferSources);
    }
  }

  function recompile (callback) {
    recompiledBuffersLength = 0;
    each(bufferSources, function (bufferSource) {
      recompileBuffer(bufferSource.buffer, bufferSource.noteDuration, bufferSource.gain, checkRecompiledBuffers.bind(this, bufferSource, callback));
    });
  }

  return {
    setBuffer: setBuffer,
    recompile: recompile
  };
}

function noteReducer (beatTempo, noteStartTime, line, note, index) {
  var noteDuration = noteTime(beatTempo, note.value);

  buffersCache.setBuffer(note.bufferIdx, buffers.get(note.bufferIdx, note.volume), noteDuration * 48, note.volume);

  var noteData = {
    bufferIdx: note.bufferIdx,
    volume: note.volume,
    duration: noteDuration,
    soundDuration: buffers.get(note.bufferIdx, note.volume).duration * 1000 | 0
  };

  if (index === 0) {

    noteData.startTime = noteStartTime;
    noteData.stopTime = noteData.startTime + noteData.duration;

    line.startTime = noteStartTime;
    line.stopTime = line.startTime + noteData.duration;
    line.duration = noteData.duration;
    line.soundDuration = line.duration > noteData.soundDuration
      ? noteData.duration
      : noteData.soundDuration;
    line.notes = [];

  } else {

    noteData.startTime = line.notes[index - 1].stopTime;
    noteData.stopTime = noteData.startTime + noteData.duration;

    line.duration += noteData.duration;
    line.stopTime += noteData.duration;

    line.soundDuration = noteData.duration > noteData.soundDuration
      ? line.duration
      : line.duration - noteData.duration + noteData.soundDuration;
  }

  line.notes.push(noteData);

  return line;
}

function lineReducer (beatTempo, lineStartTime, beat, line, index) {
  var lineData = line.notes.reduce(noteReducer.bind(this, beatTempo, lineStartTime), {});

  if (index === 0) {
    beat.startTime = lineStartTime;
    beat.stopTime = lineData.stopTime;
    beat.duration = lineData.duration;
    beat.soundDuration = lineData.soundDuration;
    beat.lines = [];
  } else {
    beat.stopTime = Math.max(beat.stopTime, lineData.stopTime);
    beat.duration = Math.max(beat.duration, lineData.duration);
    beat.soundDuration = Math.max(beat.soundDuration, lineData.soundDuration);
  }

  beat.lines.push(lineData);

  return beat;
}

function beatReducer (patternStartTime, pattern, beat, index) {
  var beatStartTime = index === 0
    ? patternStartTime
    : pattern.beats[index - 1].stopTime;


  var beatData = beat.lines.reduce(lineReducer.bind(this, beat.tempo, beatStartTime), {});

  if (index === 0) {
    pattern.startTime = beatStartTime;
    pattern.stopTime = pattern.startTime + beatData.duration;
    pattern.duration = beatData.duration;

    pattern.soundDuration = beatData.duration > beatData.soundDuration
      ? pattern.duration
      : beatData.soundDuration;

    pattern.beats = [];
  } else {
    pattern.stopTime += beatData.duration;
    pattern.duration += beatData.duration;
    pattern.soundDuration = beatData.duration > beatData.soundDuration
      ? pattern.duration
      : pattern.duration - beatData.duration + beatData.soundDuration;
  }

  pattern.beats.push(beatData);

  return pattern;
}

function updateRecompiledBuffers (trackData, recompiledBuffers) {
  trackData.patterns.forEach(function (pattern) {
    pattern.beats.forEach(function (beat) {
      beat.lines.forEach(function (line) {
        line.notes.forEach(function (note) {
          var recompiledBuffer = recompiledBuffers[note.bufferIdx + note.volume].buffer;
          note.buffer = [
            recompiledBuffer.getChannelData(0),
            recompiledBuffer.getChannelData(1)
          ];
        });
      });
    });
  });
}

function precompileTrack (currentTrack) {
  var trackName = currentTrack.name;
  now = Date.now();

  var trackPatterns = currentTrack.patterns.map(function (pattern) {
    return pattern.clone(true);
  });

  buffersCache = createBuffersCache();
  recorder = new Worker(require('../worker/recorder.js'));

  for (var i = 0; i < trackPatterns.length; i++) {
    if (trackPatterns[i].counter > 1) {
      for (var j = 1; j < trackPatterns[i].counter; j++) {
        var newPattern = trackPatterns[i].clone(true);
        newPattern.setCounter(1);
        trackPatterns.splice(i + j, 0, newPattern);
      }
      trackPatterns[i].setCounter(1);
    }
  }

  var preCompiled = trackPatterns.reduce(function (track, pattern, index) {

    var patternStartTime = index === 0
      ? 0
      : track.patterns[index - 1].stopTime;

    var patternData = pattern.beats.reduce(beatReducer.bind(this, patternStartTime), {});

    if (index === 0) {
      track.startTime = patternStartTime;
      track.stopTime = track.startTime + patternData.duration;
      track.duration = patternData.duration;
      track.soundDuration = patternData.duration > patternData.soundDuration
        ? track.duration
        : patternData.soundDuration;
      track.patterns = [];
    } else {
      track.stopTime += patternData.duration;
      track.duration += patternData.duration;
      track.soundDuration = patternData.duration > patternData.soundDuration
        ? track.duration
        : track.duration - patternData.duration + patternData.soundDuration;
    }

    track.patterns.push(patternData);

    return track;

  }, {});
  buffersCache.recompile(function (recompiledBuffers) {
    updateRecompiledBuffers(preCompiled, recompiledBuffers);
    recorder.postMessage({
      command: 'compileTrack',
      trackData: preCompiled
    });
    recorder.postMessage({
      command: 'exportWAV',
      type: 'audio/wav'
    });
  });
  recorder.postMessage({
    command: 'init',
    config: {
      sampleRate: 48000,
      numChannels: 2
    }
  });

  function forceDownload (blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    var click = document.createEvent('Event');
    click.initEvent('click', true, true);
    link.dispatchEvent(click);
    recorder.terminate();
    console.log(Date.now() - now);
  }

  recorder.onmessage = function( e ) {
    var blob = e.data;
    forceDownload(blob, trackName);
  };

}

module.exports = precompileTrack;
