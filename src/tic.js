var THREE = require('three');

module.exports = function() {

  var intervals = {};

  function setInterval(time, func) {
    var interval = new Interval(time, func, true);
    intervals[interval.uuid] = interval;
    return interval;
  };

  function setTimeout(time, func) {
    var interval = new Interval(time, func, false);
    intervals[interval.uuid] = interval;
    return interval;
  };

  function step(dt) {
    for (var id in intervals) {
      var interval = intervals[id];
      if (interval.stopped) {
        delete intervals[id];
      }
    }

    for (var id in intervals) {
      var interval = intervals[id];
      interval.counter -= dt;
      if (interval.counter <= 0) {
        interval.func();

        // If repeats, incre counter
        if (interval.repeats) {
          interval.counter += interval.time;
        } else {
          // Remove once invoked
          delete intervals[id];
        }
      }
    }
  };

  return {
    setInterval: setInterval,
    setTimeout: setTimeout,
    step: step
  }
};

var Interval = function(time, func, repeats) {
  this.time = time;
  this.counter = time;
  this.func = func;
  this.repeats = repeats || false;
  this.active = false;
  this.uuid = Interval.counter;
  Interval.counter++;
  this.stopped = false;
};

Interval.prototype.stop = function() {
  this.stopped = true;
};

Interval.counter = 0;
