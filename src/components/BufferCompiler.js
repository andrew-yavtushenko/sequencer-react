
function compileBuffer (bufferSource) {
  var recorder = new Worker(require('../worker/recorder.js'));
  recorder.postMessage({
    command: 'init',
    config: {
      sampleRate: 44100,
      numChannels: 2
    }
  });

  function forceDownload (blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    var click = document.createEvent("Event");
    click.initEvent("click", true, true);
    link.dispatchEvent(click);
    recorder.terminate();
  }

  recorder.postMessage({
    command: 'record',
    buffer: [
      bufferSource.buffer.getChannelData(0),
      bufferSource.buffer.getChannelData(0)
    ]
  });

  recorder.onmessage = function( e ) {
    var blob = e.data;
    forceDownload(blob, bufferSource.name);
  };

// callback for `exportWAV`
  recorder.postMessage({
    command: 'exportWAV',
    type: 'audio/wav'
  });
};

module.exports = window.compileBuffer = compileBuffer;
