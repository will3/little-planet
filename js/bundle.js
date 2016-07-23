(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'left command': 91,
  'right command': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222
}

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 34,
  'ins': 45,
  'del': 46,
  'cmd': 91
}


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}

},{}],2:[function(require,module,exports){
var assign = require('101/assign');
var PriorityQueue = require('./libs/queue');

// costruct
var Graph = function(vertices) {
  // you can either pass a verticies object or add every
  this.vertices = vertices || {};
}

assign(Graph.prototype, {
  // add a vertex to the graph
  addVertex: function(name, edges) {
    this.vertices[name] = edges;
    return this;
  },

  // compute the path
  shortestPath: function(start, finish, options) {
    options = options || {};
    getDistance = options.getDistance;

    this.nodes = new PriorityQueue();
    this.distances = {};
    this.previous = {};
    this.start = start;
    this.finish = finish;

    // Set the starting values for distances
    this.setBaseline.call(this);

    // loop until we checked every node in the queue
    var smallest;
    var path = [];
    var alt;
    while (!this.nodes.isEmpty()) {
      smallest = this.nodes.dequeue();

      if (smallest === finish) {
        while (this.previous[smallest]) {
          path.push(smallest);
          smallest = this.previous[smallest];
        }

        break;
      }

      if (!smallest || this.distances[smallest] === Infinity) {
        continue;
      }

      for (var neighbor in this.vertices[smallest]) {
        alt = this.distances[smallest] + getDistance(smallest, neighbor);

        if (alt < this.distances[neighbor]) {
          this.distances[neighbor] = alt;
          this.previous[neighbor] = smallest;

          this.nodes.enqueue(alt, neighbor);
        }
      }
    }

    if (path.length < 1) {
      return null;
    }

    if (options.trim) {
      path.shift()
        // `path` is generated in reverse order
      if (options.reverse) {
        return path;
      }
      return path.reverse();
    }

    path = path.concat([start]);
    if (options.reverse) {
      return path;
    }
    return path.reverse();
  },

  // set the starting point to 0 and all the others to infinite
  setBaseline: function() {
    var vertex;
    for (vertex in this.vertices) {
      if (vertex === this.start) {
        this.distances[vertex] = 0;
        this.nodes.enqueue(0, vertex, true);
      } else {
        this.distances[vertex] = Infinity;
        this.nodes.enqueue(Infinity, vertex, true);
      }

      this.previous[vertex] = null;
    }

    this.nodes.sort();
  }

});

module.exports = Graph;

},{"./libs/queue":3,"101/assign":4}],3:[function(require,module,exports){
var assign = require('101/assign');

// Priority Queue
// --------------

// basic priority queue implementation
var PriorityQueue = function() {
  this.nodes = [];
}

assign(PriorityQueue.prototype, {

  enqueue: function(priority, key, skipSort) {
    this.nodes.push({key: key, priority: priority});
    if(skipSort !== true) {
      this.sort.call(this);  
    }
  },

  dequeue: function() {
    return this.nodes.shift().key;
  },

  sort: function() {
    this.nodes.sort(function(a, b) {
      return a.priority - b.priority;
    });
  },

  isEmpty: function() {
    return !this.nodes.length;
  }

});

module.exports = PriorityQueue;

},{"101/assign":4}],4:[function(require,module,exports){
/**
 * @module 101/assign
 */

/**
 * Copies enumerable and own properties from a source object(s) to a target object, aka extend.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * I added functionality to support assign as a partial function
 * @function module:101/assign
 * @param {object} [target] - object which source objects are extending (being assigned to)
 * @param {object} sources... - objects whose properties are being assigned to the source object
 * @return {object} source with extended properties
 */
module.exports = assign;

function assign (target, firstSource) {
  if (arguments.length === 1) {
    firstSource = arguments[0];
    return function (target) {
      return assign(target, firstSource);
    };
  }
  if (target === undefined || target === null)
    throw new TypeError('Cannot convert first argument to object');
  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) continue;
    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      Object.getOwnPropertyDescriptor(nextSource, nextKey);
      // I changed the following line to get 100% test coverage.
      // if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
      // I was unable to find a scenario where desc was undefined or that desc.enumerable was false:
      //   1) Object.defineProperty does not accept undefined as a desc
      //   2) Object.keys does not return non-enumerable keys.
      // Let me know if this is a cross browser thing.
      to[nextKey] = nextSource[nextKey];
    }
  }
  return to;
}
},{}],5:[function(require,module,exports){
/*
 * A fast javascript implementation of simplex noise by Jonas Wagner
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 *
 *
 * Copyright (C) 2012 Jonas Wagner
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
(function () {
"use strict";

var F2 = 0.5 * (Math.sqrt(3.0) - 1.0),
    G2 = (3.0 - Math.sqrt(3.0)) / 6.0,
    F3 = 1.0 / 3.0,
    G3 = 1.0 / 6.0,
    F4 = (Math.sqrt(5.0) - 1.0) / 4.0,
    G4 = (5.0 - Math.sqrt(5.0)) / 20.0;


function SimplexNoise(random) {
    if (!random) random = Math.random;
    this.p = new Uint8Array(256);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (var i = 0; i < 256; i++) {
        this.p[i] = random() * 256;
    }
    for (i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
        this.permMod12[i] = this.perm[i] % 12;
    }

}
SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0,
                            - 1, 1, 0,
                            1, - 1, 0,

                            - 1, - 1, 0,
                            1, 0, 1,
                            - 1, 0, 1,

                            1, 0, - 1,
                            - 1, 0, - 1,
                            0, 1, 1,

                            0, - 1, 1,
                            0, 1, - 1,
                            0, - 1, - 1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, - 1, 0, 1, - 1, 1, 0, 1, - 1, - 1,
                            0, - 1, 1, 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 0, - 1, - 1, - 1,
                            1, 0, 1, 1, 1, 0, 1, - 1, 1, 0, - 1, 1, 1, 0, - 1, - 1,
                            - 1, 0, 1, 1, - 1, 0, 1, - 1, - 1, 0, - 1, 1, - 1, 0, - 1, - 1,
                            1, 1, 0, 1, 1, 1, 0, - 1, 1, - 1, 0, 1, 1, - 1, 0, - 1,
                            - 1, 1, 0, 1, - 1, 1, 0, - 1, - 1, - 1, 0, 1, - 1, - 1, 0, - 1,
                            1, 1, 1, 0, 1, 1, - 1, 0, 1, - 1, 1, 0, 1, - 1, - 1, 0,
                            - 1, 1, 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 0, - 1, - 1, - 1, 0]),
    noise2D: function (xin, yin) {
        var permMod12 = this.permMod12,
            perm = this.perm,
            grad3 = this.grad3;
        var n0=0, n1=0, n2=0; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin) * F2; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var t = (i + j) * G2;
        var X0 = i - t; // Unskew the cell origin back to (x,y) space
        var Y0 = j - t;
        var x0 = xin - X0; // The x,y distances from the cell origin
        var y0 = yin - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        else {
            i1 = 0;
            j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1.0 + 2.0 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        var ii = i & 255;
        var jj = j & 255;
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            var gi0 = permMod12[ii + perm[jj]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
    },
    // 3D simplex noise
    noise3D: function (xin, yin, zin) {
        var permMod12 = this.permMod12,
            perm = this.perm,
            grad3 = this.grad3;
        var n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var t = (i + j + k) * G3;
        var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0; // The x,y,z distances from the cell origin
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } // X Y Z order
            else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } // X Z Y order
            else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } // Z X Y order
        }
        else { // x0<y0
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } // Z Y X order
            else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } // Y Z X order
            else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } // Y X Z order
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
        var y2 = y0 - j2 + 2.0 * G3;
        var z2 = z0 - k2 + 2.0 * G3;
        var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
        var y3 = y0 - 1.0 + 3.0 * G3;
        var z3 = z0 - 1.0 + 3.0 * G3;
        // Work out the hashed gradient indices of the four simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        // Calculate the contribution from the four corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
            t3 *= t3;
            n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0 * (n0 + n1 + n2 + n3);
    },
    // 4D simplex noise, better simplex rank ordering method 2012-03-09
    noise4D: function (x, y, z, w) {
        var permMod12 = this.permMod12,
            perm = this.perm,
            grad4 = this.grad4;

        var n0, n1, n2, n3, n4; // Noise contributions from the five corners
        // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
        var s = (x + y + z + w) * F4; // Factor for 4D skewing
        var i = Math.floor(x + s);
        var j = Math.floor(y + s);
        var k = Math.floor(z + s);
        var l = Math.floor(w + s);
        var t = (i + j + k + l) * G4; // Factor for 4D unskewing
        var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
        var Y0 = j - t;
        var Z0 = k - t;
        var W0 = l - t;
        var x0 = x - X0; // The x,y,z,w distances from the cell origin
        var y0 = y - Y0;
        var z0 = z - Z0;
        var w0 = w - W0;
        // For the 4D case, the simplex is a 4D shape I won't even try to describe.
        // To find out which of the 24 possible simplices we're in, we need to
        // determine the magnitude ordering of x0, y0, z0 and w0.
        // Six pair-wise comparisons are performed between each possible pair
        // of the four coordinates, and the results are used to rank the numbers.
        var rankx = 0;
        var ranky = 0;
        var rankz = 0;
        var rankw = 0;
        if (x0 > y0) rankx++;
        else ranky++;
        if (x0 > z0) rankx++;
        else rankz++;
        if (x0 > w0) rankx++;
        else rankw++;
        if (y0 > z0) ranky++;
        else rankz++;
        if (y0 > w0) ranky++;
        else rankw++;
        if (z0 > w0) rankz++;
        else rankw++;
        var i1, j1, k1, l1; // The integer offsets for the second simplex corner
        var i2, j2, k2, l2; // The integer offsets for the third simplex corner
        var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
        // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
        // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
        // impossible. Only the 24 indices which have non-zero entries make any sense.
        // We use a thresholding to set the coordinates in turn from the largest magnitude.
        // Rank 3 denotes the largest coordinate.
        i1 = rankx >= 3 ? 1 : 0;
        j1 = ranky >= 3 ? 1 : 0;
        k1 = rankz >= 3 ? 1 : 0;
        l1 = rankw >= 3 ? 1 : 0;
        // Rank 2 denotes the second largest coordinate.
        i2 = rankx >= 2 ? 1 : 0;
        j2 = ranky >= 2 ? 1 : 0;
        k2 = rankz >= 2 ? 1 : 0;
        l2 = rankw >= 2 ? 1 : 0;
        // Rank 1 denotes the second smallest coordinate.
        i3 = rankx >= 1 ? 1 : 0;
        j3 = ranky >= 1 ? 1 : 0;
        k3 = rankz >= 1 ? 1 : 0;
        l3 = rankw >= 1 ? 1 : 0;
        // The fifth corner has all coordinate offsets = 1, so no need to compute that.
        var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
        var y1 = y0 - j1 + G4;
        var z1 = z0 - k1 + G4;
        var w1 = w0 - l1 + G4;
        var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
        var y2 = y0 - j2 + 2.0 * G4;
        var z2 = z0 - k2 + 2.0 * G4;
        var w2 = w0 - l2 + 2.0 * G4;
        var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
        var y3 = y0 - j3 + 3.0 * G4;
        var z3 = z0 - k3 + 3.0 * G4;
        var w3 = w0 - l3 + 3.0 * G4;
        var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
        var y4 = y0 - 1.0 + 4.0 * G4;
        var z4 = z0 - 1.0 + 4.0 * G4;
        var w4 = w0 - 1.0 + 4.0 * G4;
        // Work out the hashed gradient indices of the five simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        var ll = l & 255;
        // Calculate the contribution from the five corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0.0;
        else {
            var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
            t0 *= t0;
            n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0.0;
        else {
            var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
            t1 *= t1;
            n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0.0;
        else {
            var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
            t2 *= t2;
            n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0.0;
        else {
            var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
            t3 *= t3;
            n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
        }
        var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (t4 < 0) n4 = 0.0;
        else {
            var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
            t4 *= t4;
            n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
        }
        // Sum up and scale the result to cover the range [-1,1]
        return 27.0 * (n0 + n1 + n2 + n3 + n4);
    }


};

// amd
if (typeof define !== 'undefined' && define.amd) define(function(){return SimplexNoise;});
//common js
if (typeof exports !== 'undefined') exports.SimplexNoise = SimplexNoise;
// browser
else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
// nodejs
if (typeof module !== 'undefined') {
    module.exports = SimplexNoise;
}

})();

},{}],6:[function(require,module,exports){
/**
 * Block of voxel data with a fixed size
 * @constructor
 * @param {Array} shape optional shape, 
 * querying data outside of shape will give unexpected results
 */
var Chunk = function(shape) {
  this.volume = [];
  this.shape = shape || [16, 16, 16];
  this.dimX = this.shape[0];
  this.dimXY = this.shape[0] * this.shape[1];
};

/**
 * Get data at coord
 * @param  {Int} i i
 * @param  {Int} j j
 * @param  {Int} k k
 * @return {Object}
 */
Chunk.prototype.get = function(i, j, k) {
  return this.volume[i * this.dimXY + j * this.dimX + k];
};

/**
 * Set data at coord
 * @param {i} i i
 * @param {j} j j
 * @param {k} k k
 * @param {v} data to store
 */
Chunk.prototype.set = function(i, j, k, v) {
  this.volume[i * this.dimXY + j * this.dimX + k] = v;
};

module.exports = Chunk;

},{}],7:[function(require,module,exports){
var Chunk = require('./chunk');

/**
 * A dynamically sized block of voxel data
 * @constructor
 * @param {Int} chunkSize chunk size
 */
var Chunks = function(chunkSize) {
  this.map = {};
  this.chunkSize = chunkSize || 16;
};

/**
 * Set data at coord
 * @param {Int} i i
 * @param {Int} j j
 * @param {Int} k k
 * @param {Object} data to store
 */
Chunks.prototype.set = function(i, j, k, v) {
  var origin = this.getOrigin(i, j, k);
  var hash = origin.join(',');
  if (this.map[hash] == null) {
    this.map[hash] = {
      chunk: new Chunk([this.chunkSize, this.chunkSize, this.chunkSize]),
      origin: origin
    }
  }

  this.map[hash].dirty = true;
  this.map[hash].chunk.set(i - origin[0], j - origin[1], k - origin[2], v);
};

/**
 * Get data at coord
 * @param  {Int} i i
 * @param  {Int} j j
 * @param  {Int} k k
 * @return {Object} data stored at coord
 */
Chunks.prototype.get = function(i, j, k) {
  var origin = this.getOrigin(i, j, k);
  var hash = origin.join(',');
  if (this.map[hash] == null) {
    return null;
  }
  var origin = this.map[hash].origin;
  return this.map[hash].chunk.get(i - origin[0], j - origin[1], k - origin[2]);
};

/**
 * Get origin of chunk for coord
 * @param  {Int} i i
 * @param  {Int} j j
 * @param  {Int} k k
 * @return {Array} origin coord
 */
Chunks.prototype.getOrigin = function(i, j, k) {
  return [
    Math.floor(i / this.chunkSize) * this.chunkSize,
    Math.floor(j / this.chunkSize) * this.chunkSize,
    Math.floor(k / this.chunkSize) * this.chunkSize
  ];
};

/**
 * Visit coords
 * @param  {visitCallback} callback @callback 
 */
Chunks.prototype.visit = function(callback) {
  for (var id in this.map) {
    var chunk = this.map[id].chunk;
    var origin = this.map[id].origin;
    var shape = chunk.shape;

    for (var i = 0; i < shape[0]; i++) {
      for (var j = 0; j < shape[0]; j++) {
        for (var k = 0; k < shape[0]; k++) {
          var v = chunk.get(i, j, k);
          if (!v) {
            continue;
          }
          callback(i + origin[0], j + origin[1], k + origin[2], v);
        }
      }
    }
  }
};

/**
 * Remove all meshes and dispose all geometries
 * @return {Chunks} self for chainability
 */
Chunks.prototype.clear = function() {
  for (var id in this.map) {
    var chunk = this.map[id];
    if (chunk.mesh != null) {
      chunk.mesh.parent.remove(chunk.mesh);
      chunk.mesh.geometry.dispose();
    }
  }
  this.map = {};

  return this;
};

/**
 * Deserialize json
 * @param {JSON} data data to deserialize
 * @param {Array} offset optional offset to apply
 * @return {Chunks} self for chainability
 */
Chunks.prototype.deserialize = function(data, offset) {
  offset = offset || [0, 0, 0];
  var self = this;
  data.forEach(function(v) {
    self.set(v[0] + offset[0], v[1] + offset[1], v[2] + offset[2], v[3]);
  });

  return this;
};

module.exports = Chunks;

},{"./chunk":6}],8:[function(require,module,exports){
var GreedyMesh = (function() {
  //Cache buffer internally
  var mask = new Int32Array(4096);

  return function(f, dims) {
    var vertices = [],
      faces = [],
      uvs = [],
      dimsX = dims[0],
      dimsY = dims[1],
      dimsXY = dimsX * dimsY;

    //Sweep over 3-axes
    for (var d = 0; d < 3; ++d) {
      var i, j, k, l, w, W, h, n, c,
        u = (d + 1) % 3,
        v = (d + 2) % 3,
        x = [0, 0, 0],
        q = [0, 0, 0],
        du = [0, 0, 0],
        dv = [0, 0, 0],
        dimsD = dims[d],
        dimsU = dims[u],
        dimsV = dims[v],
        qdimsX, qdimsXY, xd;

      var flip, index, value;

      if (mask.length < dimsU * dimsV) {
        mask = new Int32Array(dimsU * dimsV);
      }

      q[d] = 1;
      x[d] = -1;

      qdimsX = dimsX * q[1]
      qdimsXY = dimsXY * q[2]

      // Compute mask
      while (x[d] < dimsD) {
        xd = x[d]
        n = 0;

        for (x[v] = 0; x[v] < dimsV; ++x[v]) {
          for (x[u] = 0; x[u] < dimsU; ++x[u], ++n) {
            var a = xd >= 0 && f(x[0], x[1], x[2]),
              b = xd < dimsD - 1 && f(x[0] + q[0], x[1] + q[1], x[2] + q[2])
            if (a ? b : !b) {
              mask[n] = 0;
              continue;
            }

            flip = !a;

            index = d * 2;
            if (flip) {
              index++;
            }

            value = (a || b)[index];

            if (flip) {
              value *= -1;
            }

            mask[n] = value;
          }
        }

        ++x[d];

        // Generate mesh for mask using lexicographic ordering
        n = 0;
        for (j = 0; j < dimsV; ++j) {
          for (i = 0; i < dimsU;) {
            c = mask[n];
            if (!c) {
              i++;
              n++;
              continue;
            }

            //Compute width
            w = 1;
            while (c === mask[n + w] && i + w < dimsU) w++;

            //Compute height (this is slightly awkward)
            for (h = 1; j + h < dimsV; ++h) {
              k = 0;
              while (k < w && c === mask[n + k + h * dimsU]) k++
                if (k < w) break;
            }

            // Add quad
            // The du/dv arrays are reused/reset
            // for each iteration.
            du[d] = 0;
            dv[d] = 0;
            x[u] = i;
            x[v] = j;

            if (c > 0) {
              dv[v] = h;
              dv[u] = 0;
              du[u] = w;
              du[v] = 0;
            } else {
              c = -c;
              du[v] = h;
              du[u] = 0;
              dv[u] = w;
              dv[v] = 0;
            }
            var vertex_count = vertices.length;
            vertices.push([x[0], x[1], x[2]]);
            vertices.push([x[0] + du[0], x[1] + du[1], x[2] + du[2]]);
            vertices.push([x[0] + du[0] + dv[0], x[1] + du[1] + dv[1], x[2] + du[2] + dv[2]]);
            vertices.push([x[0] + dv[0], x[1] + dv[1], x[2] + dv[2]]);
            uvs.push(
              [
                [0, 0],
                [du[u], du[v]],
                [du[u] + dv[u], du[v] + dv[v]],
                [dv[u], dv[v]]
              ]);

            faces.push([vertex_count, vertex_count + 1, vertex_count + 2, vertex_count + 3, c]);

            //Zero-out mask
            W = n + w;
            for (l = 0; l < h; ++l) {
              for (k = n; k < W; ++k) {
                mask[k + l * dimsU] = 0;
              }
            }

            //Increment counters and continue
            i += w;
            n += w;
          }
        }
      }
    }
    return { vertices: vertices, faces: faces, uvs: uvs };
  }
})();

if (exports) {
  exports.mesher = GreedyMesh;
}

},{}],9:[function(require,module,exports){
var Voxel = {
  Chunk: require('./chunk'),
  Chunks: require('./chunks'),
  meshChunks: require('./meshchunks'),
  mesher: require('./mesher')
};

/**
 * Visit coordinates in a shape
 * @param  {Array} shape shape to visit
 * @param  {Function} callback callback function
 */
function visitShape(shape, callback) {
  for (var i = 0; i < shape[0]; i++) {
    for (var j = 0; j < shape[1]; j++) {
      for (var k = 0; k < shape[2]; k++) {
        callback(i, j, k);
      }
    }
  }
};

/**
 * Copy a chunk, optional, an offset can be applied
 * @param  {Chunks} from chunks to copy from
 * @param  {Chunks} to chunks to copy to
 * @param  {Vector3} offset optional offset to apply when copying
 */
function copyChunks(from, to, offset) {
  offset = offset || [0, 0, 0];
  from.visit(function(i, j, k, v) {
    to.set(i + offset[0], j + offset[1], k + offset[2], v);
  });
};

/**
 * Remove floating bits from a chunk
 * @param  {Chunks} chunks: chunks to process
 * @param  {Vector3} startCoord: coord to start search from, 
 * any coords not connected to startCoord will be removed
 */
function removeFloating(chunks, startCoord) {
  var map = {};
  chunks.visit(function(i, j, k, v) {
    var hash = [i, j, k].join(',');
    map[hash] = {
      visited: false,
      coord: [i, j, k]
    };
  });

  var leads = [startCoord];

  while (leads.length > 0) {
    var result = visit([1, 0, 0]) ||
      visit([0, 1, 0]) ||
      visit([0, 0, 1]) ||
      visit([-1, 0, 0]) ||
      visit([0, -1, 0]) ||
      visit([0, 0, -1]);

    if (!result) {
      leads.pop();
    }
  }

  var count = 0;
  for (var id in map) {
    if (!map[id].visited) {
      var coord = map[id].coord;
      chunks.set(coord[0], coord[1], coord[2], null);
    }
  }

  function visit(dis) {
    var current = leads[leads.length - 1];

    var next = [current[0] + dis[0],
      current[1] + dis[1],
      current[2] + dis[2]
    ];

    var hash = next.join(',');

    if (map[hash] == null) {
      return false;
    }

    if (map[hash].visited) {
      return false;
    }

    var v = chunks.get(next[0], next[1], next[2]);
    if (!!v) {
      map[hash].visited = true;
      leads.push(next);
      return true;
    }
  };
};

Voxel.visitShape = visitShape;
Voxel.copyChunks = copyChunks;
Voxel.removeFloating = removeFloating;

module.exports = Voxel;

/**
 * Callback for reading voxel data
 * @callback visitCallback
 * @param {Int} i i
 * @param {Int} j j
 * @param {Int} j j
 * @param {Object} value value at coord
 */

/**
 * Callback for getting voxel data
 * @callback queryFunction
 * @param {Int} i i
 * @param {Int} j j
 * @param {Int} k k
 * @return {Object} value stored at coord
 */
},{"./chunk":6,"./chunks":7,"./meshchunks":10,"./mesher":11}],10:[function(require,module,exports){
var mesher = require('./mesher');

/**
 * Mesh Chunks
 * @param  {Chunks} chunks chunks to mesh
 * @param  {THREE.Object3D} parent parent object to mesh in
 * @param  {THREE.Material} material material to use
 * @param  {Object} an object with key origin hash and value cached geometry, 
 * if an empty object is passed, it will be populated for next use
 */
module.exports = function(chunks, parent, material, cached) {
  for (var id in chunks.map) {
    var chunk = chunks.map[id];
    var data = chunk.chunk;
    if (chunk.dirty) {

      if (chunk.mesh != null) {
        chunk.mesh.parent.remove(chunk.mesh);
        chunk.mesh.geometry.dispose();
      }

      var origin = chunk.origin;

      var cachedGeometry = cached == null ? null : cached[id];
      var geometry = cachedGeometry || mesher(chunk.chunk);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.fromArray(chunk.origin);
      parent.add(mesh);

      if (cached != null) {
        cached[id] = geometry;
      }

      chunk.dirty = false;
      chunk.mesh = mesh;
    }
  }
}
},{"./mesher":11}],11:[function(require,module,exports){
var greedyMesher = require('./greedy').mesher;

/**
 * Mesh Chunk
 * @param {Chunk} chunk chunk to mesh
 * @param {queryFunction} f optional query function
 * @return {THREE.Geometry} meshed geometry
 */
module.exports = function(chunk, f) {
  var geometry = new THREE.Geometry();

  f = f || function(i, j, k) {
    return chunk.get(i, j, k);
  };
  var result = greedyMesher(f, chunk.shape);

  result.vertices.forEach(function(v) {
    var vertice = new THREE.Vector3(v[0], v[1], v[2]);
    geometry.vertices.push(vertice);
  });

  result.faces.forEach(function(f) {
    var face = new THREE.Face3(f[0], f[1], f[2]);
    face.materialIndex = f[4];
    geometry.faces.push(face);

    face = new THREE.Face3(f[2], f[3], f[0]);
    face.materialIndex = f[4];
    geometry.faces.push(face);
  });

  geometry.faceVertexUvs[0] = [];
  result.uvs.forEach(function(uv) {
    geometry.faceVertexUvs[0].push([
      new THREE.Vector2().fromArray(uv[0]),
      new THREE.Vector2().fromArray(uv[1]),
      new THREE.Vector2().fromArray(uv[2])
    ], [
      new THREE.Vector2().fromArray(uv[2]),
      new THREE.Vector2().fromArray(uv[3]),
      new THREE.Vector2().fromArray(uv[0])
    ]);
  });

  geometry.computeFaceNormals();

  return geometry;
};
},{"./greedy":8}],12:[function(require,module,exports){
var Dir = {};

Dir.LEFT = 0;
Dir.RIGHT = 1;
Dir.BOTTOM = 2;
Dir.UP = 3;
Dir.BACK = 4;
Dir.FRONT = 5;

Dir.getUnitVector = function(dir) {
  switch (dir) {
    case "0":
    case Dir.LEFT:
      return new THREE.Vector3(-1, 0, 0)
    case "1":
    case Dir.RIGHT:
      return new THREE.Vector3(1, 0, 0)
    case "2":
    case Dir.BOTTOM:
      return new THREE.Vector3(0, -1, 0)
    case "3":
    case Dir.UP:
      return new THREE.Vector3(0, 1, 0)
    case "4":
    case Dir.BACK:
      return new THREE.Vector3(0, 0, -1)
    case "5":
    case Dir.FRONT:
      return new THREE.Vector3(0, 0, 1)
  }
};

Dir.unitVectorToDir = function(unitVector) {
  if (unitVector.equals(new THREE.Vector3(-1, 0, 0))) {
    return Dir.LEFT;
  } else if (unitVector.equals(new THREE.Vector3(1, 0, 0))) {
    return Dir.RIGHT;
  } else if (unitVector.equals(new THREE.Vector3(0, -1, 0))) {
    return Dir.BOTTOM;
  } else if (unitVector.equals(new THREE.Vector3(0, 1, 0))) {
    return Dir.UP;
  } else if (unitVector.equals(new THREE.Vector3(0, 0, -1))) {
    return Dir.BACK;
  } else if (unitVector.equals(new THREE.Vector3(0, 0, 1))) {
    return Dir.FRONT;
  }
};

var getQuatResult = {};
Dir.getQuat = function(dir) {
  if (getQuatResult[dir] == null) {
    getQuatResult[dir] = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), Dir.getUnitVector(dir));
  }
  return getQuatResult[dir];
};

