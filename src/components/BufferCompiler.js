var buffers = require('./Buffers');

function noteTime (tempo, noteValue) {
  return (60 / tempo * 4000 / noteValue) | 0;
}

function noteReducer (beatTempo, noteStartTime, line, note, index) {
  var noteData = {
    buffer: [
      buffers.get(note.bufferIdx, note.volume).getChannelData(0),
      buffers.get(note.bufferIdx, note.volume).getChannelData(1)
    ],
    volume: note.volume,
    duration: noteTime(beatTempo, note.value),
    bufferDuration: buffers.get()[note.bufferIdx].duration * 1000 | 0
  };

  if (index === 0) {

    noteData.startTime = noteStartTime;
    noteData.stopTime = noteData.startTime + noteData.duration;

    line.startTime = noteStartTime;
    line.stopTime = line.startTime + noteData.duration;
    line.duration = noteData.duration;
    line.soundDuration = line.duration > noteData.bufferDuration
      ? noteData.duration
      : noteData.bufferDuration;
    line.notes = [];

  } else {

    noteData.startTime = line.notes[index - 1].stopTime;
    noteData.stopTime = noteData.startTime + noteData.duration;

    line.duration += noteData.duration;
    line.stopTime += noteData.duration;

    line.soundDuration = noteData.duration > noteData.bufferDuration
      ? line.duration
      : line.duration - noteData.duration + noteData.bufferDuration;
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
    if (beat.stopTime <= lineData.stopTime) {
      beat.stopTime = lineData.stopTime;
    }
    if (beat.duration <= lineData.duration) {
      beat.duration = lineData.duration;
    }
    if (beat.soundDuration <= lineData.soundDuration) {
      beat.soundDuration = lineData.soundDuration;
    }
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

function compileBuffer (currentTrack) {
  var trackPatterns = currentTrack.patterns.slice();

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
  console.log(preCompiled);
  var recorder = new Worker(require('../worker/recorder.js'));
  //recorder.postMessage({
  //  command: 'init',
  //  config: {
  //    sampleRate: 48000,
  //    numChannels: 2
  //  }
  //});

  function forceDownload (blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    var click = document.createEvent('Event');
    click.initEvent('click', true, true);
    link.dispatchEvent(click);
    recorder.terminate();
  }

  //recorder.postMessage({
  //  command: 'record',
  //  buffer: [
  //    bufferSource.buffer.getChannelData(0),
  //    bufferSource.buffer.getChannelData(0)
  //  ]
  //});

  recorder.onmessage = function( e ) {
    var blob = e.data;
    forceDownload(blob, bufferSource.name);
  };

// callback for `exportWAV`
//  recorder.postMessage({
//    command: 'exportWAV',
//    type: 'audio/wav'
//  });
}

module.exports = compileBuffer;
