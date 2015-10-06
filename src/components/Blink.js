'use strict';

function blink (patternId, lineId, noteId) {
  var event = new CustomEvent('blink', {
    'detail': {
      patternId: patternId,
      lineId: lineId,
      noteId: noteId
    }
  });

  window.dispatchEvent(event);
}

module.exports = blink;
