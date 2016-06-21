var assert = require('assert');

describe('tic', function() {
  describe('setTimeout', function() {
    it('should invoke timeout', function() {
      var tic = require('../tic')();
      var called = 0;
      tic.setTimeout(100, function() {
        called++;
      });
      tic.step(100);
      assert.equal(called, 1);
    });

    it('should not invoke timeout after stop', function() {
      var tic = require('../tic')();
      var called = 0;
      var timeout = tic.setTimeout(100, function() {
        called++;
      });
      timeout.stop();
      tic.step(100);
      assert.equal(called, 0);
    });

    it('should not invoke timeout before timeout', function() {
      var tic = require('../tic')();
      var called = 0;
      tic.setTimeout(100, function() {
        called++;
      });
      tic.step(99);
      assert.equal(called, 0);
    });

    it('should invoke timeout once', function() {
      var tic = require('../tic')();
      var called = 0;
      tic.setTimeout(100, function() {
        called++;
      });
      tic.step(100);
      tic.step(100);
      assert.equal(called, 1);
    });
  });

  describe('setInterval', function() {
    it('should invoke interval', function() {
      var tic = require('../tic')();
      var called = 0;
      tic.setInterval(100, function() {
        called++;
      });
      tic.step(100);
      assert.equal(called, 1);
    });

    it('should not invoke interval after stop', function() {
      var tic = require('../tic')();
      var called = 0;
      var timeout = tic.setInterval(100, function() {
        called++;
      });
      timeout.stop();
      tic.step(100);
      assert.equal(called, 0);
    });

    it('should not invoke interval before interval', function() {
      var tic = require('../tic')();
      var called = 0;
      tic.setInterval(100, function() {
        called++;
      });
      tic.step(99);
      assert.equal(called, 0);
    });

    it('should invoke interval twice', function() {
      var tic = require('../tic')();
      var called = 0;
      tic.setInterval(100, function() {
        called++;
      });
      tic.step(100);
      tic.step(100);
      assert.equal(called, 2);
    });
  });
});
