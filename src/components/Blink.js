'use strict';

function blink (patternId, lineId, noteId, duration) {
  var event = new CustomEvent('blink', {
    'detail': {
      patternId: patternId,
      lineId: lineId,
      noteId: noteId,
      duration: duration
    }
  });

  window.dispatchEvent(event);
}

module.exports = blink;
