var _ticker;

function initTicker () {
  var intervalId;
  var startTime;
  var currentTime;
  var currentTrack;
  var inProgress = false;
  var tracks = [];

  function schedule() {
    currentTime = timing.current();

    currentTime -= startTime;
    var timeToDrop = currentTrack.check(currentTime);

    if (timeToDrop) startTime = timing.current();
  }

  function stop (track) {
    if (!inProgress) return;

    clearInterval(intervalId);
    currentTrack.stop();
    currentTrack.isPlaying = false;
    inProgress = false;
    console.profileEnd("worker");
  }

  function start (track) {
    if (inProgress) return;

    console.profile("worker");
    currentTrack = track;
    currentTrack.isPlaying = true;
    inProgress = true;
    startTime = timing.current();
    intervalId = setInterval(schedule, 0);
  }
  if (!_ticker) {
    _ticker = {
      start: start,
      stop: stop
    };
  }

  return _ticker;
}