var reduce = require('lodash/collection/reduce');
var size = require('lodash/collection/size');
var forOwn = require('lodash/object/forOwn');

var availableSamples = {
  'hat': require('sounds/hat.wav'),
  'mutedhat': require('sounds/mutedhat.wav'),
  'openhat': require('sounds/openhat.wav'),
  'snare': require('sounds/snare.wav'),
  'kick': require('sounds/kick.wav'),
  'mutedride': require('sounds/mutedride.wav'),
  'ride': require('sounds/ride.wav'),
  'ridebell': require('sounds/ridebell.wav'),
  'mutedcrash': require('sounds/mutedcrash.wav'),
  'crash': require('sounds/crash.wav'),
  'tom1': require('sounds/tom1.wav'),
  'tom2': require('sounds/tom2.wav'),
  'tom3': require('sounds/tom3.wav'),
  'metronome-low': require('sounds/metronome-low.wav'),
  'metronome-med': require('sounds/metronome-med.wav'),
  'metronome-high': require('sounds/metronome-high.wav')
};

var buffers = {};
var loadedBuffers = {};

function areLoaded () {
  return size(buffers) === size(availableSamples);
}

function resample (buffer, callback) {
  var channels = buffer.numberOfChannels;
  var durationInSamples = buffer.length;

  var offlineContext = new OfflineAudioContext(channels, durationInSamples, 48000);
  var emptyBuffer = offlineContext.createBuffer(channels, durationInSamples, buffer.sampleRate);

  for (var channel = 0; channel < channels; channel++) {
    var channelData = emptyBuffer.getChannelData(channel);
    for (var i = 0; i < durationInSamples; i++) {
      channelData[i] = buffer.getChannelData(channel)[i];
    }
  }
  var source = offlineContext.createBufferSource();

  source.buffer = emptyBuffer;

  source.connect(offlineContext.destination);

  source.start(0);

  offlineContext.oncomplete = function() {
    callback(event.renderedBuffer);
  };


  offlineContext.startRendering();
}

function decodeArrayBuffer (arrayBuffer, callback, errCallback) {
  var view = new DataView(arrayBuffer);
  var sampleRate = view.getUint32(24, true);
  var numberOfChannels = view.getUint16(22, true);

  var offlineCtx = new OfflineAudioContext(numberOfChannels, 1, sampleRate);

  offlineCtx.decodeAudioData(arrayBuffer, callback, errCallback);
}

function loadSample (url, callback) {

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    decodeArrayBuffer(request.response, callback, function (buffer) {
      console.log('Error decoding drum samples!', buffer);
    });
  };

  request.send();
}

function compileBuffers (receivedBuffers) {
  reduce(availableSamples, function(result, sampleUrl, sampleName){
    if (sampleName.match(/metronome-/gi)) {
      result.metronome = 'metronome';
    } else {
      result[sampleName] = receivedBuffers[sampleName];
    }
    return result;
  }, loadedBuffers);
}

function loadBuffers (callback) {
  forOwn(availableSamples, function (url, sample) {
    loadSample(url, function (buffer) {
      buffers[sample] = buffer;

      if (areLoaded()) {
        compileBuffers(buffers);
        callback(loadedBuffers);
      }
    });
  });
}

function getBuffers (bufferName, volume) {
  if (!bufferName) {
    return loadedBuffers;
  }
  if (bufferName === 'metronome') {
    switch (volume) {
      case 0.33:
        return buffers['metronome-low'];
      case 0.66:
        return buffers['metronome-med'];
      case 1:
        return buffers['metronome-high'];
      default:
        return buffers['metronome-low'];
    }
  } else {
    return loadedBuffers[bufferName];
  }
}

module.exports = {
  get: getBuffers,
  getRaw: function () { return buffers; },
  loadAll: loadBuffers,
  areLoaded: areLoaded
};
