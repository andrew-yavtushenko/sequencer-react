var Context = require('./Context').context;
window.mix = function mix (buffers) {
  /* Get the maximum length and maximum number of channels accros all buffers, so we can
   * allocate an AudioBuffer of the right size. */
  var maxChannels = 0;
  var maxDuration = 0;
  for (var i = 0; i < buffers.length; i++) {
    if (buffers[i].numberOfChannels > maxChannels) {
      maxChannels = buffers[i].numberOfChannels;
    }
    if (buffers[i].duration > maxDuration) {
      maxDuration = buffers[i].duration;
    }
  }
  var out = Context.createBuffer(maxChannels,
    Context.sampleRate * maxChannels,
    Context.sampleRate);

  for (var j = 0; j < buffers.length; j++) {
    for (var srcChannel = 0; srcChannel < buffers[j].numberOfChannels; srcChannel++) {
      /* get the channel we will mix into */
      var out = mixed.getChanneData(srcChannel);
      /* Get the channel we want to mix in */
      var into = buffers[i].getChanneData(srcChannel);
      for (var i = 0; i < toMix.length; i++) {
        out[i] += into[i];
      }
    }
  }
  return out;
}

module.exports = mix;