Dir.getOpposite = function(dir) {
  var opposites = {
    0: 1,
    1: 0,
    2: 3,
    3: 2,
    4: 5,
    5: 4
  };

  return opposites[dir];
};

Dir.isOpposite = function(dir, dir2) {
  return Dir.getOpposite(dir) === dir2;
};

Dir.isAdjacent = function(dir, dir2) {
  return dir !== dir2 && !this.isOpposite(dir, dir2);
};

module.exports = Dir;

},{}],13:[function(require,module,exports){
module.exports={
	"env": "dev"
}
},{}],14:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],15:[function(require,module,exports){
var SimplexNoise = require('simplex-noise');

var Dir = require('../dir');
var Voxel = require('voxel');
var mesher = Voxel.mesher;
var Chunks = Voxel.Chunks;
var meshChunks = Voxel.meshChunks;

var CLOUD = 10;

module.exports = function(size, parent, material) {

  var chunks = new Chunks();
  var dataMap = {};
  var object = new THREE.Object3D();
  parent.add(object);

  var noise1 = new SimplexNoise(Math.random);
  var noiseF1 = 0.1;
  var noise2 = new SimplexNoise(Math.random);
  var noiseF2 = 0.05;
  var noise_pressure = new SimplexNoise(Math.random);
  var noise_pressureF = 0.002;
  var cloudAmount = -1.0;
  var counter = 0;
  var cooldown = 4.2;

  var allCoords = {};

  var centerNum = (size / 2);
  var center = new THREE.Vector3(-size / 2, -size / 2, -size / 2);

  var cloudVoxel = [
    CLOUD, CLOUD, CLOUD, CLOUD, CLOUD, CLOUD
  ];

  initData();

  function initData() {
    var coord = [];

    for (var dir = 0; dir < 6; dir++) {
      var d = Math.floor(dir / 2);
      var u = (d + 1) % 3;
      var v = (d + 2) % 3;
      var coordD = dir % 2 ? 0 : size - 1;
      var fallDir = coordD === 0 ? 1 : -1;
      var fallCoordD = coordD + fallDir;

      for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
          coord[d] = coordD;
          coord[u] = i;
          coord[v] = j;

          var rel = [
            (coord[0] + center.x),
            (coord[1] + center.y),
            (coord[2] + center.z)
          ];

          var data = {
            pressure: noise_pressure.noise3D(
              rel[0] * noise_pressureF,
              rel[1] * noise_pressureF,
              rel[2] * noise_pressureF
            ),
            amount: 0,
            delta: 0,
            coord: [coord[0], coord[1], coord[2]]
          };

          var hash = coord.join(',');
          allCoords[hash] = [coord[0], coord[1], coord[2]];
          dataMap[hash] = data;

          var value = noise1.noise3D(
            rel[0] * noiseF1,
            rel[1] * noiseF1,
            rel[2] * noiseF1
          );

          var value2 = noise2.noise3D(
            rel[0] * noiseF2,
            rel[1] * noiseF2,
            rel[2] * noiseF2
          );

          value = Math.pow(value + value2, 1) + cloudAmount;

          if (value > 0.0) {
            chunks.set(coord[0], coord[1], coord[2], cloudVoxel);
            data.amount += 1;
          }

          data.neighbours = [];


          if (i === 0) {
            data.neighbours.push(getCoord(fallCoordD, i, j, d, u, v));
          } else {
            data.neighbours.push(getCoord(coordD, i - 1, j, d, u, v));
          }

          if (i === size - 1) {
            data.neighbours.push(getCoord(fallCoordD, i, j, d, u, v));
          } else {
            data.neighbours.push(getCoord(coordD, i + 1, j, d, u, v));
          }

          if (j === 0) {
            data.neighbours.push(getCoord(fallCoordD, i, j, d, u, v));
          } else {
            data.neighbours.push(getCoord(coordD, i, j - 1, d, u, v));
          }

          if (j === size - 1) {
            data.neighbours.push(getCoord(fallCoordD, i, j, d, u, v));
          } else {
            data.neighbours.push(getCoord(coordD, i, j + 1, d, u, v));
          }

          if (dir === 0) {
            data.nextCoord = data.neighbours[0];
          } else if (dir === 1) {
            data.nextCoord = data.neighbours[1];
          } else if (dir === 2) {
            data.nextCoord = data.neighbours[3];
          } else if (dir === 3) {
            data.nextCoord = data.neighbours[2];
          } else {
            var relI = i - centerNum;
            var relJ = j - centerNum;

            var angle = Math.atan2(relI, relJ);
            angle = normalizeAngle(angle);

            function normalizeAngle(angle) {
              angle %= (Math.PI * 2);
              if (angle < Math.PI) {
                angle += Math.PI / 2;
              } else if (angle > Math.PI) {
                angle -= Math.PI / 2;
              }
              return angle;
            };

            var offset = Math.PI / 4;
            var step = Math.PI / 2;
            var start = -Math.PI;

            if (angle >= offset && angle < offset + step) {
              data.nextCoord = data.neighbours[1];
            } else if (angle >= offset + step && angle < offset + step * 2) {
              data.nextCoord = data.neighbours[2];
            } else if (angle >= offset - step && angle < offset) {
              data.nextCoord = data.neighbours[3];
            } else {
              data.nextCoord = data.neighbours[0];
            }
          }
        }
      }
    }
  };

  function getCoord(i, j, k, d, u, v) {
    var coord = [];
    coord[d] = i;
    coord[u] = j;
    coord[v] = k;
    return coord;
  }

  updateMesh();

  object.position.copy(center);

  function tick(dt) {
    counter += dt;
    if (counter > cooldown) {
      counter -= cooldown;

      var changed = {};
      for (var id in allCoords) {
        var coord = allCoords[id];
        var data = dataMap[id];
        var nextCoord = data.nextCoord;
        if (nextCoord == null) {
          continue;
        }

        if (data.amount <= 0) {
          continue;
        }

        var nextHash = nextCoord.join(',');
        var nextData = dataMap[nextHash];
        changed[nextHash] = true;
        changed[id] = true;

        nextData.delta += 1.0;
        data.delta += -1.0;
      }

      for (var id in changed) {
        var data = dataMap[id];
        var coord = data.coord;
        data.amount += data.delta;
        data.delta = 0;

        if (data.amount >= 1.0) {
          chunks.set(coord[0], coord[1], coord[2], cloudVoxel);
        } else {
          chunks.set(coord[0], coord[1], coord[2], 0);
        }
      }

      updateMesh();
    }
  };

  function updateMesh() {
    meshChunks(chunks, object, material);
  };

  return {
    tick: tick
  };
}

},{"../dir":14,"simplex-noise":5,"voxel":9}],16:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var SimplexNoise = require('simplex-noise');

var Voxel = require('voxel');
var Dir = require('../../dir');
var SurfaceMap = require('./surfacemap');

var Chunks = Voxel.Chunks;
var meshChunks = Voxel.meshChunks;
var removeFloating = Voxel.removeFloating;

var GRASS = 1;
var SOIL = 2;
var SOIL_EDGE = 3;
var STONE = 4;
var SEA = 5;
var SAND = 6;

var LEVEL_SURFACE = 1;
var LEVEL_MIDDLE = 2;
var LEVEL_CORE = 3;

module.exports = function(size, parent, material) {
  var noise_surface = new SimplexNoise(Math.random);
  var noiseF_surface = 0.1;
  var noise_surface2 = new SimplexNoise(Math.random);
  var noiseF_surface2 = 0.04;

  var noise_biomes = new SimplexNoise(Math.random);
  var noise_biomes2 = new SimplexNoise(Math.random);
  var noise_biomes3 = new SimplexNoise(Math.random);

  var noise_biomes_trees = new SimplexNoise(Math.random);
  var noiseF_biomes_trees = 0.1;

  var noise_biomes_trees2 = new SimplexNoise(Math.random);
  var noiseF_biomes_trees2 = 0.04;

  var BIOME_VALUE_STONE = -0.8;
  var BIOME_VALUE_SOIL = 0;

  var surfaceMap = new SurfaceMap();

  var ground = new Chunks();
  var water = new Chunks();
  var bounds = {
    min: new THREE.Vector3(0, 0, 0),
    size: new THREE.Vector3(size, size, size)
  };

  var center = [-size / 2 + 0.5, -size / 2 + 0.5, -size / 2 + 0.5];
  var centerCoord = [
    Math.floor(size / 2),
    Math.floor(size / 2),
    Math.floor(size / 2)
  ];

  // hash -> data
  // gravity: gravity (s)
  // biome: biome data
  // height: height of surface
  var dataMap = {};
  var surfaceNum = 6;
  var seaLevel = 2;

  var pivot = new THREE.Object3D();
  var groundObject = new THREE.Object3D();

  function start() {
    init();
    generateGravityMap();
    generateBumps();
    removeFloating(ground, centerCoord);
    generateSea();
    generateBiomes();
    generateTiles();
    generateSurface();

    pivot.add(groundObject);
    meshChunks(ground, groundObject, material);
    meshChunks(water, pivot, material);

    var positionCenter = new THREE.Vector3()
      .subVectors(bounds.min, bounds.size)
      .multiplyScalar(0.5);
    pivot.position.copy(positionCenter);
    parent.add(pivot);
  };

  function init() {
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        for (var k = 0; k < size; k++) {
          ground.set(i, j, k, 1);
        }
      }
    }
  };

  function generateSea() {
    var coord = [];
    for (var d = 0; d < 3; d++) {
      var u = (d + 1) % 3;
      var v = (d + 2) % 3;
      [seaLevel, size - seaLevel - 1].forEach(function(c) {
        for (var i = seaLevel; i < size - seaLevel; i++) {
          for (var j = seaLevel; j < size - seaLevel; j++) {
            coord[d] = c;
            coord[u] = i;
            coord[v] = j;

            var data = getData(coord[0], coord[1], coord[2]);
            var gravity = data.gravity;

            var block = [
              0, 0, 0, 0, 0, 0
            ];

            for (var g in gravity) {
              block[g] = SEA;
            }

            if (!ground.get(coord[0], coord[1], coord[2])) {
              water.set(coord[0], coord[1], coord[2], block);
            }
          }
        }
      });
    }
  };

  function generateBiomes() {
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        for (var k = 0; k < size; k++) {
          var v = ground.get(i, j, k);
          if (!v) {
            continue;
          }

          var d = Math.max(
            Math.abs(i + center[0]),
            Math.abs(j + center[1]),
            Math.abs(k + center[2]));

          var relSeaLevel = (size / 2 - d - seaLevel - 0.5);

          d /= (size / 2);

          var noiseF = 0.05;
          var noiseF2 = 0.02;
          var noiseF3 = 0.02;

          var rel = [i + center[0], j + center[1], k + center[2]];
          var value = noise_biomes.noise3D(
            rel[0] * noiseF,
            rel[1] * noiseF,
            rel[2] * noiseF);

          var value2 = noise_biomes2.noise3D(
            rel[0] * noiseF2,
            rel[1] * noiseF2,
            rel[2] * noiseF2);

          var value3 = noise_biomes3.noise3D(
            rel[0] * noiseF3,
            rel[1] * noiseF3,
            rel[2] * noiseF3
          ) + value;

          value = value * 0.5 + value2 * 2.0;

          var biome = {
            value: value,
            value2: value3,
            relSeaLevel: relSeaLevel
          };

          var valueTree = noise_biomes_trees.noise3D(
            rel[0] * noiseF_biomes_trees,
            rel[1] * noiseF_biomes_trees,
            rel[2] * noiseF_biomes_trees
          ) + noise_biomes_trees2.noise3D(
            rel[0] * noiseF_biomes_trees2,
            rel[1] * noiseF_biomes_trees2,
            rel[2] * noiseF_biomes_trees2
          );

          // BIOME bias for tree
          if (value < BIOME_VALUE_STONE) {
            valueTree -= 1.0;
          } else if (value < BIOME_VALUE_SOIL) {
            valueTree -= 0.5;
          }

          biome.tree = valueTree;

          var level;

          if (d > 0.7) {
            // surface
            level = LEVEL_SURFACE;
          } else if (d > 0.3) {
            // middle
            level = LEVEL_MIDDLE;
          } else {
            // core
            level = LEVEL_CORE;
          }

          biome.level = level;

          var data = getData(i, j, k);
          data.biome = biome;
        }
      }
    }
  };

  function generateGravityMap() {
    var padding = 2;
    for (var i = -padding; i < size + padding; i++) {
      for (var j = -padding; j < size + padding; j++) {
        for (var k = -padding; k < size + padding; k++) {
          var map = {};
          var gravity = calcGravity(i, j, k);
          gravity.forEach(function(g) {
            map[g] = {
              dir: g
            };
          });
          var data = getData(i, j, k);
          data.gravity = map;
        }
      }
    }
  };

  function calcGravity(i, j, k) {
    var array = [
      i + center[0],
      j + center[1],
      k + center[2]
    ];
    var max = -Infinity;
    var indexes = [];
    var f;
    for (var d = 0; d < array.length; d++) {
      var a = Math.abs(array[d]);
      if (a > max) {
        max = a;
        f = d * 2 + (array[d] > 0 ? 0 : 1);
        indexes = [f];
      } else if (Math.abs(a - max) < 0.01) {
        f = d * 2 + (array[d] > 0 ? 0 : 1);
        indexes.push(f);
      }
    }
    return indexes;
  };

  function generateBumps() {
    // Generate surface

    var cRange = [];

    for (var i = 0; i < surfaceNum; i++) {
      cRange.push(0 + i, size - 1 - i);
    }

    var coord = [];
    for (var d = 0; d < 3; d++) {
      var u = (d + 1) % 3;
      var v = (d + 2) % 3;
      cRange.forEach(function(c) {
        for (var j = 0; j < size; j++) {
          for (var k = 0; k < size; k++) {

            var dis = Math.max(
              Math.abs(coord[0] + center[0]),
              Math.abs(coord[1] + center[1]),
              Math.abs(coord[2] + center[2])
            );

            var disBias = 1 - (size / 2 + 0.5 - dis) / surfaceNum;

            coord[d] = c;
            coord[u] = j;
            coord[v] = k;

            var offset = [0, 0, 0];
            var offset2 = [0, 0, 0];

            var value = noise_surface.noise3D(
              (coord[0] + center[0] + offset[0]) * noiseF_surface,
              (coord[1] + center[1] + offset[1]) * noiseF_surface,
              (coord[2] + center[2] + offset[2]) * noiseF_surface);

            var value2 = noise_surface2.noise3D(
              (coord[0] + center[0] + offset2[0]) * noiseF_surface2,
              (coord[1] + center[1] + offset2[1]) * noiseF_surface2,
              (coord[2] + center[2] + offset2[2]) * noiseF_surface2);

            value =
              (Math.pow(value2 / 1.5, 1) * disBias) +
              (-Math.pow(disBias, 1.0) * 1.0 + 0.6);

            if (value < 0.0) {
              var data = getData(coord[0], coord[1], coord[2]);
              data.height = value;
              ground.set(coord[0], coord[1], coord[2], 0);
            }
          }
        }
      });
    }
  };

  function generateSurface() {
    surfaceMap.update(self);
  };

  function isSurface(i, j, k, f) {
    var d = Math.floor(f / 2); // 0 1 2 
    var dd = (f - d * 2) ? -1 : 1; // -1 or 1

    var coord = [i, j, k];
    coord[d] += dd;

    return !ground.get(coord[0], coord[1], coord[2]) && !water.get(coord[0], coord[1], coord[2]);
  };

  function generateTiles() {
    var coord = [];
    // Generate grasses
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        for (var k = 0; k < size; k++) {
          var v = ground.get(i, j, k);
          if (!v) {
            continue;
          }

          ground.set(i, j, k, [
            get([i, j, k], 0),
            get([i, j, k], 1),
            get([i, j, k], 2),
            get([i, j, k], 3),
            get([i, j, k], 4),
            get([i, j, k], 5)
          ]);
        }
      }
    }

    function get(pos, f) {
      var d = Math.floor(f / 2); // 0 1 2
      var u = (d + 1) % 3;
      var v = (d + 2) % 3;

      var dd = (f - d * 2) ? -1 : 1; // -1 or 1

      coord[d] = pos[d] + dd;
      coord[u] = pos[u];
      coord[v] = pos[v];

      var data = getData(pos[0], pos[1], pos[2]);
      var biome = data.biome;

      var level = biome.level;
      var value = biome.value;

      if (level === LEVEL_SURFACE) {

        // If at sea level, generate sand
        if (biome.relSeaLevel === 0) {
          var data = getData(coord[0], coord[1], coord[2]);
          var height = data.height;
          if (biome.value2 * height < -0.1) {
            var above = ground.get(coord[0], coord[1], coord[2]);
            var isSurface = !above;
            if (isSurface) {
              return SAND;
            }
          }
        }

        if (value < BIOME_VALUE_STONE) {
          return STONE;
        } else if (value < BIOME_VALUE_SOIL) {
          return SOIL;
        }

        // On edge
        var gravity = data.gravity;
        if (gravity[f] != null && (biome.relSeaLevel <= 0)) {
          return GRASS;
        } else {
          return SOIL;
        }
      } else if (level === LEVEL_MIDDLE) {

      } else if (level === LEVEL_CORE) {

      }

      return STONE;
    };
  };

  function getData(i, j, k) {
    var hash = [i, j, k].join(',');
    if (dataMap[hash] == null) {
      dataMap[hash] = {};
    }
    return dataMap[hash];
  };

  var self = {
    ground: ground,
    water: water,
    bounds: bounds,
    object: pivot,
    calcGravity: calcGravity,
    surfaceMap: surfaceMap,
    groundObject: groundObject,
    getData: getData,
    isSurface: isSurface
  };

  start();

  return self;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../dir":14,"./surfacemap":17,"simplex-noise":5,"voxel":9}],17:[function(require,module,exports){
var Voxel = require('voxel');
var Dir = require('../../Dir');
var Chunks = Voxel.Chunks;
var Graph = require('node-dijkstra');

var SurfaceMap = function() {
  this.chunks = new Chunks();
  this.graphMap = {};
  this.graph = new Graph();
  this.lookup = {};
};

SurfaceMap.prototype.update = function(terrian) {
  var upVector = new THREE.Vector3(0, 1, 0);
  var centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
  var ground = terrian.ground;

  var self = this;
  ground.visit(function(i, j, k, v) {
    var data = terrian.getData(i, j, k);
    var surface = data.surface || {};
    var gravity = data.gravity;

    for (var f in gravity) {
      var result = terrian.isSurface(i, j, k, f);

      if (result) {
        var surfaces = self.chunks.get(i, j, k);
        if (surfaces == null) {
          surfaces = {};
          self.chunks.set(i, j, k, surfaces);
        }

        var unitVector = Dir.getUnitVector(f).multiplyScalar(-1);
        var positionAbove = new THREE.Vector3(i, j, k).add(unitVector).add(centerOffset);
        var quat = new THREE.Quaternion().setFromUnitVectors(upVector, unitVector);
        var inverseQuat = new THREE.Quaternion().setFromUnitVectors(unitVector, upVector);

        var hash = [i, j, k, f].join(',');
        surfaces[f] = {
          coord: [i, j, k],
          hash: hash,
          face: f,
          positionAbove: positionAbove,
          quat: quat,
          inverseQuat: inverseQuat,
          connections: {}
        }

        self.lookup[hash] = surfaces[f];
      }
    }
  });

  var self = this;
  this.visit(function(surface) {
    self.updateConnections(surface);
  });

  this.graph = new Graph(this.graphMap);
};

SurfaceMap.prototype.updateConnections = function(surface) {
  var coord = surface.coord;
  var f = surface.face;
  var d = Math.floor(surface.face / 2);
  var u = (d + 1) % 3;
  var v = (d + 2) % 3;

  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      for (var k = -1; k <= 1; k++) {
        var coord2 = [coord[0], coord[1], coord[2]];
        coord2[d] += i;
        coord2[u] += j;
        coord2[v] += k;
        var surfaces = this.getAt(coord2[0], coord2[1], coord2[2]);
        var forwardVector = new THREE.Vector3(0, 0, 1);

        for (var f2 in surfaces) {
          var surface2 = surfaces[f2];

          if (surface === surface2) {
            continue;
          }

          var disVector = surface2.positionAbove.clone().sub(surface.positionAbove);
          var dis = disVector.length();
          var quatVector = disVector.clone().normalize();
          var quatVectorArray = quatVector.toArray();
          quatVectorArray[d] = 0;
          quatVector
            .fromArray(quatVectorArray)
            .normalize()
            .applyQuaternion(surface.inverseQuat);

          if (dis < 2) {
            var quat = new THREE.Quaternion().setFromUnitVectors(
              forwardVector,
              quatVector);
            surface.connections[surface2.hash] = {
              surface: surface2,
              dis: dis,
              quat: quat
            };

            if (this.graphMap[surface.hash] == null) {
              this.graphMap[surface.hash] = {};
            }
            this.graphMap[surface.hash][surface2.hash] = dis;
          }
        }
      }
    }
  }
};

SurfaceMap.prototype.findShortest = function(surface, surface2, options) {
  var self = this;
  options = options || {
    getDistance: function(a, b) {
      var disDiffRatio = 10.0
      var surfaceA = self.getWithHash(a);
      var surfaceB = self.getWithHash(b);
      if (surfaceA.blocked || surfaceB.blocked) {
        return Infinity;
      }
      var dest = surface2;

      var dis = self.graphMap[a][b];

      var disDiff = (surfaceB.positionAbove.clone().distanceTo(dest.positionAbove)) -
        (surfaceA.positionAbove.clone().distanceTo(dest.positionAbove));

      return dis + disDiff * disDiffRatio;
    }
  }
  return this.graph.shortestPath(surface.hash, surface2.hash, options);
};

SurfaceMap.prototype.getAt = function(i, j, k) {
  return this.chunks.get(i, j, k) || {};
};

SurfaceMap.prototype.get = function(i, j, k, f) {
  return this.getAt(i, j, k)[f];
};

SurfaceMap.prototype.getWithHash = function(hash) {
  return this.lookup[hash];
};

SurfaceMap.prototype.visit = function(callback) {
  this.chunks.visit(function(i, j, k, v) {
    for (var f in v) {
      callback(v[f]);
    }
  });
};

module.exports = SurfaceMap;

},{"../../Dir":12,"node-dijkstra":2,"voxel":9}],18:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var Voxel = require('voxel');
var Dir = require('../../dir');

var Chunks = Voxel.Chunks;
var visitShape = Voxel.visitShape;
var meshChunks = Voxel.meshChunks;
var copyChunks = Voxel.copyChunks;
var removeFloating = Voxel.removeFloating;

var TRUNK = [20, 20, 20, 20, 20, 20];
var LEAF = [21, 21, 21, 21, 21, 21];

