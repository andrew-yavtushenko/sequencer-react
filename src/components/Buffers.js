var _ = require('lodash');
var Context = require('./Context');

var availableSamples = {
  'hat': require('sounds/hat.wav'),
  'mutedhat': require('sounds/mutedhat.wav'),
  'openhat': require('sounds/openhat.wav'),
  'snare': require('sounds/snare.wav'),
  'kick': require('sounds/kick.wav'),
  'ride': require('sounds/ride.wav'),
  'ridebell': require('sounds/ridebell.wav'),
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
  return _.size(buffers) === _.size(availableSamples);
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

function debugError(stage, sample, url) {
  return function (err) {
    console.error('Error', stage, 'drum sample: ', sample);
    console.error('URL:', url);
    console.error('Exception:', err);
    return Promise.reject();
  };
}

function loadBuffers (callback) {
  var requests = [];

  _.forOwn(availableSamples, function (url, sample) {
    requests.push(new Request(url)
      .arrayBuffer()
      .catch(debugError('fetching', sample, url))
      .then(function (buffer) {
        return new Promise(function (resolve, reject) {
          Context.context.decodeAudioData(buffer, resolve, reject);
        });
      })
      .catch(debugError('decoding', sample, url))
      .then(function (decodedData) {
        return [decodedData, sample];
      })
    );
  });

  Promise.all(requests).then(function (results) {
    buffers = results.reduce(function (acc, [value, key]) {
      acc[key] = value;
    }, {});

    compileBuffers(buffers);
    callback(loadedBuffers);
  }).catch(function (err) {
    console.error(err);
  });
}

module.exports = {
  get: function () { return loadedBuffers; },
  getRaw: function () { return buffers; },
  loadAll: loadBuffers,
  areLoaded: areLoaded
};
