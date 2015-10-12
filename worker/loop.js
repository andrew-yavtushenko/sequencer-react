function Loop (properties) {

  //this.id = uuid.create().hex;
  //this.counter = counter;
  //this.patterns = patterns;

  for (var key in properties) {
    this[key] = properties[key];
  }

  for (var i = 0; i < this.patterns.length; i++) {
    var patternData = this.patterns[i];
    this.patterns[i] = new Pattern(patternData);
  }

  this.patternIndex = 0;
  this.loopIndex = 0;
  this.isLoop = true;
  this.isStopped = true;
}

Loop.prototype.start = function () {
  if (this.isStopped === false) { return; }
  this.isStopped = false;
  console.log('loop start');
};

Loop.prototype.stop = function () {
  this.isStopped = true;
  console.log('loop stop');
  this.loopIndex = 0;
  this.patternIndex = 0;
};

Loop.prototype.advancePattern = function() {
  this.patternIndex++;
  if (this.patternIndex === this.patterns.length) {
    this.advanceLoop();
    this.patternIndex = 0;
  }
};

Loop.prototype.advanceLoop = function () {
  this.loopIndex++;
  if (this.loopIndex === this.counter) {
    this.stop();
  }
};

Loop.prototype.check = function (currentTime) {
  var currentPattern = this.patterns[this.patternIndex];

  currentPattern.start();

  currentPattern.check(currentTime);

  if (currentPattern.isStopped) {
    this.advancePattern();
  }

  return {
    isStopped: this.isStopped,
    timeToDrop: currentPattern.isStopped
  };
};