module.exports = function(parent, blockMaterial, terrian) {
  var chunks = new Chunks();

  var sparse = 0.2;
  var treeNum = 0.5;

  function add(coord, dir) {

    var chunks2 = require('./pine')(coord, dir);

    copyChunks(chunks2, chunks, coord.toArray());
    meshChunks(chunks, object, blockMaterial);
  };

  function start() {
    var inverseScale = 1 / self.scale;
    object.scale.set(self.scale, self.scale, self.scale);
    parent.add(object);

    terrian.surfaceMap.visit(function(surface) {
      var data = terrian.getData(surface.coord[0], surface.coord[1], surface.coord[2]);

      // No trees under sea level
      if (data.biome.relSeaLevel > 0) {
        return;
      }

      // How sparse trees should be
      if (Math.random() > sparse) {
        return;
      }

      if (data.biome.tree < treeNum) {
        return;
      }

      var f = Dir.getOpposite(surface.face);

      // Start from center of block, extend for half a block
      var coord =
        new THREE.Vector3(surface.coord[0], surface.coord[1], surface.coord[2])
        .add(new THREE.Vector3(0.5, 0.5, 0.5))
        .add(Dir.getUnitVector(f).multiplyScalar(0.5));

      // randomize uv coord
      var d = Math.floor(f / 2);
      var u = (d + 1) % 3;
      var v = (d + 2) % 3;

      var uv = [0, 0, 0];

      coord.add(new THREE.Vector3().fromArray(uv));

      // 1 tree per terrian grid
      coord.multiplyScalar(1 / self.scale);

      coord.x = Math.round(coord.x);
      coord.y = Math.round(coord.y);
      coord.z = Math.round(coord.z);

      var array = coord.toArray();
      array[u] -= Math.floor(Math.random() * inverseScale);
      array[v] -= Math.floor(Math.random() * inverseScale);
      coord.fromArray(array);

      add(coord, f);

      surface.blocked = true;
    });
  };

  var object = new THREE.Object3D();
  var self = {
    add: add,
    object: object,
    scale: (1 / 2.0)
  };

  start();

  return self;
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../dir":14,"./pine":19,"voxel":9}],19:[function(require,module,exports){
var Dir = require('../../dir');
var Voxel = require('voxel');
var Chunks = Voxel.Chunks;
var visitShape = Voxel.visitShape;
var removeFloating = Voxel.removeFloating;

var LEAF = [21, 21, 21, 21, 21, 21];
var TRUNK = [20, 20, 20, 20, 20, 20];

module.exports = function(coord, dir) {
  // Leaf height / width
  var shapeRatio = 2;
  // Density of leafs
  var density = 0.9;
  // Variable size
  var varSize = 3;
  // Base size
  var baseSize = 3;
  // Curve for variable size
  var varSizeCurve = 2.0;

  var ran = Math.random();
  var radius = Math.pow(ran, varSizeCurve) * varSize + baseSize;
  var shape2 = radius * shapeRatio;
  var leafHeight = ran < 0.5 ? 2 : 3;
  var trunkHeight = leafHeight + shape2 - 4;

  var radius = radius * Math.sqrt(2) / 2;

  if (dir == null) {
    var terrianCoord = coord.clone().multiplyScalar(self.scale);
    var gravity = terrian.calcGravity(terrianCoord.x, terrianCoord.y, terrianCoord.z);
    dir = Dir.getOpposite(gravity[Math.floor(gravity.length * Math.random())]);
  }

  var upVector = new THREE.Vector3(0, 1, 0);
  var unitVector = Dir.getUnitVector(dir);
  var quat = new THREE.Quaternion().setFromUnitVectors(upVector, unitVector);
  var d = Math.floor(dir / 2);
  var side = dir % 2 === 0;

  var leafShape = [radius, shape2, radius];

  var leafCenter = [
    Math.round(-leafShape[0] / 2),
    Math.round(-leafShape[1] / 2),
    Math.round(-leafShape[2] / 2)
  ];

  var chunks2 = new Chunks();

  for (var i = 0; i < trunkHeight; i++) {
    var c = new THREE.Vector3(0, i, 0).applyQuaternion(quat);
    if (side) {
      c.add(unitVector);
    }

    roundVector(c);
    chunks2.set(c.x, c.y, c.z, TRUNK);
  }

  visitShape(leafShape, function(i, j, k) {
    if (Math.random() > density) {
      return;
    }
    var c = new THREE.Vector3(
      leafCenter[0] + i,
      leafHeight + j,
      leafCenter[2] + k
    );

    var dis = Math.sqrt(c.x * c.x + c.z * c.z);
    var maxDis = (shape2 - j) / shape2 * radius;

    var diff = maxDis - dis;
    if (diff < 0.0) {
      return;
    }

    if (diff < 0.5) {
      return;
    }

    c.applyQuaternion(quat);

    roundVector(c);

    if (side) {
      c.add(unitVector);
    }

    chunks2.set(c.x, c.y, c.z, LEAF);
  });

  removeFloating(chunks2, [0, 0, 0]);

  return chunks2;
};

function roundVector(v) {
  v.x = Math.round(v.x);
  v.y = Math.round(v.y);
  v.z = Math.round(v.z);
  return v;
};

},{"../../dir":14,"voxel":9}],20:[function(require,module,exports){
module.exports = function() {
  
  var textureLoader = new THREE.TextureLoader();

  // Materials, Textures
  var blockMaterial = new THREE.MultiMaterial();
  blockMaterial.materials = [null];
  var blockTextures = [];

  function loadAll() {
    loadBlockMaterial('grass', 1);
    loadBlockMaterial('soil', 2);
    loadBlockMaterial('soil2', 3);
    loadBlockMaterial('stone', 4);
    loadBlockMaterial('sea', 5, 0.8);
    loadBlockMaterial('sand', 6);
    loadBlockMaterial('wall', 7);

    loadBlockMaterial('window', 8, 0.8);

    loadBlockMaterial('cloud', 10, 0.7);

    loadBlockMaterial('trunk', 20);
    loadBlockMaterial('leaf', 21);

    loadBlockMaterial('glow', 30, null);
  };

  function loadBlockMaterial(name, index, alpha) {
    var texture = textureLoader.load('textures/' + name + '.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    blockTextures.push(texture);

    var m = new THREE.MeshBasicMaterial({
      map: texture
    });

    if (alpha != null) {
      m.transparent = true;
      m.opacity = alpha;
    }

    blockMaterial.materials[index] = m;

    return m;
  };

  loadAll();

  return blockMaterial;
};

},{}],21:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var keycode = require('keycode');
var config = require('../config');
var app = {};
var env = config.env || 'production';

module.exports = function() {

  var self = {};

  // Size
  var size = 32;

  var scene = require('./scene')(size, env);
  var camera = scene.camera;
  var object = scene.object;

  var blockMaterial = require('./blockMaterial')();

  var entities = [];

  // frame time
  var dt = 1 / 60;

  var input = require('./input')(self, camera, object);

  var cloud = require('../entities/cloud')(size + 11, object, blockMaterial);
  entities.push(cloud);
  var terrian = require('../entities/terrian')(size, object, blockMaterial);
  var tree = require('../entities/tree')(terrian.object, blockMaterial, terrian);

  function animate() {
    input.tick(dt);
    entities.forEach(function(entity) {
      entity.tick(dt);
    });
    scene.render();
    requestAnimationFrame(animate);
  };

  function start() {
    scene.start();
    animate();
  };

  function zoom(ratio) {
    camera.fov *= ratio;
    camera.updateProjectionMatrix();
  };

  self.start = start;
  self.zoom = zoom;
  self.terrian = terrian;

  return self;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../config":13,"../entities/cloud":15,"../entities/terrian":16,"../entities/tree":18,"./blockMaterial":20,"./input":22,"./scene":23,"keycode":1}],22:[function(require,module,exports){
var keycode = require('keycode');
var Dir = require('../dir');

module.exports = function(game, camera, object) {

  var zoomSpeed = 1.1;
  // Input states
  var keyholds = {};
  var mouse = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  var raycasterDir;

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('mouseup', onMouseUp, false);
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);

  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position  
    raycaster.setFromCamera(mouse, camera);
    raycasterDir = raycaster.ray.direction.clone();
  };

  function onMouseDown(event) {
    var terrian = game.terrian;
    if (terrian == null) {
      return;
    }

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObject(terrian.object, true);
    if (intersects.length === 0) {
      return;
    }

    var point = intersects[0].point.clone()
      .add(raycasterDir.clone().multiplyScalar(-0.01));

    var localPoint = terrian.object.worldToLocal(point);
    var coord = new THREE.Vector3(
      Math.floor(localPoint.x),
      Math.floor(localPoint.y),
      Math.floor(localPoint.z)
    );

    var point2 = intersects[0].point.clone()
      .add(raycasterDir.clone().multiplyScalar(0.01));
    var localPoint2 = terrian.object.worldToLocal(point2);
    var coord2 = new THREE.Vector3(
      Math.floor(localPoint2.x),
      Math.floor(localPoint2.y),
      Math.floor(localPoint2.z)
    );

    var unitVector = coord2.clone().sub(coord);
    var f = Dir.unitVectorToDir(unitVector);
    if (f != null) {
      onClickedSurface(event, coord2, f);
    }
  };

  function onClickedSurface(event, coord, f) {

  };

  function onMouseUp(event) {

  };

  function onKeyDown(e) {
    var key = keycode(e);
    keyholds[key] = true;

    if (key === '=') {
      game.zoom(1 / zoomSpeed);
    }

    if (key === '-') {
      game.zoom(zoomSpeed);
    }
  };

  function onKeyUp(e) {
    var key = keycode(e);
    keyholds[key] = false;
  };

  function tick(dt) {
    var cameraUp = new THREE.Vector3(0, 1, 0);
    var cameraDir = new THREE.Vector3(0, 0, 1).applyEuler(camera.rotation);
    var cameraRight = new THREE.Vector3().crossVectors(cameraUp, cameraDir);
    
    var rotateY = 0;
    if (keyholds['right']) {
      rotateY -= 0.1;
    } else if (keyholds['left']) {
      rotateY += 0.1;
    }

    var quatInverse = object.quaternion.clone().inverse();
    var axis = cameraUp.clone().applyQuaternion(quatInverse).normalize();
    object.quaternion
      .multiply(new THREE.Quaternion().setFromAxisAngle(axis, rotateY));

    var rotateX = 0;
    if (keyholds['up']) {
      rotateX -= 0.1;
    } else if (keyholds['down']) {
      rotateX += 0.1;
    }

    axis = cameraRight.clone().applyQuaternion(quatInverse).normalize();
    object.quaternion
      .multiply(new THREE.Quaternion().setFromAxisAngle(axis, rotateX));
  };

  return {
    tick: tick
  };
};

},{"../dir":14,"keycode":1}],23:[function(require,module,exports){
module.exports = function(size, env) {
  
  if (env === 'dev') {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  // Objects
  var object = new THREE.Object3D();

  var modelSize = 5;
  var disScale = 1.2 * modelSize;

  // Post processing setting
  var postprocessing = { enabled: true, renderMode: 0 };

  // Renderer, scene, camera
  var renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xBBD9F7);

  var scene = new THREE.Scene();
  var fov = 60;
  var camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight,
    0.1, 1000);

  // Post processing
  var depthMaterial;
  var depthRenderTarget;
  var ssaoPass;
  var effectComposer;
  var finalComposer;

  var textures = {};

  function initPostprocessing() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    // Setup render pass
    var renderPass = new THREE.RenderPass(scene, camera);

    // Setup depth pass
    depthMaterial = new THREE.MeshDepthMaterial();
    depthMaterial.depthPacking = THREE.RGBADepthPacking;
    depthMaterial.blending = THREE.NoBlending;

    var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
    depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);

    // Setup SSAO pass
    ssaoPass = new THREE.ShaderPass(THREE.SSAOShader);

    //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
    ssaoPass.uniforms["tDepth"].value = depthRenderTarget.texture;
    ssaoPass.uniforms['size'].value.set(window.innerWidth, window.innerHeight);
    ssaoPass.uniforms['cameraNear'].value = camera.near;
    ssaoPass.uniforms['cameraFar'].value = camera.far;
    ssaoPass.uniforms['onlyAO'].value = (postprocessing.renderMode == 1);
    ssaoPass.uniforms['aoClamp'].value = 100.0;
    ssaoPass.uniforms['lumInfluence'].value = 0.7;
    ssaoPass.renderToScreen = true;

    // Add pass to effect composer
    effectComposer = new THREE.EffectComposer(renderer);
    effectComposer.addPass(renderPass);
    effectComposer.addPass(ssaoPass);
  };


  window.addEventListener('resize', onWindowResize);

  function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Resize renderTargets
    ssaoPass.uniforms['size'].value.set(width, height);

    var pixelRatio = renderer.getPixelRatio();
    var newWidth = Math.floor(width / pixelRatio) || 1;
    var newHeight = Math.floor(height / pixelRatio) || 1;
    depthRenderTarget.setSize(newWidth, newHeight);
    effectComposer.setSize(newWidth, newHeight);
  };

  function initScene() {
    var dis = size * disScale;
    camera.position.x = dis;
    camera.position.y = dis;
    camera.position.z = dis;
    camera.lookAt(new THREE.Vector3());

    object.scale.set(modelSize, modelSize, modelSize);
    scene.add(object);
    var ambientLight = new THREE.AmbientLight(0x888888);
    object.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0.3, 1.0, 0.5);
    object.add(directionalLight);

    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight2.position.set(-0.3, -1.0, -0.5);
    object.add(directionalLight2);
  };

  function render() {
    if (env === 'dev') {
      stats.begin();
    }

    if (postprocessing.enabled) {
      // Render depth into depthRenderTarget
      scene.overrideMaterial = depthMaterial;
      renderer.render(scene, camera, depthRenderTarget, true);
      scene.overrideMaterial = null;

      effectComposer.render();
    } else {
      renderer.render(scene, camera);
    }

    if (env === 'dev') {
      stats.end();
    }
  };

  function start() {
    initPostprocessing();
    initScene();
  };

  return {
    start: start,
    render: render,
    camera: camera,
    object: object
  }
};

},{}],24:[function(require,module,exports){
var game = require('./game')();
game.start();

},{"./game":21}]},{},[24])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva2V5Y29kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWRpamtzdHJhL2dyYXBoLmpzIiwibm9kZV9tb2R1bGVzL25vZGUtZGlqa3N0cmEvbGlicy9xdWV1ZS5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWRpamtzdHJhL25vZGVfbW9kdWxlcy8xMDEvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZXgtbm9pc2Uvc2ltcGxleC1ub2lzZS5qcyIsIm5vZGVfbW9kdWxlcy92b3hlbC9jaHVuay5qcyIsIm5vZGVfbW9kdWxlcy92b3hlbC9jaHVua3MuanMiLCJub2RlX21vZHVsZXMvdm94ZWwvZ3JlZWR5LmpzIiwibm9kZV9tb2R1bGVzL3ZveGVsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ZveGVsL21lc2hjaHVua3MuanMiLCJub2RlX21vZHVsZXMvdm94ZWwvbWVzaGVyLmpzIiwic3JjL0Rpci5qcyIsInNyYy9jb25maWcuanNvbiIsInNyYy9lbnRpdGllcy9jbG91ZC5qcyIsInNyYy9lbnRpdGllcy90ZXJyaWFuL2luZGV4LmpzIiwic3JjL2VudGl0aWVzL3RlcnJpYW4vc3VyZmFjZW1hcC5qcyIsInNyYy9lbnRpdGllcy90cmVlL2luZGV4LmpzIiwic3JjL2VudGl0aWVzL3RyZWUvcGluZS5qcyIsInNyYy9nYW1lL2Jsb2NrTWF0ZXJpYWwuanMiLCJzcmMvZ2FtZS9pbmRleC5qcyIsInNyYy9nYW1lL2lucHV0LmpzIiwic3JjL2dhbWUvc2NlbmUuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7Ozs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFNvdXJjZTogaHR0cDovL2pzZmlkZGxlLm5ldC92V3g4Vi9cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYwMzE5NS9mdWxsLWxpc3Qtb2YtamF2YXNjcmlwdC1rZXljb2Rlc1xuXG4vKipcbiAqIENvbmVuaWVuY2UgbWV0aG9kIHJldHVybnMgY29ycmVzcG9uZGluZyB2YWx1ZSBmb3IgZ2l2ZW4ga2V5TmFtZSBvciBrZXlDb2RlLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IGtleUNvZGUge051bWJlcn0gb3Iga2V5TmFtZSB7U3RyaW5nfVxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlYXJjaElucHV0KSB7XG4gIC8vIEtleWJvYXJkIEV2ZW50c1xuICBpZiAoc2VhcmNoSW5wdXQgJiYgJ29iamVjdCcgPT09IHR5cGVvZiBzZWFyY2hJbnB1dCkge1xuICAgIHZhciBoYXNLZXlDb2RlID0gc2VhcmNoSW5wdXQud2hpY2ggfHwgc2VhcmNoSW5wdXQua2V5Q29kZSB8fCBzZWFyY2hJbnB1dC5jaGFyQ29kZVxuICAgIGlmIChoYXNLZXlDb2RlKSBzZWFyY2hJbnB1dCA9IGhhc0tleUNvZGVcbiAgfVxuXG4gIC8vIE51bWJlcnNcbiAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc2VhcmNoSW5wdXQpIHJldHVybiBuYW1lc1tzZWFyY2hJbnB1dF1cblxuICAvLyBFdmVyeXRoaW5nIGVsc2UgKGNhc3QgdG8gc3RyaW5nKVxuICB2YXIgc2VhcmNoID0gU3RyaW5nKHNlYXJjaElucHV0KVxuXG4gIC8vIGNoZWNrIGNvZGVzXG4gIHZhciBmb3VuZE5hbWVkS2V5ID0gY29kZXNbc2VhcmNoLnRvTG93ZXJDYXNlKCldXG4gIGlmIChmb3VuZE5hbWVkS2V5KSByZXR1cm4gZm91bmROYW1lZEtleVxuXG4gIC8vIGNoZWNrIGFsaWFzZXNcbiAgdmFyIGZvdW5kTmFtZWRLZXkgPSBhbGlhc2VzW3NlYXJjaC50b0xvd2VyQ2FzZSgpXVxuICBpZiAoZm91bmROYW1lZEtleSkgcmV0dXJuIGZvdW5kTmFtZWRLZXlcblxuICAvLyB3ZWlyZCBjaGFyYWN0ZXI/XG4gIGlmIChzZWFyY2gubGVuZ3RoID09PSAxKSByZXR1cm4gc2VhcmNoLmNoYXJDb2RlQXQoMClcblxuICByZXR1cm4gdW5kZWZpbmVkXG59XG5cbi8qKlxuICogR2V0IGJ5IG5hbWVcbiAqXG4gKiAgIGV4cG9ydHMuY29kZVsnZW50ZXInXSAvLyA9PiAxM1xuICovXG5cbnZhciBjb2RlcyA9IGV4cG9ydHMuY29kZSA9IGV4cG9ydHMuY29kZXMgPSB7XG4gICdiYWNrc3BhY2UnOiA4LFxuICAndGFiJzogOSxcbiAgJ2VudGVyJzogMTMsXG4gICdzaGlmdCc6IDE2LFxuICAnY3RybCc6IDE3LFxuICAnYWx0JzogMTgsXG4gICdwYXVzZS9icmVhayc6IDE5LFxuICAnY2FwcyBsb2NrJzogMjAsXG4gICdlc2MnOiAyNyxcbiAgJ3NwYWNlJzogMzIsXG4gICdwYWdlIHVwJzogMzMsXG4gICdwYWdlIGRvd24nOiAzNCxcbiAgJ2VuZCc6IDM1LFxuICAnaG9tZSc6IDM2LFxuICAnbGVmdCc6IDM3LFxuICAndXAnOiAzOCxcbiAgJ3JpZ2h0JzogMzksXG4gICdkb3duJzogNDAsXG4gICdpbnNlcnQnOiA0NSxcbiAgJ2RlbGV0ZSc6IDQ2LFxuICAnY29tbWFuZCc6IDkxLFxuICAnbGVmdCBjb21tYW5kJzogOTEsXG4gICdyaWdodCBjb21tYW5kJzogOTMsXG4gICdudW1wYWQgKic6IDEwNixcbiAgJ251bXBhZCArJzogMTA3LFxuICAnbnVtcGFkIC0nOiAxMDksXG4gICdudW1wYWQgLic6IDExMCxcbiAgJ251bXBhZCAvJzogMTExLFxuICAnbnVtIGxvY2snOiAxNDQsXG4gICdzY3JvbGwgbG9jayc6IDE0NSxcbiAgJ215IGNvbXB1dGVyJzogMTgyLFxuICAnbXkgY2FsY3VsYXRvcic6IDE4MyxcbiAgJzsnOiAxODYsXG4gICc9JzogMTg3LFxuICAnLCc6IDE4OCxcbiAgJy0nOiAxODksXG4gICcuJzogMTkwLFxuICAnLyc6IDE5MSxcbiAgJ2AnOiAxOTIsXG4gICdbJzogMjE5LFxuICAnXFxcXCc6IDIyMCxcbiAgJ10nOiAyMjEsXG4gIFwiJ1wiOiAyMjJcbn1cblxuLy8gSGVscGVyIGFsaWFzZXNcblxudmFyIGFsaWFzZXMgPSBleHBvcnRzLmFsaWFzZXMgPSB7XG4gICd3aW5kb3dzJzogOTEsXG4gICfih6cnOiAxNixcbiAgJ+KMpSc6IDE4LFxuICAn4oyDJzogMTcsXG4gICfijJgnOiA5MSxcbiAgJ2N0bCc6IDE3LFxuICAnY29udHJvbCc6IDE3LFxuICAnb3B0aW9uJzogMTgsXG4gICdwYXVzZSc6IDE5LFxuICAnYnJlYWsnOiAxOSxcbiAgJ2NhcHMnOiAyMCxcbiAgJ3JldHVybic6IDEzLFxuICAnZXNjYXBlJzogMjcsXG4gICdzcGMnOiAzMixcbiAgJ3BndXAnOiAzMyxcbiAgJ3BnZG4nOiAzNCxcbiAgJ2lucyc6IDQ1LFxuICAnZGVsJzogNDYsXG4gICdjbWQnOiA5MVxufVxuXG5cbi8qIVxuICogUHJvZ3JhbWF0aWNhbGx5IGFkZCB0aGUgZm9sbG93aW5nXG4gKi9cblxuLy8gbG93ZXIgY2FzZSBjaGFyc1xuZm9yIChpID0gOTc7IGkgPCAxMjM7IGkrKykgY29kZXNbU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpIC0gMzJcblxuLy8gbnVtYmVyc1xuZm9yICh2YXIgaSA9IDQ4OyBpIDwgNTg7IGkrKykgY29kZXNbaSAtIDQ4XSA9IGlcblxuLy8gZnVuY3Rpb24ga2V5c1xuZm9yIChpID0gMTsgaSA8IDEzOyBpKyspIGNvZGVzWydmJytpXSA9IGkgKyAxMTFcblxuLy8gbnVtcGFkIGtleXNcbmZvciAoaSA9IDA7IGkgPCAxMDsgaSsrKSBjb2Rlc1snbnVtcGFkICcraV0gPSBpICsgOTZcblxuLyoqXG4gKiBHZXQgYnkgY29kZVxuICpcbiAqICAgZXhwb3J0cy5uYW1lWzEzXSAvLyA9PiAnRW50ZXInXG4gKi9cblxudmFyIG5hbWVzID0gZXhwb3J0cy5uYW1lcyA9IGV4cG9ydHMudGl0bGUgPSB7fSAvLyB0aXRsZSBmb3IgYmFja3dhcmQgY29tcGF0XG5cbi8vIENyZWF0ZSByZXZlcnNlIG1hcHBpbmdcbmZvciAoaSBpbiBjb2RlcykgbmFtZXNbY29kZXNbaV1dID0gaVxuXG4vLyBBZGQgYWxpYXNlc1xuZm9yICh2YXIgYWxpYXMgaW4gYWxpYXNlcykge1xuICBjb2Rlc1thbGlhc10gPSBhbGlhc2VzW2FsaWFzXVxufVxuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJzEwMS9hc3NpZ24nKTtcbnZhciBQcmlvcml0eVF1ZXVlID0gcmVxdWlyZSgnLi9saWJzL3F1ZXVlJyk7XG5cbi8vIGNvc3RydWN0XG52YXIgR3JhcGggPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICAvLyB5b3UgY2FuIGVpdGhlciBwYXNzIGEgdmVydGljaWVzIG9iamVjdCBvciBhZGQgZXZlcnlcbiAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzIHx8IHt9O1xufVxuXG5hc3NpZ24oR3JhcGgucHJvdG90eXBlLCB7XG4gIC8vIGFkZCBhIHZlcnRleCB0byB0aGUgZ3JhcGhcbiAgYWRkVmVydGV4OiBmdW5jdGlvbihuYW1lLCBlZGdlcykge1xuICAgIHRoaXMudmVydGljZXNbbmFtZV0gPSBlZGdlcztcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvLyBjb21wdXRlIHRoZSBwYXRoXG4gIHNob3J0ZXN0UGF0aDogZnVuY3Rpb24oc3RhcnQsIGZpbmlzaCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGdldERpc3RhbmNlID0gb3B0aW9ucy5nZXREaXN0YW5jZTtcblxuICAgIHRoaXMubm9kZXMgPSBuZXcgUHJpb3JpdHlRdWV1ZSgpO1xuICAgIHRoaXMuZGlzdGFuY2VzID0ge307XG4gICAgdGhpcy5wcmV2aW91cyA9IHt9O1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmZpbmlzaCA9IGZpbmlzaDtcblxuICAgIC8vIFNldCB0aGUgc3RhcnRpbmcgdmFsdWVzIGZvciBkaXN0YW5jZXNcbiAgICB0aGlzLnNldEJhc2VsaW5lLmNhbGwodGhpcyk7XG5cbiAgICAvLyBsb29wIHVudGlsIHdlIGNoZWNrZWQgZXZlcnkgbm9kZSBpbiB0aGUgcXVldWVcbiAgICB2YXIgc21hbGxlc3Q7XG4gICAgdmFyIHBhdGggPSBbXTtcbiAgICB2YXIgYWx0O1xuICAgIHdoaWxlICghdGhpcy5ub2Rlcy5pc0VtcHR5KCkpIHtcbiAgICAgIHNtYWxsZXN0ID0gdGhpcy5ub2Rlcy5kZXF1ZXVlKCk7XG5cbiAgICAgIGlmIChzbWFsbGVzdCA9PT0gZmluaXNoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLnByZXZpb3VzW3NtYWxsZXN0XSkge1xuICAgICAgICAgIHBhdGgucHVzaChzbWFsbGVzdCk7XG4gICAgICAgICAgc21hbGxlc3QgPSB0aGlzLnByZXZpb3VzW3NtYWxsZXN0XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNtYWxsZXN0IHx8IHRoaXMuZGlzdGFuY2VzW3NtYWxsZXN0XSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIG5laWdoYm9yIGluIHRoaXMudmVydGljZXNbc21hbGxlc3RdKSB7XG4gICAgICAgIGFsdCA9IHRoaXMuZGlzdGFuY2VzW3NtYWxsZXN0XSArIGdldERpc3RhbmNlKHNtYWxsZXN0LCBuZWlnaGJvcik7XG5cbiAgICAgICAgaWYgKGFsdCA8IHRoaXMuZGlzdGFuY2VzW25laWdoYm9yXSkge1xuICAgICAgICAgIHRoaXMuZGlzdGFuY2VzW25laWdoYm9yXSA9IGFsdDtcbiAgICAgICAgICB0aGlzLnByZXZpb3VzW25laWdoYm9yXSA9IHNtYWxsZXN0O1xuXG4gICAgICAgICAgdGhpcy5ub2Rlcy5lbnF1ZXVlKGFsdCwgbmVpZ2hib3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhdGgubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudHJpbSkge1xuICAgICAgcGF0aC5zaGlmdCgpXG4gICAgICAgIC8vIGBwYXRoYCBpcyBnZW5lcmF0ZWQgaW4gcmV2ZXJzZSBvcmRlclxuICAgICAgaWYgKG9wdGlvbnMucmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXRoLnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICBwYXRoID0gcGF0aC5jb25jYXQoW3N0YXJ0XSk7XG4gICAgaWYgKG9wdGlvbnMucmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuICAgIHJldHVybiBwYXRoLnJldmVyc2UoKTtcbiAgfSxcblxuICAvLyBzZXQgdGhlIHN0YXJ0aW5nIHBvaW50IHRvIDAgYW5kIGFsbCB0aGUgb3RoZXJzIHRvIGluZmluaXRlXG4gIHNldEJhc2VsaW5lOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmVydGV4O1xuICAgIGZvciAodmVydGV4IGluIHRoaXMudmVydGljZXMpIHtcbiAgICAgIGlmICh2ZXJ0ZXggPT09IHRoaXMuc3RhcnQpIHtcbiAgICAgICAgdGhpcy5kaXN0YW5jZXNbdmVydGV4XSA9IDA7XG4gICAgICAgIHRoaXMubm9kZXMuZW5xdWV1ZSgwLCB2ZXJ0ZXgsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXN0YW5jZXNbdmVydGV4XSA9IEluZmluaXR5O1xuICAgICAgICB0aGlzLm5vZGVzLmVucXVldWUoSW5maW5pdHksIHZlcnRleCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJldmlvdXNbdmVydGV4XSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5ub2Rlcy5zb3J0KCk7XG4gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR3JhcGg7XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnMTAxL2Fzc2lnbicpO1xuXG4vLyBQcmlvcml0eSBRdWV1ZVxuLy8gLS0tLS0tLS0tLS0tLS1cblxuLy8gYmFzaWMgcHJpb3JpdHkgcXVldWUgaW1wbGVtZW50YXRpb25cbnZhciBQcmlvcml0eVF1ZXVlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubm9kZXMgPSBbXTtcbn1cblxuYXNzaWduKFByaW9yaXR5UXVldWUucHJvdG90eXBlLCB7XG5cbiAgZW5xdWV1ZTogZnVuY3Rpb24ocHJpb3JpdHksIGtleSwgc2tpcFNvcnQpIHtcbiAgICB0aGlzLm5vZGVzLnB1c2goe2tleToga2V5LCBwcmlvcml0eTogcHJpb3JpdHl9KTtcbiAgICBpZihza2lwU29ydCAhPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5zb3J0LmNhbGwodGhpcyk7ICBcbiAgICB9XG4gIH0sXG5cbiAgZGVxdWV1ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXMuc2hpZnQoKS5rZXk7XG4gIH0sXG5cbiAgc29ydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5ub2Rlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eTtcbiAgICB9KTtcbiAgfSxcblxuICBpc0VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gIXRoaXMubm9kZXMubGVuZ3RoO1xuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByaW9yaXR5UXVldWU7XG4iLCIvKipcbiAqIEBtb2R1bGUgMTAxL2Fzc2lnblxuICovXG5cbi8qKlxuICogQ29waWVzIGVudW1lcmFibGUgYW5kIG93biBwcm9wZXJ0aWVzIGZyb20gYSBzb3VyY2Ugb2JqZWN0KHMpIHRvIGEgdGFyZ2V0IG9iamVjdCwgYWthIGV4dGVuZC5cbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbiAqIEkgYWRkZWQgZnVuY3Rpb25hbGl0eSB0byBzdXBwb3J0IGFzc2lnbiBhcyBhIHBhcnRpYWwgZnVuY3Rpb25cbiAqIEBmdW5jdGlvbiBtb2R1bGU6MTAxL2Fzc2lnblxuICogQHBhcmFtIHtvYmplY3R9IFt0YXJnZXRdIC0gb2JqZWN0IHdoaWNoIHNvdXJjZSBvYmplY3RzIGFyZSBleHRlbmRpbmcgKGJlaW5nIGFzc2lnbmVkIHRvKVxuICogQHBhcmFtIHtvYmplY3R9IHNvdXJjZXMuLi4gLSBvYmplY3RzIHdob3NlIHByb3BlcnRpZXMgYXJlIGJlaW5nIGFzc2lnbmVkIHRvIHRoZSBzb3VyY2Ugb2JqZWN0XG4gKiBAcmV0dXJuIHtvYmplY3R9IHNvdXJjZSB3aXRoIGV4dGVuZGVkIHByb3BlcnRpZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ247XG5cbmZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0LCBmaXJzdFNvdXJjZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIGZpcnN0U291cmNlID0gYXJndW1lbnRzWzBdO1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gYXNzaWduKHRhcmdldCwgZmlyc3RTb3VyY2UpO1xuICAgIH07XG4gIH1cbiAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbClcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBmaXJzdCBhcmd1bWVudCB0byBvYmplY3QnKTtcbiAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKG5leHRTb3VyY2UgPT09IHVuZGVmaW5lZCB8fCBuZXh0U291cmNlID09PSBudWxsKSBjb250aW51ZTtcbiAgICB2YXIga2V5c0FycmF5ID0gT2JqZWN0LmtleXMoT2JqZWN0KG5leHRTb3VyY2UpKTtcbiAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICB2YXIgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcbiAgICAgIC8vIEkgY2hhbmdlZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8gZ2V0IDEwMCUgdGVzdCBjb3ZlcmFnZS5cbiAgICAgIC8vIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlKSB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAvLyBJIHdhcyB1bmFibGUgdG8gZmluZCBhIHNjZW5hcmlvIHdoZXJlIGRlc2Mgd2FzIHVuZGVmaW5lZCBvciB0aGF0IGRlc2MuZW51bWVyYWJsZSB3YXMgZmFsc2U6XG4gICAgICAvLyAgIDEpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBkb2VzIG5vdCBhY2NlcHQgdW5kZWZpbmVkIGFzIGEgZGVzY1xuICAgICAgLy8gICAyKSBPYmplY3Qua2V5cyBkb2VzIG5vdCByZXR1cm4gbm9uLWVudW1lcmFibGUga2V5cy5cbiAgICAgIC8vIExldCBtZSBrbm93IGlmIHRoaXMgaXMgYSBjcm9zcyBicm93c2VyIHRoaW5nLlxuICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdG87XG59IiwiLypcbiAqIEEgZmFzdCBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHNpbXBsZXggbm9pc2UgYnkgSm9uYXMgV2FnbmVyXG4gKlxuICogQmFzZWQgb24gYSBzcGVlZC1pbXByb3ZlZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobSBmb3IgMkQsIDNEIGFuZCA0RCBpbiBKYXZhLlxuICogV2hpY2ggaXMgYmFzZWQgb24gZXhhbXBsZSBjb2RlIGJ5IFN0ZWZhbiBHdXN0YXZzb24gKHN0ZWd1QGl0bi5saXUuc2UpLlxuICogV2l0aCBPcHRpbWlzYXRpb25zIGJ5IFBldGVyIEVhc3RtYW4gKHBlYXN0bWFuQGRyaXp6bGUuc3RhbmZvcmQuZWR1KS5cbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXG4gKlxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMiBKb25hcyBXYWduZXJcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbiAqIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuICogXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4gKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4gKiBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuICogdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4gKiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqXG4gKi9cbihmdW5jdGlvbiAoKSB7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEYyID0gMC41ICogKE1hdGguc3FydCgzLjApIC0gMS4wKSxcbiAgICBHMiA9ICgzLjAgLSBNYXRoLnNxcnQoMy4wKSkgLyA2LjAsXG4gICAgRjMgPSAxLjAgLyAzLjAsXG4gICAgRzMgPSAxLjAgLyA2LjAsXG4gICAgRjQgPSAoTWF0aC5zcXJ0KDUuMCkgLSAxLjApIC8gNC4wLFxuICAgIEc0ID0gKDUuMCAtIE1hdGguc3FydCg1LjApKSAvIDIwLjA7XG5cblxuZnVuY3Rpb24gU2ltcGxleE5vaXNlKHJhbmRvbSkge1xuICAgIGlmICghcmFuZG9tKSByYW5kb20gPSBNYXRoLnJhbmRvbTtcbiAgICB0aGlzLnAgPSBuZXcgVWludDhBcnJheSgyNTYpO1xuICAgIHRoaXMucGVybSA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgdGhpcy5wZXJtTW9kMTIgPSBuZXcgVWludDhBcnJheSg1MTIpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgICAgdGhpcy5wW2ldID0gcmFuZG9tKCkgKiAyNTY7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCA1MTI7IGkrKykge1xuICAgICAgICB0aGlzLnBlcm1baV0gPSB0aGlzLnBbaSAmIDI1NV07XG4gICAgICAgIHRoaXMucGVybU1vZDEyW2ldID0gdGhpcy5wZXJtW2ldICUgMTI7XG4gICAgfVxuXG59XG5TaW1wbGV4Tm9pc2UucHJvdG90eXBlID0ge1xuICAgIGdyYWQzOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAtIDEsIDAsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIC0gMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAwLCAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMCwgMSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDAsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDAsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAxLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgLSAxLCAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAtIDEsIC0gMV0pLFxuICAgIGdyYWQ0OiBuZXcgRmxvYXQzMkFycmF5KFswLCAxLCAxLCAxLCAwLCAxLCAxLCAtIDEsIDAsIDEsIC0gMSwgMSwgMCwgMSwgLSAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgLSAxLCAxLCAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgLSAxLCAtIDEsIDEsIDAsIC0gMSwgLSAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMCwgMSwgMSwgMSwgMCwgMSwgLSAxLCAxLCAwLCAtIDEsIDEsIDEsIDAsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMCwgMSwgMSwgLSAxLCAwLCAxLCAtIDEsIC0gMSwgMCwgLSAxLCAxLCAtIDEsIDAsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDEsIDAsIDEsIDEsIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAxLCAxLCAtIDEsIDAsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDEsIDAsIDEsIC0gMSwgMSwgMCwgLSAxLCAtIDEsIC0gMSwgMCwgMSwgLSAxLCAtIDEsIDAsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAxLCAxLCAwLCAxLCAxLCAtIDEsIDAsIDEsIC0gMSwgMSwgMCwgMSwgLSAxLCAtIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAxLCAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgLSAxLCAtIDEsIDEsIDAsIC0gMSwgLSAxLCAtIDEsIDBdKSxcbiAgICBub2lzZTJEOiBmdW5jdGlvbiAoeGluLCB5aW4pIHtcbiAgICAgICAgdmFyIHBlcm1Nb2QxMiA9IHRoaXMucGVybU1vZDEyLFxuICAgICAgICAgICAgcGVybSA9IHRoaXMucGVybSxcbiAgICAgICAgICAgIGdyYWQzID0gdGhpcy5ncmFkMztcbiAgICAgICAgdmFyIG4wPTAsIG4xPTAsIG4yPTA7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXG4gICAgICAgIHZhciBzID0gKHhpbiArIHlpbikgKiBGMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XG4gICAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5aW4gKyBzKTtcbiAgICAgICAgdmFyIHQgPSAoaSArIGopICogRzI7XG4gICAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSkgc3BhY2VcbiAgICAgICAgdmFyIFkwID0gaiAtIHQ7XG4gICAgICAgIHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgICB2YXIgeTAgPSB5aW4gLSBZMDtcbiAgICAgICAgLy8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxuICAgICAgICB2YXIgaTEsIGoxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgKG1pZGRsZSkgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaikgY29vcmRzXG4gICAgICAgIGlmICh4MCA+IHkwKSB7XG4gICAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgIH0gLy8gbG93ZXIgdHJpYW5nbGUsIFhZIG9yZGVyOiAoMCwwKS0+KDEsMCktPigxLDEpXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgajEgPSAxO1xuICAgICAgICB9IC8vIHVwcGVyIHRyaWFuZ2xlLCBZWCBvcmRlcjogKDAsMCktPigwLDEpLT4oMSwxKVxuICAgICAgICAvLyBBIHN0ZXAgb2YgKDEsMCkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMpIGluICh4LHkpLCBhbmRcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcbiAgICAgICAgLy8gYyA9ICgzLXNxcnQoMykpLzZcbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEcyOyAvLyBPZmZzZXRzIGZvciBtaWRkbGUgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzI7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gMS4wICsgMi4wICogRzI7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICB2YXIgeTIgPSB5MCAtIDEuMCArIDIuMCAqIEcyO1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xuICAgICAgICB2YXIgaWkgPSBpICYgMjU1O1xuICAgICAgICB2YXIgamogPSBqICYgMjU1O1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICAgIHZhciB0MCA9IDAuNSAtIHgwICogeDAgLSB5MCAqIHkwO1xuICAgICAgICBpZiAodDAgPj0gMCkge1xuICAgICAgICAgICAgdmFyIGdpMCA9IHBlcm1Nb2QxMltpaSArIHBlcm1bampdXSAqIDM7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkM1tnaTBdICogeDAgKyBncmFkM1tnaTAgKyAxXSAqIHkwKTsgLy8gKHgseSkgb2YgZ3JhZDMgdXNlZCBmb3IgMkQgZ3JhZGllbnRcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDEgPSAwLjUgLSB4MSAqIHgxIC0geTEgKiB5MTtcbiAgICAgICAgaWYgKHQxID49IDApIHtcbiAgICAgICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMV1dICogMztcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQzW2dpMV0gKiB4MSArIGdyYWQzW2dpMSArIDFdICogeTEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MiA9IDAuNSAtIHgyICogeDIgLSB5MiAqIHkyO1xuICAgICAgICBpZiAodDIgPj0gMCkge1xuICAgICAgICAgICAgdmFyIGdpMiA9IHBlcm1Nb2QxMltpaSArIDEgKyBwZXJtW2pqICsgMV1dICogMztcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWQzW2dpMl0gKiB4MiArIGdyYWQzW2dpMiArIDFdICogeTIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cbiAgICAgICAgLy8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gcmV0dXJuIHZhbHVlcyBpbiB0aGUgaW50ZXJ2YWwgWy0xLDFdLlxuICAgICAgICByZXR1cm4gNzAuMCAqIChuMCArIG4xICsgbjIpO1xuICAgIH0sXG4gICAgLy8gM0Qgc2ltcGxleCBub2lzZVxuICAgIG5vaXNlM0Q6IGZ1bmN0aW9uICh4aW4sIHlpbiwgemluKSB7XG4gICAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMixcbiAgICAgICAgICAgIHBlcm0gPSB0aGlzLnBlcm0sXG4gICAgICAgICAgICBncmFkMyA9IHRoaXMuZ3JhZDM7XG4gICAgICAgIHZhciBuMCwgbjEsIG4yLCBuMzsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4aW4gKyB5aW4gKyB6aW4pICogRjM7IC8vIFZlcnkgbmljZSBhbmQgc2ltcGxlIHNrZXcgZmFjdG9yIGZvciAzRFxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XG4gICAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5aW4gKyBzKTtcbiAgICAgICAgdmFyIGsgPSBNYXRoLmZsb29yKHppbiArIHMpO1xuICAgICAgICB2YXIgdCA9IChpICsgaiArIGspICogRzM7XG4gICAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSx6KSBzcGFjZVxuICAgICAgICB2YXIgWTAgPSBqIC0gdDtcbiAgICAgICAgdmFyIFowID0gayAtIHQ7XG4gICAgICAgIHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5LHogZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXG4gICAgICAgIHZhciB5MCA9IHlpbiAtIFkwO1xuICAgICAgICB2YXIgejAgPSB6aW4gLSBaMDtcbiAgICAgICAgLy8gRm9yIHRoZSAzRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhIHNsaWdodGx5IGlycmVndWxhciB0ZXRyYWhlZHJvbi5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxuICAgICAgICB2YXIgaTEsIGoxLCBrMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGosaykgY29vcmRzXG4gICAgICAgIHZhciBpMiwgajIsIGsyOyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqLGspIGNvb3Jkc1xuICAgICAgICBpZiAoeDAgPj0geTApIHtcbiAgICAgICAgICAgIGlmICh5MCA+PSB6MCkge1xuICAgICAgICAgICAgICAgIGkxID0gMTtcbiAgICAgICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgICAgICAgazEgPSAwO1xuICAgICAgICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICAgICAgICBqMiA9IDE7XG4gICAgICAgICAgICAgICAgazIgPSAwO1xuICAgICAgICAgICAgfSAvLyBYIFkgWiBvcmRlclxuICAgICAgICAgICAgZWxzZSBpZiAoeDAgPj0gejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAwO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWCBaIFkgb3JkZXJcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgICAgICAgazEgPSAxO1xuICAgICAgICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICAgICAgICBqMiA9IDA7XG4gICAgICAgICAgICAgICAgazIgPSAxO1xuICAgICAgICAgICAgfSAvLyBaIFggWSBvcmRlclxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyB4MDx5MFxuICAgICAgICAgICAgaWYgKHkwIDwgejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMTtcbiAgICAgICAgICAgICAgICBpMiA9IDA7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWiBZIFggb3JkZXJcbiAgICAgICAgICAgIGVsc2UgaWYgKHgwIDwgejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAxO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDA7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWSBaIFggb3JkZXJcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgICAgICBqMSA9IDE7XG4gICAgICAgICAgICAgICAgazEgPSAwO1xuICAgICAgICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICAgICAgICBqMiA9IDE7XG4gICAgICAgICAgICAgICAgazIgPSAwO1xuICAgICAgICAgICAgfSAvLyBZIFggWiBvcmRlclxuICAgICAgICB9XG4gICAgICAgIC8vIEEgc3RlcCBvZiAoMSwwLDApIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMsLWMpIGluICh4LHkseiksXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwxLDApIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMsLWMpIGluICh4LHkseiksIGFuZFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMCwxKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsLWMsMS1jKSBpbiAoeCx5LHopLCB3aGVyZVxuICAgICAgICAvLyBjID0gMS82LlxuICAgICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzM7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcbiAgICAgICAgdmFyIHkxID0geTAgLSBqMSArIEczO1xuICAgICAgICB2YXIgejEgPSB6MCAtIGsxICsgRzM7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gaTIgKyAyLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXG4gICAgICAgIHZhciB5MiA9IHkwIC0gajIgKyAyLjAgKiBHMztcbiAgICAgICAgdmFyIHoyID0gejAgLSBrMiArIDIuMCAqIEczO1xuICAgICAgICB2YXIgeDMgPSB4MCAtIDEuMCArIDMuMCAqIEczOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xuICAgICAgICB2YXIgeTMgPSB5MCAtIDEuMCArIDMuMCAqIEczO1xuICAgICAgICB2YXIgejMgPSB6MCAtIDEuMCArIDMuMCAqIEczO1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIGZvdXIgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIHZhciBpaSA9IGkgJiAyNTU7XG4gICAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICAgIHZhciBrayA9IGsgJiAyNTU7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIGZvdXIgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjYgLSB4MCAqIHgwIC0geTAgKiB5MCAtIHowICogejA7XG4gICAgICAgIGlmICh0MCA8IDApIG4wID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTAgPSBwZXJtTW9kMTJbaWkgKyBwZXJtW2pqICsgcGVybVtra11dXSAqIDM7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkM1tnaTBdICogeDAgKyBncmFkM1tnaTAgKyAxXSAqIHkwICsgZ3JhZDNbZ2kwICsgMl0gKiB6MCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC42IC0geDEgKiB4MSAtIHkxICogeTEgLSB6MSAqIHoxO1xuICAgICAgICBpZiAodDEgPCAwKSBuMSA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kxID0gcGVybU1vZDEyW2lpICsgaTEgKyBwZXJtW2pqICsgajEgKyBwZXJtW2trICsgazFdXV0gKiAzO1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSArIGdyYWQzW2dpMSArIDJdICogejEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MiA9IDAuNiAtIHgyICogeDIgLSB5MiAqIHkyIC0gejIgKiB6MjtcbiAgICAgICAgaWYgKHQyIDwgMCkgbjIgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMiA9IHBlcm1Nb2QxMltpaSArIGkyICsgcGVybVtqaiArIGoyICsgcGVybVtrayArIGsyXV1dICogMztcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWQzW2dpMl0gKiB4MiArIGdyYWQzW2dpMiArIDFdICogeTIgKyBncmFkM1tnaTIgKyAyXSAqIHoyKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDMgPSAwLjYgLSB4MyAqIHgzIC0geTMgKiB5MyAtIHozICogejM7XG4gICAgICAgIGlmICh0MyA8IDApIG4zID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTMgPSBwZXJtTW9kMTJbaWkgKyAxICsgcGVybVtqaiArIDEgKyBwZXJtW2trICsgMV1dXSAqIDM7XG4gICAgICAgICAgICB0MyAqPSB0MztcbiAgICAgICAgICAgIG4zID0gdDMgKiB0MyAqIChncmFkM1tnaTNdICogeDMgKyBncmFkM1tnaTMgKyAxXSAqIHkzICsgZ3JhZDNbZ2kzICsgMl0gKiB6Myk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuICAgICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byBzdGF5IGp1c3QgaW5zaWRlIFstMSwxXVxuICAgICAgICByZXR1cm4gMzIuMCAqIChuMCArIG4xICsgbjIgKyBuMyk7XG4gICAgfSxcbiAgICAvLyA0RCBzaW1wbGV4IG5vaXNlLCBiZXR0ZXIgc2ltcGxleCByYW5rIG9yZGVyaW5nIG1ldGhvZCAyMDEyLTAzLTA5XG4gICAgbm9pc2U0RDogZnVuY3Rpb24gKHgsIHksIHosIHcpIHtcbiAgICAgICAgdmFyIHBlcm1Nb2QxMiA9IHRoaXMucGVybU1vZDEyLFxuICAgICAgICAgICAgcGVybSA9IHRoaXMucGVybSxcbiAgICAgICAgICAgIGdyYWQ0ID0gdGhpcy5ncmFkNDtcblxuICAgICAgICB2YXIgbjAsIG4xLCBuMiwgbjMsIG40OyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIGZpdmUgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSAoeCx5LHosdykgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIGNlbGwgb2YgMjQgc2ltcGxpY2VzIHdlJ3JlIGluXG4gICAgICAgIHZhciBzID0gKHggKyB5ICsgeiArIHcpICogRjQ7IC8vIEZhY3RvciBmb3IgNEQgc2tld2luZ1xuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeCArIHMpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeSArIHMpO1xuICAgICAgICB2YXIgayA9IE1hdGguZmxvb3IoeiArIHMpO1xuICAgICAgICB2YXIgbCA9IE1hdGguZmxvb3IodyArIHMpO1xuICAgICAgICB2YXIgdCA9IChpICsgaiArIGsgKyBsKSAqIEc0OyAvLyBGYWN0b3IgZm9yIDREIHVuc2tld2luZ1xuICAgICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseix3KSBzcGFjZVxuICAgICAgICB2YXIgWTAgPSBqIC0gdDtcbiAgICAgICAgdmFyIFowID0gayAtIHQ7XG4gICAgICAgIHZhciBXMCA9IGwgLSB0O1xuICAgICAgICB2YXIgeDAgPSB4IC0gWDA7IC8vIFRoZSB4LHkseix3IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgICB2YXIgeTAgPSB5IC0gWTA7XG4gICAgICAgIHZhciB6MCA9IHogLSBaMDtcbiAgICAgICAgdmFyIHcwID0gdyAtIFcwO1xuICAgICAgICAvLyBGb3IgdGhlIDREIGNhc2UsIHRoZSBzaW1wbGV4IGlzIGEgNEQgc2hhcGUgSSB3b24ndCBldmVuIHRyeSB0byBkZXNjcmliZS5cbiAgICAgICAgLy8gVG8gZmluZCBvdXQgd2hpY2ggb2YgdGhlIDI0IHBvc3NpYmxlIHNpbXBsaWNlcyB3ZSdyZSBpbiwgd2UgbmVlZCB0b1xuICAgICAgICAvLyBkZXRlcm1pbmUgdGhlIG1hZ25pdHVkZSBvcmRlcmluZyBvZiB4MCwgeTAsIHowIGFuZCB3MC5cbiAgICAgICAgLy8gU2l4IHBhaXItd2lzZSBjb21wYXJpc29ucyBhcmUgcGVyZm9ybWVkIGJldHdlZW4gZWFjaCBwb3NzaWJsZSBwYWlyXG4gICAgICAgIC8vIG9mIHRoZSBmb3VyIGNvb3JkaW5hdGVzLCBhbmQgdGhlIHJlc3VsdHMgYXJlIHVzZWQgdG8gcmFuayB0aGUgbnVtYmVycy5cbiAgICAgICAgdmFyIHJhbmt4ID0gMDtcbiAgICAgICAgdmFyIHJhbmt5ID0gMDtcbiAgICAgICAgdmFyIHJhbmt6ID0gMDtcbiAgICAgICAgdmFyIHJhbmt3ID0gMDtcbiAgICAgICAgaWYgKHgwID4geTApIHJhbmt4Kys7XG4gICAgICAgIGVsc2UgcmFua3krKztcbiAgICAgICAgaWYgKHgwID4gejApIHJhbmt4Kys7XG4gICAgICAgIGVsc2UgcmFua3orKztcbiAgICAgICAgaWYgKHgwID4gdzApIHJhbmt4Kys7XG4gICAgICAgIGVsc2UgcmFua3crKztcbiAgICAgICAgaWYgKHkwID4gejApIHJhbmt5Kys7XG4gICAgICAgIGVsc2UgcmFua3orKztcbiAgICAgICAgaWYgKHkwID4gdzApIHJhbmt5Kys7XG4gICAgICAgIGVsc2UgcmFua3crKztcbiAgICAgICAgaWYgKHowID4gdzApIHJhbmt6Kys7XG4gICAgICAgIGVsc2UgcmFua3crKztcbiAgICAgICAgdmFyIGkxLCBqMSwgazEsIGwxOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgc2Vjb25kIHNpbXBsZXggY29ybmVyXG4gICAgICAgIHZhciBpMiwgajIsIGsyLCBsMjsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIHRoaXJkIHNpbXBsZXggY29ybmVyXG4gICAgICAgIHZhciBpMywgajMsIGszLCBsMzsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIGZvdXJ0aCBzaW1wbGV4IGNvcm5lclxuICAgICAgICAvLyBzaW1wbGV4W2NdIGlzIGEgNC12ZWN0b3Igd2l0aCB0aGUgbnVtYmVycyAwLCAxLCAyIGFuZCAzIGluIHNvbWUgb3JkZXIuXG4gICAgICAgIC8vIE1hbnkgdmFsdWVzIG9mIGMgd2lsbCBuZXZlciBvY2N1ciwgc2luY2UgZS5nLiB4Pnk+ej53IG1ha2VzIHg8eiwgeTx3IGFuZCB4PHdcbiAgICAgICAgLy8gaW1wb3NzaWJsZS4gT25seSB0aGUgMjQgaW5kaWNlcyB3aGljaCBoYXZlIG5vbi16ZXJvIGVudHJpZXMgbWFrZSBhbnkgc2Vuc2UuXG4gICAgICAgIC8vIFdlIHVzZSBhIHRocmVzaG9sZGluZyB0byBzZXQgdGhlIGNvb3JkaW5hdGVzIGluIHR1cm4gZnJvbSB0aGUgbGFyZ2VzdCBtYWduaXR1ZGUuXG4gICAgICAgIC8vIFJhbmsgMyBkZW5vdGVzIHRoZSBsYXJnZXN0IGNvb3JkaW5hdGUuXG4gICAgICAgIGkxID0gcmFua3ggPj0gMyA/IDEgOiAwO1xuICAgICAgICBqMSA9IHJhbmt5ID49IDMgPyAxIDogMDtcbiAgICAgICAgazEgPSByYW5reiA+PSAzID8gMSA6IDA7XG4gICAgICAgIGwxID0gcmFua3cgPj0gMyA/IDEgOiAwO1xuICAgICAgICAvLyBSYW5rIDIgZGVub3RlcyB0aGUgc2Vjb25kIGxhcmdlc3QgY29vcmRpbmF0ZS5cbiAgICAgICAgaTIgPSByYW5reCA+PSAyID8gMSA6IDA7XG4gICAgICAgIGoyID0gcmFua3kgPj0gMiA/IDEgOiAwO1xuICAgICAgICBrMiA9IHJhbmt6ID49IDIgPyAxIDogMDtcbiAgICAgICAgbDIgPSByYW5rdyA+PSAyID8gMSA6IDA7XG4gICAgICAgIC8vIFJhbmsgMSBkZW5vdGVzIHRoZSBzZWNvbmQgc21hbGxlc3QgY29vcmRpbmF0ZS5cbiAgICAgICAgaTMgPSByYW5reCA+PSAxID8gMSA6IDA7XG4gICAgICAgIGozID0gcmFua3kgPj0gMSA/IDEgOiAwO1xuICAgICAgICBrMyA9IHJhbmt6ID49IDEgPyAxIDogMDtcbiAgICAgICAgbDMgPSByYW5rdyA+PSAxID8gMSA6IDA7XG4gICAgICAgIC8vIFRoZSBmaWZ0aCBjb3JuZXIgaGFzIGFsbCBjb29yZGluYXRlIG9mZnNldHMgPSAxLCBzbyBubyBuZWVkIHRvIGNvbXB1dGUgdGhhdC5cbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEc0OyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHkxID0geTAgLSBqMSArIEc0O1xuICAgICAgICB2YXIgejEgPSB6MCAtIGsxICsgRzQ7XG4gICAgICAgIHZhciB3MSA9IHcwIC0gbDEgKyBHNDtcbiAgICAgICAgdmFyIHgyID0geDAgLSBpMiArIDIuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzQ7XG4gICAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHNDtcbiAgICAgICAgdmFyIHcyID0gdzAgLSBsMiArIDIuMCAqIEc0O1xuICAgICAgICB2YXIgeDMgPSB4MCAtIGkzICsgMy4wICogRzQ7IC8vIE9mZnNldHMgZm9yIGZvdXJ0aCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTMgPSB5MCAtIGozICsgMy4wICogRzQ7XG4gICAgICAgIHZhciB6MyA9IHowIC0gazMgKyAzLjAgKiBHNDtcbiAgICAgICAgdmFyIHczID0gdzAgLSBsMyArIDMuMCAqIEc0O1xuICAgICAgICB2YXIgeDQgPSB4MCAtIDEuMCArIDQuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5NCA9IHkwIC0gMS4wICsgNC4wICogRzQ7XG4gICAgICAgIHZhciB6NCA9IHowIC0gMS4wICsgNC4wICogRzQ7XG4gICAgICAgIHZhciB3NCA9IHcwIC0gMS4wICsgNC4wICogRzQ7XG4gICAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgZml2ZSBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgICAgdmFyIGpqID0gaiAmIDI1NTtcbiAgICAgICAgdmFyIGtrID0gayAmIDI1NTtcbiAgICAgICAgdmFyIGxsID0gbCAmIDI1NTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgZml2ZSBjb3JuZXJzXG4gICAgICAgIHZhciB0MCA9IDAuNiAtIHgwICogeDAgLSB5MCAqIHkwIC0gejAgKiB6MCAtIHcwICogdzA7XG4gICAgICAgIGlmICh0MCA8IDApIG4wID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTAgPSAocGVybVtpaSArIHBlcm1bamogKyBwZXJtW2trICsgcGVybVtsbF1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDRbZ2kwXSAqIHgwICsgZ3JhZDRbZ2kwICsgMV0gKiB5MCArIGdyYWQ0W2dpMCArIDJdICogejAgKyBncmFkNFtnaTAgKyAzXSAqIHcwKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDEgPSAwLjYgLSB4MSAqIHgxIC0geTEgKiB5MSAtIHoxICogejEgLSB3MSAqIHcxO1xuICAgICAgICBpZiAodDEgPCAwKSBuMSA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kxID0gKHBlcm1baWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMSArIHBlcm1bbGwgKyBsMV1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDRbZ2kxXSAqIHgxICsgZ3JhZDRbZ2kxICsgMV0gKiB5MSArIGdyYWQ0W2dpMSArIDJdICogejEgKyBncmFkNFtnaTEgKyAzXSAqIHcxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejIgLSB3MiAqIHcyO1xuICAgICAgICBpZiAodDIgPCAwKSBuMiA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kyID0gKHBlcm1baWkgKyBpMiArIHBlcm1bamogKyBqMiArIHBlcm1ba2sgKyBrMiArIHBlcm1bbGwgKyBsMl1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDRbZ2kyXSAqIHgyICsgZ3JhZDRbZ2kyICsgMV0gKiB5MiArIGdyYWQ0W2dpMiArIDJdICogejIgKyBncmFkNFtnaTIgKyAzXSAqIHcyKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDMgPSAwLjYgLSB4MyAqIHgzIC0geTMgKiB5MyAtIHozICogejMgLSB3MyAqIHczO1xuICAgICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kzID0gKHBlcm1baWkgKyBpMyArIHBlcm1bamogKyBqMyArIHBlcm1ba2sgKyBrMyArIHBlcm1bbGwgKyBsM11dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDMgKj0gdDM7XG4gICAgICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDRbZ2kzXSAqIHgzICsgZ3JhZDRbZ2kzICsgMV0gKiB5MyArIGdyYWQ0W2dpMyArIDJdICogejMgKyBncmFkNFtnaTMgKyAzXSAqIHczKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDQgPSAwLjYgLSB4NCAqIHg0IC0geTQgKiB5NCAtIHo0ICogejQgLSB3NCAqIHc0O1xuICAgICAgICBpZiAodDQgPCAwKSBuNCA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2k0ID0gKHBlcm1baWkgKyAxICsgcGVybVtqaiArIDEgKyBwZXJtW2trICsgMSArIHBlcm1bbGwgKyAxXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0NCAqPSB0NDtcbiAgICAgICAgICAgIG40ID0gdDQgKiB0NCAqIChncmFkNFtnaTRdICogeDQgKyBncmFkNFtnaTQgKyAxXSAqIHk0ICsgZ3JhZDRbZ2k0ICsgMl0gKiB6NCArIGdyYWQ0W2dpNCArIDNdICogdzQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFN1bSB1cCBhbmQgc2NhbGUgdGhlIHJlc3VsdCB0byBjb3ZlciB0aGUgcmFuZ2UgWy0xLDFdXG4gICAgICAgIHJldHVybiAyNy4wICogKG4wICsgbjEgKyBuMiArIG4zICsgbjQpO1xuICAgIH1cblxuXG59O1xuXG4vLyBhbWRcbmlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gU2ltcGxleE5vaXNlO30pO1xuLy9jb21tb24ganNcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIGV4cG9ydHMuU2ltcGxleE5vaXNlID0gU2ltcGxleE5vaXNlO1xuLy8gYnJvd3NlclxuZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHdpbmRvdy5TaW1wbGV4Tm9pc2UgPSBTaW1wbGV4Tm9pc2U7XG4vLyBub2RlanNcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gU2ltcGxleE5vaXNlO1xufVxuXG59KSgpO1xuIiwiLyoqXG4gKiBCbG9jayBvZiB2b3hlbCBkYXRhIHdpdGggYSBmaXhlZCBzaXplXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IHNoYXBlIG9wdGlvbmFsIHNoYXBlLCBcbiAqIHF1ZXJ5aW5nIGRhdGEgb3V0c2lkZSBvZiBzaGFwZSB3aWxsIGdpdmUgdW5leHBlY3RlZCByZXN1bHRzXG4gKi9cbnZhciBDaHVuayA9IGZ1bmN0aW9uKHNoYXBlKSB7XG4gIHRoaXMudm9sdW1lID0gW107XG4gIHRoaXMuc2hhcGUgPSBzaGFwZSB8fCBbMTYsIDE2LCAxNl07XG4gIHRoaXMuZGltWCA9IHRoaXMuc2hhcGVbMF07XG4gIHRoaXMuZGltWFkgPSB0aGlzLnNoYXBlWzBdICogdGhpcy5zaGFwZVsxXTtcbn07XG5cbi8qKlxuICogR2V0IGRhdGEgYXQgY29vcmRcbiAqIEBwYXJhbSAge0ludH0gaSBpXG4gKiBAcGFyYW0gIHtJbnR9IGogalxuICogQHBhcmFtICB7SW50fSBrIGtcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuQ2h1bmsucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgcmV0dXJuIHRoaXMudm9sdW1lW2kgKiB0aGlzLmRpbVhZICsgaiAqIHRoaXMuZGltWCArIGtdO1xufTtcblxuLyoqXG4gKiBTZXQgZGF0YSBhdCBjb29yZFxuICogQHBhcmFtIHtpfSBpIGlcbiAqIEBwYXJhbSB7an0gaiBqXG4gKiBAcGFyYW0ge2t9IGsga1xuICogQHBhcmFtIHt2fSBkYXRhIHRvIHN0b3JlXG4gKi9cbkNodW5rLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gIHRoaXMudm9sdW1lW2kgKiB0aGlzLmRpbVhZICsgaiAqIHRoaXMuZGltWCArIGtdID0gdjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2h1bms7XG4iLCJ2YXIgQ2h1bmsgPSByZXF1aXJlKCcuL2NodW5rJyk7XG5cbi8qKlxuICogQSBkeW5hbWljYWxseSBzaXplZCBibG9jayBvZiB2b3hlbCBkYXRhXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SW50fSBjaHVua1NpemUgY2h1bmsgc2l6ZVxuICovXG52YXIgQ2h1bmtzID0gZnVuY3Rpb24oY2h1bmtTaXplKSB7XG4gIHRoaXMubWFwID0ge307XG4gIHRoaXMuY2h1bmtTaXplID0gY2h1bmtTaXplIHx8IDE2O1xufTtcblxuLyoqXG4gKiBTZXQgZGF0YSBhdCBjb29yZFxuICogQHBhcmFtIHtJbnR9IGkgaVxuICogQHBhcmFtIHtJbnR9IGogalxuICogQHBhcmFtIHtJbnR9IGsga1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgdG8gc3RvcmVcbiAqL1xuQ2h1bmtzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gIHZhciBvcmlnaW4gPSB0aGlzLmdldE9yaWdpbihpLCBqLCBrKTtcbiAgdmFyIGhhc2ggPSBvcmlnaW4uam9pbignLCcpO1xuICBpZiAodGhpcy5tYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgIHRoaXMubWFwW2hhc2hdID0ge1xuICAgICAgY2h1bms6IG5ldyBDaHVuayhbdGhpcy5jaHVua1NpemUsIHRoaXMuY2h1bmtTaXplLCB0aGlzLmNodW5rU2l6ZV0pLFxuICAgICAgb3JpZ2luOiBvcmlnaW5cbiAgICB9XG4gIH1cblxuICB0aGlzLm1hcFtoYXNoXS5kaXJ0eSA9IHRydWU7XG4gIHRoaXMubWFwW2hhc2hdLmNodW5rLnNldChpIC0gb3JpZ2luWzBdLCBqIC0gb3JpZ2luWzFdLCBrIC0gb3JpZ2luWzJdLCB2KTtcbn07XG5cbi8qKlxuICogR2V0IGRhdGEgYXQgY29vcmRcbiAqIEBwYXJhbSAge0ludH0gaSBpXG4gKiBAcGFyYW0gIHtJbnR9IGogalxuICogQHBhcmFtICB7SW50fSBrIGtcbiAqIEByZXR1cm4ge09iamVjdH0gZGF0YSBzdG9yZWQgYXQgY29vcmRcbiAqL1xuQ2h1bmtzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpLCBqLCBrKSB7XG4gIHZhciBvcmlnaW4gPSB0aGlzLmdldE9yaWdpbihpLCBqLCBrKTtcbiAgdmFyIGhhc2ggPSBvcmlnaW4uam9pbignLCcpO1xuICBpZiAodGhpcy5tYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBvcmlnaW4gPSB0aGlzLm1hcFtoYXNoXS5vcmlnaW47XG4gIHJldHVybiB0aGlzLm1hcFtoYXNoXS5jaHVuay5nZXQoaSAtIG9yaWdpblswXSwgaiAtIG9yaWdpblsxXSwgayAtIG9yaWdpblsyXSk7XG59O1xuXG4vKipcbiAqIEdldCBvcmlnaW4gb2YgY2h1bmsgZm9yIGNvb3JkXG4gKiBAcGFyYW0gIHtJbnR9IGkgaVxuICogQHBhcmFtICB7SW50fSBqIGpcbiAqIEBwYXJhbSAge0ludH0gayBrXG4gKiBAcmV0dXJuIHtBcnJheX0gb3JpZ2luIGNvb3JkXG4gKi9cbkNodW5rcy5wcm90b3R5cGUuZ2V0T3JpZ2luID0gZnVuY3Rpb24oaSwgaiwgaykge1xuICByZXR1cm4gW1xuICAgIE1hdGguZmxvb3IoaSAvIHRoaXMuY2h1bmtTaXplKSAqIHRoaXMuY2h1bmtTaXplLFxuICAgIE1hdGguZmxvb3IoaiAvIHRoaXMuY2h1bmtTaXplKSAqIHRoaXMuY2h1bmtTaXplLFxuICAgIE1hdGguZmxvb3IoayAvIHRoaXMuY2h1bmtTaXplKSAqIHRoaXMuY2h1bmtTaXplXG4gIF07XG59O1xuXG4vKipcbiAqIFZpc2l0IGNvb3Jkc1xuICogQHBhcmFtICB7dmlzaXRDYWxsYmFja30gY2FsbGJhY2sgQGNhbGxiYWNrIFxuICovXG5DaHVua3MucHJvdG90eXBlLnZpc2l0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaWQgaW4gdGhpcy5tYXApIHtcbiAgICB2YXIgY2h1bmsgPSB0aGlzLm1hcFtpZF0uY2h1bms7XG4gICAgdmFyIG9yaWdpbiA9IHRoaXMubWFwW2lkXS5vcmlnaW47XG4gICAgdmFyIHNoYXBlID0gY2h1bmsuc2hhcGU7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNoYXBlWzBdOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2hhcGVbMF07IGorKykge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNoYXBlWzBdOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGNodW5rLmdldChpLCBqLCBrKTtcbiAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjayhpICsgb3JpZ2luWzBdLCBqICsgb3JpZ2luWzFdLCBrICsgb3JpZ2luWzJdLCB2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIG1lc2hlcyBhbmQgZGlzcG9zZSBhbGwgZ2VvbWV0cmllc1xuICogQHJldHVybiB7Q2h1bmtzfSBzZWxmIGZvciBjaGFpbmFiaWxpdHlcbiAqL1xuQ2h1bmtzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpZCBpbiB0aGlzLm1hcCkge1xuICAgIHZhciBjaHVuayA9IHRoaXMubWFwW2lkXTtcbiAgICBpZiAoY2h1bmsubWVzaCAhPSBudWxsKSB7XG4gICAgICBjaHVuay5tZXNoLnBhcmVudC5yZW1vdmUoY2h1bmsubWVzaCk7XG4gICAgICBjaHVuay5tZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cbiAgdGhpcy5tYXAgPSB7fTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRGVzZXJpYWxpemUganNvblxuICogQHBhcmFtIHtKU09OfSBkYXRhIGRhdGEgdG8gZGVzZXJpYWxpemVcbiAqIEBwYXJhbSB7QXJyYXl9IG9mZnNldCBvcHRpb25hbCBvZmZzZXQgdG8gYXBwbHlcbiAqIEByZXR1cm4ge0NodW5rc30gc2VsZiBmb3IgY2hhaW5hYmlsaXR5XG4gKi9cbkNodW5rcy5wcm90b3R5cGUuZGVzZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhLCBvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHx8IFswLCAwLCAwXTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIHNlbGYuc2V0KHZbMF0gKyBvZmZzZXRbMF0sIHZbMV0gKyBvZmZzZXRbMV0sIHZbMl0gKyBvZmZzZXRbMl0sIHZbM10pO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2h1bmtzO1xuIiwidmFyIEdyZWVkeU1lc2ggPSAoZnVuY3Rpb24oKSB7XG4gIC8vQ2FjaGUgYnVmZmVyIGludGVybmFsbHlcbiAgdmFyIG1hc2sgPSBuZXcgSW50MzJBcnJheSg0MDk2KTtcblxuICByZXR1cm4gZnVuY3Rpb24oZiwgZGltcykge1xuICAgIHZhciB2ZXJ0aWNlcyA9IFtdLFxuICAgICAgZmFjZXMgPSBbXSxcbiAgICAgIHV2cyA9IFtdLFxuICAgICAgZGltc1ggPSBkaW1zWzBdLFxuICAgICAgZGltc1kgPSBkaW1zWzFdLFxuICAgICAgZGltc1hZID0gZGltc1ggKiBkaW1zWTtcblxuICAgIC8vU3dlZXAgb3ZlciAzLWF4ZXNcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IDM7ICsrZCkge1xuICAgICAgdmFyIGksIGosIGssIGwsIHcsIFcsIGgsIG4sIGMsXG4gICAgICAgIHUgPSAoZCArIDEpICUgMyxcbiAgICAgICAgdiA9IChkICsgMikgJSAzLFxuICAgICAgICB4ID0gWzAsIDAsIDBdLFxuICAgICAgICBxID0gWzAsIDAsIDBdLFxuICAgICAgICBkdSA9IFswLCAwLCAwXSxcbiAgICAgICAgZHYgPSBbMCwgMCwgMF0sXG4gICAgICAgIGRpbXNEID0gZGltc1tkXSxcbiAgICAgICAgZGltc1UgPSBkaW1zW3VdLFxuICAgICAgICBkaW1zViA9IGRpbXNbdl0sXG4gICAgICAgIHFkaW1zWCwgcWRpbXNYWSwgeGQ7XG5cbiAgICAgIHZhciBmbGlwLCBpbmRleCwgdmFsdWU7XG5cbiAgICAgIGlmIChtYXNrLmxlbmd0aCA8IGRpbXNVICogZGltc1YpIHtcbiAgICAgICAgbWFzayA9IG5ldyBJbnQzMkFycmF5KGRpbXNVICogZGltc1YpO1xuICAgICAgfVxuXG4gICAgICBxW2RdID0gMTtcbiAgICAgIHhbZF0gPSAtMTtcblxuICAgICAgcWRpbXNYID0gZGltc1ggKiBxWzFdXG4gICAgICBxZGltc1hZID0gZGltc1hZICogcVsyXVxuXG4gICAgICAvLyBDb21wdXRlIG1hc2tcbiAgICAgIHdoaWxlICh4W2RdIDwgZGltc0QpIHtcbiAgICAgICAgeGQgPSB4W2RdXG4gICAgICAgIG4gPSAwO1xuXG4gICAgICAgIGZvciAoeFt2XSA9IDA7IHhbdl0gPCBkaW1zVjsgKyt4W3ZdKSB7XG4gICAgICAgICAgZm9yICh4W3VdID0gMDsgeFt1XSA8IGRpbXNVOyArK3hbdV0sICsrbikge1xuICAgICAgICAgICAgdmFyIGEgPSB4ZCA+PSAwICYmIGYoeFswXSwgeFsxXSwgeFsyXSksXG4gICAgICAgICAgICAgIGIgPSB4ZCA8IGRpbXNEIC0gMSAmJiBmKHhbMF0gKyBxWzBdLCB4WzFdICsgcVsxXSwgeFsyXSArIHFbMl0pXG4gICAgICAgICAgICBpZiAoYSA/IGIgOiAhYikge1xuICAgICAgICAgICAgICBtYXNrW25dID0gMDtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZsaXAgPSAhYTtcblxuICAgICAgICAgICAgaW5kZXggPSBkICogMjtcbiAgICAgICAgICAgIGlmIChmbGlwKSB7XG4gICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlID0gKGEgfHwgYilbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAoZmxpcCkge1xuICAgICAgICAgICAgICB2YWx1ZSAqPSAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFza1tuXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICsreFtkXTtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBtZXNoIGZvciBtYXNrIHVzaW5nIGxleGljb2dyYXBoaWMgb3JkZXJpbmdcbiAgICAgICAgbiA9IDA7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBkaW1zVjsgKytqKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRpbXNVOykge1xuICAgICAgICAgICAgYyA9IG1hc2tbbl07XG4gICAgICAgICAgICBpZiAoIWMpIHtcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICBuKys7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0NvbXB1dGUgd2lkdGhcbiAgICAgICAgICAgIHcgPSAxO1xuICAgICAgICAgICAgd2hpbGUgKGMgPT09IG1hc2tbbiArIHddICYmIGkgKyB3IDwgZGltc1UpIHcrKztcblxuICAgICAgICAgICAgLy9Db21wdXRlIGhlaWdodCAodGhpcyBpcyBzbGlnaHRseSBhd2t3YXJkKVxuICAgICAgICAgICAgZm9yIChoID0gMTsgaiArIGggPCBkaW1zVjsgKytoKSB7XG4gICAgICAgICAgICAgIGsgPSAwO1xuICAgICAgICAgICAgICB3aGlsZSAoayA8IHcgJiYgYyA9PT0gbWFza1tuICsgayArIGggKiBkaW1zVV0pIGsrK1xuICAgICAgICAgICAgICAgIGlmIChrIDwgdykgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBxdWFkXG4gICAgICAgICAgICAvLyBUaGUgZHUvZHYgYXJyYXlzIGFyZSByZXVzZWQvcmVzZXRcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIGl0ZXJhdGlvbi5cbiAgICAgICAgICAgIGR1W2RdID0gMDtcbiAgICAgICAgICAgIGR2W2RdID0gMDtcbiAgICAgICAgICAgIHhbdV0gPSBpO1xuICAgICAgICAgICAgeFt2XSA9IGo7XG5cbiAgICAgICAgICAgIGlmIChjID4gMCkge1xuICAgICAgICAgICAgICBkdlt2XSA9IGg7XG4gICAgICAgICAgICAgIGR2W3VdID0gMDtcbiAgICAgICAgICAgICAgZHVbdV0gPSB3O1xuICAgICAgICAgICAgICBkdVt2XSA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjID0gLWM7XG4gICAgICAgICAgICAgIGR1W3ZdID0gaDtcbiAgICAgICAgICAgICAgZHVbdV0gPSAwO1xuICAgICAgICAgICAgICBkdlt1XSA9IHc7XG4gICAgICAgICAgICAgIGR2W3ZdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhfY291bnQgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdLCB4WzFdLCB4WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHVbMF0sIHhbMV0gKyBkdVsxXSwgeFsyXSArIGR1WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHVbMF0gKyBkdlswXSwgeFsxXSArIGR1WzFdICsgZHZbMV0sIHhbMl0gKyBkdVsyXSArIGR2WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHZbMF0sIHhbMV0gKyBkdlsxXSwgeFsyXSArIGR2WzJdXSk7XG4gICAgICAgICAgICB1dnMucHVzaChcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFswLCAwXSxcbiAgICAgICAgICAgICAgICBbZHVbdV0sIGR1W3ZdXSxcbiAgICAgICAgICAgICAgICBbZHVbdV0gKyBkdlt1XSwgZHVbdl0gKyBkdlt2XV0sXG4gICAgICAgICAgICAgICAgW2R2W3VdLCBkdlt2XV1cbiAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGZhY2VzLnB1c2goW3ZlcnRleF9jb3VudCwgdmVydGV4X2NvdW50ICsgMSwgdmVydGV4X2NvdW50ICsgMiwgdmVydGV4X2NvdW50ICsgMywgY10pO1xuXG4gICAgICAgICAgICAvL1plcm8tb3V0IG1hc2tcbiAgICAgICAgICAgIFcgPSBuICsgdztcbiAgICAgICAgICAgIGZvciAobCA9IDA7IGwgPCBoOyArK2wpIHtcbiAgICAgICAgICAgICAgZm9yIChrID0gbjsgayA8IFc7ICsraykge1xuICAgICAgICAgICAgICAgIG1hc2tbayArIGwgKiBkaW1zVV0gPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vSW5jcmVtZW50IGNvdW50ZXJzIGFuZCBjb250aW51ZVxuICAgICAgICAgICAgaSArPSB3O1xuICAgICAgICAgICAgbiArPSB3O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB2ZXJ0aWNlczogdmVydGljZXMsIGZhY2VzOiBmYWNlcywgdXZzOiB1dnMgfTtcbiAgfVxufSkoKTtcblxuaWYgKGV4cG9ydHMpIHtcbiAgZXhwb3J0cy5tZXNoZXIgPSBHcmVlZHlNZXNoO1xufVxuIiwidmFyIFZveGVsID0ge1xuICBDaHVuazogcmVxdWlyZSgnLi9jaHVuaycpLFxuICBDaHVua3M6IHJlcXVpcmUoJy4vY2h1bmtzJyksXG4gIG1lc2hDaHVua3M6IHJlcXVpcmUoJy4vbWVzaGNodW5rcycpLFxuICBtZXNoZXI6IHJlcXVpcmUoJy4vbWVzaGVyJylcbn07XG5cbi8qKlxuICogVmlzaXQgY29vcmRpbmF0ZXMgaW4gYSBzaGFwZVxuICogQHBhcmFtICB7QXJyYXl9IHNoYXBlIHNoYXBlIHRvIHZpc2l0XG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gdmlzaXRTaGFwZShzaGFwZSwgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaGFwZVswXTsgaSsrKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaGFwZVsxXTsgaisrKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNoYXBlWzJdOyBrKyspIHtcbiAgICAgICAgY2FsbGJhY2soaSwgaiwgayk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIENvcHkgYSBjaHVuaywgb3B0aW9uYWwsIGFuIG9mZnNldCBjYW4gYmUgYXBwbGllZFxuICogQHBhcmFtICB7Q2h1bmtzfSBmcm9tIGNodW5rcyB0byBjb3B5IGZyb21cbiAqIEBwYXJhbSAge0NodW5rc30gdG8gY2h1bmtzIHRvIGNvcHkgdG9cbiAqIEBwYXJhbSAge1ZlY3RvcjN9IG9mZnNldCBvcHRpb25hbCBvZmZzZXQgdG8gYXBwbHkgd2hlbiBjb3B5aW5nXG4gKi9cbmZ1bmN0aW9uIGNvcHlDaHVua3MoZnJvbSwgdG8sIG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfHwgWzAsIDAsIDBdO1xuICBmcm9tLnZpc2l0KGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgICB0by5zZXQoaSArIG9mZnNldFswXSwgaiArIG9mZnNldFsxXSwgayArIG9mZnNldFsyXSwgdik7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgZmxvYXRpbmcgYml0cyBmcm9tIGEgY2h1bmtcbiAqIEBwYXJhbSAge0NodW5rc30gY2h1bmtzOiBjaHVua3MgdG8gcHJvY2Vzc1xuICogQHBhcmFtICB7VmVjdG9yM30gc3RhcnRDb29yZDogY29vcmQgdG8gc3RhcnQgc2VhcmNoIGZyb20sIFxuICogYW55IGNvb3JkcyBub3QgY29ubmVjdGVkIHRvIHN0YXJ0Q29vcmQgd2lsbCBiZSByZW1vdmVkXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZsb2F0aW5nKGNodW5rcywgc3RhcnRDb29yZCkge1xuICB2YXIgbWFwID0ge307XG4gIGNodW5rcy52aXNpdChmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gICAgdmFyIGhhc2ggPSBbaSwgaiwga10uam9pbignLCcpO1xuICAgIG1hcFtoYXNoXSA9IHtcbiAgICAgIHZpc2l0ZWQ6IGZhbHNlLFxuICAgICAgY29vcmQ6IFtpLCBqLCBrXVxuICAgIH07XG4gIH0pO1xuXG4gIHZhciBsZWFkcyA9IFtzdGFydENvb3JkXTtcblxuICB3aGlsZSAobGVhZHMubGVuZ3RoID4gMCkge1xuICAgIHZhciByZXN1bHQgPSB2aXNpdChbMSwgMCwgMF0pIHx8XG4gICAgICB2aXNpdChbMCwgMSwgMF0pIHx8XG4gICAgICB2aXNpdChbMCwgMCwgMV0pIHx8XG4gICAgICB2aXNpdChbLTEsIDAsIDBdKSB8fFxuICAgICAgdmlzaXQoWzAsIC0xLCAwXSkgfHxcbiAgICAgIHZpc2l0KFswLCAwLCAtMV0pO1xuXG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIGxlYWRzLnBvcCgpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb3VudCA9IDA7XG4gIGZvciAodmFyIGlkIGluIG1hcCkge1xuICAgIGlmICghbWFwW2lkXS52aXNpdGVkKSB7XG4gICAgICB2YXIgY29vcmQgPSBtYXBbaWRdLmNvb3JkO1xuICAgICAgY2h1bmtzLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCBudWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB2aXNpdChkaXMpIHtcbiAgICB2YXIgY3VycmVudCA9IGxlYWRzW2xlYWRzLmxlbmd0aCAtIDFdO1xuXG4gICAgdmFyIG5leHQgPSBbY3VycmVudFswXSArIGRpc1swXSxcbiAgICAgIGN1cnJlbnRbMV0gKyBkaXNbMV0sXG4gICAgICBjdXJyZW50WzJdICsgZGlzWzJdXG4gICAgXTtcblxuICAgIHZhciBoYXNoID0gbmV4dC5qb2luKCcsJyk7XG5cbiAgICBpZiAobWFwW2hhc2hdID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobWFwW2hhc2hdLnZpc2l0ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgdiA9IGNodW5rcy5nZXQobmV4dFswXSwgbmV4dFsxXSwgbmV4dFsyXSk7XG4gICAgaWYgKCEhdikge1xuICAgICAgbWFwW2hhc2hdLnZpc2l0ZWQgPSB0cnVlO1xuICAgICAgbGVhZHMucHVzaChuZXh0KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcbn07XG5cblZveGVsLnZpc2l0U2hhcGUgPSB2aXNpdFNoYXBlO1xuVm94ZWwuY29weUNodW5rcyA9IGNvcHlDaHVua3M7XG5Wb3hlbC5yZW1vdmVGbG9hdGluZyA9IHJlbW92ZUZsb2F0aW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZveGVsO1xuXG4vKipcbiAqIENhbGxiYWNrIGZvciByZWFkaW5nIHZveGVsIGRhdGFcbiAqIEBjYWxsYmFjayB2aXNpdENhbGxiYWNrXG4gKiBAcGFyYW0ge0ludH0gaSBpXG4gKiBAcGFyYW0ge0ludH0gaiBqXG4gKiBAcGFyYW0ge0ludH0gaiBqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgdmFsdWUgYXQgY29vcmRcbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIGZvciBnZXR0aW5nIHZveGVsIGRhdGFcbiAqIEBjYWxsYmFjayBxdWVyeUZ1bmN0aW9uXG4gKiBAcGFyYW0ge0ludH0gaSBpXG4gKiBAcGFyYW0ge0ludH0gaiBqXG4gKiBAcGFyYW0ge0ludH0gayBrXG4gKiBAcmV0dXJuIHtPYmplY3R9IHZhbHVlIHN0b3JlZCBhdCBjb29yZFxuICovIiwidmFyIG1lc2hlciA9IHJlcXVpcmUoJy4vbWVzaGVyJyk7XG5cbi8qKlxuICogTWVzaCBDaHVua3NcbiAqIEBwYXJhbSAge0NodW5rc30gY2h1bmtzIGNodW5rcyB0byBtZXNoXG4gKiBAcGFyYW0gIHtUSFJFRS5PYmplY3QzRH0gcGFyZW50IHBhcmVudCBvYmplY3QgdG8gbWVzaCBpblxuICogQHBhcmFtICB7VEhSRUUuTWF0ZXJpYWx9IG1hdGVyaWFsIG1hdGVyaWFsIHRvIHVzZVxuICogQHBhcmFtICB7T2JqZWN0fSBhbiBvYmplY3Qgd2l0aCBrZXkgb3JpZ2luIGhhc2ggYW5kIHZhbHVlIGNhY2hlZCBnZW9tZXRyeSwgXG4gKiBpZiBhbiBlbXB0eSBvYmplY3QgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIHBvcHVsYXRlZCBmb3IgbmV4dCB1c2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaHVua3MsIHBhcmVudCwgbWF0ZXJpYWwsIGNhY2hlZCkge1xuICBmb3IgKHZhciBpZCBpbiBjaHVua3MubWFwKSB7XG4gICAgdmFyIGNodW5rID0gY2h1bmtzLm1hcFtpZF07XG4gICAgdmFyIGRhdGEgPSBjaHVuay5jaHVuaztcbiAgICBpZiAoY2h1bmsuZGlydHkpIHtcblxuICAgICAgaWYgKGNodW5rLm1lc2ggIT0gbnVsbCkge1xuICAgICAgICBjaHVuay5tZXNoLnBhcmVudC5yZW1vdmUoY2h1bmsubWVzaCk7XG4gICAgICAgIGNodW5rLm1lc2guZ2VvbWV0cnkuZGlzcG9zZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3JpZ2luID0gY2h1bmsub3JpZ2luO1xuXG4gICAgICB2YXIgY2FjaGVkR2VvbWV0cnkgPSBjYWNoZWQgPT0gbnVsbCA/IG51bGwgOiBjYWNoZWRbaWRdO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gY2FjaGVkR2VvbWV0cnkgfHwgbWVzaGVyKGNodW5rLmNodW5rKTtcbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG1lc2gucG9zaXRpb24uZnJvbUFycmF5KGNodW5rLm9yaWdpbik7XG4gICAgICBwYXJlbnQuYWRkKG1lc2gpO1xuXG4gICAgICBpZiAoY2FjaGVkICE9IG51bGwpIHtcbiAgICAgICAgY2FjaGVkW2lkXSA9IGdlb21ldHJ5O1xuICAgICAgfVxuXG4gICAgICBjaHVuay5kaXJ0eSA9IGZhbHNlO1xuICAgICAgY2h1bmsubWVzaCA9IG1lc2g7XG4gICAgfVxuICB9XG59IiwidmFyIGdyZWVkeU1lc2hlciA9IHJlcXVpcmUoJy4vZ3JlZWR5JykubWVzaGVyO1xuXG4vKipcbiAqIE1lc2ggQ2h1bmtcbiAqIEBwYXJhbSB7Q2h1bmt9IGNodW5rIGNodW5rIHRvIG1lc2hcbiAqIEBwYXJhbSB7cXVlcnlGdW5jdGlvbn0gZiBvcHRpb25hbCBxdWVyeSBmdW5jdGlvblxuICogQHJldHVybiB7VEhSRUUuR2VvbWV0cnl9IG1lc2hlZCBnZW9tZXRyeVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNodW5rLCBmKSB7XG4gIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gIGYgPSBmIHx8IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgICByZXR1cm4gY2h1bmsuZ2V0KGksIGosIGspO1xuICB9O1xuICB2YXIgcmVzdWx0ID0gZ3JlZWR5TWVzaGVyKGYsIGNodW5rLnNoYXBlKTtcblxuICByZXN1bHQudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgdmFyIHZlcnRpY2UgPSBuZXcgVEhSRUUuVmVjdG9yMyh2WzBdLCB2WzFdLCB2WzJdKTtcbiAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKHZlcnRpY2UpO1xuICB9KTtcblxuICByZXN1bHQuZmFjZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgdmFyIGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMoZlswXSwgZlsxXSwgZlsyXSk7XG4gICAgZmFjZS5tYXRlcmlhbEluZGV4ID0gZls0XTtcbiAgICBnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xuXG4gICAgZmFjZSA9IG5ldyBUSFJFRS5GYWNlMyhmWzJdLCBmWzNdLCBmWzBdKTtcbiAgICBmYWNlLm1hdGVyaWFsSW5kZXggPSBmWzRdO1xuICAgIGdlb21ldHJ5LmZhY2VzLnB1c2goZmFjZSk7XG4gIH0pO1xuXG4gIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbMF0gPSBbXTtcbiAgcmVzdWx0LnV2cy5mb3JFYWNoKGZ1bmN0aW9uKHV2KSB7XG4gICAgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1swXS5wdXNoKFtcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzBdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzFdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzJdKVxuICAgIF0sIFtcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzJdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzNdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzBdKVxuICAgIF0pO1xuICB9KTtcblxuICBnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcblxuICByZXR1cm4gZ2VvbWV0cnk7XG59OyIsInZhciBEaXIgPSB7fTtcblxuRGlyLkxFRlQgPSAwO1xuRGlyLlJJR0hUID0gMTtcbkRpci5CT1RUT00gPSAyO1xuRGlyLlVQID0gMztcbkRpci5CQUNLID0gNDtcbkRpci5GUk9OVCA9IDU7XG5cbkRpci5nZXRVbml0VmVjdG9yID0gZnVuY3Rpb24oZGlyKSB7XG4gIHN3aXRjaCAoZGlyKSB7XG4gICAgY2FzZSBcIjBcIjpcbiAgICBjYXNlIERpci5MRUZUOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKC0xLCAwLCAwKVxuICAgIGNhc2UgXCIxXCI6XG4gICAgY2FzZSBEaXIuUklHSFQ6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMClcbiAgICBjYXNlIFwiMlwiOlxuICAgIGNhc2UgRGlyLkJPVFRPTTpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAtMSwgMClcbiAgICBjYXNlIFwiM1wiOlxuICAgIGNhc2UgRGlyLlVQOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApXG4gICAgY2FzZSBcIjRcIjpcbiAgICBjYXNlIERpci5CQUNLOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIC0xKVxuICAgIGNhc2UgXCI1XCI6XG4gICAgY2FzZSBEaXIuRlJPTlQ6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSlcbiAgfVxufTtcblxuRGlyLnVuaXRWZWN0b3JUb0RpciA9IGZ1bmN0aW9uKHVuaXRWZWN0b3IpIHtcbiAgaWYgKHVuaXRWZWN0b3IuZXF1YWxzKG5ldyBUSFJFRS5WZWN0b3IzKC0xLCAwLCAwKSkpIHtcbiAgICByZXR1cm4gRGlyLkxFRlQ7XG4gIH0gZWxzZSBpZiAodW5pdFZlY3Rvci5lcXVhbHMobmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMCkpKSB7XG4gICAgcmV0dXJuIERpci5SSUdIVDtcbiAgfSBlbHNlIGlmICh1bml0VmVjdG9yLmVxdWFscyhuZXcgVEhSRUUuVmVjdG9yMygwLCAtMSwgMCkpKSB7XG4gICAgcmV0dXJuIERpci5CT1RUT007XG4gIH0gZWxzZSBpZiAodW5pdFZlY3Rvci5lcXVhbHMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCkpKSB7XG4gICAgcmV0dXJuIERpci5VUDtcbiAgfSBlbHNlIGlmICh1bml0VmVjdG9yLmVxdWFscyhuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAtMSkpKSB7XG4gICAgcmV0dXJuIERpci5CQUNLO1xuICB9IGVsc2UgaWYgKHVuaXRWZWN0b3IuZXF1YWxzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpKSkge1xuICAgIHJldHVybiBEaXIuRlJPTlQ7XG4gIH1cbn07XG5cbnZhciBnZXRRdWF0UmVzdWx0ID0ge307XG5EaXIuZ2V0UXVhdCA9IGZ1bmN0aW9uKGRpcikge1xuICBpZiAoZ2V0UXVhdFJlc3VsdFtkaXJdID09IG51bGwpIHtcbiAgICBnZXRRdWF0UmVzdWx0W2Rpcl0gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgRGlyLmdldFVuaXRWZWN0b3IoZGlyKSk7XG4gIH1cbiAgcmV0dXJuIGdldFF1YXRSZXN1bHRbZGlyXTtcbn07XG5cbkRpci5nZXRPcHBvc2l0ZSA9IGZ1bmN0aW9uKGRpcikge1xuICB2YXIgb3Bwb3NpdGVzID0ge1xuICAgIDA6IDEsXG4gICAgMTogMCxcbiAgICAyOiAzLFxuICAgIDM6IDIsXG4gICAgNDogNSxcbiAgICA1OiA0XG4gIH07XG5cbiAgcmV0dXJuIG9wcG9zaXRlc1tkaXJdO1xufTtcblxuRGlyLmlzT3Bwb3NpdGUgPSBmdW5jdGlvbihkaXIsIGRpcjIpIHtcbiAgcmV0dXJuIERpci5nZXRPcHBvc2l0ZShkaXIpID09PSBkaXIyO1xufTtcblxuRGlyLmlzQWRqYWNlbnQgPSBmdW5jdGlvbihkaXIsIGRpcjIpIHtcbiAgcmV0dXJuIGRpciAhPT0gZGlyMiAmJiAhdGhpcy5pc09wcG9zaXRlKGRpciwgZGlyMik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcjtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJlbnZcIjogXCJkZXZcIlxufSIsInZhciBTaW1wbGV4Tm9pc2UgPSByZXF1aXJlKCdzaW1wbGV4LW5vaXNlJyk7XG5cbnZhciBEaXIgPSByZXF1aXJlKCcuLi9kaXInKTtcbnZhciBWb3hlbCA9IHJlcXVpcmUoJ3ZveGVsJyk7XG52YXIgbWVzaGVyID0gVm94ZWwubWVzaGVyO1xudmFyIENodW5rcyA9IFZveGVsLkNodW5rcztcbnZhciBtZXNoQ2h1bmtzID0gVm94ZWwubWVzaENodW5rcztcblxudmFyIENMT1VEID0gMTA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2l6ZSwgcGFyZW50LCBtYXRlcmlhbCkge1xuXG4gIHZhciBjaHVua3MgPSBuZXcgQ2h1bmtzKCk7XG4gIHZhciBkYXRhTWFwID0ge307XG4gIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgcGFyZW50LmFkZChvYmplY3QpO1xuXG4gIHZhciBub2lzZTEgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlRjEgPSAwLjE7XG4gIHZhciBub2lzZTIgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlRjIgPSAwLjA1O1xuICB2YXIgbm9pc2VfcHJlc3N1cmUgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlX3ByZXNzdXJlRiA9IDAuMDAyO1xuICB2YXIgY2xvdWRBbW91bnQgPSAtMS4wO1xuICB2YXIgY291bnRlciA9IDA7XG4gIHZhciBjb29sZG93biA9IDQuMjtcblxuICB2YXIgYWxsQ29vcmRzID0ge307XG5cbiAgdmFyIGNlbnRlck51bSA9IChzaXplIC8gMik7XG4gIHZhciBjZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMygtc2l6ZSAvIDIsIC1zaXplIC8gMiwgLXNpemUgLyAyKTtcblxuICB2YXIgY2xvdWRWb3hlbCA9IFtcbiAgICBDTE9VRCwgQ0xPVUQsIENMT1VELCBDTE9VRCwgQ0xPVUQsIENMT1VEXG4gIF07XG5cbiAgaW5pdERhdGEoKTtcblxuICBmdW5jdGlvbiBpbml0RGF0YSgpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcblxuICAgIGZvciAodmFyIGRpciA9IDA7IGRpciA8IDY7IGRpcisrKSB7XG4gICAgICB2YXIgZCA9IE1hdGguZmxvb3IoZGlyIC8gMik7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIHZhciBjb29yZEQgPSBkaXIgJSAyID8gMCA6IHNpemUgLSAxO1xuICAgICAgdmFyIGZhbGxEaXIgPSBjb29yZEQgPT09IDAgPyAxIDogLTE7XG4gICAgICB2YXIgZmFsbENvb3JkRCA9IGNvb3JkRCArIGZhbGxEaXI7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgICAgY29vcmRbZF0gPSBjb29yZEQ7XG4gICAgICAgICAgY29vcmRbdV0gPSBpO1xuICAgICAgICAgIGNvb3JkW3ZdID0gajtcblxuICAgICAgICAgIHZhciByZWwgPSBbXG4gICAgICAgICAgICAoY29vcmRbMF0gKyBjZW50ZXIueCksXG4gICAgICAgICAgICAoY29vcmRbMV0gKyBjZW50ZXIueSksXG4gICAgICAgICAgICAoY29vcmRbMl0gKyBjZW50ZXIueilcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBwcmVzc3VyZTogbm9pc2VfcHJlc3N1cmUubm9pc2UzRChcbiAgICAgICAgICAgICAgcmVsWzBdICogbm9pc2VfcHJlc3N1cmVGLFxuICAgICAgICAgICAgICByZWxbMV0gKiBub2lzZV9wcmVzc3VyZUYsXG4gICAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlX3ByZXNzdXJlRlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGFtb3VudDogMCxcbiAgICAgICAgICAgIGRlbHRhOiAwLFxuICAgICAgICAgICAgY29vcmQ6IFtjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdXVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgaGFzaCA9IGNvb3JkLmpvaW4oJywnKTtcbiAgICAgICAgICBhbGxDb29yZHNbaGFzaF0gPSBbY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXV07XG4gICAgICAgICAgZGF0YU1hcFtoYXNoXSA9IGRhdGE7XG5cbiAgICAgICAgICB2YXIgdmFsdWUgPSBub2lzZTEubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRjEsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUYxLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGMVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB2YXIgdmFsdWUyID0gbm9pc2UyLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYyLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGMixcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRjJcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdmFsdWUgPSBNYXRoLnBvdyh2YWx1ZSArIHZhbHVlMiwgMSkgKyBjbG91ZEFtb3VudDtcblxuICAgICAgICAgIGlmICh2YWx1ZSA+IDAuMCkge1xuICAgICAgICAgICAgY2h1bmtzLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCBjbG91ZFZveGVsKTtcbiAgICAgICAgICAgIGRhdGEuYW1vdW50ICs9IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0YS5uZWlnaGJvdXJzID0gW107XG5cblxuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChmYWxsQ29vcmRELCBpLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGNvb3JkRCwgaSAtIDEsIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaSA9PT0gc2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpICsgMSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChmYWxsQ29vcmRELCBpLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGNvb3JkRCwgaSwgaiAtIDEsIGQsIHUsIHYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaiA9PT0gc2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpLCBqICsgMSwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkaXIgPT09IDApIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzBdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAxKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1sxXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gMikge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbM107XG4gICAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09IDMpIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzJdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVsSSA9IGkgLSBjZW50ZXJOdW07XG4gICAgICAgICAgICB2YXIgcmVsSiA9IGogLSBjZW50ZXJOdW07XG5cbiAgICAgICAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIocmVsSSwgcmVsSik7XG4gICAgICAgICAgICBhbmdsZSA9IG5vcm1hbGl6ZUFuZ2xlKGFuZ2xlKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbm9ybWFsaXplQW5nbGUoYW5nbGUpIHtcbiAgICAgICAgICAgICAgYW5nbGUgJT0gKE1hdGguUEkgKiAyKTtcbiAgICAgICAgICAgICAgaWYgKGFuZ2xlIDwgTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgIGFuZ2xlICs9IE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgIGFuZ2xlIC09IE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBhbmdsZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBNYXRoLlBJIC8gNDtcbiAgICAgICAgICAgIHZhciBzdGVwID0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSAtTWF0aC5QSTtcblxuICAgICAgICAgICAgaWYgKGFuZ2xlID49IG9mZnNldCAmJiBhbmdsZSA8IG9mZnNldCArIHN0ZXApIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ2xlID49IG9mZnNldCArIHN0ZXAgJiYgYW5nbGUgPCBvZmZzZXQgKyBzdGVwICogMikge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1syXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5nbGUgPj0gb2Zmc2V0IC0gc3RlcCAmJiBhbmdsZSA8IG9mZnNldCkge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1szXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZXRDb29yZChpLCBqLCBrLCBkLCB1LCB2KSB7XG4gICAgdmFyIGNvb3JkID0gW107XG4gICAgY29vcmRbZF0gPSBpO1xuICAgIGNvb3JkW3VdID0gajtcbiAgICBjb29yZFt2XSA9IGs7XG4gICAgcmV0dXJuIGNvb3JkO1xuICB9XG5cbiAgdXBkYXRlTWVzaCgpO1xuXG4gIG9iamVjdC5wb3NpdGlvbi5jb3B5KGNlbnRlcik7XG5cbiAgZnVuY3Rpb24gdGljayhkdCkge1xuICAgIGNvdW50ZXIgKz0gZHQ7XG4gICAgaWYgKGNvdW50ZXIgPiBjb29sZG93bikge1xuICAgICAgY291bnRlciAtPSBjb29sZG93bjtcblxuICAgICAgdmFyIGNoYW5nZWQgPSB7fTtcbiAgICAgIGZvciAodmFyIGlkIGluIGFsbENvb3Jkcykge1xuICAgICAgICB2YXIgY29vcmQgPSBhbGxDb29yZHNbaWRdO1xuICAgICAgICB2YXIgZGF0YSA9IGRhdGFNYXBbaWRdO1xuICAgICAgICB2YXIgbmV4dENvb3JkID0gZGF0YS5uZXh0Q29vcmQ7XG4gICAgICAgIGlmIChuZXh0Q29vcmQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEuYW1vdW50IDw9IDApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0SGFzaCA9IG5leHRDb29yZC5qb2luKCcsJyk7XG4gICAgICAgIHZhciBuZXh0RGF0YSA9IGRhdGFNYXBbbmV4dEhhc2hdO1xuICAgICAgICBjaGFuZ2VkW25leHRIYXNoXSA9IHRydWU7XG4gICAgICAgIGNoYW5nZWRbaWRdID0gdHJ1ZTtcblxuICAgICAgICBuZXh0RGF0YS5kZWx0YSArPSAxLjA7XG4gICAgICAgIGRhdGEuZGVsdGEgKz0gLTEuMDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaWQgaW4gY2hhbmdlZCkge1xuICAgICAgICB2YXIgZGF0YSA9IGRhdGFNYXBbaWRdO1xuICAgICAgICB2YXIgY29vcmQgPSBkYXRhLmNvb3JkO1xuICAgICAgICBkYXRhLmFtb3VudCArPSBkYXRhLmRlbHRhO1xuICAgICAgICBkYXRhLmRlbHRhID0gMDtcblxuICAgICAgICBpZiAoZGF0YS5hbW91bnQgPj0gMS4wKSB7XG4gICAgICAgICAgY2h1bmtzLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCBjbG91ZFZveGVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIDApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZU1lc2goKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gdXBkYXRlTWVzaCgpIHtcbiAgICBtZXNoQ2h1bmtzKGNodW5rcywgb2JqZWN0LCBtYXRlcmlhbCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0aWNrOiB0aWNrXG4gIH07XG59XG4iLCJ2YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBTaW1wbGV4Tm9pc2UgPSByZXF1aXJlKCdzaW1wbGV4LW5vaXNlJyk7XG5cbnZhciBWb3hlbCA9IHJlcXVpcmUoJ3ZveGVsJyk7XG52YXIgRGlyID0gcmVxdWlyZSgnLi4vLi4vZGlyJyk7XG52YXIgU3VyZmFjZU1hcCA9IHJlcXVpcmUoJy4vc3VyZmFjZW1hcCcpO1xuXG52YXIgQ2h1bmtzID0gVm94ZWwuQ2h1bmtzO1xudmFyIG1lc2hDaHVua3MgPSBWb3hlbC5tZXNoQ2h1bmtzO1xudmFyIHJlbW92ZUZsb2F0aW5nID0gVm94ZWwucmVtb3ZlRmxvYXRpbmc7XG5cbnZhciBHUkFTUyA9IDE7XG52YXIgU09JTCA9IDI7XG52YXIgU09JTF9FREdFID0gMztcbnZhciBTVE9ORSA9IDQ7XG52YXIgU0VBID0gNTtcbnZhciBTQU5EID0gNjtcblxudmFyIExFVkVMX1NVUkZBQ0UgPSAxO1xudmFyIExFVkVMX01JRERMRSA9IDI7XG52YXIgTEVWRUxfQ09SRSA9IDM7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2l6ZSwgcGFyZW50LCBtYXRlcmlhbCkge1xuICB2YXIgbm9pc2Vfc3VyZmFjZSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX3N1cmZhY2UgPSAwLjE7XG4gIHZhciBub2lzZV9zdXJmYWNlMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX3N1cmZhY2UyID0gMC4wNDtcblxuICB2YXIgbm9pc2VfYmlvbWVzID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZV9iaW9tZXMyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZV9iaW9tZXMzID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG5cbiAgdmFyIG5vaXNlX2Jpb21lc190cmVlcyA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX2Jpb21lc190cmVlcyA9IDAuMTtcblxuICB2YXIgbm9pc2VfYmlvbWVzX3RyZWVzMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX2Jpb21lc190cmVlczIgPSAwLjA0O1xuXG4gIHZhciBCSU9NRV9WQUxVRV9TVE9ORSA9IC0wLjg7XG4gIHZhciBCSU9NRV9WQUxVRV9TT0lMID0gMDtcblxuICB2YXIgc3VyZmFjZU1hcCA9IG5ldyBTdXJmYWNlTWFwKCk7XG5cbiAgdmFyIGdyb3VuZCA9IG5ldyBDaHVua3MoKTtcbiAgdmFyIHdhdGVyID0gbmV3IENodW5rcygpO1xuICB2YXIgYm91bmRzID0ge1xuICAgIG1pbjogbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCksXG4gICAgc2l6ZTogbmV3IFRIUkVFLlZlY3RvcjMoc2l6ZSwgc2l6ZSwgc2l6ZSlcbiAgfTtcblxuICB2YXIgY2VudGVyID0gWy1zaXplIC8gMiArIDAuNSwgLXNpemUgLyAyICsgMC41LCAtc2l6ZSAvIDIgKyAwLjVdO1xuICB2YXIgY2VudGVyQ29vcmQgPSBbXG4gICAgTWF0aC5mbG9vcihzaXplIC8gMiksXG4gICAgTWF0aC5mbG9vcihzaXplIC8gMiksXG4gICAgTWF0aC5mbG9vcihzaXplIC8gMilcbiAgXTtcblxuICAvLyBoYXNoIC0+IGRhdGFcbiAgLy8gZ3Jhdml0eTogZ3Jhdml0eSAocylcbiAgLy8gYmlvbWU6IGJpb21lIGRhdGFcbiAgLy8gaGVpZ2h0OiBoZWlnaHQgb2Ygc3VyZmFjZVxuICB2YXIgZGF0YU1hcCA9IHt9O1xuICB2YXIgc3VyZmFjZU51bSA9IDY7XG4gIHZhciBzZWFMZXZlbCA9IDI7XG5cbiAgdmFyIHBpdm90ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIHZhciBncm91bmRPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICBpbml0KCk7XG4gICAgZ2VuZXJhdGVHcmF2aXR5TWFwKCk7XG4gICAgZ2VuZXJhdGVCdW1wcygpO1xuICAgIHJlbW92ZUZsb2F0aW5nKGdyb3VuZCwgY2VudGVyQ29vcmQpO1xuICAgIGdlbmVyYXRlU2VhKCk7XG4gICAgZ2VuZXJhdGVCaW9tZXMoKTtcbiAgICBnZW5lcmF0ZVRpbGVzKCk7XG4gICAgZ2VuZXJhdGVTdXJmYWNlKCk7XG5cbiAgICBwaXZvdC5hZGQoZ3JvdW5kT2JqZWN0KTtcbiAgICBtZXNoQ2h1bmtzKGdyb3VuZCwgZ3JvdW5kT2JqZWN0LCBtYXRlcmlhbCk7XG4gICAgbWVzaENodW5rcyh3YXRlciwgcGl2b3QsIG1hdGVyaWFsKTtcblxuICAgIHZhciBwb3NpdGlvbkNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICAgIC5zdWJWZWN0b3JzKGJvdW5kcy5taW4sIGJvdW5kcy5zaXplKVxuICAgICAgLm11bHRpcGx5U2NhbGFyKDAuNSk7XG4gICAgcGl2b3QucG9zaXRpb24uY29weShwb3NpdGlvbkNlbnRlcik7XG4gICAgcGFyZW50LmFkZChwaXZvdCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICBncm91bmQuc2V0KGksIGosIGssIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU2VhKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgZCsrKSB7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIFtzZWFMZXZlbCwgc2l6ZSAtIHNlYUxldmVsIC0gMV0uZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBzZWFMZXZlbDsgaSA8IHNpemUgLSBzZWFMZXZlbDsgaSsrKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IHNlYUxldmVsOyBqIDwgc2l6ZSAtIHNlYUxldmVsOyBqKyspIHtcbiAgICAgICAgICAgIGNvb3JkW2RdID0gYztcbiAgICAgICAgICAgIGNvb3JkW3VdID0gaTtcbiAgICAgICAgICAgIGNvb3JkW3ZdID0gajtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgdmFyIGdyYXZpdHkgPSBkYXRhLmdyYXZpdHk7XG5cbiAgICAgICAgICAgIHZhciBibG9jayA9IFtcbiAgICAgICAgICAgICAgMCwgMCwgMCwgMCwgMCwgMFxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgZyBpbiBncmF2aXR5KSB7XG4gICAgICAgICAgICAgIGJsb2NrW2ddID0gU0VBO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSkpIHtcbiAgICAgICAgICAgICAgd2F0ZXIuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJpb21lcygpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGdyb3VuZC5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgTWF0aC5hYnMoaSArIGNlbnRlclswXSksXG4gICAgICAgICAgICBNYXRoLmFicyhqICsgY2VudGVyWzFdKSxcbiAgICAgICAgICAgIE1hdGguYWJzKGsgKyBjZW50ZXJbMl0pKTtcblxuICAgICAgICAgIHZhciByZWxTZWFMZXZlbCA9IChzaXplIC8gMiAtIGQgLSBzZWFMZXZlbCAtIDAuNSk7XG5cbiAgICAgICAgICBkIC89IChzaXplIC8gMik7XG5cbiAgICAgICAgICB2YXIgbm9pc2VGID0gMC4wNTtcbiAgICAgICAgICB2YXIgbm9pc2VGMiA9IDAuMDI7XG4gICAgICAgICAgdmFyIG5vaXNlRjMgPSAwLjAyO1xuXG4gICAgICAgICAgdmFyIHJlbCA9IFtpICsgY2VudGVyWzBdLCBqICsgY2VudGVyWzFdLCBrICsgY2VudGVyWzJdXTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBub2lzZV9iaW9tZXMubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRixcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRik7XG5cbiAgICAgICAgICB2YXIgdmFsdWUyID0gbm9pc2VfYmlvbWVzMi5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYyKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTMgPSBub2lzZV9iaW9tZXMzLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYzLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGMyxcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRjNcbiAgICAgICAgICApICsgdmFsdWU7XG5cbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlICogMC41ICsgdmFsdWUyICogMi4wO1xuXG4gICAgICAgICAgdmFyIGJpb21lID0ge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsdWUyOiB2YWx1ZTMsXG4gICAgICAgICAgICByZWxTZWFMZXZlbDogcmVsU2VhTGV2ZWxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHZhbHVlVHJlZSA9IG5vaXNlX2Jpb21lc190cmVlcy5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGX2Jpb21lc190cmVlcyxcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUZfYmlvbWVzX3RyZWVzXG4gICAgICAgICAgKSArIG5vaXNlX2Jpb21lc190cmVlczIubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMyLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGX2Jpb21lc190cmVlczIsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUZfYmlvbWVzX3RyZWVzMlxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvLyBCSU9NRSBiaWFzIGZvciB0cmVlXG4gICAgICAgICAgaWYgKHZhbHVlIDwgQklPTUVfVkFMVUVfU1RPTkUpIHtcbiAgICAgICAgICAgIHZhbHVlVHJlZSAtPSAxLjA7XG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IEJJT01FX1ZBTFVFX1NPSUwpIHtcbiAgICAgICAgICAgIHZhbHVlVHJlZSAtPSAwLjU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmlvbWUudHJlZSA9IHZhbHVlVHJlZTtcblxuICAgICAgICAgIHZhciBsZXZlbDtcblxuICAgICAgICAgIGlmIChkID4gMC43KSB7XG4gICAgICAgICAgICAvLyBzdXJmYWNlXG4gICAgICAgICAgICBsZXZlbCA9IExFVkVMX1NVUkZBQ0U7XG4gICAgICAgICAgfSBlbHNlIGlmIChkID4gMC4zKSB7XG4gICAgICAgICAgICAvLyBtaWRkbGVcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfTUlERExFO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb3JlXG4gICAgICAgICAgICBsZXZlbCA9IExFVkVMX0NPUkU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmlvbWUubGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShpLCBqLCBrKTtcbiAgICAgICAgICBkYXRhLmJpb21lID0gYmlvbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVHcmF2aXR5TWFwKCkge1xuICAgIHZhciBwYWRkaW5nID0gMjtcbiAgICBmb3IgKHZhciBpID0gLXBhZGRpbmc7IGkgPCBzaXplICsgcGFkZGluZzsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gLXBhZGRpbmc7IGogPCBzaXplICsgcGFkZGluZzsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAtcGFkZGluZzsgayA8IHNpemUgKyBwYWRkaW5nOyBrKyspIHtcbiAgICAgICAgICB2YXIgbWFwID0ge307XG4gICAgICAgICAgdmFyIGdyYXZpdHkgPSBjYWxjR3Jhdml0eShpLCBqLCBrKTtcbiAgICAgICAgICBncmF2aXR5LmZvckVhY2goZnVuY3Rpb24oZykge1xuICAgICAgICAgICAgbWFwW2ddID0ge1xuICAgICAgICAgICAgICBkaXI6IGdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGksIGosIGspO1xuICAgICAgICAgIGRhdGEuZ3Jhdml0eSA9IG1hcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBjYWxjR3Jhdml0eShpLCBqLCBrKSB7XG4gICAgdmFyIGFycmF5ID0gW1xuICAgICAgaSArIGNlbnRlclswXSxcbiAgICAgIGogKyBjZW50ZXJbMV0sXG4gICAgICBrICsgY2VudGVyWzJdXG4gICAgXTtcbiAgICB2YXIgbWF4ID0gLUluZmluaXR5O1xuICAgIHZhciBpbmRleGVzID0gW107XG4gICAgdmFyIGY7XG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBhcnJheS5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIGEgPSBNYXRoLmFicyhhcnJheVtkXSk7XG4gICAgICBpZiAoYSA+IG1heCkge1xuICAgICAgICBtYXggPSBhO1xuICAgICAgICBmID0gZCAqIDIgKyAoYXJyYXlbZF0gPiAwID8gMCA6IDEpO1xuICAgICAgICBpbmRleGVzID0gW2ZdO1xuICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhhIC0gbWF4KSA8IDAuMDEpIHtcbiAgICAgICAgZiA9IGQgKiAyICsgKGFycmF5W2RdID4gMCA/IDAgOiAxKTtcbiAgICAgICAgaW5kZXhlcy5wdXNoKGYpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5kZXhlcztcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJ1bXBzKCkge1xuICAgIC8vIEdlbmVyYXRlIHN1cmZhY2VcblxuICAgIHZhciBjUmFuZ2UgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3VyZmFjZU51bTsgaSsrKSB7XG4gICAgICBjUmFuZ2UucHVzaCgwICsgaSwgc2l6ZSAtIDEgLSBpKTtcbiAgICB9XG5cbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IDM7IGQrKykge1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG4gICAgICBjUmFuZ2UuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcblxuICAgICAgICAgICAgdmFyIGRpcyA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICBNYXRoLmFicyhjb29yZFswXSArIGNlbnRlclswXSksXG4gICAgICAgICAgICAgIE1hdGguYWJzKGNvb3JkWzFdICsgY2VudGVyWzFdKSxcbiAgICAgICAgICAgICAgTWF0aC5hYnMoY29vcmRbMl0gKyBjZW50ZXJbMl0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgZGlzQmlhcyA9IDEgLSAoc2l6ZSAvIDIgKyAwLjUgLSBkaXMpIC8gc3VyZmFjZU51bTtcblxuICAgICAgICAgICAgY29vcmRbZF0gPSBjO1xuICAgICAgICAgICAgY29vcmRbdV0gPSBqO1xuICAgICAgICAgICAgY29vcmRbdl0gPSBrO1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gWzAsIDAsIDBdO1xuICAgICAgICAgICAgdmFyIG9mZnNldDIgPSBbMCwgMCwgMF07XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG5vaXNlX3N1cmZhY2Uubm9pc2UzRChcbiAgICAgICAgICAgICAgKGNvb3JkWzBdICsgY2VudGVyWzBdICsgb2Zmc2V0WzBdKSAqIG5vaXNlRl9zdXJmYWNlLFxuICAgICAgICAgICAgICAoY29vcmRbMV0gKyBjZW50ZXJbMV0gKyBvZmZzZXRbMV0pICogbm9pc2VGX3N1cmZhY2UsXG4gICAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlclsyXSArIG9mZnNldFsyXSkgKiBub2lzZUZfc3VyZmFjZSk7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZTIgPSBub2lzZV9zdXJmYWNlMi5ub2lzZTNEKFxuICAgICAgICAgICAgICAoY29vcmRbMF0gKyBjZW50ZXJbMF0gKyBvZmZzZXQyWzBdKSAqIG5vaXNlRl9zdXJmYWNlMixcbiAgICAgICAgICAgICAgKGNvb3JkWzFdICsgY2VudGVyWzFdICsgb2Zmc2V0MlsxXSkgKiBub2lzZUZfc3VyZmFjZTIsXG4gICAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlclsyXSArIG9mZnNldDJbMl0pICogbm9pc2VGX3N1cmZhY2UyKTtcblxuICAgICAgICAgICAgdmFsdWUgPVxuICAgICAgICAgICAgICAoTWF0aC5wb3codmFsdWUyIC8gMS41LCAxKSAqIGRpc0JpYXMpICtcbiAgICAgICAgICAgICAgKC1NYXRoLnBvdyhkaXNCaWFzLCAxLjApICogMS4wICsgMC42KTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMC4wKSB7XG4gICAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICAgICAgZGF0YS5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgZ3JvdW5kLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVN1cmZhY2UoKSB7XG4gICAgc3VyZmFjZU1hcC51cGRhdGUoc2VsZik7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNTdXJmYWNlKGksIGosIGssIGYpIHtcbiAgICB2YXIgZCA9IE1hdGguZmxvb3IoZiAvIDIpOyAvLyAwIDEgMiBcbiAgICB2YXIgZGQgPSAoZiAtIGQgKiAyKSA/IC0xIDogMTsgLy8gLTEgb3IgMVxuXG4gICAgdmFyIGNvb3JkID0gW2ksIGosIGtdO1xuICAgIGNvb3JkW2RdICs9IGRkO1xuXG4gICAgcmV0dXJuICFncm91bmQuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pICYmICF3YXRlci5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVUaWxlcygpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICAvLyBHZW5lcmF0ZSBncmFzc2VzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XG4gICAgICAgICAgdmFyIHYgPSBncm91bmQuZ2V0KGksIGosIGspO1xuICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZ3JvdW5kLnNldChpLCBqLCBrLCBbXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAwKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDEpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMiksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAzKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDQpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgNSlcbiAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldChwb3MsIGYpIHtcbiAgICAgIHZhciBkID0gTWF0aC5mbG9vcihmIC8gMik7IC8vIDAgMSAyXG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcblxuICAgICAgdmFyIGRkID0gKGYgLSBkICogMikgPyAtMSA6IDE7IC8vIC0xIG9yIDFcblxuICAgICAgY29vcmRbZF0gPSBwb3NbZF0gKyBkZDtcbiAgICAgIGNvb3JkW3VdID0gcG9zW3VdO1xuICAgICAgY29vcmRbdl0gPSBwb3Nbdl07XG5cbiAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShwb3NbMF0sIHBvc1sxXSwgcG9zWzJdKTtcbiAgICAgIHZhciBiaW9tZSA9IGRhdGEuYmlvbWU7XG5cbiAgICAgIHZhciBsZXZlbCA9IGJpb21lLmxldmVsO1xuICAgICAgdmFyIHZhbHVlID0gYmlvbWUudmFsdWU7XG5cbiAgICAgIGlmIChsZXZlbCA9PT0gTEVWRUxfU1VSRkFDRSkge1xuXG4gICAgICAgIC8vIElmIGF0IHNlYSBsZXZlbCwgZ2VuZXJhdGUgc2FuZFxuICAgICAgICBpZiAoYmlvbWUucmVsU2VhTGV2ZWwgPT09IDApIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gICAgICAgICAgdmFyIGhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgICAgIGlmIChiaW9tZS52YWx1ZTIgKiBoZWlnaHQgPCAtMC4xKSB7XG4gICAgICAgICAgICB2YXIgYWJvdmUgPSBncm91bmQuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgdmFyIGlzU3VyZmFjZSA9ICFhYm92ZTtcbiAgICAgICAgICAgIGlmIChpc1N1cmZhY2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFNBTkQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlIDwgQklPTUVfVkFMVUVfU1RPTkUpIHtcbiAgICAgICAgICByZXR1cm4gU1RPTkU7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPCBCSU9NRV9WQUxVRV9TT0lMKSB7XG4gICAgICAgICAgcmV0dXJuIFNPSUw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPbiBlZGdlXG4gICAgICAgIHZhciBncmF2aXR5ID0gZGF0YS5ncmF2aXR5O1xuICAgICAgICBpZiAoZ3Jhdml0eVtmXSAhPSBudWxsICYmIChiaW9tZS5yZWxTZWFMZXZlbCA8PSAwKSkge1xuICAgICAgICAgIHJldHVybiBHUkFTUztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gU09JTDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PT0gTEVWRUxfTUlERExFKSB7XG5cbiAgICAgIH0gZWxzZSBpZiAobGV2ZWwgPT09IExFVkVMX0NPUkUpIHtcblxuICAgICAgfVxuXG4gICAgICByZXR1cm4gU1RPTkU7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZXREYXRhKGksIGosIGspIHtcbiAgICB2YXIgaGFzaCA9IFtpLCBqLCBrXS5qb2luKCcsJyk7XG4gICAgaWYgKGRhdGFNYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgICAgZGF0YU1hcFtoYXNoXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gZGF0YU1hcFtoYXNoXTtcbiAgfTtcblxuICB2YXIgc2VsZiA9IHtcbiAgICBncm91bmQ6IGdyb3VuZCxcbiAgICB3YXRlcjogd2F0ZXIsXG4gICAgYm91bmRzOiBib3VuZHMsXG4gICAgb2JqZWN0OiBwaXZvdCxcbiAgICBjYWxjR3Jhdml0eTogY2FsY0dyYXZpdHksXG4gICAgc3VyZmFjZU1hcDogc3VyZmFjZU1hcCxcbiAgICBncm91bmRPYmplY3Q6IGdyb3VuZE9iamVjdCxcbiAgICBnZXREYXRhOiBnZXREYXRhLFxuICAgIGlzU3VyZmFjZTogaXNTdXJmYWNlXG4gIH07XG5cbiAgc3RhcnQoKTtcblxuICByZXR1cm4gc2VsZjtcbn07XG4iLCJ2YXIgVm94ZWwgPSByZXF1aXJlKCd2b3hlbCcpO1xudmFyIERpciA9IHJlcXVpcmUoJy4uLy4uL0RpcicpO1xudmFyIENodW5rcyA9IFZveGVsLkNodW5rcztcbnZhciBHcmFwaCA9IHJlcXVpcmUoJ25vZGUtZGlqa3N0cmEnKTtcblxudmFyIFN1cmZhY2VNYXAgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jaHVua3MgPSBuZXcgQ2h1bmtzKCk7XG4gIHRoaXMuZ3JhcGhNYXAgPSB7fTtcbiAgdGhpcy5ncmFwaCA9IG5ldyBHcmFwaCgpO1xuICB0aGlzLmxvb2t1cCA9IHt9O1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGVycmlhbikge1xuICB2YXIgdXBWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKTtcbiAgdmFyIGNlbnRlck9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKDAuNSwgMC41LCAwLjUpO1xuICB2YXIgZ3JvdW5kID0gdGVycmlhbi5ncm91bmQ7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBncm91bmQudmlzaXQoZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICAgIHZhciBkYXRhID0gdGVycmlhbi5nZXREYXRhKGksIGosIGspO1xuICAgIHZhciBzdXJmYWNlID0gZGF0YS5zdXJmYWNlIHx8IHt9O1xuICAgIHZhciBncmF2aXR5ID0gZGF0YS5ncmF2aXR5O1xuXG4gICAgZm9yICh2YXIgZiBpbiBncmF2aXR5KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdGVycmlhbi5pc1N1cmZhY2UoaSwgaiwgaywgZik7XG5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdmFyIHN1cmZhY2VzID0gc2VsZi5jaHVua3MuZ2V0KGksIGosIGspO1xuICAgICAgICBpZiAoc3VyZmFjZXMgPT0gbnVsbCkge1xuICAgICAgICAgIHN1cmZhY2VzID0ge307XG4gICAgICAgICAgc2VsZi5jaHVua3Muc2V0KGksIGosIGssIHN1cmZhY2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1bml0VmVjdG9yID0gRGlyLmdldFVuaXRWZWN0b3IoZikubXVsdGlwbHlTY2FsYXIoLTEpO1xuICAgICAgICB2YXIgcG9zaXRpb25BYm92ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKGksIGosIGspLmFkZCh1bml0VmVjdG9yKS5hZGQoY2VudGVyT2Zmc2V0KTtcbiAgICAgICAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyh1cFZlY3RvciwgdW5pdFZlY3Rvcik7XG4gICAgICAgIHZhciBpbnZlcnNlUXVhdCA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbVVuaXRWZWN0b3JzKHVuaXRWZWN0b3IsIHVwVmVjdG9yKTtcblxuICAgICAgICB2YXIgaGFzaCA9IFtpLCBqLCBrLCBmXS5qb2luKCcsJyk7XG4gICAgICAgIHN1cmZhY2VzW2ZdID0ge1xuICAgICAgICAgIGNvb3JkOiBbaSwgaiwga10sXG4gICAgICAgICAgaGFzaDogaGFzaCxcbiAgICAgICAgICBmYWNlOiBmLFxuICAgICAgICAgIHBvc2l0aW9uQWJvdmU6IHBvc2l0aW9uQWJvdmUsXG4gICAgICAgICAgcXVhdDogcXVhdCxcbiAgICAgICAgICBpbnZlcnNlUXVhdDogaW52ZXJzZVF1YXQsXG4gICAgICAgICAgY29ubmVjdGlvbnM6IHt9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmxvb2t1cFtoYXNoXSA9IHN1cmZhY2VzW2ZdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLnZpc2l0KGZ1bmN0aW9uKHN1cmZhY2UpIHtcbiAgICBzZWxmLnVwZGF0ZUNvbm5lY3Rpb25zKHN1cmZhY2UpO1xuICB9KTtcblxuICB0aGlzLmdyYXBoID0gbmV3IEdyYXBoKHRoaXMuZ3JhcGhNYXApO1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUudXBkYXRlQ29ubmVjdGlvbnMgPSBmdW5jdGlvbihzdXJmYWNlKSB7XG4gIHZhciBjb29yZCA9IHN1cmZhY2UuY29vcmQ7XG4gIHZhciBmID0gc3VyZmFjZS5mYWNlO1xuICB2YXIgZCA9IE1hdGguZmxvb3Ioc3VyZmFjZS5mYWNlIC8gMik7XG4gIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gIHZhciB2ID0gKGQgKyAyKSAlIDM7XG5cbiAgZm9yICh2YXIgaSA9IC0xOyBpIDw9IDE7IGkrKykge1xuICAgIGZvciAodmFyIGogPSAtMTsgaiA8PSAxOyBqKyspIHtcbiAgICAgIGZvciAodmFyIGsgPSAtMTsgayA8PSAxOyBrKyspIHtcbiAgICAgICAgdmFyIGNvb3JkMiA9IFtjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdXTtcbiAgICAgICAgY29vcmQyW2RdICs9IGk7XG4gICAgICAgIGNvb3JkMlt1XSArPSBqO1xuICAgICAgICBjb29yZDJbdl0gKz0gaztcbiAgICAgICAgdmFyIHN1cmZhY2VzID0gdGhpcy5nZXRBdChjb29yZDJbMF0sIGNvb3JkMlsxXSwgY29vcmQyWzJdKTtcbiAgICAgICAgdmFyIGZvcndhcmRWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKTtcblxuICAgICAgICBmb3IgKHZhciBmMiBpbiBzdXJmYWNlcykge1xuICAgICAgICAgIHZhciBzdXJmYWNlMiA9IHN1cmZhY2VzW2YyXTtcblxuICAgICAgICAgIGlmIChzdXJmYWNlID09PSBzdXJmYWNlMikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGRpc1ZlY3RvciA9IHN1cmZhY2UyLnBvc2l0aW9uQWJvdmUuY2xvbmUoKS5zdWIoc3VyZmFjZS5wb3NpdGlvbkFib3ZlKTtcbiAgICAgICAgICB2YXIgZGlzID0gZGlzVmVjdG9yLmxlbmd0aCgpO1xuICAgICAgICAgIHZhciBxdWF0VmVjdG9yID0gZGlzVmVjdG9yLmNsb25lKCkubm9ybWFsaXplKCk7XG4gICAgICAgICAgdmFyIHF1YXRWZWN0b3JBcnJheSA9IHF1YXRWZWN0b3IudG9BcnJheSgpO1xuICAgICAgICAgIHF1YXRWZWN0b3JBcnJheVtkXSA9IDA7XG4gICAgICAgICAgcXVhdFZlY3RvclxuICAgICAgICAgICAgLmZyb21BcnJheShxdWF0VmVjdG9yQXJyYXkpXG4gICAgICAgICAgICAubm9ybWFsaXplKClcbiAgICAgICAgICAgIC5hcHBseVF1YXRlcm5pb24oc3VyZmFjZS5pbnZlcnNlUXVhdCk7XG5cbiAgICAgICAgICBpZiAoZGlzIDwgMikge1xuICAgICAgICAgICAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyhcbiAgICAgICAgICAgICAgZm9yd2FyZFZlY3RvcixcbiAgICAgICAgICAgICAgcXVhdFZlY3Rvcik7XG4gICAgICAgICAgICBzdXJmYWNlLmNvbm5lY3Rpb25zW3N1cmZhY2UyLmhhc2hdID0ge1xuICAgICAgICAgICAgICBzdXJmYWNlOiBzdXJmYWNlMixcbiAgICAgICAgICAgICAgZGlzOiBkaXMsXG4gICAgICAgICAgICAgIHF1YXQ6IHF1YXRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdyYXBoTWFwW3N1cmZhY2UuaGFzaF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLmdyYXBoTWFwW3N1cmZhY2UuaGFzaF0gPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ3JhcGhNYXBbc3VyZmFjZS5oYXNoXVtzdXJmYWNlMi5oYXNoXSA9IGRpcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblN1cmZhY2VNYXAucHJvdG90eXBlLmZpbmRTaG9ydGVzdCA9IGZ1bmN0aW9uKHN1cmZhY2UsIHN1cmZhY2UyLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge1xuICAgIGdldERpc3RhbmNlOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgICB2YXIgZGlzRGlmZlJhdGlvID0gMTAuMFxuICAgICAgdmFyIHN1cmZhY2VBID0gc2VsZi5nZXRXaXRoSGFzaChhKTtcbiAgICAgIHZhciBzdXJmYWNlQiA9IHNlbGYuZ2V0V2l0aEhhc2goYik7XG4gICAgICBpZiAoc3VyZmFjZUEuYmxvY2tlZCB8fCBzdXJmYWNlQi5ibG9ja2VkKSB7XG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgIH1cbiAgICAgIHZhciBkZXN0ID0gc3VyZmFjZTI7XG5cbiAgICAgIHZhciBkaXMgPSBzZWxmLmdyYXBoTWFwW2FdW2JdO1xuXG4gICAgICB2YXIgZGlzRGlmZiA9IChzdXJmYWNlQi5wb3NpdGlvbkFib3ZlLmNsb25lKCkuZGlzdGFuY2VUbyhkZXN0LnBvc2l0aW9uQWJvdmUpKSAtXG4gICAgICAgIChzdXJmYWNlQS5wb3NpdGlvbkFib3ZlLmNsb25lKCkuZGlzdGFuY2VUbyhkZXN0LnBvc2l0aW9uQWJvdmUpKTtcblxuICAgICAgcmV0dXJuIGRpcyArIGRpc0RpZmYgKiBkaXNEaWZmUmF0aW87XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzLmdyYXBoLnNob3J0ZXN0UGF0aChzdXJmYWNlLmhhc2gsIHN1cmZhY2UyLmhhc2gsIG9wdGlvbnMpO1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUuZ2V0QXQgPSBmdW5jdGlvbihpLCBqLCBrKSB7XG4gIHJldHVybiB0aGlzLmNodW5rcy5nZXQoaSwgaiwgaykgfHwge307XG59O1xuXG5TdXJmYWNlTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpLCBqLCBrLCBmKSB7XG4gIHJldHVybiB0aGlzLmdldEF0KGksIGosIGspW2ZdO1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUuZ2V0V2l0aEhhc2ggPSBmdW5jdGlvbihoYXNoKSB7XG4gIHJldHVybiB0aGlzLmxvb2t1cFtoYXNoXTtcbn07XG5cblN1cmZhY2VNYXAucHJvdG90eXBlLnZpc2l0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdGhpcy5jaHVua3MudmlzaXQoZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICAgIGZvciAodmFyIGYgaW4gdikge1xuICAgICAgY2FsbGJhY2sodltmXSk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3VyZmFjZU1hcDtcbiIsInZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFZveGVsID0gcmVxdWlyZSgndm94ZWwnKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuLi8uLi9kaXInKTtcblxudmFyIENodW5rcyA9IFZveGVsLkNodW5rcztcbnZhciB2aXNpdFNoYXBlID0gVm94ZWwudmlzaXRTaGFwZTtcbnZhciBtZXNoQ2h1bmtzID0gVm94ZWwubWVzaENodW5rcztcbnZhciBjb3B5Q2h1bmtzID0gVm94ZWwuY29weUNodW5rcztcbnZhciByZW1vdmVGbG9hdGluZyA9IFZveGVsLnJlbW92ZUZsb2F0aW5nO1xuXG52YXIgVFJVTksgPSBbMjAsIDIwLCAyMCwgMjAsIDIwLCAyMF07XG52YXIgTEVBRiA9IFsyMSwgMjEsIDIxLCAyMSwgMjEsIDIxXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJlbnQsIGJsb2NrTWF0ZXJpYWwsIHRlcnJpYW4pIHtcbiAgdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcblxuICB2YXIgc3BhcnNlID0gMC4yO1xuICB2YXIgdHJlZU51bSA9IDAuNTtcblxuICBmdW5jdGlvbiBhZGQoY29vcmQsIGRpcikge1xuXG4gICAgdmFyIGNodW5rczIgPSByZXF1aXJlKCcuL3BpbmUnKShjb29yZCwgZGlyKTtcblxuICAgIGNvcHlDaHVua3MoY2h1bmtzMiwgY2h1bmtzLCBjb29yZC50b0FycmF5KCkpO1xuICAgIG1lc2hDaHVua3MoY2h1bmtzLCBvYmplY3QsIGJsb2NrTWF0ZXJpYWwpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIHZhciBpbnZlcnNlU2NhbGUgPSAxIC8gc2VsZi5zY2FsZTtcbiAgICBvYmplY3Quc2NhbGUuc2V0KHNlbGYuc2NhbGUsIHNlbGYuc2NhbGUsIHNlbGYuc2NhbGUpO1xuICAgIHBhcmVudC5hZGQob2JqZWN0KTtcblxuICAgIHRlcnJpYW4uc3VyZmFjZU1hcC52aXNpdChmdW5jdGlvbihzdXJmYWNlKSB7XG4gICAgICB2YXIgZGF0YSA9IHRlcnJpYW4uZ2V0RGF0YShzdXJmYWNlLmNvb3JkWzBdLCBzdXJmYWNlLmNvb3JkWzFdLCBzdXJmYWNlLmNvb3JkWzJdKTtcblxuICAgICAgLy8gTm8gdHJlZXMgdW5kZXIgc2VhIGxldmVsXG4gICAgICBpZiAoZGF0YS5iaW9tZS5yZWxTZWFMZXZlbCA+IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBIb3cgc3BhcnNlIHRyZWVzIHNob3VsZCBiZVxuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiBzcGFyc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5iaW9tZS50cmVlIDwgdHJlZU51bSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBmID0gRGlyLmdldE9wcG9zaXRlKHN1cmZhY2UuZmFjZSk7XG5cbiAgICAgIC8vIFN0YXJ0IGZyb20gY2VudGVyIG9mIGJsb2NrLCBleHRlbmQgZm9yIGhhbGYgYSBibG9ja1xuICAgICAgdmFyIGNvb3JkID1cbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoc3VyZmFjZS5jb29yZFswXSwgc3VyZmFjZS5jb29yZFsxXSwgc3VyZmFjZS5jb29yZFsyXSlcbiAgICAgICAgLmFkZChuZXcgVEhSRUUuVmVjdG9yMygwLjUsIDAuNSwgMC41KSlcbiAgICAgICAgLmFkZChEaXIuZ2V0VW5pdFZlY3RvcihmKS5tdWx0aXBseVNjYWxhcigwLjUpKTtcblxuICAgICAgLy8gcmFuZG9taXplIHV2IGNvb3JkXG4gICAgICB2YXIgZCA9IE1hdGguZmxvb3IoZiAvIDIpO1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG5cbiAgICAgIHZhciB1diA9IFswLCAwLCAwXTtcblxuICAgICAgY29vcmQuYWRkKG5ldyBUSFJFRS5WZWN0b3IzKCkuZnJvbUFycmF5KHV2KSk7XG5cbiAgICAgIC8vIDEgdHJlZSBwZXIgdGVycmlhbiBncmlkXG4gICAgICBjb29yZC5tdWx0aXBseVNjYWxhcigxIC8gc2VsZi5zY2FsZSk7XG5cbiAgICAgIGNvb3JkLnggPSBNYXRoLnJvdW5kKGNvb3JkLngpO1xuICAgICAgY29vcmQueSA9IE1hdGgucm91bmQoY29vcmQueSk7XG4gICAgICBjb29yZC56ID0gTWF0aC5yb3VuZChjb29yZC56KTtcblxuICAgICAgdmFyIGFycmF5ID0gY29vcmQudG9BcnJheSgpO1xuICAgICAgYXJyYXlbdV0gLT0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaW52ZXJzZVNjYWxlKTtcbiAgICAgIGFycmF5W3ZdIC09IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGludmVyc2VTY2FsZSk7XG4gICAgICBjb29yZC5mcm9tQXJyYXkoYXJyYXkpO1xuXG4gICAgICBhZGQoY29vcmQsIGYpO1xuXG4gICAgICBzdXJmYWNlLmJsb2NrZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgdmFyIHNlbGYgPSB7XG4gICAgYWRkOiBhZGQsXG4gICAgb2JqZWN0OiBvYmplY3QsXG4gICAgc2NhbGU6ICgxIC8gMi4wKVxuICB9O1xuXG4gIHN0YXJ0KCk7XG5cbiAgcmV0dXJuIHNlbGY7XG59OyIsInZhciBEaXIgPSByZXF1aXJlKCcuLi8uLi9kaXInKTtcbnZhciBWb3hlbCA9IHJlcXVpcmUoJ3ZveGVsJyk7XG52YXIgQ2h1bmtzID0gVm94ZWwuQ2h1bmtzO1xudmFyIHZpc2l0U2hhcGUgPSBWb3hlbC52aXNpdFNoYXBlO1xudmFyIHJlbW92ZUZsb2F0aW5nID0gVm94ZWwucmVtb3ZlRmxvYXRpbmc7XG5cbnZhciBMRUFGID0gWzIxLCAyMSwgMjEsIDIxLCAyMSwgMjFdO1xudmFyIFRSVU5LID0gWzIwLCAyMCwgMjAsIDIwLCAyMCwgMjBdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvb3JkLCBkaXIpIHtcbiAgLy8gTGVhZiBoZWlnaHQgLyB3aWR0aFxuICB2YXIgc2hhcGVSYXRpbyA9IDI7XG4gIC8vIERlbnNpdHkgb2YgbGVhZnNcbiAgdmFyIGRlbnNpdHkgPSAwLjk7XG4gIC8vIFZhcmlhYmxlIHNpemVcbiAgdmFyIHZhclNpemUgPSAzO1xuICAvLyBCYXNlIHNpemVcbiAgdmFyIGJhc2VTaXplID0gMztcbiAgLy8gQ3VydmUgZm9yIHZhcmlhYmxlIHNpemVcbiAgdmFyIHZhclNpemVDdXJ2ZSA9IDIuMDtcblxuICB2YXIgcmFuID0gTWF0aC5yYW5kb20oKTtcbiAgdmFyIHJhZGl1cyA9IE1hdGgucG93KHJhbiwgdmFyU2l6ZUN1cnZlKSAqIHZhclNpemUgKyBiYXNlU2l6ZTtcbiAgdmFyIHNoYXBlMiA9IHJhZGl1cyAqIHNoYXBlUmF0aW87XG4gIHZhciBsZWFmSGVpZ2h0ID0gcmFuIDwgMC41ID8gMiA6IDM7XG4gIHZhciB0cnVua0hlaWdodCA9IGxlYWZIZWlnaHQgKyBzaGFwZTIgLSA0O1xuXG4gIHZhciByYWRpdXMgPSByYWRpdXMgKiBNYXRoLnNxcnQoMikgLyAyO1xuXG4gIGlmIChkaXIgPT0gbnVsbCkge1xuICAgIHZhciB0ZXJyaWFuQ29vcmQgPSBjb29yZC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNlbGYuc2NhbGUpO1xuICAgIHZhciBncmF2aXR5ID0gdGVycmlhbi5jYWxjR3Jhdml0eSh0ZXJyaWFuQ29vcmQueCwgdGVycmlhbkNvb3JkLnksIHRlcnJpYW5Db29yZC56KTtcbiAgICBkaXIgPSBEaXIuZ2V0T3Bwb3NpdGUoZ3Jhdml0eVtNYXRoLmZsb29yKGdyYXZpdHkubGVuZ3RoICogTWF0aC5yYW5kb20oKSldKTtcbiAgfVxuXG4gIHZhciB1cFZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApO1xuICB2YXIgdW5pdFZlY3RvciA9IERpci5nZXRVbml0VmVjdG9yKGRpcik7XG4gIHZhciBxdWF0ID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tVW5pdFZlY3RvcnModXBWZWN0b3IsIHVuaXRWZWN0b3IpO1xuICB2YXIgZCA9IE1hdGguZmxvb3IoZGlyIC8gMik7XG4gIHZhciBzaWRlID0gZGlyICUgMiA9PT0gMDtcblxuICB2YXIgbGVhZlNoYXBlID0gW3JhZGl1cywgc2hhcGUyLCByYWRpdXNdO1xuXG4gIHZhciBsZWFmQ2VudGVyID0gW1xuICAgIE1hdGgucm91bmQoLWxlYWZTaGFwZVswXSAvIDIpLFxuICAgIE1hdGgucm91bmQoLWxlYWZTaGFwZVsxXSAvIDIpLFxuICAgIE1hdGgucm91bmQoLWxlYWZTaGFwZVsyXSAvIDIpXG4gIF07XG5cbiAgdmFyIGNodW5rczIgPSBuZXcgQ2h1bmtzKCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cnVua0hlaWdodDsgaSsrKSB7XG4gICAgdmFyIGMgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCBpLCAwKS5hcHBseVF1YXRlcm5pb24ocXVhdCk7XG4gICAgaWYgKHNpZGUpIHtcbiAgICAgIGMuYWRkKHVuaXRWZWN0b3IpO1xuICAgIH1cblxuICAgIHJvdW5kVmVjdG9yKGMpO1xuICAgIGNodW5rczIuc2V0KGMueCwgYy55LCBjLnosIFRSVU5LKTtcbiAgfVxuXG4gIHZpc2l0U2hhcGUobGVhZlNoYXBlLCBmdW5jdGlvbihpLCBqLCBrKSB7XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiBkZW5zaXR5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBjID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgICBsZWFmQ2VudGVyWzBdICsgaSxcbiAgICAgIGxlYWZIZWlnaHQgKyBqLFxuICAgICAgbGVhZkNlbnRlclsyXSArIGtcbiAgICApO1xuXG4gICAgdmFyIGRpcyA9IE1hdGguc3FydChjLnggKiBjLnggKyBjLnogKiBjLnopO1xuICAgIHZhciBtYXhEaXMgPSAoc2hhcGUyIC0gaikgLyBzaGFwZTIgKiByYWRpdXM7XG5cbiAgICB2YXIgZGlmZiA9IG1heERpcyAtIGRpcztcbiAgICBpZiAoZGlmZiA8IDAuMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkaWZmIDwgMC41KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYy5hcHBseVF1YXRlcm5pb24ocXVhdCk7XG5cbiAgICByb3VuZFZlY3RvcihjKTtcblxuICAgIGlmIChzaWRlKSB7XG4gICAgICBjLmFkZCh1bml0VmVjdG9yKTtcbiAgICB9XG5cbiAgICBjaHVua3MyLnNldChjLngsIGMueSwgYy56LCBMRUFGKTtcbiAgfSk7XG5cbiAgcmVtb3ZlRmxvYXRpbmcoY2h1bmtzMiwgWzAsIDAsIDBdKTtcblxuICByZXR1cm4gY2h1bmtzMjtcbn07XG5cbmZ1bmN0aW9uIHJvdW5kVmVjdG9yKHYpIHtcbiAgdi54ID0gTWF0aC5yb3VuZCh2LngpO1xuICB2LnkgPSBNYXRoLnJvdW5kKHYueSk7XG4gIHYueiA9IE1hdGgucm91bmQodi56KTtcbiAgcmV0dXJuIHY7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgXG4gIHZhciB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAvLyBNYXRlcmlhbHMsIFRleHR1cmVzXG4gIHZhciBibG9ja01hdGVyaWFsID0gbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoKTtcbiAgYmxvY2tNYXRlcmlhbC5tYXRlcmlhbHMgPSBbbnVsbF07XG4gIHZhciBibG9ja1RleHR1cmVzID0gW107XG5cbiAgZnVuY3Rpb24gbG9hZEFsbCgpIHtcbiAgICBsb2FkQmxvY2tNYXRlcmlhbCgnZ3Jhc3MnLCAxKTtcbiAgICBsb2FkQmxvY2tNYXRlcmlhbCgnc29pbCcsIDIpO1xuICAgIGxvYWRCbG9ja01hdGVyaWFsKCdzb2lsMicsIDMpO1xuICAgIGxvYWRCbG9ja01hdGVyaWFsKCdzdG9uZScsIDQpO1xuICAgIGxvYWRCbG9ja01hdGVyaWFsKCdzZWEnLCA1LCAwLjgpO1xuICAgIGxvYWRCbG9ja01hdGVyaWFsKCdzYW5kJywgNik7XG4gICAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3dhbGwnLCA3KTtcblxuICAgIGxvYWRCbG9ja01hdGVyaWFsKCd3aW5kb3cnLCA4LCAwLjgpO1xuXG4gICAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2Nsb3VkJywgMTAsIDAuNyk7XG5cbiAgICBsb2FkQmxvY2tNYXRlcmlhbCgndHJ1bmsnLCAyMCk7XG4gICAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2xlYWYnLCAyMSk7XG5cbiAgICBsb2FkQmxvY2tNYXRlcmlhbCgnZ2xvdycsIDMwLCBudWxsKTtcbiAgfTtcblxuICBmdW5jdGlvbiBsb2FkQmxvY2tNYXRlcmlhbChuYW1lLCBpbmRleCwgYWxwaGEpIHtcbiAgICB2YXIgdGV4dHVyZSA9IHRleHR1cmVMb2FkZXIubG9hZCgndGV4dHVyZXMvJyArIG5hbWUgKyAnLnBuZycpO1xuICAgIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XG4gICAgdGV4dHVyZS53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICBibG9ja1RleHR1cmVzLnB1c2godGV4dHVyZSk7XG5cbiAgICB2YXIgbSA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBtYXA6IHRleHR1cmVcbiAgICB9KTtcblxuICAgIGlmIChhbHBoYSAhPSBudWxsKSB7XG4gICAgICBtLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgIG0ub3BhY2l0eSA9IGFscGhhO1xuICAgIH1cblxuICAgIGJsb2NrTWF0ZXJpYWwubWF0ZXJpYWxzW2luZGV4XSA9IG07XG5cbiAgICByZXR1cm4gbTtcbiAgfTtcblxuICBsb2FkQWxsKCk7XG5cbiAgcmV0dXJuIGJsb2NrTWF0ZXJpYWw7XG59O1xuIiwidmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIga2V5Y29kZSA9IHJlcXVpcmUoJ2tleWNvZGUnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKTtcbnZhciBhcHAgPSB7fTtcbnZhciBlbnYgPSBjb25maWcuZW52IHx8ICdwcm9kdWN0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgc2VsZiA9IHt9O1xuXG4gIC8vIFNpemVcbiAgdmFyIHNpemUgPSAzMjtcblxuICB2YXIgc2NlbmUgPSByZXF1aXJlKCcuL3NjZW5lJykoc2l6ZSwgZW52KTtcbiAgdmFyIGNhbWVyYSA9IHNjZW5lLmNhbWVyYTtcbiAgdmFyIG9iamVjdCA9IHNjZW5lLm9iamVjdDtcblxuICB2YXIgYmxvY2tNYXRlcmlhbCA9IHJlcXVpcmUoJy4vYmxvY2tNYXRlcmlhbCcpKCk7XG5cbiAgdmFyIGVudGl0aWVzID0gW107XG5cbiAgLy8gZnJhbWUgdGltZVxuICB2YXIgZHQgPSAxIC8gNjA7XG5cbiAgdmFyIGlucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpKHNlbGYsIGNhbWVyYSwgb2JqZWN0KTtcblxuICB2YXIgY2xvdWQgPSByZXF1aXJlKCcuLi9lbnRpdGllcy9jbG91ZCcpKHNpemUgKyAxMSwgb2JqZWN0LCBibG9ja01hdGVyaWFsKTtcbiAgZW50aXRpZXMucHVzaChjbG91ZCk7XG4gIHZhciB0ZXJyaWFuID0gcmVxdWlyZSgnLi4vZW50aXRpZXMvdGVycmlhbicpKHNpemUsIG9iamVjdCwgYmxvY2tNYXRlcmlhbCk7XG4gIHZhciB0cmVlID0gcmVxdWlyZSgnLi4vZW50aXRpZXMvdHJlZScpKHRlcnJpYW4ub2JqZWN0LCBibG9ja01hdGVyaWFsLCB0ZXJyaWFuKTtcblxuICBmdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIGlucHV0LnRpY2soZHQpO1xuICAgIGVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgICBlbnRpdHkudGljayhkdCk7XG4gICAgfSk7XG4gICAgc2NlbmUucmVuZGVyKCk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIHNjZW5lLnN0YXJ0KCk7XG4gICAgYW5pbWF0ZSgpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHpvb20ocmF0aW8pIHtcbiAgICBjYW1lcmEuZm92ICo9IHJhdGlvO1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIH07XG5cbiAgc2VsZi5zdGFydCA9IHN0YXJ0O1xuICBzZWxmLnpvb20gPSB6b29tO1xuICBzZWxmLnRlcnJpYW4gPSB0ZXJyaWFuO1xuXG4gIHJldHVybiBzZWxmO1xufTtcbiIsInZhciBrZXljb2RlID0gcmVxdWlyZSgna2V5Y29kZScpO1xudmFyIERpciA9IHJlcXVpcmUoJy4uL2RpcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdhbWUsIGNhbWVyYSwgb2JqZWN0KSB7XG5cbiAgdmFyIHpvb21TcGVlZCA9IDEuMTtcbiAgLy8gSW5wdXQgc3RhdGVzXG4gIHZhciBrZXlob2xkcyA9IHt9O1xuICB2YXIgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICB2YXIgcmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcigpO1xuICB2YXIgcmF5Y2FzdGVyRGlyO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24sIGZhbHNlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25LZXlVcCwgZmFsc2UpO1xuXG4gIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgbW91c2UueCA9IChldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogMiAtIDE7XG4gICAgbW91c2UueSA9IC0oZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgcGlja2luZyByYXkgd2l0aCB0aGUgY2FtZXJhIGFuZCBtb3VzZSBwb3NpdGlvbiAgXG4gICAgcmF5Y2FzdGVyLnNldEZyb21DYW1lcmEobW91c2UsIGNhbWVyYSk7XG4gICAgcmF5Y2FzdGVyRGlyID0gcmF5Y2FzdGVyLnJheS5kaXJlY3Rpb24uY2xvbmUoKTtcbiAgfTtcblxuICBmdW5jdGlvbiBvbk1vdXNlRG93bihldmVudCkge1xuICAgIHZhciB0ZXJyaWFuID0gZ2FtZS50ZXJyaWFuO1xuICAgIGlmICh0ZXJyaWFuID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgb2JqZWN0cyBpbnRlcnNlY3RpbmcgdGhlIHBpY2tpbmcgcmF5XG4gICAgdmFyIGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0KHRlcnJpYW4ub2JqZWN0LCB0cnVlKTtcbiAgICBpZiAoaW50ZXJzZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcG9pbnQgPSBpbnRlcnNlY3RzWzBdLnBvaW50LmNsb25lKClcbiAgICAgIC5hZGQocmF5Y2FzdGVyRGlyLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoLTAuMDEpKTtcblxuICAgIHZhciBsb2NhbFBvaW50ID0gdGVycmlhbi5vYmplY3Qud29ybGRUb0xvY2FsKHBvaW50KTtcbiAgICB2YXIgY29vcmQgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC54KSxcbiAgICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC55KSxcbiAgICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC56KVxuICAgICk7XG5cbiAgICB2YXIgcG9pbnQyID0gaW50ZXJzZWN0c1swXS5wb2ludC5jbG9uZSgpXG4gICAgICAuYWRkKHJheWNhc3RlckRpci5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKDAuMDEpKTtcbiAgICB2YXIgbG9jYWxQb2ludDIgPSB0ZXJyaWFuLm9iamVjdC53b3JsZFRvTG9jYWwocG9pbnQyKTtcbiAgICB2YXIgY29vcmQyID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQyLngpLFxuICAgICAgTWF0aC5mbG9vcihsb2NhbFBvaW50Mi55KSxcbiAgICAgIE1hdGguZmxvb3IobG9jYWxQb2ludDIueilcbiAgICApO1xuXG4gICAgdmFyIHVuaXRWZWN0b3IgPSBjb29yZDIuY2xvbmUoKS5zdWIoY29vcmQpO1xuICAgIHZhciBmID0gRGlyLnVuaXRWZWN0b3JUb0Rpcih1bml0VmVjdG9yKTtcbiAgICBpZiAoZiAhPSBudWxsKSB7XG4gICAgICBvbkNsaWNrZWRTdXJmYWNlKGV2ZW50LCBjb29yZDIsIGYpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBvbkNsaWNrZWRTdXJmYWNlKGV2ZW50LCBjb29yZCwgZikge1xuXG4gIH07XG5cbiAgZnVuY3Rpb24gb25Nb3VzZVVwKGV2ZW50KSB7XG5cbiAgfTtcblxuICBmdW5jdGlvbiBvbktleURvd24oZSkge1xuICAgIHZhciBrZXkgPSBrZXljb2RlKGUpO1xuICAgIGtleWhvbGRzW2tleV0gPSB0cnVlO1xuXG4gICAgaWYgKGtleSA9PT0gJz0nKSB7XG4gICAgICBnYW1lLnpvb20oMSAvIHpvb21TcGVlZCk7XG4gICAgfVxuXG4gICAgaWYgKGtleSA9PT0gJy0nKSB7XG4gICAgICBnYW1lLnpvb20oem9vbVNwZWVkKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gb25LZXlVcChlKSB7XG4gICAgdmFyIGtleSA9IGtleWNvZGUoZSk7XG4gICAga2V5aG9sZHNba2V5XSA9IGZhbHNlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHRpY2soZHQpIHtcbiAgICB2YXIgY2FtZXJhVXAgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKTtcbiAgICB2YXIgY2FtZXJhRGlyID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSkuYXBwbHlFdWxlcihjYW1lcmEucm90YXRpb24pO1xuICAgIHZhciBjYW1lcmFSaWdodCA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY3Jvc3NWZWN0b3JzKGNhbWVyYVVwLCBjYW1lcmFEaXIpO1xuICAgIFxuICAgIHZhciByb3RhdGVZID0gMDtcbiAgICBpZiAoa2V5aG9sZHNbJ3JpZ2h0J10pIHtcbiAgICAgIHJvdGF0ZVkgLT0gMC4xO1xuICAgIH0gZWxzZSBpZiAoa2V5aG9sZHNbJ2xlZnQnXSkge1xuICAgICAgcm90YXRlWSArPSAwLjE7XG4gICAgfVxuXG4gICAgdmFyIHF1YXRJbnZlcnNlID0gb2JqZWN0LnF1YXRlcm5pb24uY2xvbmUoKS5pbnZlcnNlKCk7XG4gICAgdmFyIGF4aXMgPSBjYW1lcmFVcC5jbG9uZSgpLmFwcGx5UXVhdGVybmlvbihxdWF0SW52ZXJzZSkubm9ybWFsaXplKCk7XG4gICAgb2JqZWN0LnF1YXRlcm5pb25cbiAgICAgIC5tdWx0aXBseShuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUoYXhpcywgcm90YXRlWSkpO1xuXG4gICAgdmFyIHJvdGF0ZVggPSAwO1xuICAgIGlmIChrZXlob2xkc1sndXAnXSkge1xuICAgICAgcm90YXRlWCAtPSAwLjE7XG4gICAgfSBlbHNlIGlmIChrZXlob2xkc1snZG93biddKSB7XG4gICAgICByb3RhdGVYICs9IDAuMTtcbiAgICB9XG5cbiAgICBheGlzID0gY2FtZXJhUmlnaHQuY2xvbmUoKS5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpLm5vcm1hbGl6ZSgpO1xuICAgIG9iamVjdC5xdWF0ZXJuaW9uXG4gICAgICAubXVsdGlwbHkobmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tQXhpc0FuZ2xlKGF4aXMsIHJvdGF0ZVgpKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHRpY2s6IHRpY2tcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNpemUsIGVudikge1xuICBcbiAgaWYgKGVudiA9PT0gJ2RldicpIHtcbiAgICB2YXIgc3RhdHMgPSBuZXcgU3RhdHMoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG4gIH1cblxuICAvLyBPYmplY3RzXG4gIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICB2YXIgbW9kZWxTaXplID0gNTtcbiAgdmFyIGRpc1NjYWxlID0gMS4yICogbW9kZWxTaXplO1xuXG4gIC8vIFBvc3QgcHJvY2Vzc2luZyBzZXR0aW5nXG4gIHZhciBwb3N0cHJvY2Vzc2luZyA9IHsgZW5hYmxlZDogdHJ1ZSwgcmVuZGVyTW9kZTogMCB9O1xuXG4gIC8vIFJlbmRlcmVyLCBzY2VuZSwgY2FtZXJhXG4gIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIHJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhCQkQ5RjcpO1xuXG4gIHZhciBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICB2YXIgZm92ID0gNjA7XG4gIHZhciBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoZm92LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAwLjEsIDEwMDApO1xuXG4gIC8vIFBvc3QgcHJvY2Vzc2luZ1xuICB2YXIgZGVwdGhNYXRlcmlhbDtcbiAgdmFyIGRlcHRoUmVuZGVyVGFyZ2V0O1xuICB2YXIgc3Nhb1Bhc3M7XG4gIHZhciBlZmZlY3RDb21wb3NlcjtcbiAgdmFyIGZpbmFsQ29tcG9zZXI7XG5cbiAgdmFyIHRleHR1cmVzID0ge307XG5cbiAgZnVuY3Rpb24gaW5pdFBvc3Rwcm9jZXNzaW5nKCkge1xuICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAvLyBTZXR1cCByZW5kZXIgcGFzc1xuICAgIHZhciByZW5kZXJQYXNzID0gbmV3IFRIUkVFLlJlbmRlclBhc3Moc2NlbmUsIGNhbWVyYSk7XG5cbiAgICAvLyBTZXR1cCBkZXB0aCBwYXNzXG4gICAgZGVwdGhNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoRGVwdGhNYXRlcmlhbCgpO1xuICAgIGRlcHRoTWF0ZXJpYWwuZGVwdGhQYWNraW5nID0gVEhSRUUuUkdCQURlcHRoUGFja2luZztcbiAgICBkZXB0aE1hdGVyaWFsLmJsZW5kaW5nID0gVEhSRUUuTm9CbGVuZGluZztcblxuICAgIHZhciBwYXJzID0geyBtaW5GaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciwgbWFnRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIgfTtcbiAgICBkZXB0aFJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCBwYXJzKTtcblxuICAgIC8vIFNldHVwIFNTQU8gcGFzc1xuICAgIHNzYW9QYXNzID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuU1NBT1NoYWRlcik7XG5cbiAgICAvL3NzYW9QYXNzLnVuaWZvcm1zWyBcInREaWZmdXNlXCIgXS52YWx1ZSB3aWxsIGJlIHNldCBieSBTaGFkZXJQYXNzXG4gICAgc3Nhb1Bhc3MudW5pZm9ybXNbXCJ0RGVwdGhcIl0udmFsdWUgPSBkZXB0aFJlbmRlclRhcmdldC50ZXh0dXJlO1xuICAgIHNzYW9QYXNzLnVuaWZvcm1zWydzaXplJ10udmFsdWUuc2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHNzYW9QYXNzLnVuaWZvcm1zWydjYW1lcmFOZWFyJ10udmFsdWUgPSBjYW1lcmEubmVhcjtcbiAgICBzc2FvUGFzcy51bmlmb3Jtc1snY2FtZXJhRmFyJ10udmFsdWUgPSBjYW1lcmEuZmFyO1xuICAgIHNzYW9QYXNzLnVuaWZvcm1zWydvbmx5QU8nXS52YWx1ZSA9IChwb3N0cHJvY2Vzc2luZy5yZW5kZXJNb2RlID09IDEpO1xuICAgIHNzYW9QYXNzLnVuaWZvcm1zWydhb0NsYW1wJ10udmFsdWUgPSAxMDAuMDtcbiAgICBzc2FvUGFzcy51bmlmb3Jtc1snbHVtSW5mbHVlbmNlJ10udmFsdWUgPSAwLjc7XG4gICAgc3Nhb1Bhc3MucmVuZGVyVG9TY3JlZW4gPSB0cnVlO1xuXG4gICAgLy8gQWRkIHBhc3MgdG8gZWZmZWN0IGNvbXBvc2VyXG4gICAgZWZmZWN0Q29tcG9zZXIgPSBuZXcgVEhSRUUuRWZmZWN0Q29tcG9zZXIocmVuZGVyZXIpO1xuICAgIGVmZmVjdENvbXBvc2VyLmFkZFBhc3MocmVuZGVyUGFzcyk7XG4gICAgZWZmZWN0Q29tcG9zZXIuYWRkUGFzcyhzc2FvUGFzcyk7XG4gIH07XG5cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xuXG4gIGZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgLy8gUmVzaXplIHJlbmRlclRhcmdldHNcbiAgICBzc2FvUGFzcy51bmlmb3Jtc1snc2l6ZSddLnZhbHVlLnNldCh3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHZhciBwaXhlbFJhdGlvID0gcmVuZGVyZXIuZ2V0UGl4ZWxSYXRpbygpO1xuICAgIHZhciBuZXdXaWR0aCA9IE1hdGguZmxvb3Iod2lkdGggLyBwaXhlbFJhdGlvKSB8fCAxO1xuICAgIHZhciBuZXdIZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCAvIHBpeGVsUmF0aW8pIHx8IDE7XG4gICAgZGVwdGhSZW5kZXJUYXJnZXQuc2V0U2l6ZShuZXdXaWR0aCwgbmV3SGVpZ2h0KTtcbiAgICBlZmZlY3RDb21wb3Nlci5zZXRTaXplKG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGluaXRTY2VuZSgpIHtcbiAgICB2YXIgZGlzID0gc2l6ZSAqIGRpc1NjYWxlO1xuICAgIGNhbWVyYS5wb3NpdGlvbi54ID0gZGlzO1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ID0gZGlzO1xuICAgIGNhbWVyYS5wb3NpdGlvbi56ID0gZGlzO1xuICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoKSk7XG5cbiAgICBvYmplY3Quc2NhbGUuc2V0KG1vZGVsU2l6ZSwgbW9kZWxTaXplLCBtb2RlbFNpemUpO1xuICAgIHNjZW5lLmFkZChvYmplY3QpO1xuICAgIHZhciBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ODg4ODg4KTtcbiAgICBvYmplY3QuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgICB2YXIgZGlyZWN0aW9uYWxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjYpO1xuICAgIGRpcmVjdGlvbmFsTGlnaHQucG9zaXRpb24uc2V0KDAuMywgMS4wLCAwLjUpO1xuICAgIG9iamVjdC5hZGQoZGlyZWN0aW9uYWxMaWdodCk7XG5cbiAgICB2YXIgZGlyZWN0aW9uYWxMaWdodDIgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC42KTtcbiAgICBkaXJlY3Rpb25hbExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTAuMywgLTEuMCwgLTAuNSk7XG4gICAgb2JqZWN0LmFkZChkaXJlY3Rpb25hbExpZ2h0Mik7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGlmIChlbnYgPT09ICdkZXYnKSB7XG4gICAgICBzdGF0cy5iZWdpbigpO1xuICAgIH1cblxuICAgIGlmIChwb3N0cHJvY2Vzc2luZy5lbmFibGVkKSB7XG4gICAgICAvLyBSZW5kZXIgZGVwdGggaW50byBkZXB0aFJlbmRlclRhcmdldFxuICAgICAgc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IGRlcHRoTWF0ZXJpYWw7XG4gICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSwgZGVwdGhSZW5kZXJUYXJnZXQsIHRydWUpO1xuICAgICAgc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IG51bGw7XG5cbiAgICAgIGVmZmVjdENvbXBvc2VyLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgfVxuXG4gICAgaWYgKGVudiA9PT0gJ2RldicpIHtcbiAgICAgIHN0YXRzLmVuZCgpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICBpbml0UG9zdHByb2Nlc3NpbmcoKTtcbiAgICBpbml0U2NlbmUoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICByZW5kZXI6IHJlbmRlcixcbiAgICBjYW1lcmE6IGNhbWVyYSxcbiAgICBvYmplY3Q6IG9iamVjdFxuICB9XG59O1xuIiwidmFyIGdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKSgpO1xuZ2FtZS5zdGFydCgpO1xuIl19
