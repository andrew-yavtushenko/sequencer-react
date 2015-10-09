'use strict';

var uuid = require('./uuid');

function Loop (patterns, counter) {
  this.counter = counter;
  this.id = uuid.create().hex;
  this.patterns = patterns;
  this.patternIndex = 0;
  this.isStoped = true;
  this.loopIndex = 0;
  this.isLoop = true;

  return this;
}

Loop.prototype.setCounter = function (counter) {
  this.counter = counter;
};

Loop.prototype.start = function () {
  this.isStoped = false;
};

Loop.prototype.stop = function () {
  this.loopIndex = 0;
  this.patternIndex = 0;
  this.isStoped = true;
};

Loop.advancePattern = function () {
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

  return this.isStoped;
};

module.exports = Loop;
