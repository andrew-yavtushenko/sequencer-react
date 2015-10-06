'use strict';

var Context = require('./Context').context;
var Buffers = require('./Buffers');
var blink = require('./Blink');

function play (buffer, gain, duration, psh) {
  var noteDuration = duration / 1000;
  var source = Context.createBufferSource();
  var gainNode = Context.createGain();

  source.buffer = buffer;

  gainNode.gain.value = gain;
  source.connect(gainNode);

  gainNode.connect(Context.destination);

  var ratio = noteDuration / buffer.duration;

  if (!source.start) {
    source.start = source.noteOn;
  }
  source.start(0);
  if (psh) {
    gainNode.gain.setTargetAtTime(0, Context.currentTime + buffer.duration * ratio, 0.05);
  }
}


module.exports = function playNote (bufferId, gain, patternId, lineId, noteId, duration) {
  blink(patternId, lineId, noteId);

  var buffer;
  var psh = bufferId.match(/muted/gi);

  if (bufferId.match(/metronome/gi)) {
    if (gain === 0.33) {
      buffer = Buffers.getRaw()['metronome-low'];
    } else if (gain === 0.66) {
      buffer = Buffers.getRaw()['metronome-med'];
    } else {
      buffer = Buffers.getRaw()['metronome-high'];
    }
    gain = 1;
  } else {
    buffer = Buffers.get()[bufferId];
  }

  play(buffer, gain, duration, psh);
};
