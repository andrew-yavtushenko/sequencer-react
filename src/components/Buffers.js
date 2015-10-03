var _ = require('lodash');
var Context = require('./Context');

var availableSamples = {
  'hat': 'hat',
  'mutedhat': 'mutedhat',
  'openhat': 'openhat',
  'snare': 'snare',
  'kick': 'kick',
  'ride': 'ride',
  'ridebell': 'ridebell',
  'crash': 'crash',
  'tom1': 'tom1',
  'tom2': 'tom2',
  'tom3': 'tom3',
  'metronome-low': 'metronome-low',
  'metronome-med': 'metronome-med',
  'metronome-high': 'metronome-high'
};

var buffers = {};
var loadedBuffers = {};

function areLoaded () {
  return _.size(buffers) === _.size(availableSamples);
}

function loadSample (url, callback) {

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    Context.context.decodeAudioData(
      request.response,
      callback,
      function(buffer) {
          console.log('Error decoding drum samples!', buffer);
      }
    );
  };

  request.send();
}

function compileBuffers (receivedBuffers) {
  _.reduce(availableSamples, function(result, sampleName){
    if (sampleName.match(/metronome-/gi)) {
      result.metronome = 'metronome';
    } else {
      result[sampleName] = receivedBuffers[sampleName];
    }
    return result;
  }, loadedBuffers);
}

function loadBuffers (callback) {
  _.each(availableSamples, function (sample) {

    loadSample('./sounds/' + sample + '.wav', function (buffer) {
      buffers[sample] = buffer;

      if (areLoaded()) {
        compileBuffers(buffers);
        callback(loadedBuffers);
      }
    });
  });
}

module.exports = {
  get: function () { return loadedBuffers; },
  getRaw: function () { return buffers; },
  loadAll: loadBuffers,
  areLoaded: areLoaded
};
