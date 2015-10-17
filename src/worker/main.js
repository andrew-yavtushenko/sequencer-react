importScripts(
  './utils.js',
  './timing.js',
  './settings.js',
  './emitNote.js',
  './line.js',
  './beat.js',
  './track.js',
  './ticker.js',
  './player.js',
  './dispatcher.js',
  './uuid.js'
);

var Player = initPlayer();
var Ticker = initTicker();
(function () {})(Player, Ticker); // tricking eslint
