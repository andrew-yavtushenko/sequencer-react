'use strict';

function sumArrays (arrays, size) {
  var output = new Float32Array(size);

  arrays.reduce(function (result, array, index, arr) {
    for (var i = 0; i < result.length; i++) {
      var a = index === 0
        ? 0
        : arr[index - 1][i];
      result[i] = a + array[i];
    }
    return result;
  }, output);

  return output;
}

function mergeArrays (arrA, arrB, offset) {
  var outputLength = arrA.length + arrB.length - offset;
  var output = new Float32Array(outputLength);

  var subArrA = arrA.subarray(0, arrA.length - offset);

  var mergeA = arrA.subarray(arrA.length - offset);
  var mergeB = arrB.subarray(0, offset);

  var subArrMerge = sumArrays([mergeA, mergeB], offset);
  var subArrB = arrB.subarray(offset);

  output.set(subArrA);
  output.set(subArrMerge, arrA.length - offset);
  output.set(subArrB, arrA.length);

  return output;
}

function noteReducer (lineOutput, note, index, arr) {
  var offset = note.soundDuration > note.duration
    ? note.soundDuration > note.duration
    : note.duration;

  if (index + 1 !== arr.length) {
    for (var i = 0; i < note.buffer.length; i++) {
      lineOutput[i] = mergeArrays(note.buffer[i], arr[index + 1].buffer[i], offset * 48);
    }
  } else {
    return lineOutput;
  }

  return lineOutput;
}

function lineReducer (beatOutput, line) {
  var offset = line.soundDuration - line.duration;

  var noteData = line.notes.reduce(noteReducer, []);

  for (var channelIndex = 0; channelIndex < 2; channelIndex++) {
    beatOutput[channelIndex] = mergeArrays(noteData[0], noteData[1], offset);
  }

  return beatOutput;
}

function beatReducer (patternOutput, beat) {

  var lineData = beat.lines.reduce(lineReducer, []);

  for (var channelIndex = 0; channelIndex < 2; channelIndex++) {
    patternOutput[channelIndex] = sumArrays(lineData[channelIndex], beat.soundDuration * 48);
  }

  return patternOutput;
}

function patternReducer (trackOutput, pattern) {

  var offset = pattern.soundDuration - pattern.duration;

  var patternData = pattern.beats.reduce(beatReducer, []);

  for (var channelIndex = 0; channelIndex < 2; channelIndex++) {
    trackOutput[channelIndex] = mergeArrays(patternData[0], patternData[1], offset);
  }

  return trackOutput;
}

function compileTrack (trackObj) {
  var trackChannels = trackObj.patterns.reduce(patternReducer, []);

  return trackChannels;
}

module.exports = compileTrack;
