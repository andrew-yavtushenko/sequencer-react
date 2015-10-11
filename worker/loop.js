function Loop (properties) {
  for (var key in properties) {
    this[key] = properties[key];
  }
}

Loop.prototype.start = function () {
  if (!this.isStoped) { return; }
  console.log('loop start');
  this.isStoped = false;
};

Loop.prototype.stop = function () {
  if (this.isStoped) { return; }
  console.log('loop stop');
  this.loopIndex = 0;
  this.patternIndex = 0;
  this.isStoped = true;
};

Loop.advancePattern = function () {
  this.patternIndex++;

  if (this.patternIndex === this.patterns.length) {
    this.advance();
    this.patternIndex = 0;
  }
};

Loop.prototype.advance = function () {
  console.log(this.loopIndex);
  this.loopIndex++;

  if (this.loopIndex === this.counter) {
    this.stop();
  }

  return this.isStoped;
};

Loop.prototype.hasPattern = function (pattern) {
  return this.patterns.indexOf(pattern.id) !== -1;
};
