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

},{}],7:[function(require,module,exports){
module.exports={
	"env": "dev"
}
},{}],8:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],9:[function(require,module,exports){
var SimplexNoise = require('simplex-noise');

var mesher = require('../voxel/mesher');
var Dir = require('../dir');
var Chunks = require('../voxel/chunks');
var meshChunks = require('../voxel/meshchunks');

var CLOUD = 10;

module.exports = function(parent, material) {

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

  var size = 43;
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

},{"../dir":8,"../voxel/chunks":17,"../voxel/meshchunks":20,"../voxel/mesher":21,"simplex-noise":5}],10:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var SimplexNoise = require('simplex-noise');

var Voxel = require('../../voxel');
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

        // GRASS

        // no grass below
        // if (biome.relSeaLevel > 0) {
        //   return SOIL;
        // }

        // On edge
        var gravity = data.gravity;
        if (gravity[f] != null) {
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

},{"../../dir":8,"../../voxel":19,"./surfacemap":11,"simplex-noise":5}],11:[function(require,module,exports){
var Voxel = require('../../voxel');
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

},{"../../Dir":6,"../../voxel":19,"node-dijkstra":2}],12:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var Voxel = require('../../voxel');
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

  var sparse = 0.1;

  function add(coord, dir) {

    var chunks2 = require('./pine')(coord, dir);

    copyChunks(chunks2, chunks, coord);
    meshChunks(chunks, object, blockMaterial);
  };

  function start() {
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

      if (data.biome.tree < 0.5) {
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
      uv[u] = Math.random() - 0.5;
      uv[v] = Math.random() - 0.5;

      coord.add(new THREE.Vector3().fromArray(uv));

      // 1 tree per terrian grid
      coord.multiplyScalar(1 / self.scale);

      coord.x = Math.round(coord.x);
      coord.y = Math.round(coord.y);
      coord.z = Math.round(coord.z);
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

},{"../../dir":8,"../../voxel":19,"./pine":13}],13:[function(require,module,exports){
var Dir = require('../../dir');
var Voxel = require('../../voxel');
var Chunks = Voxel.Chunks;
var visitShape = Voxel.visitShape;
var removeFloating = Voxel.removeFloating;

var LEAF = [21, 21, 21, 21, 21, 21];
var TRUNK = [20, 20, 20, 20, 20, 20];

module.exports = function(coord, dir) {
  // Leaf height / width
  var shapeRatio = 2;
  // Density of leafs
  var density = 0.8;
  // Variable size
  var varSize = 4;
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

    if (diff < 1) {
      if (Math.pow(diff, 0.5) > Math.random()) {
        return;
      }
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

},{"../../dir":8,"../../voxel":19}],14:[function(require,module,exports){
var finalshader = {
  uniforms: {
    "tDiffuse": { value: null }, // The base scene buffer
    "tGlow": { value: null } // The glow scene buffer
  },

  vertexShader: [
    "varying vec2 vUv;",

    "void main() {",

    "vUv = vec2( uv.x, uv.y );",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform sampler2D tGlow;",

    "varying vec2 vUv;",

    "void main() {",

    "vec4 texel = texture2D( tDiffuse, vUv );",
    "vec4 glow = texture2D( tGlow, vUv );",
    "gl_FragColor = texel + glow * 1.0;",

    "}"
  ].join("\n")
};

module.exports = finalshader;

},{}],15:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var keycode = require('keycode');
var Dir = require('./dir');
var finalShader = require('./finalshader');
var config = require('./config');
var app = {};

var env = config.env || 'production';

if (env === 'dev') {
  var stats = new Stats();
  document.body.appendChild(stats.dom);
}

// Post processing setting
var postprocessing = { enabled: true, renderMode: 0 };

// Renderer, scene, camera
var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xBBD9F7);
// renderer.setClearColor(0x222222);
var scene = new THREE.Scene();
var fov = 60;
var zoomSpeed = 1.1;
var camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight,
  0.1, 1000);
var cameraUp, cameraDir, cameraRight;

// Post processing
var depthMaterial;
var depthRenderTarget;
var ssaoPass;
var effectComposer;
var finalComposer;

// Size
var size = 32;
var modelSize = 5;
var disScale = 1.2 * modelSize;

// Objects
var object;
var noAoLayer;

var entities = [];

// Materials, Textures
var material = new THREE.MultiMaterial();
material.materials = [null];
var textureLoader = new THREE.TextureLoader();
var blockTextures = [];
var textures = {};

// Input states
var keyholds = {};
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var raycasterDir;

// frame time
var dt = 1 / 60;
var bluriness = 1;

var swapped = false;

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

  cameraUp = new THREE.Vector3(0, 1, 0);
  cameraDir = new THREE.Vector3(0, 0, 1).applyEuler(camera.rotation);
  cameraRight = new THREE.Vector3().crossVectors(cameraUp, cameraDir);

  object = new THREE.Object3D();
  object.scale.set(modelSize, modelSize, modelSize);
  scene.add(object);
  noAoLayer = new THREE.Object3D();
  object.add(noAoLayer);
  var ambientLight = new THREE.AmbientLight(0x888888);
  object.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(0.3, 1.0, 0.5);
  object.add(directionalLight);

  var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight2.position.set(-0.3, -1.0, -0.5);
  object.add(directionalLight2);


};

var materialsCopy = [];
var materialsSwap = [];

function loadResources() {
  loadBlockMaterial('grass', 1);
  loadBlockMaterial('soil', 2);
  loadBlockMaterial('soil2', 3);
  loadBlockMaterial('stone', 4);
  loadBlockMaterial('sea', 5, 0.8);
  loadBlockMaterial('sand', 6);
  loadBlockMaterial('wall', 7);

  loadBlockMaterial('window', 8, 0.8);

  var m = loadBlockMaterial('cloud', 10, 0.7);
  // m.emissive = new THREE.Color(0x888888);

  loadBlockMaterial('trunk', 20);
  loadBlockMaterial('leaf', 21);

  loadBlockMaterial('glow', 30, null, true);

  materialsCopy = material.materials;
};

function loadBlockMaterial(name, index, alpha, skipSwap) {
  skipSwap = skipSwap || false;
  var texture = textureLoader.load('textures/' + name + '.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  blockTextures.push(texture);

  var m = new THREE.MeshBasicMaterial({
    map: texture
  });

  var swapMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000
  });

  if (alpha != null) {
    m.transparent = swapMaterial.transparent = true;
    m.opacity = swapMaterial.opacity = alpha;
  }

  material.materials[index] = m;

  if (!skipSwap) {
    materialsSwap[index] = swapMaterial;
  } else {
    materialsSwap[index] = m;
  }

  return m;
};

function swap(flag) {
  swapped = flag;
  if (flag) {
    material.materials = materialsSwap;
  } else {
    material.materials = materialsCopy;
  }
};

function render() {
  if (env === 'dev') {
    stats.begin();
  }

  if (postprocessing.enabled) {
    // Render depth into depthRenderTarget
    noAoLayer.visible = false;
    scene.overrideMaterial = depthMaterial;
    renderer.render(scene, camera, depthRenderTarget, true);
    noAoLayer.visible = true;
    scene.overrideMaterial = null;
    
    effectComposer.render();
  } else {
    renderer.render(scene, camera);
  }

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

  if (env === 'dev') {
    stats.end();
  }
};

function animate() {
  entities.forEach(function(entity) {
    entity.tick(dt);
  });
  render();
  requestAnimationFrame(animate);
};

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and mouse position  
  raycaster.setFromCamera(mouse, camera);
  raycasterDir = raycaster.ray.direction.clone();
};

function onMouseDown(event) {
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
  // if (event.button === 0) {
  //   var critter = require('./entities/critter')(terrian.object, material, terrian);
  //   entities.push(critter);
  //   critter.setCoord(coord, f);
  //   critters.push(critter);
  // } else {
  //   critters.forEach(function(critter) {
  //     critter.setCoord(coord, f);
  //   });
  // }
};

var critters = [];

function onMouseUp(event) {

};

function onKeyDown(e) {
  var key = keycode(e);
  keyholds[key] = true;

  if (key === 'g') {
    terrian.groundObject.visible = !terrian.groundObject.visible;
  }

  if (key === '=') {
    camera.fov /= zoomSpeed;
    camera.updateProjectionMatrix();
  }

  if (key === '-') {
    camera.fov *= zoomSpeed;
    camera.updateProjectionMatrix();
  }
};

function onKeyUp(e) {
  var key = keycode(e);
  keyholds[key] = false;
};

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);
window.addEventListener('resize', onWindowResize);

loadResources();
initPostprocessing();
initScene();

// Init app

var cloud = require('./entities/cloud')(object, material);
entities.push(cloud);

var terrian = require('./entities/terrian')(size, object, material);

var tree = require('./entities/tree')(terrian.object, material, terrian);

// var Chunks = require('./voxel/chunks');
// var chunks = new Chunks();
// var len = 32;

// var material = new THREE.MultiMaterial();
// material.materials.push(null, new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   transparent: true,
//   opacity: 0.5
// }));

// for (var i = 0; i < len; i++) {
//   for (var j = 0; j < len; j++) {
//     for (var k = 0; k < len; k++) {
//       chunks.set(i, j, k, [1, 1, 1, 1, 1, 1]);
//     }
//   }
// }

// var meshChunks = require('./voxel/meshchunks');
// var testObject = new THREE.Object3D();
// testObject.scale.set(5, 5, 5);
// scene.add(testObject);
// meshChunks(chunks, testObject, material);

animate();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./config":7,"./dir":8,"./entities/cloud":9,"./entities/terrian":10,"./entities/tree":12,"./finalshader":14,"keycode":1}],16:[function(require,module,exports){
var Chunk = function(shape) {
  this.volume = [];
  this.shape = shape || [16, 16, 16];
  this.dimX = this.shape[0];
  this.dimXY = this.shape[0] * this.shape[1];
};

Chunk.prototype.get = function(i, j, k) {
  return this.volume[i * this.dimXY + j * this.dimX + k];
};

Chunk.prototype.set = function(i, j, k, v) {
  this.volume[i * this.dimXY + j * this.dimX + k] = v;
};

module.exports = Chunk;

},{}],17:[function(require,module,exports){
var Chunk = require('./chunk');

var Chunks = function(chunkSize) {
  this.map = {};
  this.chunkSize = chunkSize || 16;
};

Chunks.prototype.set = function(i, j, k, v) {
  var origin = this.getOrigin(i, j, k);
  var hash = origin.toArray().join(',');
  if (this.map[hash] == null) {
    this.map[hash] = {
      chunk: new Chunk([this.chunkSize, this.chunkSize, this.chunkSize]),
      origin: origin
    }
  }

  this.map[hash].dirty = true;
  this.map[hash].chunk.set(i - origin.x, j - origin.y, k - origin.z, v);
};

Chunks.prototype.get = function(i, j, k, v) {
  var origin = this.getOrigin(i, j, k);
  var hash = origin.toArray().join(',');
  if (this.map[hash] == null) {
    return null;
  }
  var origin = this.map[hash].origin;
  return this.map[hash].chunk.get(i - origin.x, j - origin.y, k - origin.z);
};

Chunks.prototype.getOrigin = function(i, j, k) {
  return new THREE.Vector3(
    Math.floor(i / this.chunkSize),
    Math.floor(j / this.chunkSize),
    Math.floor(k / this.chunkSize)
  ).multiplyScalar(this.chunkSize);
};

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
          callback(i + origin.x, j + origin.y, k + origin.z, v);
        }
      }
    }
  }
};

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

Chunks.prototype.deserialize = function(data, offset) {
  offset = offset || new THREE.Vector3(0, 0, 0);
  var self = this;
  data.forEach(function(v) {
    self.set(v[0] + offset.x, v[1] + offset.y, v[2] + offset.z, v[3]);
  });

  return this;
};

module.exports = Chunks;

},{"./chunk":16}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
var Voxel = {
  Chunk: require('./chunk'),
  Chunks: require('./chunks'),
  meshChunks: require('./meshchunks'),
  mesher: require('./mesher')
};

function visitShape(shape, callback) {
  for (var i = 0; i < shape[0]; i++) {
    for (var j = 0; j < shape[1]; j++) {
      for (var k = 0; k < shape[2]; k++) {
        callback(i, j, k);
      }
    }
  }
};

function copyChunks(from, to, offset) {
  offset = offset || new THREE.Vector3();
  from.visit(function(i, j, k, v) {
    to.set(i + offset.x, j + offset.y, k + offset.z, v);
  });
};

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

},{"./chunk":16,"./chunks":17,"./meshchunks":20,"./mesher":21}],20:[function(require,module,exports){
var mesher = require('./mesher');

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
      mesh.position.copy(chunk.origin);
      parent.add(mesh);

      if (cached != null) {
        cached[id] = geometry;
      }

      chunk.dirty = false;
      chunk.mesh = mesh;
    }
  }
}

},{"./mesher":21}],21:[function(require,module,exports){
var greedyMesher = require('./greedy').mesher;

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

},{"./greedy":18}]},{},[15])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva2V5Y29kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWRpamtzdHJhL2dyYXBoLmpzIiwibm9kZV9tb2R1bGVzL25vZGUtZGlqa3N0cmEvbGlicy9xdWV1ZS5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWRpamtzdHJhL25vZGVfbW9kdWxlcy8xMDEvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZXgtbm9pc2Uvc2ltcGxleC1ub2lzZS5qcyIsInNyYy9EaXIuanMiLCJzcmMvY29uZmlnLmpzb24iLCJzcmMvZW50aXRpZXMvY2xvdWQuanMiLCJzcmMvZW50aXRpZXMvdGVycmlhbi9pbmRleC5qcyIsInNyYy9lbnRpdGllcy90ZXJyaWFuL3N1cmZhY2VtYXAuanMiLCJzcmMvZW50aXRpZXMvdHJlZS9pbmRleC5qcyIsInNyYy9lbnRpdGllcy90cmVlL3BpbmUuanMiLCJzcmMvZmluYWxzaGFkZXIuanMiLCJzcmMvbWFpbi5qcyIsInNyYy92b3hlbC9jaHVuay5qcyIsInNyYy92b3hlbC9jaHVua3MuanMiLCJzcmMvdm94ZWwvZ3JlZWR5LmpzIiwic3JjL3ZveGVsL2luZGV4LmpzIiwic3JjL3ZveGVsL21lc2hjaHVua3MuanMiLCJzcmMvdm94ZWwvbWVzaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDemJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gU291cmNlOiBodHRwOi8vanNmaWRkbGUubmV0L3ZXeDhWL1xuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjAzMTk1L2Z1bGwtbGlzdC1vZi1qYXZhc2NyaXB0LWtleWNvZGVzXG5cbi8qKlxuICogQ29uZW5pZW5jZSBtZXRob2QgcmV0dXJucyBjb3JyZXNwb25kaW5nIHZhbHVlIGZvciBnaXZlbiBrZXlOYW1lIG9yIGtleUNvZGUuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0ga2V5Q29kZSB7TnVtYmVyfSBvciBrZXlOYW1lIHtTdHJpbmd9XG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VhcmNoSW5wdXQpIHtcbiAgLy8gS2V5Ym9hcmQgRXZlbnRzXG4gIGlmIChzZWFyY2hJbnB1dCAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlYXJjaElucHV0KSB7XG4gICAgdmFyIGhhc0tleUNvZGUgPSBzZWFyY2hJbnB1dC53aGljaCB8fCBzZWFyY2hJbnB1dC5rZXlDb2RlIHx8IHNlYXJjaElucHV0LmNoYXJDb2RlXG4gICAgaWYgKGhhc0tleUNvZGUpIHNlYXJjaElucHV0ID0gaGFzS2V5Q29kZVxuICB9XG5cbiAgLy8gTnVtYmVyc1xuICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzZWFyY2hJbnB1dCkgcmV0dXJuIG5hbWVzW3NlYXJjaElucHV0XVxuXG4gIC8vIEV2ZXJ5dGhpbmcgZWxzZSAoY2FzdCB0byBzdHJpbmcpXG4gIHZhciBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoSW5wdXQpXG5cbiAgLy8gY2hlY2sgY29kZXNcbiAgdmFyIGZvdW5kTmFtZWRLZXkgPSBjb2Rlc1tzZWFyY2gudG9Mb3dlckNhc2UoKV1cbiAgaWYgKGZvdW5kTmFtZWRLZXkpIHJldHVybiBmb3VuZE5hbWVkS2V5XG5cbiAgLy8gY2hlY2sgYWxpYXNlc1xuICB2YXIgZm91bmROYW1lZEtleSA9IGFsaWFzZXNbc2VhcmNoLnRvTG93ZXJDYXNlKCldXG4gIGlmIChmb3VuZE5hbWVkS2V5KSByZXR1cm4gZm91bmROYW1lZEtleVxuXG4gIC8vIHdlaXJkIGNoYXJhY3Rlcj9cbiAgaWYgKHNlYXJjaC5sZW5ndGggPT09IDEpIHJldHVybiBzZWFyY2guY2hhckNvZGVBdCgwKVxuXG4gIHJldHVybiB1bmRlZmluZWRcbn1cblxuLyoqXG4gKiBHZXQgYnkgbmFtZVxuICpcbiAqICAgZXhwb3J0cy5jb2RlWydlbnRlciddIC8vID0+IDEzXG4gKi9cblxudmFyIGNvZGVzID0gZXhwb3J0cy5jb2RlID0gZXhwb3J0cy5jb2RlcyA9IHtcbiAgJ2JhY2tzcGFjZSc6IDgsXG4gICd0YWInOiA5LFxuICAnZW50ZXInOiAxMyxcbiAgJ3NoaWZ0JzogMTYsXG4gICdjdHJsJzogMTcsXG4gICdhbHQnOiAxOCxcbiAgJ3BhdXNlL2JyZWFrJzogMTksXG4gICdjYXBzIGxvY2snOiAyMCxcbiAgJ2VzYyc6IDI3LFxuICAnc3BhY2UnOiAzMixcbiAgJ3BhZ2UgdXAnOiAzMyxcbiAgJ3BhZ2UgZG93bic6IDM0LFxuICAnZW5kJzogMzUsXG4gICdob21lJzogMzYsXG4gICdsZWZ0JzogMzcsXG4gICd1cCc6IDM4LFxuICAncmlnaHQnOiAzOSxcbiAgJ2Rvd24nOiA0MCxcbiAgJ2luc2VydCc6IDQ1LFxuICAnZGVsZXRlJzogNDYsXG4gICdjb21tYW5kJzogOTEsXG4gICdsZWZ0IGNvbW1hbmQnOiA5MSxcbiAgJ3JpZ2h0IGNvbW1hbmQnOiA5MyxcbiAgJ251bXBhZCAqJzogMTA2LFxuICAnbnVtcGFkICsnOiAxMDcsXG4gICdudW1wYWQgLSc6IDEwOSxcbiAgJ251bXBhZCAuJzogMTEwLFxuICAnbnVtcGFkIC8nOiAxMTEsXG4gICdudW0gbG9jayc6IDE0NCxcbiAgJ3Njcm9sbCBsb2NrJzogMTQ1LFxuICAnbXkgY29tcHV0ZXInOiAxODIsXG4gICdteSBjYWxjdWxhdG9yJzogMTgzLFxuICAnOyc6IDE4NixcbiAgJz0nOiAxODcsXG4gICcsJzogMTg4LFxuICAnLSc6IDE4OSxcbiAgJy4nOiAxOTAsXG4gICcvJzogMTkxLFxuICAnYCc6IDE5MixcbiAgJ1snOiAyMTksXG4gICdcXFxcJzogMjIwLFxuICAnXSc6IDIyMSxcbiAgXCInXCI6IDIyMlxufVxuXG4vLyBIZWxwZXIgYWxpYXNlc1xuXG52YXIgYWxpYXNlcyA9IGV4cG9ydHMuYWxpYXNlcyA9IHtcbiAgJ3dpbmRvd3MnOiA5MSxcbiAgJ+KHpyc6IDE2LFxuICAn4oylJzogMTgsXG4gICfijIMnOiAxNyxcbiAgJ+KMmCc6IDkxLFxuICAnY3RsJzogMTcsXG4gICdjb250cm9sJzogMTcsXG4gICdvcHRpb24nOiAxOCxcbiAgJ3BhdXNlJzogMTksXG4gICdicmVhayc6IDE5LFxuICAnY2Fwcyc6IDIwLFxuICAncmV0dXJuJzogMTMsXG4gICdlc2NhcGUnOiAyNyxcbiAgJ3NwYyc6IDMyLFxuICAncGd1cCc6IDMzLFxuICAncGdkbic6IDM0LFxuICAnaW5zJzogNDUsXG4gICdkZWwnOiA0NixcbiAgJ2NtZCc6IDkxXG59XG5cblxuLyohXG4gKiBQcm9ncmFtYXRpY2FsbHkgYWRkIHRoZSBmb2xsb3dpbmdcbiAqL1xuXG4vLyBsb3dlciBjYXNlIGNoYXJzXG5mb3IgKGkgPSA5NzsgaSA8IDEyMzsgaSsrKSBjb2Rlc1tTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGkgLSAzMlxuXG4vLyBudW1iZXJzXG5mb3IgKHZhciBpID0gNDg7IGkgPCA1ODsgaSsrKSBjb2Rlc1tpIC0gNDhdID0gaVxuXG4vLyBmdW5jdGlvbiBrZXlzXG5mb3IgKGkgPSAxOyBpIDwgMTM7IGkrKykgY29kZXNbJ2YnK2ldID0gaSArIDExMVxuXG4vLyBudW1wYWQga2V5c1xuZm9yIChpID0gMDsgaSA8IDEwOyBpKyspIGNvZGVzWydudW1wYWQgJytpXSA9IGkgKyA5NlxuXG4vKipcbiAqIEdldCBieSBjb2RlXG4gKlxuICogICBleHBvcnRzLm5hbWVbMTNdIC8vID0+ICdFbnRlcidcbiAqL1xuXG52YXIgbmFtZXMgPSBleHBvcnRzLm5hbWVzID0gZXhwb3J0cy50aXRsZSA9IHt9IC8vIHRpdGxlIGZvciBiYWNrd2FyZCBjb21wYXRcblxuLy8gQ3JlYXRlIHJldmVyc2UgbWFwcGluZ1xuZm9yIChpIGluIGNvZGVzKSBuYW1lc1tjb2Rlc1tpXV0gPSBpXG5cbi8vIEFkZCBhbGlhc2VzXG5mb3IgKHZhciBhbGlhcyBpbiBhbGlhc2VzKSB7XG4gIGNvZGVzW2FsaWFzXSA9IGFsaWFzZXNbYWxpYXNdXG59XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnMTAxL2Fzc2lnbicpO1xudmFyIFByaW9yaXR5UXVldWUgPSByZXF1aXJlKCcuL2xpYnMvcXVldWUnKTtcblxuLy8gY29zdHJ1Y3RcbnZhciBHcmFwaCA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIC8vIHlvdSBjYW4gZWl0aGVyIHBhc3MgYSB2ZXJ0aWNpZXMgb2JqZWN0IG9yIGFkZCBldmVyeVxuICB0aGlzLnZlcnRpY2VzID0gdmVydGljZXMgfHwge307XG59XG5cbmFzc2lnbihHcmFwaC5wcm90b3R5cGUsIHtcbiAgLy8gYWRkIGEgdmVydGV4IHRvIHRoZSBncmFwaFxuICBhZGRWZXJ0ZXg6IGZ1bmN0aW9uKG5hbWUsIGVkZ2VzKSB7XG4gICAgdGhpcy52ZXJ0aWNlc1tuYW1lXSA9IGVkZ2VzO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8vIGNvbXB1dGUgdGhlIHBhdGhcbiAgc2hvcnRlc3RQYXRoOiBmdW5jdGlvbihzdGFydCwgZmluaXNoLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgZ2V0RGlzdGFuY2UgPSBvcHRpb25zLmdldERpc3RhbmNlO1xuXG4gICAgdGhpcy5ub2RlcyA9IG5ldyBQcmlvcml0eVF1ZXVlKCk7XG4gICAgdGhpcy5kaXN0YW5jZXMgPSB7fTtcbiAgICB0aGlzLnByZXZpb3VzID0ge307XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZmluaXNoID0gZmluaXNoO1xuXG4gICAgLy8gU2V0IHRoZSBzdGFydGluZyB2YWx1ZXMgZm9yIGRpc3RhbmNlc1xuICAgIHRoaXMuc2V0QmFzZWxpbmUuY2FsbCh0aGlzKTtcblxuICAgIC8vIGxvb3AgdW50aWwgd2UgY2hlY2tlZCBldmVyeSBub2RlIGluIHRoZSBxdWV1ZVxuICAgIHZhciBzbWFsbGVzdDtcbiAgICB2YXIgcGF0aCA9IFtdO1xuICAgIHZhciBhbHQ7XG4gICAgd2hpbGUgKCF0aGlzLm5vZGVzLmlzRW1wdHkoKSkge1xuICAgICAgc21hbGxlc3QgPSB0aGlzLm5vZGVzLmRlcXVldWUoKTtcblxuICAgICAgaWYgKHNtYWxsZXN0ID09PSBmaW5pc2gpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMucHJldmlvdXNbc21hbGxlc3RdKSB7XG4gICAgICAgICAgcGF0aC5wdXNoKHNtYWxsZXN0KTtcbiAgICAgICAgICBzbWFsbGVzdCA9IHRoaXMucHJldmlvdXNbc21hbGxlc3RdO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmICghc21hbGxlc3QgfHwgdGhpcy5kaXN0YW5jZXNbc21hbGxlc3RdID09PSBJbmZpbml0eSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgbmVpZ2hib3IgaW4gdGhpcy52ZXJ0aWNlc1tzbWFsbGVzdF0pIHtcbiAgICAgICAgYWx0ID0gdGhpcy5kaXN0YW5jZXNbc21hbGxlc3RdICsgZ2V0RGlzdGFuY2Uoc21hbGxlc3QsIG5laWdoYm9yKTtcblxuICAgICAgICBpZiAoYWx0IDwgdGhpcy5kaXN0YW5jZXNbbmVpZ2hib3JdKSB7XG4gICAgICAgICAgdGhpcy5kaXN0YW5jZXNbbmVpZ2hib3JdID0gYWx0O1xuICAgICAgICAgIHRoaXMucHJldmlvdXNbbmVpZ2hib3JdID0gc21hbGxlc3Q7XG5cbiAgICAgICAgICB0aGlzLm5vZGVzLmVucXVldWUoYWx0LCBuZWlnaGJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy50cmltKSB7XG4gICAgICBwYXRoLnNoaWZ0KClcbiAgICAgICAgLy8gYHBhdGhgIGlzIGdlbmVyYXRlZCBpbiByZXZlcnNlIG9yZGVyXG4gICAgICBpZiAob3B0aW9ucy5yZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGgucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHBhdGggPSBwYXRoLmNvbmNhdChbc3RhcnRdKTtcbiAgICBpZiAob3B0aW9ucy5yZXZlcnNlKSB7XG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGgucmV2ZXJzZSgpO1xuICB9LFxuXG4gIC8vIHNldCB0aGUgc3RhcnRpbmcgcG9pbnQgdG8gMCBhbmQgYWxsIHRoZSBvdGhlcnMgdG8gaW5maW5pdGVcbiAgc2V0QmFzZWxpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ZXJ0ZXg7XG4gICAgZm9yICh2ZXJ0ZXggaW4gdGhpcy52ZXJ0aWNlcykge1xuICAgICAgaWYgKHZlcnRleCA9PT0gdGhpcy5zdGFydCkge1xuICAgICAgICB0aGlzLmRpc3RhbmNlc1t2ZXJ0ZXhdID0gMDtcbiAgICAgICAgdGhpcy5ub2Rlcy5lbnF1ZXVlKDAsIHZlcnRleCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc3RhbmNlc1t2ZXJ0ZXhdID0gSW5maW5pdHk7XG4gICAgICAgIHRoaXMubm9kZXMuZW5xdWV1ZShJbmZpbml0eSwgdmVydGV4LCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcmV2aW91c1t2ZXJ0ZXhdID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLm5vZGVzLnNvcnQoKTtcbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCcxMDEvYXNzaWduJyk7XG5cbi8vIFByaW9yaXR5IFF1ZXVlXG4vLyAtLS0tLS0tLS0tLS0tLVxuXG4vLyBiYXNpYyBwcmlvcml0eSBxdWV1ZSBpbXBsZW1lbnRhdGlvblxudmFyIFByaW9yaXR5UXVldWUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5ub2RlcyA9IFtdO1xufVxuXG5hc3NpZ24oUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUsIHtcblxuICBlbnF1ZXVlOiBmdW5jdGlvbihwcmlvcml0eSwga2V5LCBza2lwU29ydCkge1xuICAgIHRoaXMubm9kZXMucHVzaCh7a2V5OiBrZXksIHByaW9yaXR5OiBwcmlvcml0eX0pO1xuICAgIGlmKHNraXBTb3J0ICE9PSB0cnVlKSB7XG4gICAgICB0aGlzLnNvcnQuY2FsbCh0aGlzKTsgIFxuICAgIH1cbiAgfSxcblxuICBkZXF1ZXVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5zaGlmdCgpLmtleTtcbiAgfSxcblxuICBzb3J0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm5vZGVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGEucHJpb3JpdHkgLSBiLnByaW9yaXR5O1xuICAgIH0pO1xuICB9LFxuXG4gIGlzRW1wdHk6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhdGhpcy5ub2Rlcy5sZW5ndGg7XG4gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJpb3JpdHlRdWV1ZTtcbiIsIi8qKlxuICogQG1vZHVsZSAxMDEvYXNzaWduXG4gKi9cblxuLyoqXG4gKiBDb3BpZXMgZW51bWVyYWJsZSBhbmQgb3duIHByb3BlcnRpZXMgZnJvbSBhIHNvdXJjZSBvYmplY3QocykgdG8gYSB0YXJnZXQgb2JqZWN0LCBha2EgZXh0ZW5kLlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuICogSSBhZGRlZCBmdW5jdGlvbmFsaXR5IHRvIHN1cHBvcnQgYXNzaWduIGFzIGEgcGFydGlhbCBmdW5jdGlvblxuICogQGZ1bmN0aW9uIG1vZHVsZToxMDEvYXNzaWduXG4gKiBAcGFyYW0ge29iamVjdH0gW3RhcmdldF0gLSBvYmplY3Qgd2hpY2ggc291cmNlIG9iamVjdHMgYXJlIGV4dGVuZGluZyAoYmVpbmcgYXNzaWduZWQgdG8pXG4gKiBAcGFyYW0ge29iamVjdH0gc291cmNlcy4uLiAtIG9iamVjdHMgd2hvc2UgcHJvcGVydGllcyBhcmUgYmVpbmcgYXNzaWduZWQgdG8gdGhlIHNvdXJjZSBvYmplY3RcbiAqIEByZXR1cm4ge29iamVjdH0gc291cmNlIHdpdGggZXh0ZW5kZWQgcHJvcGVydGllc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcblxuZnVuY3Rpb24gYXNzaWduICh0YXJnZXQsIGZpcnN0U291cmNlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgZmlyc3RTb3VyY2UgPSBhcmd1bWVudHNbMF07XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBhc3NpZ24odGFyZ2V0LCBmaXJzdFNvdXJjZSk7XG4gICAgfTtcbiAgfVxuICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBudWxsKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdCcpO1xuICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbmV4dFNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAobmV4dFNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IG5leHRTb3VyY2UgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIHZhciBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xuICAgIGZvciAodmFyIG5leHRJbmRleCA9IDAsIGxlbiA9IGtleXNBcnJheS5sZW5ndGg7IG5leHRJbmRleCA8IGxlbjsgbmV4dEluZGV4KyspIHtcbiAgICAgIHZhciBuZXh0S2V5ID0ga2V5c0FycmF5W25leHRJbmRleF07XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5leHRTb3VyY2UsIG5leHRLZXkpO1xuICAgICAgLy8gSSBjaGFuZ2VkIHRoZSBmb2xsb3dpbmcgbGluZSB0byBnZXQgMTAwJSB0ZXN0IGNvdmVyYWdlLlxuICAgICAgLy8gaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgIC8vIEkgd2FzIHVuYWJsZSB0byBmaW5kIGEgc2NlbmFyaW8gd2hlcmUgZGVzYyB3YXMgdW5kZWZpbmVkIG9yIHRoYXQgZGVzYy5lbnVtZXJhYmxlIHdhcyBmYWxzZTpcbiAgICAgIC8vICAgMSkgT2JqZWN0LmRlZmluZVByb3BlcnR5IGRvZXMgbm90IGFjY2VwdCB1bmRlZmluZWQgYXMgYSBkZXNjXG4gICAgICAvLyAgIDIpIE9iamVjdC5rZXlzIGRvZXMgbm90IHJldHVybiBub24tZW51bWVyYWJsZSBrZXlzLlxuICAgICAgLy8gTGV0IG1lIGtub3cgaWYgdGhpcyBpcyBhIGNyb3NzIGJyb3dzZXIgdGhpbmcuXG4gICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0bztcbn0iLCIvKlxuICogQSBmYXN0IGphdmFzY3JpcHQgaW1wbGVtZW50YXRpb24gb2Ygc2ltcGxleCBub2lzZSBieSBKb25hcyBXYWduZXJcbiAqXG4gKiBCYXNlZCBvbiBhIHNwZWVkLWltcHJvdmVkIHNpbXBsZXggbm9pc2UgYWxnb3JpdGhtIGZvciAyRCwgM0QgYW5kIDREIGluIEphdmEuXG4gKiBXaGljaCBpcyBiYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXG4gKiBXaXRoIE9wdGltaXNhdGlvbnMgYnkgUGV0ZXIgRWFzdG1hbiAocGVhc3RtYW5AZHJpenpsZS5zdGFuZm9yZC5lZHUpLlxuICogQmV0dGVyIHJhbmsgb3JkZXJpbmcgbWV0aG9kIGJ5IFN0ZWZhbiBHdXN0YXZzb24gaW4gMjAxMi5cbiAqXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDEyIEpvbmFzIFdhZ25lclxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuICogYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4gKiBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbiAqIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbiAqIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG4gKiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAqIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbiAqIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICpcbiAqL1xuKGZ1bmN0aW9uICgpIHtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgRjIgPSAwLjUgKiAoTWF0aC5zcXJ0KDMuMCkgLSAxLjApLFxuICAgIEcyID0gKDMuMCAtIE1hdGguc3FydCgzLjApKSAvIDYuMCxcbiAgICBGMyA9IDEuMCAvIDMuMCxcbiAgICBHMyA9IDEuMCAvIDYuMCxcbiAgICBGNCA9IChNYXRoLnNxcnQoNS4wKSAtIDEuMCkgLyA0LjAsXG4gICAgRzQgPSAoNS4wIC0gTWF0aC5zcXJ0KDUuMCkpIC8gMjAuMDtcblxuXG5mdW5jdGlvbiBTaW1wbGV4Tm9pc2UocmFuZG9tKSB7XG4gICAgaWYgKCFyYW5kb20pIHJhbmRvbSA9IE1hdGgucmFuZG9tO1xuICAgIHRoaXMucCA9IG5ldyBVaW50OEFycmF5KDI1Nik7XG4gICAgdGhpcy5wZXJtID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICB0aGlzLnBlcm1Nb2QxMiA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgICAgICB0aGlzLnBbaV0gPSByYW5kb20oKSAqIDI1NjtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IDUxMjsgaSsrKSB7XG4gICAgICAgIHRoaXMucGVybVtpXSA9IHRoaXMucFtpICYgMjU1XTtcbiAgICAgICAgdGhpcy5wZXJtTW9kMTJbaV0gPSB0aGlzLnBlcm1baV0gJSAxMjtcbiAgICB9XG5cbn1cblNpbXBsZXhOb2lzZS5wcm90b3R5cGUgPSB7XG4gICAgZ3JhZDM6IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIC0gMSwgMCxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgLSAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDAsIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAwLCAxLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMCwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMCwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDEsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAtIDEsIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIC0gMSwgLSAxXSksXG4gICAgZ3JhZDQ6IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDEsIDEsIDEsIDAsIDEsIDEsIC0gMSwgMCwgMSwgLSAxLCAxLCAwLCAxLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAtIDEsIDEsIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAtIDEsIC0gMSwgMSwgMCwgLSAxLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAwLCAxLCAxLCAxLCAwLCAxLCAtIDEsIDEsIDAsIC0gMSwgMSwgMSwgMCwgLSAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAwLCAxLCAxLCAtIDEsIDAsIDEsIC0gMSwgLSAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgLSAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMSwgMCwgMSwgMSwgMSwgMCwgLSAxLCAxLCAtIDEsIDAsIDEsIDEsIC0gMSwgMCwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMSwgMCwgMSwgLSAxLCAxLCAwLCAtIDEsIC0gMSwgLSAxLCAwLCAxLCAtIDEsIC0gMSwgMCwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDEsIDEsIDAsIDEsIDEsIC0gMSwgMCwgMSwgLSAxLCAxLCAwLCAxLCAtIDEsIC0gMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDEsIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAtIDEsIC0gMSwgMSwgMCwgLSAxLCAtIDEsIC0gMSwgMF0pLFxuICAgIG5vaXNlMkQ6IGZ1bmN0aW9uICh4aW4sIHlpbikge1xuICAgICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTIsXG4gICAgICAgICAgICBwZXJtID0gdGhpcy5wZXJtLFxuICAgICAgICAgICAgZ3JhZDMgPSB0aGlzLmdyYWQzO1xuICAgICAgICB2YXIgbjA9MCwgbjE9MCwgbjI9MDsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cbiAgICAgICAgdmFyIHMgPSAoeGluICsgeWluKSAqIEYyOyAvLyBIYWlyeSBmYWN0b3IgZm9yIDJEXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4aW4gKyBzKTtcbiAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xuICAgICAgICB2YXIgdCA9IChpICsgaikgKiBHMjtcbiAgICAgICAgdmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5KSBzcGFjZVxuICAgICAgICB2YXIgWTAgPSBqIC0gdDtcbiAgICAgICAgdmFyIHgwID0geGluIC0gWDA7IC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXG4gICAgICAgIHZhciB5MCA9IHlpbiAtIFkwO1xuICAgICAgICAvLyBGb3IgdGhlIDJEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGFuIGVxdWlsYXRlcmFsIHRyaWFuZ2xlLlxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXG4gICAgICAgIHZhciBpMSwgajE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCAobWlkZGxlKSBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqKSBjb29yZHNcbiAgICAgICAgaWYgKHgwID4geTApIHtcbiAgICAgICAgICAgIGkxID0gMTtcbiAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgfSAvLyBsb3dlciB0cmlhbmdsZSwgWFkgb3JkZXI6ICgwLDApLT4oMSwwKS0+KDEsMSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICBqMSA9IDE7XG4gICAgICAgIH0gLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXG4gICAgICAgIC8vIEEgc3RlcCBvZiAoMSwwKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYykgaW4gKHgseSksIGFuZFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMSkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMpIGluICh4LHkpLCB3aGVyZVxuICAgICAgICAvLyBjID0gKDMtc3FydCgzKSkvNlxuICAgICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzI7IC8vIE9mZnNldHMgZm9yIG1pZGRsZSBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMjtcbiAgICAgICAgdmFyIHgyID0geDAgLSAxLjAgKyAyLjAgKiBHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIHZhciB5MiA9IHkwIC0gMS4wICsgMi4wICogRzI7XG4gICAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgdGhyZWUgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIHZhciBpaSA9IGkgJiAyNTU7XG4gICAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgdmFyIHQwID0gMC41IC0geDAgKiB4MCAtIHkwICogeTA7XG4gICAgICAgIGlmICh0MCA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgZ2kwID0gcGVybU1vZDEyW2lpICsgcGVybVtqal1dICogMztcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQzW2dpMF0gKiB4MCArIGdyYWQzW2dpMCArIDFdICogeTApOyAvLyAoeCx5KSBvZiBncmFkMyB1c2VkIGZvciAyRCBncmFkaWVudFxuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNSAtIHgxICogeDEgLSB5MSAqIHkxO1xuICAgICAgICBpZiAodDEgPj0gMCkge1xuICAgICAgICAgICAgdmFyIGdpMSA9IHBlcm1Nb2QxMltpaSArIGkxICsgcGVybVtqaiArIGoxXV0gKiAzO1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC41IC0geDIgKiB4MiAtIHkyICogeTI7XG4gICAgICAgIGlmICh0MiA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgZ2kyID0gcGVybU1vZDEyW2lpICsgMSArIHBlcm1bamogKyAxXV0gKiAzO1xuICAgICAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDNbZ2kyXSAqIHgyICsgZ3JhZDNbZ2kyICsgMV0gKiB5Mik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuICAgICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXG4gICAgICAgIHJldHVybiA3MC4wICogKG4wICsgbjEgKyBuMik7XG4gICAgfSxcbiAgICAvLyAzRCBzaW1wbGV4IG5vaXNlXG4gICAgbm9pc2UzRDogZnVuY3Rpb24gKHhpbiwgeWluLCB6aW4pIHtcbiAgICAgICAgdmFyIHBlcm1Nb2QxMiA9IHRoaXMucGVybU1vZDEyLFxuICAgICAgICAgICAgcGVybSA9IHRoaXMucGVybSxcbiAgICAgICAgICAgIGdyYWQzID0gdGhpcy5ncmFkMztcbiAgICAgICAgdmFyIG4wLCBuMSwgbjIsIG4zOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIGZvdXIgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXG4gICAgICAgIHZhciBzID0gKHhpbiArIHlpbiArIHppbikgKiBGMzsgLy8gVmVyeSBuaWNlIGFuZCBzaW1wbGUgc2tldyBmYWN0b3IgZm9yIDNEXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4aW4gKyBzKTtcbiAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xuICAgICAgICB2YXIgayA9IE1hdGguZmxvb3IoemluICsgcyk7XG4gICAgICAgIHZhciB0ID0gKGkgKyBqICsgaykgKiBHMztcbiAgICAgICAgdmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5LHopIHNwYWNlXG4gICAgICAgIHZhciBZMCA9IGogLSB0O1xuICAgICAgICB2YXIgWjAgPSBrIC0gdDtcbiAgICAgICAgdmFyIHgwID0geGluIC0gWDA7IC8vIFRoZSB4LHkseiBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgdmFyIHkwID0geWluIC0gWTA7XG4gICAgICAgIHZhciB6MCA9IHppbiAtIFowO1xuICAgICAgICAvLyBGb3IgdGhlIDNEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGEgc2xpZ2h0bHkgaXJyZWd1bGFyIHRldHJhaGVkcm9uLlxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXG4gICAgICAgIHZhciBpMSwgajEsIGsxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaixrKSBjb29yZHNcbiAgICAgICAgdmFyIGkyLCBqMiwgazI7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGosaykgY29vcmRzXG4gICAgICAgIGlmICh4MCA+PSB5MCkge1xuICAgICAgICAgICAgaWYgKHkwID49IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDA7XG4gICAgICAgICAgICB9IC8vIFggWSBaIG9yZGVyXG4gICAgICAgICAgICBlbHNlIGlmICh4MCA+PSB6MCkge1xuICAgICAgICAgICAgICAgIGkxID0gMTtcbiAgICAgICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgICAgICAgazEgPSAwO1xuICAgICAgICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICAgICAgICBqMiA9IDA7XG4gICAgICAgICAgICAgICAgazIgPSAxO1xuICAgICAgICAgICAgfSAvLyBYIFogWSBvcmRlclxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDE7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMDtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFogWCBZIG9yZGVyXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIHgwPHkwXG4gICAgICAgICAgICBpZiAoeTAgPCB6MCkge1xuICAgICAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgICAgICAgazEgPSAxO1xuICAgICAgICAgICAgICAgIGkyID0gMDtcbiAgICAgICAgICAgICAgICBqMiA9IDE7XG4gICAgICAgICAgICAgICAgazIgPSAxO1xuICAgICAgICAgICAgfSAvLyBaIFkgWCBvcmRlclxuICAgICAgICAgICAgZWxzZSBpZiAoeDAgPCB6MCkge1xuICAgICAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgICAgICBqMSA9IDE7XG4gICAgICAgICAgICAgICAgazEgPSAwO1xuICAgICAgICAgICAgICAgIGkyID0gMDtcbiAgICAgICAgICAgICAgICBqMiA9IDE7XG4gICAgICAgICAgICAgICAgazIgPSAxO1xuICAgICAgICAgICAgfSAvLyBZIFogWCBvcmRlclxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDA7XG4gICAgICAgICAgICB9IC8vIFkgWCBaIG9yZGVyXG4gICAgICAgIH1cbiAgICAgICAgLy8gQSBzdGVwIG9mICgxLDAsMCkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYywtYykgaW4gKHgseSx6KSxcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDEsMCkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYywtYykgaW4gKHgseSx6KSwgYW5kXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwwLDEpIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgtYywtYywxLWMpIGluICh4LHkseiksIHdoZXJlXG4gICAgICAgIC8vIGMgPSAxLzYuXG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHMzsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xuICAgICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzM7XG4gICAgICAgIHZhciB6MSA9IHowIC0gazEgKyBHMztcbiAgICAgICAgdmFyIHgyID0geDAgLSBpMiArIDIuMCAqIEczOyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSBqMiArIDIuMCAqIEczO1xuICAgICAgICB2YXIgejIgPSB6MCAtIGsyICsgMi4wICogRzM7XG4gICAgICAgIHZhciB4MyA9IHgwIC0gMS4wICsgMy4wICogRzM7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkseikgY29vcmRzXG4gICAgICAgIHZhciB5MyA9IHkwIC0gMS4wICsgMy4wICogRzM7XG4gICAgICAgIHZhciB6MyA9IHowIC0gMS4wICsgMy4wICogRzM7XG4gICAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgZm91ciBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgICAgdmFyIGpqID0gaiAmIDI1NTtcbiAgICAgICAgdmFyIGtrID0gayAmIDI1NTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgZm91ciBjb3JuZXJzXG4gICAgICAgIHZhciB0MCA9IDAuNiAtIHgwICogeDAgLSB5MCAqIHkwIC0gejAgKiB6MDtcbiAgICAgICAgaWYgKHQwIDwgMCkgbjAgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMCA9IHBlcm1Nb2QxMltpaSArIHBlcm1bamogKyBwZXJtW2trXV1dICogMztcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQzW2dpMF0gKiB4MCArIGdyYWQzW2dpMCArIDFdICogeTAgKyBncmFkM1tnaTAgKyAyXSAqIHowKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDEgPSAwLjYgLSB4MSAqIHgxIC0geTEgKiB5MSAtIHoxICogejE7XG4gICAgICAgIGlmICh0MSA8IDApIG4xID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMV1dXSAqIDM7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkM1tnaTFdICogeDEgKyBncmFkM1tnaTEgKyAxXSAqIHkxICsgZ3JhZDNbZ2kxICsgMl0gKiB6MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC42IC0geDIgKiB4MiAtIHkyICogeTIgLSB6MiAqIHoyO1xuICAgICAgICBpZiAodDIgPCAwKSBuMiA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kyID0gcGVybU1vZDEyW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazJdXV0gKiAzO1xuICAgICAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDNbZ2kyXSAqIHgyICsgZ3JhZDNbZ2kyICsgMV0gKiB5MiArIGdyYWQzW2dpMiArIDJdICogejIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MyA9IDAuNiAtIHgzICogeDMgLSB5MyAqIHkzIC0gejMgKiB6MztcbiAgICAgICAgaWYgKHQzIDwgMCkgbjMgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMyA9IHBlcm1Nb2QxMltpaSArIDEgKyBwZXJtW2pqICsgMSArIHBlcm1ba2sgKyAxXV1dICogMztcbiAgICAgICAgICAgIHQzICo9IHQzO1xuICAgICAgICAgICAgbjMgPSB0MyAqIHQzICogKGdyYWQzW2dpM10gKiB4MyArIGdyYWQzW2dpMyArIDFdICogeTMgKyBncmFkM1tnaTMgKyAyXSAqIHozKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHN0YXkganVzdCBpbnNpZGUgWy0xLDFdXG4gICAgICAgIHJldHVybiAzMi4wICogKG4wICsgbjEgKyBuMiArIG4zKTtcbiAgICB9LFxuICAgIC8vIDREIHNpbXBsZXggbm9pc2UsIGJldHRlciBzaW1wbGV4IHJhbmsgb3JkZXJpbmcgbWV0aG9kIDIwMTItMDMtMDlcbiAgICBub2lzZTREOiBmdW5jdGlvbiAoeCwgeSwgeiwgdykge1xuICAgICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTIsXG4gICAgICAgICAgICBwZXJtID0gdGhpcy5wZXJtLFxuICAgICAgICAgICAgZ3JhZDQgPSB0aGlzLmdyYWQ0O1xuXG4gICAgICAgIHZhciBuMCwgbjEsIG4yLCBuMywgbjQ7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgZml2ZSBjb3JuZXJzXG4gICAgICAgIC8vIFNrZXcgdGhlICh4LHkseix3KSBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggY2VsbCBvZiAyNCBzaW1wbGljZXMgd2UncmUgaW5cbiAgICAgICAgdmFyIHMgPSAoeCArIHkgKyB6ICsgdykgKiBGNDsgLy8gRmFjdG9yIGZvciA0RCBza2V3aW5nXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4ICsgcyk7XG4gICAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5ICsgcyk7XG4gICAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6ICsgcyk7XG4gICAgICAgIHZhciBsID0gTWF0aC5mbG9vcih3ICsgcyk7XG4gICAgICAgIHZhciB0ID0gKGkgKyBqICsgayArIGwpICogRzQ7IC8vIEZhY3RvciBmb3IgNEQgdW5za2V3aW5nXG4gICAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSx6LHcpIHNwYWNlXG4gICAgICAgIHZhciBZMCA9IGogLSB0O1xuICAgICAgICB2YXIgWjAgPSBrIC0gdDtcbiAgICAgICAgdmFyIFcwID0gbCAtIHQ7XG4gICAgICAgIHZhciB4MCA9IHggLSBYMDsgLy8gVGhlIHgseSx6LHcgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXG4gICAgICAgIHZhciB5MCA9IHkgLSBZMDtcbiAgICAgICAgdmFyIHowID0geiAtIFowO1xuICAgICAgICB2YXIgdzAgPSB3IC0gVzA7XG4gICAgICAgIC8vIEZvciB0aGUgNEQgY2FzZSwgdGhlIHNpbXBsZXggaXMgYSA0RCBzaGFwZSBJIHdvbid0IGV2ZW4gdHJ5IHRvIGRlc2NyaWJlLlxuICAgICAgICAvLyBUbyBmaW5kIG91dCB3aGljaCBvZiB0aGUgMjQgcG9zc2libGUgc2ltcGxpY2VzIHdlJ3JlIGluLCB3ZSBuZWVkIHRvXG4gICAgICAgIC8vIGRldGVybWluZSB0aGUgbWFnbml0dWRlIG9yZGVyaW5nIG9mIHgwLCB5MCwgejAgYW5kIHcwLlxuICAgICAgICAvLyBTaXggcGFpci13aXNlIGNvbXBhcmlzb25zIGFyZSBwZXJmb3JtZWQgYmV0d2VlbiBlYWNoIHBvc3NpYmxlIHBhaXJcbiAgICAgICAgLy8gb2YgdGhlIGZvdXIgY29vcmRpbmF0ZXMsIGFuZCB0aGUgcmVzdWx0cyBhcmUgdXNlZCB0byByYW5rIHRoZSBudW1iZXJzLlxuICAgICAgICB2YXIgcmFua3ggPSAwO1xuICAgICAgICB2YXIgcmFua3kgPSAwO1xuICAgICAgICB2YXIgcmFua3ogPSAwO1xuICAgICAgICB2YXIgcmFua3cgPSAwO1xuICAgICAgICBpZiAoeDAgPiB5MCkgcmFua3grKztcbiAgICAgICAgZWxzZSByYW5reSsrO1xuICAgICAgICBpZiAoeDAgPiB6MCkgcmFua3grKztcbiAgICAgICAgZWxzZSByYW5reisrO1xuICAgICAgICBpZiAoeDAgPiB3MCkgcmFua3grKztcbiAgICAgICAgZWxzZSByYW5rdysrO1xuICAgICAgICBpZiAoeTAgPiB6MCkgcmFua3krKztcbiAgICAgICAgZWxzZSByYW5reisrO1xuICAgICAgICBpZiAoeTAgPiB3MCkgcmFua3krKztcbiAgICAgICAgZWxzZSByYW5rdysrO1xuICAgICAgICBpZiAoejAgPiB3MCkgcmFua3orKztcbiAgICAgICAgZWxzZSByYW5rdysrO1xuICAgICAgICB2YXIgaTEsIGoxLCBrMSwgbDE7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSBzZWNvbmQgc2ltcGxleCBjb3JuZXJcbiAgICAgICAgdmFyIGkyLCBqMiwgazIsIGwyOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgdGhpcmQgc2ltcGxleCBjb3JuZXJcbiAgICAgICAgdmFyIGkzLCBqMywgazMsIGwzOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgZm91cnRoIHNpbXBsZXggY29ybmVyXG4gICAgICAgIC8vIHNpbXBsZXhbY10gaXMgYSA0LXZlY3RvciB3aXRoIHRoZSBudW1iZXJzIDAsIDEsIDIgYW5kIDMgaW4gc29tZSBvcmRlci5cbiAgICAgICAgLy8gTWFueSB2YWx1ZXMgb2YgYyB3aWxsIG5ldmVyIG9jY3VyLCBzaW5jZSBlLmcuIHg+eT56PncgbWFrZXMgeDx6LCB5PHcgYW5kIHg8d1xuICAgICAgICAvLyBpbXBvc3NpYmxlLiBPbmx5IHRoZSAyNCBpbmRpY2VzIHdoaWNoIGhhdmUgbm9uLXplcm8gZW50cmllcyBtYWtlIGFueSBzZW5zZS5cbiAgICAgICAgLy8gV2UgdXNlIGEgdGhyZXNob2xkaW5nIHRvIHNldCB0aGUgY29vcmRpbmF0ZXMgaW4gdHVybiBmcm9tIHRoZSBsYXJnZXN0IG1hZ25pdHVkZS5cbiAgICAgICAgLy8gUmFuayAzIGRlbm90ZXMgdGhlIGxhcmdlc3QgY29vcmRpbmF0ZS5cbiAgICAgICAgaTEgPSByYW5reCA+PSAzID8gMSA6IDA7XG4gICAgICAgIGoxID0gcmFua3kgPj0gMyA/IDEgOiAwO1xuICAgICAgICBrMSA9IHJhbmt6ID49IDMgPyAxIDogMDtcbiAgICAgICAgbDEgPSByYW5rdyA+PSAzID8gMSA6IDA7XG4gICAgICAgIC8vIFJhbmsgMiBkZW5vdGVzIHRoZSBzZWNvbmQgbGFyZ2VzdCBjb29yZGluYXRlLlxuICAgICAgICBpMiA9IHJhbmt4ID49IDIgPyAxIDogMDtcbiAgICAgICAgajIgPSByYW5reSA+PSAyID8gMSA6IDA7XG4gICAgICAgIGsyID0gcmFua3ogPj0gMiA/IDEgOiAwO1xuICAgICAgICBsMiA9IHJhbmt3ID49IDIgPyAxIDogMDtcbiAgICAgICAgLy8gUmFuayAxIGRlbm90ZXMgdGhlIHNlY29uZCBzbWFsbGVzdCBjb29yZGluYXRlLlxuICAgICAgICBpMyA9IHJhbmt4ID49IDEgPyAxIDogMDtcbiAgICAgICAgajMgPSByYW5reSA+PSAxID8gMSA6IDA7XG4gICAgICAgIGszID0gcmFua3ogPj0gMSA/IDEgOiAwO1xuICAgICAgICBsMyA9IHJhbmt3ID49IDEgPyAxIDogMDtcbiAgICAgICAgLy8gVGhlIGZpZnRoIGNvcm5lciBoYXMgYWxsIGNvb3JkaW5hdGUgb2Zmc2V0cyA9IDEsIHNvIG5vIG5lZWQgdG8gY29tcHV0ZSB0aGF0LlxuICAgICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzQ7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzQ7XG4gICAgICAgIHZhciB6MSA9IHowIC0gazEgKyBHNDtcbiAgICAgICAgdmFyIHcxID0gdzAgLSBsMSArIEc0O1xuICAgICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzQ7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5MiA9IHkwIC0gajIgKyAyLjAgKiBHNDtcbiAgICAgICAgdmFyIHoyID0gejAgLSBrMiArIDIuMCAqIEc0O1xuICAgICAgICB2YXIgdzIgPSB3MCAtIGwyICsgMi4wICogRzQ7XG4gICAgICAgIHZhciB4MyA9IHgwIC0gaTMgKyAzLjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgZm91cnRoIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5MyA9IHkwIC0gajMgKyAzLjAgKiBHNDtcbiAgICAgICAgdmFyIHozID0gejAgLSBrMyArIDMuMCAqIEc0O1xuICAgICAgICB2YXIgdzMgPSB3MCAtIGwzICsgMy4wICogRzQ7XG4gICAgICAgIHZhciB4NCA9IHgwIC0gMS4wICsgNC4wICogRzQ7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHk0ID0geTAgLSAxLjAgKyA0LjAgKiBHNDtcbiAgICAgICAgdmFyIHo0ID0gejAgLSAxLjAgKyA0LjAgKiBHNDtcbiAgICAgICAgdmFyIHc0ID0gdzAgLSAxLjAgKyA0LjAgKiBHNDtcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmaXZlIHNpbXBsZXggY29ybmVyc1xuICAgICAgICB2YXIgaWkgPSBpICYgMjU1O1xuICAgICAgICB2YXIgamogPSBqICYgMjU1O1xuICAgICAgICB2YXIga2sgPSBrICYgMjU1O1xuICAgICAgICB2YXIgbGwgPSBsICYgMjU1O1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSBmaXZlIGNvcm5lcnNcbiAgICAgICAgdmFyIHQwID0gMC42IC0geDAgKiB4MCAtIHkwICogeTAgLSB6MCAqIHowIC0gdzAgKiB3MDtcbiAgICAgICAgaWYgKHQwIDwgMCkgbjAgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMCA9IChwZXJtW2lpICsgcGVybVtqaiArIHBlcm1ba2sgKyBwZXJtW2xsXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkNFtnaTBdICogeDAgKyBncmFkNFtnaTAgKyAxXSAqIHkwICsgZ3JhZDRbZ2kwICsgMl0gKiB6MCArIGdyYWQ0W2dpMCArIDNdICogdzApO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MSAtIHcxICogdzE7XG4gICAgICAgIGlmICh0MSA8IDApIG4xID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTEgPSAocGVybVtpaSArIGkxICsgcGVybVtqaiArIGoxICsgcGVybVtrayArIGsxICsgcGVybVtsbCArIGwxXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkNFtnaTFdICogeDEgKyBncmFkNFtnaTEgKyAxXSAqIHkxICsgZ3JhZDRbZ2kxICsgMl0gKiB6MSArIGdyYWQ0W2dpMSArIDNdICogdzEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MiA9IDAuNiAtIHgyICogeDIgLSB5MiAqIHkyIC0gejIgKiB6MiAtIHcyICogdzI7XG4gICAgICAgIGlmICh0MiA8IDApIG4yID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTIgPSAocGVybVtpaSArIGkyICsgcGVybVtqaiArIGoyICsgcGVybVtrayArIGsyICsgcGVybVtsbCArIGwyXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkNFtnaTJdICogeDIgKyBncmFkNFtnaTIgKyAxXSAqIHkyICsgZ3JhZDRbZ2kyICsgMl0gKiB6MiArIGdyYWQ0W2dpMiArIDNdICogdzIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MyA9IDAuNiAtIHgzICogeDMgLSB5MyAqIHkzIC0gejMgKiB6MyAtIHczICogdzM7XG4gICAgICAgIGlmICh0MyA8IDApIG4zID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTMgPSAocGVybVtpaSArIGkzICsgcGVybVtqaiArIGozICsgcGVybVtrayArIGszICsgcGVybVtsbCArIGwzXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0MyAqPSB0MztcbiAgICAgICAgICAgIG4zID0gdDMgKiB0MyAqIChncmFkNFtnaTNdICogeDMgKyBncmFkNFtnaTMgKyAxXSAqIHkzICsgZ3JhZDRbZ2kzICsgMl0gKiB6MyArIGdyYWQ0W2dpMyArIDNdICogdzMpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0NCA9IDAuNiAtIHg0ICogeDQgLSB5NCAqIHk0IC0gejQgKiB6NCAtIHc0ICogdzQ7XG4gICAgICAgIGlmICh0NCA8IDApIG40ID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTQgPSAocGVybVtpaSArIDEgKyBwZXJtW2pqICsgMSArIHBlcm1ba2sgKyAxICsgcGVybVtsbCArIDFdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQ0ICo9IHQ0O1xuICAgICAgICAgICAgbjQgPSB0NCAqIHQ0ICogKGdyYWQ0W2dpNF0gKiB4NCArIGdyYWQ0W2dpNCArIDFdICogeTQgKyBncmFkNFtnaTQgKyAyXSAqIHo0ICsgZ3JhZDRbZ2k0ICsgM10gKiB3NCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3VtIHVwIGFuZCBzY2FsZSB0aGUgcmVzdWx0IHRvIGNvdmVyIHRoZSByYW5nZSBbLTEsMV1cbiAgICAgICAgcmV0dXJuIDI3LjAgKiAobjAgKyBuMSArIG4yICsgbjMgKyBuNCk7XG4gICAgfVxuXG5cbn07XG5cbi8vIGFtZFxuaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIGRlZmluZS5hbWQpIGRlZmluZShmdW5jdGlvbigpe3JldHVybiBTaW1wbGV4Tm9pc2U7fSk7XG4vL2NvbW1vbiBqc1xuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykgZXhwb3J0cy5TaW1wbGV4Tm9pc2UgPSBTaW1wbGV4Tm9pc2U7XG4vLyBicm93c2VyXG5lbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgd2luZG93LlNpbXBsZXhOb2lzZSA9IFNpbXBsZXhOb2lzZTtcbi8vIG5vZGVqc1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTaW1wbGV4Tm9pc2U7XG59XG5cbn0pKCk7XG4iLCJ2YXIgRGlyID0ge307XG5cbkRpci5MRUZUID0gMDtcbkRpci5SSUdIVCA9IDE7XG5EaXIuQk9UVE9NID0gMjtcbkRpci5VUCA9IDM7XG5EaXIuQkFDSyA9IDQ7XG5EaXIuRlJPTlQgPSA1O1xuXG5EaXIuZ2V0VW5pdFZlY3RvciA9IGZ1bmN0aW9uKGRpcikge1xuICBzd2l0Y2ggKGRpcikge1xuICAgIGNhc2UgXCIwXCI6XG4gICAgY2FzZSBEaXIuTEVGVDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygtMSwgMCwgMClcbiAgICBjYXNlIFwiMVwiOlxuICAgIGNhc2UgRGlyLlJJR0hUOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDEsIDAsIDApXG4gICAgY2FzZSBcIjJcIjpcbiAgICBjYXNlIERpci5CT1RUT006XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMCwgLTEsIDApXG4gICAgY2FzZSBcIjNcIjpcbiAgICBjYXNlIERpci5VUDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKVxuICAgIGNhc2UgXCI0XCI6XG4gICAgY2FzZSBEaXIuQkFDSzpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAtMSlcbiAgICBjYXNlIFwiNVwiOlxuICAgIGNhc2UgRGlyLkZST05UOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpXG4gIH1cbn07XG5cbkRpci51bml0VmVjdG9yVG9EaXIgPSBmdW5jdGlvbih1bml0VmVjdG9yKSB7XG4gIGlmICh1bml0VmVjdG9yLmVxdWFscyhuZXcgVEhSRUUuVmVjdG9yMygtMSwgMCwgMCkpKSB7XG4gICAgcmV0dXJuIERpci5MRUZUO1xuICB9IGVsc2UgaWYgKHVuaXRWZWN0b3IuZXF1YWxzKG5ldyBUSFJFRS5WZWN0b3IzKDEsIDAsIDApKSkge1xuICAgIHJldHVybiBEaXIuUklHSFQ7XG4gIH0gZWxzZSBpZiAodW5pdFZlY3Rvci5lcXVhbHMobmV3IFRIUkVFLlZlY3RvcjMoMCwgLTEsIDApKSkge1xuICAgIHJldHVybiBEaXIuQk9UVE9NO1xuICB9IGVsc2UgaWYgKHVuaXRWZWN0b3IuZXF1YWxzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApKSkge1xuICAgIHJldHVybiBEaXIuVVA7XG4gIH0gZWxzZSBpZiAodW5pdFZlY3Rvci5lcXVhbHMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpKSkge1xuICAgIHJldHVybiBEaXIuQkFDSztcbiAgfSBlbHNlIGlmICh1bml0VmVjdG9yLmVxdWFscyhuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKSkpIHtcbiAgICByZXR1cm4gRGlyLkZST05UO1xuICB9XG59O1xuXG52YXIgZ2V0UXVhdFJlc3VsdCA9IHt9O1xuRGlyLmdldFF1YXQgPSBmdW5jdGlvbihkaXIpIHtcbiAgaWYgKGdldFF1YXRSZXN1bHRbZGlyXSA9PSBudWxsKSB7XG4gICAgZ2V0UXVhdFJlc3VsdFtkaXJdID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tVW5pdFZlY3RvcnMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCksIERpci5nZXRVbml0VmVjdG9yKGRpcikpO1xuICB9XG4gIHJldHVybiBnZXRRdWF0UmVzdWx0W2Rpcl07XG59O1xuXG5EaXIuZ2V0T3Bwb3NpdGUgPSBmdW5jdGlvbihkaXIpIHtcbiAgdmFyIG9wcG9zaXRlcyA9IHtcbiAgICAwOiAxLFxuICAgIDE6IDAsXG4gICAgMjogMyxcbiAgICAzOiAyLFxuICAgIDQ6IDUsXG4gICAgNTogNFxuICB9O1xuXG4gIHJldHVybiBvcHBvc2l0ZXNbZGlyXTtcbn07XG5cbkRpci5pc09wcG9zaXRlID0gZnVuY3Rpb24oZGlyLCBkaXIyKSB7XG4gIHJldHVybiBEaXIuZ2V0T3Bwb3NpdGUoZGlyKSA9PT0gZGlyMjtcbn07XG5cbkRpci5pc0FkamFjZW50ID0gZnVuY3Rpb24oZGlyLCBkaXIyKSB7XG4gIHJldHVybiBkaXIgIT09IGRpcjIgJiYgIXRoaXMuaXNPcHBvc2l0ZShkaXIsIGRpcjIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXI7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiZW52XCI6IFwiZGV2XCJcbn0iLCJ2YXIgU2ltcGxleE5vaXNlID0gcmVxdWlyZSgnc2ltcGxleC1ub2lzZScpO1xuXG52YXIgbWVzaGVyID0gcmVxdWlyZSgnLi4vdm94ZWwvbWVzaGVyJyk7XG52YXIgRGlyID0gcmVxdWlyZSgnLi4vZGlyJyk7XG52YXIgQ2h1bmtzID0gcmVxdWlyZSgnLi4vdm94ZWwvY2h1bmtzJyk7XG52YXIgbWVzaENodW5rcyA9IHJlcXVpcmUoJy4uL3ZveGVsL21lc2hjaHVua3MnKTtcblxudmFyIENMT1VEID0gMTA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocGFyZW50LCBtYXRlcmlhbCkge1xuXG4gIHZhciBjaHVua3MgPSBuZXcgQ2h1bmtzKCk7XG4gIHZhciBkYXRhTWFwID0ge307XG4gIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgcGFyZW50LmFkZChvYmplY3QpO1xuXG4gIHZhciBub2lzZTEgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlRjEgPSAwLjE7XG4gIHZhciBub2lzZTIgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlRjIgPSAwLjA1O1xuICB2YXIgbm9pc2VfcHJlc3N1cmUgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlX3ByZXNzdXJlRiA9IDAuMDAyO1xuICB2YXIgY2xvdWRBbW91bnQgPSAtMS4wO1xuICB2YXIgY291bnRlciA9IDA7XG4gIHZhciBjb29sZG93biA9IDQuMjtcblxuICB2YXIgYWxsQ29vcmRzID0ge307XG5cbiAgdmFyIHNpemUgPSA0MztcbiAgdmFyIGNlbnRlck51bSA9IChzaXplIC8gMik7XG4gIHZhciBjZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMygtc2l6ZSAvIDIsIC1zaXplIC8gMiwgLXNpemUgLyAyKTtcblxuICB2YXIgY2xvdWRWb3hlbCA9IFtcbiAgICBDTE9VRCwgQ0xPVUQsIENMT1VELCBDTE9VRCwgQ0xPVUQsIENMT1VEXG4gIF07XG5cbiAgaW5pdERhdGEoKTtcblxuICBmdW5jdGlvbiBpbml0RGF0YSgpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcblxuICAgIGZvciAodmFyIGRpciA9IDA7IGRpciA8IDY7IGRpcisrKSB7XG4gICAgICB2YXIgZCA9IE1hdGguZmxvb3IoZGlyIC8gMik7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIHZhciBjb29yZEQgPSBkaXIgJSAyID8gMCA6IHNpemUgLSAxO1xuICAgICAgdmFyIGZhbGxEaXIgPSBjb29yZEQgPT09IDAgPyAxIDogLTE7XG4gICAgICB2YXIgZmFsbENvb3JkRCA9IGNvb3JkRCArIGZhbGxEaXI7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgICAgY29vcmRbZF0gPSBjb29yZEQ7XG4gICAgICAgICAgY29vcmRbdV0gPSBpO1xuICAgICAgICAgIGNvb3JkW3ZdID0gajtcblxuICAgICAgICAgIHZhciByZWwgPSBbXG4gICAgICAgICAgICAoY29vcmRbMF0gKyBjZW50ZXIueCksXG4gICAgICAgICAgICAoY29vcmRbMV0gKyBjZW50ZXIueSksXG4gICAgICAgICAgICAoY29vcmRbMl0gKyBjZW50ZXIueilcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBwcmVzc3VyZTogbm9pc2VfcHJlc3N1cmUubm9pc2UzRChcbiAgICAgICAgICAgICAgcmVsWzBdICogbm9pc2VfcHJlc3N1cmVGLFxuICAgICAgICAgICAgICByZWxbMV0gKiBub2lzZV9wcmVzc3VyZUYsXG4gICAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlX3ByZXNzdXJlRlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGFtb3VudDogMCxcbiAgICAgICAgICAgIGRlbHRhOiAwLFxuICAgICAgICAgICAgY29vcmQ6IFtjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdXVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgaGFzaCA9IGNvb3JkLmpvaW4oJywnKTtcbiAgICAgICAgICBhbGxDb29yZHNbaGFzaF0gPSBbY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXV07XG4gICAgICAgICAgZGF0YU1hcFtoYXNoXSA9IGRhdGE7XG5cbiAgICAgICAgICB2YXIgdmFsdWUgPSBub2lzZTEubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRjEsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUYxLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGMVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB2YXIgdmFsdWUyID0gbm9pc2UyLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYyLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGMixcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRjJcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdmFsdWUgPSBNYXRoLnBvdyh2YWx1ZSArIHZhbHVlMiwgMSkgKyBjbG91ZEFtb3VudDtcblxuICAgICAgICAgIGlmICh2YWx1ZSA+IDAuMCkge1xuICAgICAgICAgICAgY2h1bmtzLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCBjbG91ZFZveGVsKTtcbiAgICAgICAgICAgIGRhdGEuYW1vdW50ICs9IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0YS5uZWlnaGJvdXJzID0gW107XG5cblxuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChmYWxsQ29vcmRELCBpLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGNvb3JkRCwgaSAtIDEsIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaSA9PT0gc2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpICsgMSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChmYWxsQ29vcmRELCBpLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGNvb3JkRCwgaSwgaiAtIDEsIGQsIHUsIHYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaiA9PT0gc2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpLCBqICsgMSwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkaXIgPT09IDApIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzBdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAxKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1sxXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gMikge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbM107XG4gICAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09IDMpIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzJdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVsSSA9IGkgLSBjZW50ZXJOdW07XG4gICAgICAgICAgICB2YXIgcmVsSiA9IGogLSBjZW50ZXJOdW07XG5cbiAgICAgICAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIocmVsSSwgcmVsSik7XG4gICAgICAgICAgICBhbmdsZSA9IG5vcm1hbGl6ZUFuZ2xlKGFuZ2xlKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbm9ybWFsaXplQW5nbGUoYW5nbGUpIHtcbiAgICAgICAgICAgICAgYW5nbGUgJT0gKE1hdGguUEkgKiAyKTtcbiAgICAgICAgICAgICAgaWYgKGFuZ2xlIDwgTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgIGFuZ2xlICs9IE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgIGFuZ2xlIC09IE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBhbmdsZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBNYXRoLlBJIC8gNDtcbiAgICAgICAgICAgIHZhciBzdGVwID0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSAtTWF0aC5QSTtcblxuICAgICAgICAgICAgaWYgKGFuZ2xlID49IG9mZnNldCAmJiBhbmdsZSA8IG9mZnNldCArIHN0ZXApIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ2xlID49IG9mZnNldCArIHN0ZXAgJiYgYW5nbGUgPCBvZmZzZXQgKyBzdGVwICogMikge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1syXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5nbGUgPj0gb2Zmc2V0IC0gc3RlcCAmJiBhbmdsZSA8IG9mZnNldCkge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1szXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZXRDb29yZChpLCBqLCBrLCBkLCB1LCB2KSB7XG4gICAgdmFyIGNvb3JkID0gW107XG4gICAgY29vcmRbZF0gPSBpO1xuICAgIGNvb3JkW3VdID0gajtcbiAgICBjb29yZFt2XSA9IGs7XG4gICAgcmV0dXJuIGNvb3JkO1xuICB9XG5cbiAgdXBkYXRlTWVzaCgpO1xuXG4gIG9iamVjdC5wb3NpdGlvbi5jb3B5KGNlbnRlcik7XG5cbiAgZnVuY3Rpb24gdGljayhkdCkge1xuICAgIGNvdW50ZXIgKz0gZHQ7XG4gICAgaWYgKGNvdW50ZXIgPiBjb29sZG93bikge1xuICAgICAgY291bnRlciAtPSBjb29sZG93bjtcblxuICAgICAgdmFyIGNoYW5nZWQgPSB7fTtcbiAgICAgIGZvciAodmFyIGlkIGluIGFsbENvb3Jkcykge1xuICAgICAgICB2YXIgY29vcmQgPSBhbGxDb29yZHNbaWRdO1xuICAgICAgICB2YXIgZGF0YSA9IGRhdGFNYXBbaWRdO1xuICAgICAgICB2YXIgbmV4dENvb3JkID0gZGF0YS5uZXh0Q29vcmQ7XG4gICAgICAgIGlmIChuZXh0Q29vcmQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEuYW1vdW50IDw9IDApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0SGFzaCA9IG5leHRDb29yZC5qb2luKCcsJyk7XG4gICAgICAgIHZhciBuZXh0RGF0YSA9IGRhdGFNYXBbbmV4dEhhc2hdO1xuICAgICAgICBjaGFuZ2VkW25leHRIYXNoXSA9IHRydWU7XG4gICAgICAgIGNoYW5nZWRbaWRdID0gdHJ1ZTtcblxuICAgICAgICBuZXh0RGF0YS5kZWx0YSArPSAxLjA7XG4gICAgICAgIGRhdGEuZGVsdGEgKz0gLTEuMDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaWQgaW4gY2hhbmdlZCkge1xuICAgICAgICB2YXIgZGF0YSA9IGRhdGFNYXBbaWRdO1xuICAgICAgICB2YXIgY29vcmQgPSBkYXRhLmNvb3JkO1xuICAgICAgICBkYXRhLmFtb3VudCArPSBkYXRhLmRlbHRhO1xuICAgICAgICBkYXRhLmRlbHRhID0gMDtcblxuICAgICAgICBpZiAoZGF0YS5hbW91bnQgPj0gMS4wKSB7XG4gICAgICAgICAgY2h1bmtzLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCBjbG91ZFZveGVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIDApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZU1lc2goKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gdXBkYXRlTWVzaCgpIHtcbiAgICBtZXNoQ2h1bmtzKGNodW5rcywgb2JqZWN0LCBtYXRlcmlhbCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0aWNrOiB0aWNrXG4gIH07XG59XG4iLCJ2YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBTaW1wbGV4Tm9pc2UgPSByZXF1aXJlKCdzaW1wbGV4LW5vaXNlJyk7XG5cbnZhciBWb3hlbCA9IHJlcXVpcmUoJy4uLy4uL3ZveGVsJyk7XG52YXIgRGlyID0gcmVxdWlyZSgnLi4vLi4vZGlyJyk7XG52YXIgU3VyZmFjZU1hcCA9IHJlcXVpcmUoJy4vc3VyZmFjZW1hcCcpO1xuXG52YXIgQ2h1bmtzID0gVm94ZWwuQ2h1bmtzO1xudmFyIG1lc2hDaHVua3MgPSBWb3hlbC5tZXNoQ2h1bmtzO1xudmFyIHJlbW92ZUZsb2F0aW5nID0gVm94ZWwucmVtb3ZlRmxvYXRpbmc7XG5cbnZhciBHUkFTUyA9IDE7XG52YXIgU09JTCA9IDI7XG52YXIgU09JTF9FREdFID0gMztcbnZhciBTVE9ORSA9IDQ7XG52YXIgU0VBID0gNTtcbnZhciBTQU5EID0gNjtcblxudmFyIExFVkVMX1NVUkZBQ0UgPSAxO1xudmFyIExFVkVMX01JRERMRSA9IDI7XG52YXIgTEVWRUxfQ09SRSA9IDM7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2l6ZSwgcGFyZW50LCBtYXRlcmlhbCkge1xuICB2YXIgbm9pc2Vfc3VyZmFjZSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX3N1cmZhY2UgPSAwLjE7XG4gIHZhciBub2lzZV9zdXJmYWNlMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX3N1cmZhY2UyID0gMC4wNDtcblxuICB2YXIgbm9pc2VfYmlvbWVzID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZV9iaW9tZXMyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZV9iaW9tZXMzID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG5cbiAgdmFyIG5vaXNlX2Jpb21lc190cmVlcyA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX2Jpb21lc190cmVlcyA9IDAuMTtcblxuICB2YXIgbm9pc2VfYmlvbWVzX3RyZWVzMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX2Jpb21lc190cmVlczIgPSAwLjA0O1xuXG4gIHZhciBCSU9NRV9WQUxVRV9TVE9ORSA9IC0wLjg7XG4gIHZhciBCSU9NRV9WQUxVRV9TT0lMID0gMDtcblxuICB2YXIgc3VyZmFjZU1hcCA9IG5ldyBTdXJmYWNlTWFwKCk7XG5cbiAgdmFyIGdyb3VuZCA9IG5ldyBDaHVua3MoKTtcbiAgdmFyIHdhdGVyID0gbmV3IENodW5rcygpO1xuICB2YXIgYm91bmRzID0ge1xuICAgIG1pbjogbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCksXG4gICAgc2l6ZTogbmV3IFRIUkVFLlZlY3RvcjMoc2l6ZSwgc2l6ZSwgc2l6ZSlcbiAgfTtcblxuICB2YXIgY2VudGVyID0gWy1zaXplIC8gMiArIDAuNSwgLXNpemUgLyAyICsgMC41LCAtc2l6ZSAvIDIgKyAwLjVdO1xuICB2YXIgY2VudGVyQ29vcmQgPSBbXG4gICAgTWF0aC5mbG9vcihzaXplIC8gMiksXG4gICAgTWF0aC5mbG9vcihzaXplIC8gMiksXG4gICAgTWF0aC5mbG9vcihzaXplIC8gMilcbiAgXTtcblxuICAvLyBoYXNoIC0+IGRhdGFcbiAgLy8gZ3Jhdml0eTogZ3Jhdml0eSAocylcbiAgLy8gYmlvbWU6IGJpb21lIGRhdGFcbiAgLy8gaGVpZ2h0OiBoZWlnaHQgb2Ygc3VyZmFjZVxuICB2YXIgZGF0YU1hcCA9IHt9O1xuICB2YXIgc3VyZmFjZU51bSA9IDY7XG4gIHZhciBzZWFMZXZlbCA9IDI7XG5cbiAgdmFyIHBpdm90ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIHZhciBncm91bmRPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICBpbml0KCk7XG4gICAgZ2VuZXJhdGVHcmF2aXR5TWFwKCk7XG4gICAgZ2VuZXJhdGVCdW1wcygpO1xuICAgIHJlbW92ZUZsb2F0aW5nKGdyb3VuZCwgY2VudGVyQ29vcmQpO1xuICAgIGdlbmVyYXRlU2VhKCk7XG4gICAgZ2VuZXJhdGVCaW9tZXMoKTtcbiAgICBnZW5lcmF0ZVRpbGVzKCk7XG4gICAgZ2VuZXJhdGVTdXJmYWNlKCk7XG5cbiAgICBwaXZvdC5hZGQoZ3JvdW5kT2JqZWN0KTtcbiAgICBtZXNoQ2h1bmtzKGdyb3VuZCwgZ3JvdW5kT2JqZWN0LCBtYXRlcmlhbCk7XG4gICAgbWVzaENodW5rcyh3YXRlciwgcGl2b3QsIG1hdGVyaWFsKTtcblxuICAgIHZhciBwb3NpdGlvbkNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICAgIC5zdWJWZWN0b3JzKGJvdW5kcy5taW4sIGJvdW5kcy5zaXplKVxuICAgICAgLm11bHRpcGx5U2NhbGFyKDAuNSk7XG4gICAgcGl2b3QucG9zaXRpb24uY29weShwb3NpdGlvbkNlbnRlcik7XG4gICAgcGFyZW50LmFkZChwaXZvdCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICBncm91bmQuc2V0KGksIGosIGssIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU2VhKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgZCsrKSB7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIFtzZWFMZXZlbCwgc2l6ZSAtIHNlYUxldmVsIC0gMV0uZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBzZWFMZXZlbDsgaSA8IHNpemUgLSBzZWFMZXZlbDsgaSsrKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IHNlYUxldmVsOyBqIDwgc2l6ZSAtIHNlYUxldmVsOyBqKyspIHtcbiAgICAgICAgICAgIGNvb3JkW2RdID0gYztcbiAgICAgICAgICAgIGNvb3JkW3VdID0gaTtcbiAgICAgICAgICAgIGNvb3JkW3ZdID0gajtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgdmFyIGdyYXZpdHkgPSBkYXRhLmdyYXZpdHk7XG5cbiAgICAgICAgICAgIHZhciBibG9jayA9IFtcbiAgICAgICAgICAgICAgMCwgMCwgMCwgMCwgMCwgMFxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgZyBpbiBncmF2aXR5KSB7XG4gICAgICAgICAgICAgIGJsb2NrW2ddID0gU0VBO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSkpIHtcbiAgICAgICAgICAgICAgd2F0ZXIuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJpb21lcygpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGdyb3VuZC5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgTWF0aC5hYnMoaSArIGNlbnRlclswXSksXG4gICAgICAgICAgICBNYXRoLmFicyhqICsgY2VudGVyWzFdKSxcbiAgICAgICAgICAgIE1hdGguYWJzKGsgKyBjZW50ZXJbMl0pKTtcblxuICAgICAgICAgIHZhciByZWxTZWFMZXZlbCA9IChzaXplIC8gMiAtIGQgLSBzZWFMZXZlbCAtIDAuNSk7XG5cbiAgICAgICAgICBkIC89IChzaXplIC8gMik7XG5cbiAgICAgICAgICB2YXIgbm9pc2VGID0gMC4wNTtcbiAgICAgICAgICB2YXIgbm9pc2VGMiA9IDAuMDI7XG4gICAgICAgICAgdmFyIG5vaXNlRjMgPSAwLjAyO1xuXG4gICAgICAgICAgdmFyIHJlbCA9IFtpICsgY2VudGVyWzBdLCBqICsgY2VudGVyWzFdLCBrICsgY2VudGVyWzJdXTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBub2lzZV9iaW9tZXMubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRixcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRik7XG5cbiAgICAgICAgICB2YXIgdmFsdWUyID0gbm9pc2VfYmlvbWVzMi5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYyKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTMgPSBub2lzZV9iaW9tZXMzLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYzLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGMyxcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRjNcbiAgICAgICAgICApICsgdmFsdWU7XG5cbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlICogMC41ICsgdmFsdWUyICogMi4wO1xuXG4gICAgICAgICAgdmFyIGJpb21lID0ge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsdWUyOiB2YWx1ZTMsXG4gICAgICAgICAgICByZWxTZWFMZXZlbDogcmVsU2VhTGV2ZWxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHZhbHVlVHJlZSA9IG5vaXNlX2Jpb21lc190cmVlcy5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGX2Jpb21lc190cmVlcyxcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUZfYmlvbWVzX3RyZWVzXG4gICAgICAgICAgKSArIG5vaXNlX2Jpb21lc190cmVlczIubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMyLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGX2Jpb21lc190cmVlczIsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUZfYmlvbWVzX3RyZWVzMlxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvLyBCSU9NRSBiaWFzIGZvciB0cmVlXG4gICAgICAgICAgaWYgKHZhbHVlIDwgQklPTUVfVkFMVUVfU1RPTkUpIHtcbiAgICAgICAgICAgIHZhbHVlVHJlZSAtPSAxLjA7XG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IEJJT01FX1ZBTFVFX1NPSUwpIHtcbiAgICAgICAgICAgIHZhbHVlVHJlZSAtPSAwLjU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmlvbWUudHJlZSA9IHZhbHVlVHJlZTtcblxuICAgICAgICAgIHZhciBsZXZlbDtcblxuICAgICAgICAgIGlmIChkID4gMC43KSB7XG4gICAgICAgICAgICAvLyBzdXJmYWNlXG4gICAgICAgICAgICBsZXZlbCA9IExFVkVMX1NVUkZBQ0U7XG4gICAgICAgICAgfSBlbHNlIGlmIChkID4gMC4zKSB7XG4gICAgICAgICAgICAvLyBtaWRkbGVcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfTUlERExFO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb3JlXG4gICAgICAgICAgICBsZXZlbCA9IExFVkVMX0NPUkU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmlvbWUubGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShpLCBqLCBrKTtcbiAgICAgICAgICBkYXRhLmJpb21lID0gYmlvbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVHcmF2aXR5TWFwKCkge1xuICAgIHZhciBwYWRkaW5nID0gMjtcbiAgICBmb3IgKHZhciBpID0gLXBhZGRpbmc7IGkgPCBzaXplICsgcGFkZGluZzsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gLXBhZGRpbmc7IGogPCBzaXplICsgcGFkZGluZzsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAtcGFkZGluZzsgayA8IHNpemUgKyBwYWRkaW5nOyBrKyspIHtcbiAgICAgICAgICB2YXIgbWFwID0ge307XG4gICAgICAgICAgdmFyIGdyYXZpdHkgPSBjYWxjR3Jhdml0eShpLCBqLCBrKTtcbiAgICAgICAgICBncmF2aXR5LmZvckVhY2goZnVuY3Rpb24oZykge1xuICAgICAgICAgICAgbWFwW2ddID0ge1xuICAgICAgICAgICAgICBkaXI6IGdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGksIGosIGspO1xuICAgICAgICAgIGRhdGEuZ3Jhdml0eSA9IG1hcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBjYWxjR3Jhdml0eShpLCBqLCBrKSB7XG4gICAgdmFyIGFycmF5ID0gW1xuICAgICAgaSArIGNlbnRlclswXSxcbiAgICAgIGogKyBjZW50ZXJbMV0sXG4gICAgICBrICsgY2VudGVyWzJdXG4gICAgXTtcbiAgICB2YXIgbWF4ID0gLUluZmluaXR5O1xuICAgIHZhciBpbmRleGVzID0gW107XG4gICAgdmFyIGY7XG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBhcnJheS5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIGEgPSBNYXRoLmFicyhhcnJheVtkXSk7XG4gICAgICBpZiAoYSA+IG1heCkge1xuICAgICAgICBtYXggPSBhO1xuICAgICAgICBmID0gZCAqIDIgKyAoYXJyYXlbZF0gPiAwID8gMCA6IDEpO1xuICAgICAgICBpbmRleGVzID0gW2ZdO1xuICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhhIC0gbWF4KSA8IDAuMDEpIHtcbiAgICAgICAgZiA9IGQgKiAyICsgKGFycmF5W2RdID4gMCA/IDAgOiAxKTtcbiAgICAgICAgaW5kZXhlcy5wdXNoKGYpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5kZXhlcztcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJ1bXBzKCkge1xuICAgIC8vIEdlbmVyYXRlIHN1cmZhY2VcblxuICAgIHZhciBjUmFuZ2UgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3VyZmFjZU51bTsgaSsrKSB7XG4gICAgICBjUmFuZ2UucHVzaCgwICsgaSwgc2l6ZSAtIDEgLSBpKTtcbiAgICB9XG5cbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IDM7IGQrKykge1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG4gICAgICBjUmFuZ2UuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcblxuICAgICAgICAgICAgdmFyIGRpcyA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICBNYXRoLmFicyhjb29yZFswXSArIGNlbnRlclswXSksXG4gICAgICAgICAgICAgIE1hdGguYWJzKGNvb3JkWzFdICsgY2VudGVyWzFdKSxcbiAgICAgICAgICAgICAgTWF0aC5hYnMoY29vcmRbMl0gKyBjZW50ZXJbMl0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgZGlzQmlhcyA9IDEgLSAoc2l6ZSAvIDIgKyAwLjUgLSBkaXMpIC8gc3VyZmFjZU51bTtcblxuICAgICAgICAgICAgY29vcmRbZF0gPSBjO1xuICAgICAgICAgICAgY29vcmRbdV0gPSBqO1xuICAgICAgICAgICAgY29vcmRbdl0gPSBrO1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gWzAsIDAsIDBdO1xuICAgICAgICAgICAgdmFyIG9mZnNldDIgPSBbMCwgMCwgMF07XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG5vaXNlX3N1cmZhY2Uubm9pc2UzRChcbiAgICAgICAgICAgICAgKGNvb3JkWzBdICsgY2VudGVyWzBdICsgb2Zmc2V0WzBdKSAqIG5vaXNlRl9zdXJmYWNlLFxuICAgICAgICAgICAgICAoY29vcmRbMV0gKyBjZW50ZXJbMV0gKyBvZmZzZXRbMV0pICogbm9pc2VGX3N1cmZhY2UsXG4gICAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlclsyXSArIG9mZnNldFsyXSkgKiBub2lzZUZfc3VyZmFjZSk7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZTIgPSBub2lzZV9zdXJmYWNlMi5ub2lzZTNEKFxuICAgICAgICAgICAgICAoY29vcmRbMF0gKyBjZW50ZXJbMF0gKyBvZmZzZXQyWzBdKSAqIG5vaXNlRl9zdXJmYWNlMixcbiAgICAgICAgICAgICAgKGNvb3JkWzFdICsgY2VudGVyWzFdICsgb2Zmc2V0MlsxXSkgKiBub2lzZUZfc3VyZmFjZTIsXG4gICAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlclsyXSArIG9mZnNldDJbMl0pICogbm9pc2VGX3N1cmZhY2UyKTtcblxuICAgICAgICAgICAgdmFsdWUgPVxuICAgICAgICAgICAgICAoTWF0aC5wb3codmFsdWUyIC8gMS41LCAxKSAqIGRpc0JpYXMpICtcbiAgICAgICAgICAgICAgKC1NYXRoLnBvdyhkaXNCaWFzLCAxLjApICogMS4wICsgMC42KTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMC4wKSB7XG4gICAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICAgICAgZGF0YS5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgZ3JvdW5kLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVN1cmZhY2UoKSB7XG4gICAgc3VyZmFjZU1hcC51cGRhdGUoc2VsZik7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNTdXJmYWNlKGksIGosIGssIGYpIHtcbiAgICB2YXIgZCA9IE1hdGguZmxvb3IoZiAvIDIpOyAvLyAwIDEgMiBcbiAgICB2YXIgZGQgPSAoZiAtIGQgKiAyKSA/IC0xIDogMTsgLy8gLTEgb3IgMVxuXG4gICAgdmFyIGNvb3JkID0gW2ksIGosIGtdO1xuICAgIGNvb3JkW2RdICs9IGRkO1xuXG4gICAgcmV0dXJuICFncm91bmQuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pICYmICF3YXRlci5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVUaWxlcygpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICAvLyBHZW5lcmF0ZSBncmFzc2VzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XG4gICAgICAgICAgdmFyIHYgPSBncm91bmQuZ2V0KGksIGosIGspO1xuICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZ3JvdW5kLnNldChpLCBqLCBrLCBbXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAwKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDEpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMiksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAzKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDQpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgNSlcbiAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldChwb3MsIGYpIHtcbiAgICAgIHZhciBkID0gTWF0aC5mbG9vcihmIC8gMik7IC8vIDAgMSAyXG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcblxuICAgICAgdmFyIGRkID0gKGYgLSBkICogMikgPyAtMSA6IDE7IC8vIC0xIG9yIDFcblxuICAgICAgY29vcmRbZF0gPSBwb3NbZF0gKyBkZDtcbiAgICAgIGNvb3JkW3VdID0gcG9zW3VdO1xuICAgICAgY29vcmRbdl0gPSBwb3Nbdl07XG5cbiAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShwb3NbMF0sIHBvc1sxXSwgcG9zWzJdKTtcbiAgICAgIHZhciBiaW9tZSA9IGRhdGEuYmlvbWU7XG5cbiAgICAgIHZhciBsZXZlbCA9IGJpb21lLmxldmVsO1xuICAgICAgdmFyIHZhbHVlID0gYmlvbWUudmFsdWU7XG5cbiAgICAgIGlmIChsZXZlbCA9PT0gTEVWRUxfU1VSRkFDRSkge1xuXG4gICAgICAgIC8vIElmIGF0IHNlYSBsZXZlbCwgZ2VuZXJhdGUgc2FuZFxuICAgICAgICBpZiAoYmlvbWUucmVsU2VhTGV2ZWwgPT09IDApIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gICAgICAgICAgdmFyIGhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgICAgIGlmIChiaW9tZS52YWx1ZTIgKiBoZWlnaHQgPCAtMC4xKSB7XG4gICAgICAgICAgICB2YXIgYWJvdmUgPSBncm91bmQuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgdmFyIGlzU3VyZmFjZSA9ICFhYm92ZTtcbiAgICAgICAgICAgIGlmIChpc1N1cmZhY2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFNBTkQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlIDwgQklPTUVfVkFMVUVfU1RPTkUpIHtcbiAgICAgICAgICByZXR1cm4gU1RPTkU7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPCBCSU9NRV9WQUxVRV9TT0lMKSB7XG4gICAgICAgICAgcmV0dXJuIFNPSUw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHUkFTU1xuXG4gICAgICAgIC8vIG5vIGdyYXNzIGJlbG93XG4gICAgICAgIC8vIGlmIChiaW9tZS5yZWxTZWFMZXZlbCA+IDApIHtcbiAgICAgICAgLy8gICByZXR1cm4gU09JTDtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIE9uIGVkZ2VcbiAgICAgICAgdmFyIGdyYXZpdHkgPSBkYXRhLmdyYXZpdHk7XG4gICAgICAgIGlmIChncmF2aXR5W2ZdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gR1JBU1M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFNPSUw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobGV2ZWwgPT09IExFVkVMX01JRERMRSkge1xuXG4gICAgICB9IGVsc2UgaWYgKGxldmVsID09PSBMRVZFTF9DT1JFKSB7XG5cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFNUT05FO1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YShpLCBqLCBrKSB7XG4gICAgdmFyIGhhc2ggPSBbaSwgaiwga10uam9pbignLCcpO1xuICAgIGlmIChkYXRhTWFwW2hhc2hdID09IG51bGwpIHtcbiAgICAgIGRhdGFNYXBbaGFzaF0gPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFNYXBbaGFzaF07XG4gIH07XG5cbiAgdmFyIHNlbGYgPSB7XG4gICAgZ3JvdW5kOiBncm91bmQsXG4gICAgd2F0ZXI6IHdhdGVyLFxuICAgIGJvdW5kczogYm91bmRzLFxuICAgIG9iamVjdDogcGl2b3QsXG4gICAgY2FsY0dyYXZpdHk6IGNhbGNHcmF2aXR5LFxuICAgIHN1cmZhY2VNYXA6IHN1cmZhY2VNYXAsXG4gICAgZ3JvdW5kT2JqZWN0OiBncm91bmRPYmplY3QsXG4gICAgZ2V0RGF0YTogZ2V0RGF0YSxcbiAgICBpc1N1cmZhY2U6IGlzU3VyZmFjZVxuICB9O1xuXG4gIHN0YXJ0KCk7XG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuIiwidmFyIFZveGVsID0gcmVxdWlyZSgnLi4vLi4vdm94ZWwnKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuLi8uLi9EaXInKTtcbnZhciBDaHVua3MgPSBWb3hlbC5DaHVua3M7XG52YXIgR3JhcGggPSByZXF1aXJlKCdub2RlLWRpamtzdHJhJyk7XG5cbnZhciBTdXJmYWNlTWFwID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2h1bmtzID0gbmV3IENodW5rcygpO1xuICB0aGlzLmdyYXBoTWFwID0ge307XG4gIHRoaXMuZ3JhcGggPSBuZXcgR3JhcGgoKTtcbiAgdGhpcy5sb29rdXAgPSB7fTtcbn07XG5cblN1cmZhY2VNYXAucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRlcnJpYW4pIHtcbiAgdmFyIHVwVmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCk7XG4gIHZhciBjZW50ZXJPZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygwLjUsIDAuNSwgMC41KTtcbiAgdmFyIGdyb3VuZCA9IHRlcnJpYW4uZ3JvdW5kO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgZ3JvdW5kLnZpc2l0KGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgICB2YXIgZGF0YSA9IHRlcnJpYW4uZ2V0RGF0YShpLCBqLCBrKTtcbiAgICB2YXIgc3VyZmFjZSA9IGRhdGEuc3VyZmFjZSB8fCB7fTtcbiAgICB2YXIgZ3Jhdml0eSA9IGRhdGEuZ3Jhdml0eTtcblxuICAgIGZvciAodmFyIGYgaW4gZ3Jhdml0eSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRlcnJpYW4uaXNTdXJmYWNlKGksIGosIGssIGYpO1xuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHZhciBzdXJmYWNlcyA9IHNlbGYuY2h1bmtzLmdldChpLCBqLCBrKTtcbiAgICAgICAgaWYgKHN1cmZhY2VzID09IG51bGwpIHtcbiAgICAgICAgICBzdXJmYWNlcyA9IHt9O1xuICAgICAgICAgIHNlbGYuY2h1bmtzLnNldChpLCBqLCBrLCBzdXJmYWNlcyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdW5pdFZlY3RvciA9IERpci5nZXRVbml0VmVjdG9yKGYpLm11bHRpcGx5U2NhbGFyKC0xKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uQWJvdmUgPSBuZXcgVEhSRUUuVmVjdG9yMyhpLCBqLCBrKS5hZGQodW5pdFZlY3RvcikuYWRkKGNlbnRlck9mZnNldCk7XG4gICAgICAgIHZhciBxdWF0ID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tVW5pdFZlY3RvcnModXBWZWN0b3IsIHVuaXRWZWN0b3IpO1xuICAgICAgICB2YXIgaW52ZXJzZVF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyh1bml0VmVjdG9yLCB1cFZlY3Rvcik7XG5cbiAgICAgICAgdmFyIGhhc2ggPSBbaSwgaiwgaywgZl0uam9pbignLCcpO1xuICAgICAgICBzdXJmYWNlc1tmXSA9IHtcbiAgICAgICAgICBjb29yZDogW2ksIGosIGtdLFxuICAgICAgICAgIGhhc2g6IGhhc2gsXG4gICAgICAgICAgZmFjZTogZixcbiAgICAgICAgICBwb3NpdGlvbkFib3ZlOiBwb3NpdGlvbkFib3ZlLFxuICAgICAgICAgIHF1YXQ6IHF1YXQsXG4gICAgICAgICAgaW52ZXJzZVF1YXQ6IGludmVyc2VRdWF0LFxuICAgICAgICAgIGNvbm5lY3Rpb25zOiB7fVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5sb29rdXBbaGFzaF0gPSBzdXJmYWNlc1tmXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy52aXNpdChmdW5jdGlvbihzdXJmYWNlKSB7XG4gICAgc2VsZi51cGRhdGVDb25uZWN0aW9ucyhzdXJmYWNlKTtcbiAgfSk7XG5cbiAgdGhpcy5ncmFwaCA9IG5ldyBHcmFwaCh0aGlzLmdyYXBoTWFwKTtcbn07XG5cblN1cmZhY2VNYXAucHJvdG90eXBlLnVwZGF0ZUNvbm5lY3Rpb25zID0gZnVuY3Rpb24oc3VyZmFjZSkge1xuICB2YXIgY29vcmQgPSBzdXJmYWNlLmNvb3JkO1xuICB2YXIgZiA9IHN1cmZhY2UuZmFjZTtcbiAgdmFyIGQgPSBNYXRoLmZsb29yKHN1cmZhY2UuZmFjZSAvIDIpO1xuICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICB2YXIgdiA9IChkICsgMikgJSAzO1xuXG4gIGZvciAodmFyIGkgPSAtMTsgaSA8PSAxOyBpKyspIHtcbiAgICBmb3IgKHZhciBqID0gLTE7IGogPD0gMTsgaisrKSB7XG4gICAgICBmb3IgKHZhciBrID0gLTE7IGsgPD0gMTsgaysrKSB7XG4gICAgICAgIHZhciBjb29yZDIgPSBbY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXV07XG4gICAgICAgIGNvb3JkMltkXSArPSBpO1xuICAgICAgICBjb29yZDJbdV0gKz0gajtcbiAgICAgICAgY29vcmQyW3ZdICs9IGs7XG4gICAgICAgIHZhciBzdXJmYWNlcyA9IHRoaXMuZ2V0QXQoY29vcmQyWzBdLCBjb29yZDJbMV0sIGNvb3JkMlsyXSk7XG4gICAgICAgIHZhciBmb3J3YXJkVmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSk7XG5cbiAgICAgICAgZm9yICh2YXIgZjIgaW4gc3VyZmFjZXMpIHtcbiAgICAgICAgICB2YXIgc3VyZmFjZTIgPSBzdXJmYWNlc1tmMl07XG5cbiAgICAgICAgICBpZiAoc3VyZmFjZSA9PT0gc3VyZmFjZTIpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBkaXNWZWN0b3IgPSBzdXJmYWNlMi5wb3NpdGlvbkFib3ZlLmNsb25lKCkuc3ViKHN1cmZhY2UucG9zaXRpb25BYm92ZSk7XG4gICAgICAgICAgdmFyIGRpcyA9IGRpc1ZlY3Rvci5sZW5ndGgoKTtcbiAgICAgICAgICB2YXIgcXVhdFZlY3RvciA9IGRpc1ZlY3Rvci5jbG9uZSgpLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgIHZhciBxdWF0VmVjdG9yQXJyYXkgPSBxdWF0VmVjdG9yLnRvQXJyYXkoKTtcbiAgICAgICAgICBxdWF0VmVjdG9yQXJyYXlbZF0gPSAwO1xuICAgICAgICAgIHF1YXRWZWN0b3JcbiAgICAgICAgICAgIC5mcm9tQXJyYXkocXVhdFZlY3RvckFycmF5KVxuICAgICAgICAgICAgLm5vcm1hbGl6ZSgpXG4gICAgICAgICAgICAuYXBwbHlRdWF0ZXJuaW9uKHN1cmZhY2UuaW52ZXJzZVF1YXQpO1xuXG4gICAgICAgICAgaWYgKGRpcyA8IDIpIHtcbiAgICAgICAgICAgIHZhciBxdWF0ID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tVW5pdFZlY3RvcnMoXG4gICAgICAgICAgICAgIGZvcndhcmRWZWN0b3IsXG4gICAgICAgICAgICAgIHF1YXRWZWN0b3IpO1xuICAgICAgICAgICAgc3VyZmFjZS5jb25uZWN0aW9uc1tzdXJmYWNlMi5oYXNoXSA9IHtcbiAgICAgICAgICAgICAgc3VyZmFjZTogc3VyZmFjZTIsXG4gICAgICAgICAgICAgIGRpczogZGlzLFxuICAgICAgICAgICAgICBxdWF0OiBxdWF0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ncmFwaE1hcFtzdXJmYWNlLmhhc2hdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhpcy5ncmFwaE1hcFtzdXJmYWNlLmhhc2hdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdyYXBoTWFwW3N1cmZhY2UuaGFzaF1bc3VyZmFjZTIuaGFzaF0gPSBkaXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5TdXJmYWNlTWFwLnByb3RvdHlwZS5maW5kU2hvcnRlc3QgPSBmdW5jdGlvbihzdXJmYWNlLCBzdXJmYWNlMiwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHtcbiAgICBnZXREaXN0YW5jZTogZnVuY3Rpb24oYSwgYikge1xuICAgICAgdmFyIGRpc0RpZmZSYXRpbyA9IDEwLjBcbiAgICAgIHZhciBzdXJmYWNlQSA9IHNlbGYuZ2V0V2l0aEhhc2goYSk7XG4gICAgICB2YXIgc3VyZmFjZUIgPSBzZWxmLmdldFdpdGhIYXNoKGIpO1xuICAgICAgaWYgKHN1cmZhY2VBLmJsb2NrZWQgfHwgc3VyZmFjZUIuYmxvY2tlZCkge1xuICAgICAgICByZXR1cm4gSW5maW5pdHk7XG4gICAgICB9XG4gICAgICB2YXIgZGVzdCA9IHN1cmZhY2UyO1xuXG4gICAgICB2YXIgZGlzID0gc2VsZi5ncmFwaE1hcFthXVtiXTtcblxuICAgICAgdmFyIGRpc0RpZmYgPSAoc3VyZmFjZUIucG9zaXRpb25BYm92ZS5jbG9uZSgpLmRpc3RhbmNlVG8oZGVzdC5wb3NpdGlvbkFib3ZlKSkgLVxuICAgICAgICAoc3VyZmFjZUEucG9zaXRpb25BYm92ZS5jbG9uZSgpLmRpc3RhbmNlVG8oZGVzdC5wb3NpdGlvbkFib3ZlKSk7XG5cbiAgICAgIHJldHVybiBkaXMgKyBkaXNEaWZmICogZGlzRGlmZlJhdGlvO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcy5ncmFwaC5zaG9ydGVzdFBhdGgoc3VyZmFjZS5oYXNoLCBzdXJmYWNlMi5oYXNoLCBvcHRpb25zKTtcbn07XG5cblN1cmZhY2VNYXAucHJvdG90eXBlLmdldEF0ID0gZnVuY3Rpb24oaSwgaiwgaykge1xuICByZXR1cm4gdGhpcy5jaHVua3MuZ2V0KGksIGosIGspIHx8IHt9O1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaSwgaiwgaywgZikge1xuICByZXR1cm4gdGhpcy5nZXRBdChpLCBqLCBrKVtmXTtcbn07XG5cblN1cmZhY2VNYXAucHJvdG90eXBlLmdldFdpdGhIYXNoID0gZnVuY3Rpb24oaGFzaCkge1xuICByZXR1cm4gdGhpcy5sb29rdXBbaGFzaF07XG59O1xuXG5TdXJmYWNlTWFwLnByb3RvdHlwZS52aXNpdCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHRoaXMuY2h1bmtzLnZpc2l0KGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgICBmb3IgKHZhciBmIGluIHYpIHtcbiAgICAgIGNhbGxiYWNrKHZbZl0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1cmZhY2VNYXA7XG4iLCJ2YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBWb3hlbCA9IHJlcXVpcmUoJy4uLy4uL3ZveGVsJyk7XG52YXIgRGlyID0gcmVxdWlyZSgnLi4vLi4vZGlyJyk7XG5cbnZhciBDaHVua3MgPSBWb3hlbC5DaHVua3M7XG52YXIgdmlzaXRTaGFwZSA9IFZveGVsLnZpc2l0U2hhcGU7XG52YXIgbWVzaENodW5rcyA9IFZveGVsLm1lc2hDaHVua3M7XG52YXIgY29weUNodW5rcyA9IFZveGVsLmNvcHlDaHVua3M7XG52YXIgcmVtb3ZlRmxvYXRpbmcgPSBWb3hlbC5yZW1vdmVGbG9hdGluZztcblxudmFyIFRSVU5LID0gWzIwLCAyMCwgMjAsIDIwLCAyMCwgMjBdO1xudmFyIExFQUYgPSBbMjEsIDIxLCAyMSwgMjEsIDIxLCAyMV07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocGFyZW50LCBibG9ja01hdGVyaWFsLCB0ZXJyaWFuKSB7XG4gIHZhciBjaHVua3MgPSBuZXcgQ2h1bmtzKCk7XG5cbiAgdmFyIHNwYXJzZSA9IDAuMTtcblxuICBmdW5jdGlvbiBhZGQoY29vcmQsIGRpcikge1xuXG4gICAgdmFyIGNodW5rczIgPSByZXF1aXJlKCcuL3BpbmUnKShjb29yZCwgZGlyKTtcblxuICAgIGNvcHlDaHVua3MoY2h1bmtzMiwgY2h1bmtzLCBjb29yZCk7XG4gICAgbWVzaENodW5rcyhjaHVua3MsIG9iamVjdCwgYmxvY2tNYXRlcmlhbCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgb2JqZWN0LnNjYWxlLnNldChzZWxmLnNjYWxlLCBzZWxmLnNjYWxlLCBzZWxmLnNjYWxlKTtcbiAgICBwYXJlbnQuYWRkKG9iamVjdCk7XG5cbiAgICB0ZXJyaWFuLnN1cmZhY2VNYXAudmlzaXQoZnVuY3Rpb24oc3VyZmFjZSkge1xuICAgICAgdmFyIGRhdGEgPSB0ZXJyaWFuLmdldERhdGEoc3VyZmFjZS5jb29yZFswXSwgc3VyZmFjZS5jb29yZFsxXSwgc3VyZmFjZS5jb29yZFsyXSk7XG5cbiAgICAgIC8vIE5vIHRyZWVzIHVuZGVyIHNlYSBsZXZlbFxuICAgICAgaWYgKGRhdGEuYmlvbWUucmVsU2VhTGV2ZWwgPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSG93IHNwYXJzZSB0cmVlcyBzaG91bGQgYmVcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gc3BhcnNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuYmlvbWUudHJlZSA8IDAuNSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBmID0gRGlyLmdldE9wcG9zaXRlKHN1cmZhY2UuZmFjZSk7XG5cbiAgICAgIC8vIFN0YXJ0IGZyb20gY2VudGVyIG9mIGJsb2NrLCBleHRlbmQgZm9yIGhhbGYgYSBibG9ja1xuICAgICAgdmFyIGNvb3JkID1cbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoc3VyZmFjZS5jb29yZFswXSwgc3VyZmFjZS5jb29yZFsxXSwgc3VyZmFjZS5jb29yZFsyXSlcbiAgICAgICAgLmFkZChuZXcgVEhSRUUuVmVjdG9yMygwLjUsIDAuNSwgMC41KSlcbiAgICAgICAgLmFkZChEaXIuZ2V0VW5pdFZlY3RvcihmKS5tdWx0aXBseVNjYWxhcigwLjUpKTtcblxuICAgICAgLy8gcmFuZG9taXplIHV2IGNvb3JkXG4gICAgICB2YXIgZCA9IE1hdGguZmxvb3IoZiAvIDIpO1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG5cbiAgICAgIHZhciB1diA9IFswLCAwLCAwXTtcbiAgICAgIHV2W3VdID0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgIHV2W3ZdID0gTWF0aC5yYW5kb20oKSAtIDAuNTtcblxuICAgICAgY29vcmQuYWRkKG5ldyBUSFJFRS5WZWN0b3IzKCkuZnJvbUFycmF5KHV2KSk7XG5cbiAgICAgIC8vIDEgdHJlZSBwZXIgdGVycmlhbiBncmlkXG4gICAgICBjb29yZC5tdWx0aXBseVNjYWxhcigxIC8gc2VsZi5zY2FsZSk7XG5cbiAgICAgIGNvb3JkLnggPSBNYXRoLnJvdW5kKGNvb3JkLngpO1xuICAgICAgY29vcmQueSA9IE1hdGgucm91bmQoY29vcmQueSk7XG4gICAgICBjb29yZC56ID0gTWF0aC5yb3VuZChjb29yZC56KTtcbiAgICAgIGFkZChjb29yZCwgZik7XG5cbiAgICAgIHN1cmZhY2UuYmxvY2tlZCA9IHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICB2YXIgc2VsZiA9IHtcbiAgICBhZGQ6IGFkZCxcbiAgICBvYmplY3Q6IG9iamVjdCxcbiAgICBzY2FsZTogKDEgLyAyLjApXG4gIH07XG5cbiAgc3RhcnQoKTtcblxuICByZXR1cm4gc2VsZjtcbn07IiwidmFyIERpciA9IHJlcXVpcmUoJy4uLy4uL2RpcicpO1xudmFyIFZveGVsID0gcmVxdWlyZSgnLi4vLi4vdm94ZWwnKTtcbnZhciBDaHVua3MgPSBWb3hlbC5DaHVua3M7XG52YXIgdmlzaXRTaGFwZSA9IFZveGVsLnZpc2l0U2hhcGU7XG52YXIgcmVtb3ZlRmxvYXRpbmcgPSBWb3hlbC5yZW1vdmVGbG9hdGluZztcblxudmFyIExFQUYgPSBbMjEsIDIxLCAyMSwgMjEsIDIxLCAyMV07XG52YXIgVFJVTksgPSBbMjAsIDIwLCAyMCwgMjAsIDIwLCAyMF07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29vcmQsIGRpcikge1xuICAvLyBMZWFmIGhlaWdodCAvIHdpZHRoXG4gIHZhciBzaGFwZVJhdGlvID0gMjtcbiAgLy8gRGVuc2l0eSBvZiBsZWFmc1xuICB2YXIgZGVuc2l0eSA9IDAuODtcbiAgLy8gVmFyaWFibGUgc2l6ZVxuICB2YXIgdmFyU2l6ZSA9IDQ7XG4gIC8vIEJhc2Ugc2l6ZVxuICB2YXIgYmFzZVNpemUgPSAzO1xuICAvLyBDdXJ2ZSBmb3IgdmFyaWFibGUgc2l6ZVxuICB2YXIgdmFyU2l6ZUN1cnZlID0gMi4wO1xuXG4gIHZhciByYW4gPSBNYXRoLnJhbmRvbSgpO1xuICB2YXIgcmFkaXVzID0gTWF0aC5wb3cocmFuLCB2YXJTaXplQ3VydmUpICogdmFyU2l6ZSArIGJhc2VTaXplO1xuICB2YXIgc2hhcGUyID0gcmFkaXVzICogc2hhcGVSYXRpbztcbiAgdmFyIGxlYWZIZWlnaHQgPSByYW4gPCAwLjUgPyAyIDogMztcbiAgdmFyIHRydW5rSGVpZ2h0ID0gbGVhZkhlaWdodCArIHNoYXBlMiAtIDQ7XG5cbiAgdmFyIHJhZGl1cyA9IHJhZGl1cyAqIE1hdGguc3FydCgyKSAvIDI7XG5cbiAgaWYgKGRpciA9PSBudWxsKSB7XG4gICAgdmFyIHRlcnJpYW5Db29yZCA9IGNvb3JkLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2VsZi5zY2FsZSk7XG4gICAgdmFyIGdyYXZpdHkgPSB0ZXJyaWFuLmNhbGNHcmF2aXR5KHRlcnJpYW5Db29yZC54LCB0ZXJyaWFuQ29vcmQueSwgdGVycmlhbkNvb3JkLnopO1xuICAgIGRpciA9IERpci5nZXRPcHBvc2l0ZShncmF2aXR5W01hdGguZmxvb3IoZ3Jhdml0eS5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV0pO1xuICB9XG5cbiAgdmFyIHVwVmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCk7XG4gIHZhciB1bml0VmVjdG9yID0gRGlyLmdldFVuaXRWZWN0b3IoZGlyKTtcbiAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyh1cFZlY3RvciwgdW5pdFZlY3Rvcik7XG4gIHZhciBkID0gTWF0aC5mbG9vcihkaXIgLyAyKTtcbiAgdmFyIHNpZGUgPSBkaXIgJSAyID09PSAwO1xuXG4gIHZhciBsZWFmU2hhcGUgPSBbcmFkaXVzLCBzaGFwZTIsIHJhZGl1c107XG5cbiAgdmFyIGxlYWZDZW50ZXIgPSBbXG4gICAgTWF0aC5yb3VuZCgtbGVhZlNoYXBlWzBdIC8gMiksXG4gICAgTWF0aC5yb3VuZCgtbGVhZlNoYXBlWzFdIC8gMiksXG4gICAgTWF0aC5yb3VuZCgtbGVhZlNoYXBlWzJdIC8gMilcbiAgXTtcblxuICB2YXIgY2h1bmtzMiA9IG5ldyBDaHVua3MoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRydW5rSGVpZ2h0OyBpKyspIHtcbiAgICB2YXIgYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIGksIDApLmFwcGx5UXVhdGVybmlvbihxdWF0KTtcbiAgICBpZiAoc2lkZSkge1xuICAgICAgYy5hZGQodW5pdFZlY3Rvcik7XG4gICAgfVxuXG4gICAgcm91bmRWZWN0b3IoYyk7XG4gICAgY2h1bmtzMi5zZXQoYy54LCBjLnksIGMueiwgVFJVTkspO1xuICB9XG5cbiAgdmlzaXRTaGFwZShsZWFmU2hhcGUsIGZ1bmN0aW9uKGksIGosIGspIHtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IGRlbnNpdHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGMgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgIGxlYWZDZW50ZXJbMF0gKyBpLFxuICAgICAgbGVhZkhlaWdodCArIGosXG4gICAgICBsZWFmQ2VudGVyWzJdICsga1xuICAgICk7XG5cbiAgICB2YXIgZGlzID0gTWF0aC5zcXJ0KGMueCAqIGMueCArIGMueiAqIGMueik7XG4gICAgdmFyIG1heERpcyA9IChzaGFwZTIgLSBqKSAvIHNoYXBlMiAqIHJhZGl1cztcblxuICAgIHZhciBkaWZmID0gbWF4RGlzIC0gZGlzO1xuICAgIGlmIChkaWZmIDwgMC4wKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRpZmYgPCAxKSB7XG4gICAgICBpZiAoTWF0aC5wb3coZGlmZiwgMC41KSA+IE1hdGgucmFuZG9tKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGMuYXBwbHlRdWF0ZXJuaW9uKHF1YXQpO1xuXG4gICAgcm91bmRWZWN0b3IoYyk7XG5cbiAgICBpZiAoc2lkZSkge1xuICAgICAgYy5hZGQodW5pdFZlY3Rvcik7XG4gICAgfVxuXG4gICAgY2h1bmtzMi5zZXQoYy54LCBjLnksIGMueiwgTEVBRik7XG4gIH0pO1xuXG4gIHJlbW92ZUZsb2F0aW5nKGNodW5rczIsIFswLCAwLCAwXSk7XG5cbiAgcmV0dXJuIGNodW5rczI7XG59O1xuXG5mdW5jdGlvbiByb3VuZFZlY3Rvcih2KSB7XG4gIHYueCA9IE1hdGgucm91bmQodi54KTtcbiAgdi55ID0gTWF0aC5yb3VuZCh2LnkpO1xuICB2LnogPSBNYXRoLnJvdW5kKHYueik7XG4gIHJldHVybiB2O1xufTtcbiIsInZhciBmaW5hbHNoYWRlciA9IHtcbiAgdW5pZm9ybXM6IHtcbiAgICBcInREaWZmdXNlXCI6IHsgdmFsdWU6IG51bGwgfSwgLy8gVGhlIGJhc2Ugc2NlbmUgYnVmZmVyXG4gICAgXCJ0R2xvd1wiOiB7IHZhbHVlOiBudWxsIH0gLy8gVGhlIGdsb3cgc2NlbmUgYnVmZmVyXG4gIH0sXG5cbiAgdmVydGV4U2hhZGVyOiBbXG4gICAgXCJ2YXJ5aW5nIHZlYzIgdlV2O1wiLFxuXG4gICAgXCJ2b2lkIG1haW4oKSB7XCIsXG5cbiAgICBcInZVdiA9IHZlYzIoIHV2LngsIHV2LnkgKTtcIixcbiAgICBcImdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQoIHBvc2l0aW9uLCAxLjAgKTtcIixcblxuICAgIFwifVwiXG4gIF0uam9pbihcIlxcblwiKSxcblxuICBmcmFnbWVudFNoYWRlcjogW1xuICAgIFwidW5pZm9ybSBzYW1wbGVyMkQgdERpZmZ1c2U7XCIsXG4gICAgXCJ1bmlmb3JtIHNhbXBsZXIyRCB0R2xvdztcIixcblxuICAgIFwidmFyeWluZyB2ZWMyIHZVdjtcIixcblxuICAgIFwidm9pZCBtYWluKCkge1wiLFxuXG4gICAgXCJ2ZWM0IHRleGVsID0gdGV4dHVyZTJEKCB0RGlmZnVzZSwgdlV2ICk7XCIsXG4gICAgXCJ2ZWM0IGdsb3cgPSB0ZXh0dXJlMkQoIHRHbG93LCB2VXYgKTtcIixcbiAgICBcImdsX0ZyYWdDb2xvciA9IHRleGVsICsgZ2xvdyAqIDEuMDtcIixcblxuICAgIFwifVwiXG4gIF0uam9pbihcIlxcblwiKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaW5hbHNoYWRlcjtcbiIsInZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIGtleWNvZGUgPSByZXF1aXJlKCdrZXljb2RlJyk7XG52YXIgRGlyID0gcmVxdWlyZSgnLi9kaXInKTtcbnZhciBmaW5hbFNoYWRlciA9IHJlcXVpcmUoJy4vZmluYWxzaGFkZXInKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xudmFyIGFwcCA9IHt9O1xuXG52YXIgZW52ID0gY29uZmlnLmVudiB8fCAncHJvZHVjdGlvbic7XG5cbmlmIChlbnYgPT09ICdkZXYnKSB7XG4gIHZhciBzdGF0cyA9IG5ldyBTdGF0cygpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG59XG5cbi8vIFBvc3QgcHJvY2Vzc2luZyBzZXR0aW5nXG52YXIgcG9zdHByb2Nlc3NpbmcgPSB7IGVuYWJsZWQ6IHRydWUsIHJlbmRlck1vZGU6IDAgfTtcblxuLy8gUmVuZGVyZXIsIHNjZW5lLCBjYW1lcmFcbnZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhCQkQ5RjcpO1xuLy8gcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDIyMjIyMik7XG52YXIgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbnZhciBmb3YgPSA2MDtcbnZhciB6b29tU3BlZWQgPSAxLjE7XG52YXIgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKGZvdiwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gIDAuMSwgMTAwMCk7XG52YXIgY2FtZXJhVXAsIGNhbWVyYURpciwgY2FtZXJhUmlnaHQ7XG5cbi8vIFBvc3QgcHJvY2Vzc2luZ1xudmFyIGRlcHRoTWF0ZXJpYWw7XG52YXIgZGVwdGhSZW5kZXJUYXJnZXQ7XG52YXIgc3Nhb1Bhc3M7XG52YXIgZWZmZWN0Q29tcG9zZXI7XG52YXIgZmluYWxDb21wb3NlcjtcblxuLy8gU2l6ZVxudmFyIHNpemUgPSAzMjtcbnZhciBtb2RlbFNpemUgPSA1O1xudmFyIGRpc1NjYWxlID0gMS4yICogbW9kZWxTaXplO1xuXG4vLyBPYmplY3RzXG52YXIgb2JqZWN0O1xudmFyIG5vQW9MYXllcjtcblxudmFyIGVudGl0aWVzID0gW107XG5cbi8vIE1hdGVyaWFscywgVGV4dHVyZXNcbnZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NdWx0aU1hdGVyaWFsKCk7XG5tYXRlcmlhbC5tYXRlcmlhbHMgPSBbbnVsbF07XG52YXIgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG52YXIgYmxvY2tUZXh0dXJlcyA9IFtdO1xudmFyIHRleHR1cmVzID0ge307XG5cbi8vIElucHV0IHN0YXRlc1xudmFyIGtleWhvbGRzID0ge307XG52YXIgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xudmFyIHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoKTtcbnZhciByYXljYXN0ZXJEaXI7XG5cbi8vIGZyYW1lIHRpbWVcbnZhciBkdCA9IDEgLyA2MDtcbnZhciBibHVyaW5lc3MgPSAxO1xuXG52YXIgc3dhcHBlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBpbml0UG9zdHByb2Nlc3NpbmcoKSB7XG4gIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gIC8vIFNldHVwIHJlbmRlciBwYXNzXG4gIHZhciByZW5kZXJQYXNzID0gbmV3IFRIUkVFLlJlbmRlclBhc3Moc2NlbmUsIGNhbWVyYSk7XG5cbiAgLy8gU2V0dXAgZGVwdGggcGFzc1xuICBkZXB0aE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hEZXB0aE1hdGVyaWFsKCk7XG4gIGRlcHRoTWF0ZXJpYWwuZGVwdGhQYWNraW5nID0gVEhSRUUuUkdCQURlcHRoUGFja2luZztcbiAgZGVwdGhNYXRlcmlhbC5ibGVuZGluZyA9IFRIUkVFLk5vQmxlbmRpbmc7XG5cbiAgdmFyIHBhcnMgPSB7IG1pbkZpbHRlcjogVEhSRUUuTGluZWFyRmlsdGVyLCBtYWdGaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciB9O1xuICBkZXB0aFJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCBwYXJzKTtcblxuICAvLyBTZXR1cCBTU0FPIHBhc3NcbiAgc3Nhb1Bhc3MgPSBuZXcgVEhSRUUuU2hhZGVyUGFzcyhUSFJFRS5TU0FPU2hhZGVyKTtcblxuICAvL3NzYW9QYXNzLnVuaWZvcm1zWyBcInREaWZmdXNlXCIgXS52YWx1ZSB3aWxsIGJlIHNldCBieSBTaGFkZXJQYXNzXG4gIHNzYW9QYXNzLnVuaWZvcm1zW1widERlcHRoXCJdLnZhbHVlID0gZGVwdGhSZW5kZXJUYXJnZXQudGV4dHVyZTtcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ3NpemUnXS52YWx1ZS5zZXQod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydjYW1lcmFOZWFyJ10udmFsdWUgPSBjYW1lcmEubmVhcjtcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ2NhbWVyYUZhciddLnZhbHVlID0gY2FtZXJhLmZhcjtcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ29ubHlBTyddLnZhbHVlID0gKHBvc3Rwcm9jZXNzaW5nLnJlbmRlck1vZGUgPT0gMSk7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydhb0NsYW1wJ10udmFsdWUgPSAxMDAuMDtcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ2x1bUluZmx1ZW5jZSddLnZhbHVlID0gMC43O1xuc3Nhb1Bhc3MucmVuZGVyVG9TY3JlZW4gPSB0cnVlO1xuXG4gIC8vIEFkZCBwYXNzIHRvIGVmZmVjdCBjb21wb3NlclxuICBlZmZlY3RDb21wb3NlciA9IG5ldyBUSFJFRS5FZmZlY3RDb21wb3NlcihyZW5kZXJlcik7XG4gIGVmZmVjdENvbXBvc2VyLmFkZFBhc3MocmVuZGVyUGFzcyk7XG4gIGVmZmVjdENvbXBvc2VyLmFkZFBhc3Moc3Nhb1Bhc3MpOyAgICBcbn07XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgdmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgLy8gUmVzaXplIHJlbmRlclRhcmdldHNcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ3NpemUnXS52YWx1ZS5zZXQod2lkdGgsIGhlaWdodCk7XG5cbiAgdmFyIHBpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG4gIHZhciBuZXdXaWR0aCA9IE1hdGguZmxvb3Iod2lkdGggLyBwaXhlbFJhdGlvKSB8fCAxO1xuICB2YXIgbmV3SGVpZ2h0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyBwaXhlbFJhdGlvKSB8fCAxO1xuICBkZXB0aFJlbmRlclRhcmdldC5zZXRTaXplKG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xuICBlZmZlY3RDb21wb3Nlci5zZXRTaXplKG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xufTtcblxuZnVuY3Rpb24gaW5pdFNjZW5lKCkge1xuICB2YXIgZGlzID0gc2l6ZSAqIGRpc1NjYWxlO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IGRpcztcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSBkaXM7XG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gZGlzO1xuICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKCkpO1xuXG4gIGNhbWVyYVVwID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCk7XG4gIGNhbWVyYURpciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLmFwcGx5RXVsZXIoY2FtZXJhLnJvdGF0aW9uKTtcbiAgY2FtZXJhUmlnaHQgPSBuZXcgVEhSRUUuVmVjdG9yMygpLmNyb3NzVmVjdG9ycyhjYW1lcmFVcCwgY2FtZXJhRGlyKTtcblxuICBvYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgb2JqZWN0LnNjYWxlLnNldChtb2RlbFNpemUsIG1vZGVsU2l6ZSwgbW9kZWxTaXplKTtcbiAgc2NlbmUuYWRkKG9iamVjdCk7XG4gIG5vQW9MYXllciA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBvYmplY3QuYWRkKG5vQW9MYXllcik7XG4gIHZhciBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ODg4ODg4KTtcbiAgb2JqZWN0LmFkZChhbWJpZW50TGlnaHQpO1xuXG4gIHZhciBkaXJlY3Rpb25hbExpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuNik7XG4gIGRpcmVjdGlvbmFsTGlnaHQucG9zaXRpb24uc2V0KDAuMywgMS4wLCAwLjUpO1xuICBvYmplY3QuYWRkKGRpcmVjdGlvbmFsTGlnaHQpO1xuXG4gIHZhciBkaXJlY3Rpb25hbExpZ2h0MiA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjYpO1xuICBkaXJlY3Rpb25hbExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTAuMywgLTEuMCwgLTAuNSk7XG4gIG9iamVjdC5hZGQoZGlyZWN0aW9uYWxMaWdodDIpO1xuXG5cbn07XG5cbnZhciBtYXRlcmlhbHNDb3B5ID0gW107XG52YXIgbWF0ZXJpYWxzU3dhcCA9IFtdO1xuXG5mdW5jdGlvbiBsb2FkUmVzb3VyY2VzKCkge1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnZ3Jhc3MnLCAxKTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NvaWwnLCAyKTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NvaWwyJywgMyk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzdG9uZScsIDQpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnc2VhJywgNSwgMC44KTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NhbmQnLCA2KTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3dhbGwnLCA3KTtcblxuICBsb2FkQmxvY2tNYXRlcmlhbCgnd2luZG93JywgOCwgMC44KTtcblxuICB2YXIgbSA9IGxvYWRCbG9ja01hdGVyaWFsKCdjbG91ZCcsIDEwLCAwLjcpO1xuICAvLyBtLmVtaXNzaXZlID0gbmV3IFRIUkVFLkNvbG9yKDB4ODg4ODg4KTtcblxuICBsb2FkQmxvY2tNYXRlcmlhbCgndHJ1bmsnLCAyMCk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdsZWFmJywgMjEpO1xuXG4gIGxvYWRCbG9ja01hdGVyaWFsKCdnbG93JywgMzAsIG51bGwsIHRydWUpO1xuXG4gIG1hdGVyaWFsc0NvcHkgPSBtYXRlcmlhbC5tYXRlcmlhbHM7XG59O1xuXG5mdW5jdGlvbiBsb2FkQmxvY2tNYXRlcmlhbChuYW1lLCBpbmRleCwgYWxwaGEsIHNraXBTd2FwKSB7XG4gIHNraXBTd2FwID0gc2tpcFN3YXAgfHwgZmFsc2U7XG4gIHZhciB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKCd0ZXh0dXJlcy8nICsgbmFtZSArICcucG5nJyk7XG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICB0ZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gIHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgYmxvY2tUZXh0dXJlcy5wdXNoKHRleHR1cmUpO1xuXG4gIHZhciBtID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG5cbiAgdmFyIHN3YXBNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgY29sb3I6IDB4MDAwMDAwXG4gIH0pO1xuXG4gIGlmIChhbHBoYSAhPSBudWxsKSB7XG4gICAgbS50cmFuc3BhcmVudCA9IHN3YXBNYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gICAgbS5vcGFjaXR5ID0gc3dhcE1hdGVyaWFsLm9wYWNpdHkgPSBhbHBoYTtcbiAgfVxuXG4gIG1hdGVyaWFsLm1hdGVyaWFsc1tpbmRleF0gPSBtO1xuXG4gIGlmICghc2tpcFN3YXApIHtcbiAgICBtYXRlcmlhbHNTd2FwW2luZGV4XSA9IHN3YXBNYXRlcmlhbDtcbiAgfSBlbHNlIHtcbiAgICBtYXRlcmlhbHNTd2FwW2luZGV4XSA9IG07XG4gIH1cblxuICByZXR1cm4gbTtcbn07XG5cbmZ1bmN0aW9uIHN3YXAoZmxhZykge1xuICBzd2FwcGVkID0gZmxhZztcbiAgaWYgKGZsYWcpIHtcbiAgICBtYXRlcmlhbC5tYXRlcmlhbHMgPSBtYXRlcmlhbHNTd2FwO1xuICB9IGVsc2Uge1xuICAgIG1hdGVyaWFsLm1hdGVyaWFscyA9IG1hdGVyaWFsc0NvcHk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgaWYgKGVudiA9PT0gJ2RldicpIHtcbiAgICBzdGF0cy5iZWdpbigpO1xuICB9XG5cbiAgaWYgKHBvc3Rwcm9jZXNzaW5nLmVuYWJsZWQpIHtcbiAgICAvLyBSZW5kZXIgZGVwdGggaW50byBkZXB0aFJlbmRlclRhcmdldFxuICAgIG5vQW9MYXllci52aXNpYmxlID0gZmFsc2U7XG4gICAgc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IGRlcHRoTWF0ZXJpYWw7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEsIGRlcHRoUmVuZGVyVGFyZ2V0LCB0cnVlKTtcbiAgICBub0FvTGF5ZXIudmlzaWJsZSA9IHRydWU7XG4gICAgc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IG51bGw7XG4gICAgXG4gICAgZWZmZWN0Q29tcG9zZXIucmVuZGVyKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICB9XG5cbiAgdmFyIHJvdGF0ZVkgPSAwO1xuICBpZiAoa2V5aG9sZHNbJ3JpZ2h0J10pIHtcbiAgICByb3RhdGVZIC09IDAuMTtcbiAgfSBlbHNlIGlmIChrZXlob2xkc1snbGVmdCddKSB7XG4gICAgcm90YXRlWSArPSAwLjE7XG4gIH1cblxuICB2YXIgcXVhdEludmVyc2UgPSBvYmplY3QucXVhdGVybmlvbi5jbG9uZSgpLmludmVyc2UoKTtcbiAgdmFyIGF4aXMgPSBjYW1lcmFVcC5jbG9uZSgpLmFwcGx5UXVhdGVybmlvbihxdWF0SW52ZXJzZSkubm9ybWFsaXplKCk7XG4gIG9iamVjdC5xdWF0ZXJuaW9uXG4gICAgLm11bHRpcGx5KG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZShheGlzLCByb3RhdGVZKSk7XG5cbiAgdmFyIHJvdGF0ZVggPSAwO1xuICBpZiAoa2V5aG9sZHNbJ3VwJ10pIHtcbiAgICByb3RhdGVYIC09IDAuMTtcbiAgfSBlbHNlIGlmIChrZXlob2xkc1snZG93biddKSB7XG4gICAgcm90YXRlWCArPSAwLjE7XG4gIH1cblxuICBheGlzID0gY2FtZXJhUmlnaHQuY2xvbmUoKS5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpLm5vcm1hbGl6ZSgpO1xuICBvYmplY3QucXVhdGVybmlvblxuICAgIC5tdWx0aXBseShuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUoYXhpcywgcm90YXRlWCkpO1xuXG4gIGlmIChlbnYgPT09ICdkZXYnKSB7XG4gICAgc3RhdHMuZW5kKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIGVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgZW50aXR5LnRpY2soZHQpO1xuICB9KTtcbiAgcmVuZGVyKCk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn07XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlLnggPSAoZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIDIgLSAxO1xuICBtb3VzZS55ID0gLShldmVudC5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSAqIDIgKyAxO1xuXG4gIC8vIHVwZGF0ZSB0aGUgcGlja2luZyByYXkgd2l0aCB0aGUgY2FtZXJhIGFuZCBtb3VzZSBwb3NpdGlvbiAgXG4gIHJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKG1vdXNlLCBjYW1lcmEpO1xuICByYXljYXN0ZXJEaXIgPSByYXljYXN0ZXIucmF5LmRpcmVjdGlvbi5jbG9uZSgpO1xufTtcblxuZnVuY3Rpb24gb25Nb3VzZURvd24oZXZlbnQpIHtcbiAgaWYgKHRlcnJpYW4gPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGNhbGN1bGF0ZSBvYmplY3RzIGludGVyc2VjdGluZyB0aGUgcGlja2luZyByYXlcbiAgdmFyIGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0KHRlcnJpYW4ub2JqZWN0LCB0cnVlKTtcbiAgaWYgKGludGVyc2VjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHBvaW50ID0gaW50ZXJzZWN0c1swXS5wb2ludC5jbG9uZSgpXG4gICAgLmFkZChyYXljYXN0ZXJEaXIuY2xvbmUoKS5tdWx0aXBseVNjYWxhcigtMC4wMSkpO1xuXG4gIHZhciBsb2NhbFBvaW50ID0gdGVycmlhbi5vYmplY3Qud29ybGRUb0xvY2FsKHBvaW50KTtcbiAgdmFyIGNvb3JkID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgTWF0aC5mbG9vcihsb2NhbFBvaW50LngpLFxuICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC55KSxcbiAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQueilcbiAgKTtcblxuICB2YXIgcG9pbnQyID0gaW50ZXJzZWN0c1swXS5wb2ludC5jbG9uZSgpXG4gICAgLmFkZChyYXljYXN0ZXJEaXIuY2xvbmUoKS5tdWx0aXBseVNjYWxhcigwLjAxKSk7XG4gIHZhciBsb2NhbFBvaW50MiA9IHRlcnJpYW4ub2JqZWN0LndvcmxkVG9Mb2NhbChwb2ludDIpO1xuICB2YXIgY29vcmQyID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgTWF0aC5mbG9vcihsb2NhbFBvaW50Mi54KSxcbiAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQyLnkpLFxuICAgIE1hdGguZmxvb3IobG9jYWxQb2ludDIueilcbiAgKTtcblxuICB2YXIgdW5pdFZlY3RvciA9IGNvb3JkMi5jbG9uZSgpLnN1Yihjb29yZCk7XG4gIHZhciBmID0gRGlyLnVuaXRWZWN0b3JUb0Rpcih1bml0VmVjdG9yKTtcbiAgaWYgKGYgIT0gbnVsbCkge1xuICAgIG9uQ2xpY2tlZFN1cmZhY2UoZXZlbnQsIGNvb3JkMiwgZik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIG9uQ2xpY2tlZFN1cmZhY2UoZXZlbnQsIGNvb3JkLCBmKSB7XG4gIC8vIGlmIChldmVudC5idXR0b24gPT09IDApIHtcbiAgLy8gICB2YXIgY3JpdHRlciA9IHJlcXVpcmUoJy4vZW50aXRpZXMvY3JpdHRlcicpKHRlcnJpYW4ub2JqZWN0LCBtYXRlcmlhbCwgdGVycmlhbik7XG4gIC8vICAgZW50aXRpZXMucHVzaChjcml0dGVyKTtcbiAgLy8gICBjcml0dGVyLnNldENvb3JkKGNvb3JkLCBmKTtcbiAgLy8gICBjcml0dGVycy5wdXNoKGNyaXR0ZXIpO1xuICAvLyB9IGVsc2Uge1xuICAvLyAgIGNyaXR0ZXJzLmZvckVhY2goZnVuY3Rpb24oY3JpdHRlcikge1xuICAvLyAgICAgY3JpdHRlci5zZXRDb29yZChjb29yZCwgZik7XG4gIC8vICAgfSk7XG4gIC8vIH1cbn07XG5cbnZhciBjcml0dGVycyA9IFtdO1xuXG5mdW5jdGlvbiBvbk1vdXNlVXAoZXZlbnQpIHtcblxufTtcblxuZnVuY3Rpb24gb25LZXlEb3duKGUpIHtcbiAgdmFyIGtleSA9IGtleWNvZGUoZSk7XG4gIGtleWhvbGRzW2tleV0gPSB0cnVlO1xuXG4gIGlmIChrZXkgPT09ICdnJykge1xuICAgIHRlcnJpYW4uZ3JvdW5kT2JqZWN0LnZpc2libGUgPSAhdGVycmlhbi5ncm91bmRPYmplY3QudmlzaWJsZTtcbiAgfVxuXG4gIGlmIChrZXkgPT09ICc9Jykge1xuICAgIGNhbWVyYS5mb3YgLz0gem9vbVNwZWVkO1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIH1cblxuICBpZiAoa2V5ID09PSAnLScpIHtcbiAgICBjYW1lcmEuZm92ICo9IHpvb21TcGVlZDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBvbktleVVwKGUpIHtcbiAgdmFyIGtleSA9IGtleWNvZGUoZSk7XG4gIGtleWhvbGRzW2tleV0gPSBmYWxzZTtcbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24sIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXAsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG5cbmxvYWRSZXNvdXJjZXMoKTtcbmluaXRQb3N0cHJvY2Vzc2luZygpO1xuaW5pdFNjZW5lKCk7XG5cbi8vIEluaXQgYXBwXG5cbnZhciBjbG91ZCA9IHJlcXVpcmUoJy4vZW50aXRpZXMvY2xvdWQnKShvYmplY3QsIG1hdGVyaWFsKTtcbmVudGl0aWVzLnB1c2goY2xvdWQpO1xuXG52YXIgdGVycmlhbiA9IHJlcXVpcmUoJy4vZW50aXRpZXMvdGVycmlhbicpKHNpemUsIG9iamVjdCwgbWF0ZXJpYWwpO1xuXG52YXIgdHJlZSA9IHJlcXVpcmUoJy4vZW50aXRpZXMvdHJlZScpKHRlcnJpYW4ub2JqZWN0LCBtYXRlcmlhbCwgdGVycmlhbik7XG5cbi8vIHZhciBDaHVua3MgPSByZXF1aXJlKCcuL3ZveGVsL2NodW5rcycpO1xuLy8gdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcbi8vIHZhciBsZW4gPSAzMjtcblxuLy8gdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoKTtcbi8vIG1hdGVyaWFsLm1hdGVyaWFscy5wdXNoKG51bGwsIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4vLyAgIGNvbG9yOiAweGZmZmZmZixcbi8vICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4vLyAgIG9wYWNpdHk6IDAuNVxuLy8gfSkpO1xuXG4vLyBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4vLyAgIGZvciAodmFyIGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbi8vICAgICBmb3IgKHZhciBrID0gMDsgayA8IGxlbjsgaysrKSB7XG4vLyAgICAgICBjaHVua3Muc2V0KGksIGosIGssIFsxLCAxLCAxLCAxLCAxLCAxXSk7XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XG5cbi8vIHZhciBtZXNoQ2h1bmtzID0gcmVxdWlyZSgnLi92b3hlbC9tZXNoY2h1bmtzJyk7XG4vLyB2YXIgdGVzdE9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuLy8gdGVzdE9iamVjdC5zY2FsZS5zZXQoNSwgNSwgNSk7XG4vLyBzY2VuZS5hZGQodGVzdE9iamVjdCk7XG4vLyBtZXNoQ2h1bmtzKGNodW5rcywgdGVzdE9iamVjdCwgbWF0ZXJpYWwpO1xuXG5hbmltYXRlKCk7XG4iLCJ2YXIgQ2h1bmsgPSBmdW5jdGlvbihzaGFwZSkge1xuICB0aGlzLnZvbHVtZSA9IFtdO1xuICB0aGlzLnNoYXBlID0gc2hhcGUgfHwgWzE2LCAxNiwgMTZdO1xuICB0aGlzLmRpbVggPSB0aGlzLnNoYXBlWzBdO1xuICB0aGlzLmRpbVhZID0gdGhpcy5zaGFwZVswXSAqIHRoaXMuc2hhcGVbMV07XG59O1xuXG5DaHVuay5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaSwgaiwgaykge1xuICByZXR1cm4gdGhpcy52b2x1bWVbaSAqIHRoaXMuZGltWFkgKyBqICogdGhpcy5kaW1YICsga107XG59O1xuXG5DaHVuay5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICB0aGlzLnZvbHVtZVtpICogdGhpcy5kaW1YWSArIGogKiB0aGlzLmRpbVggKyBrXSA9IHY7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENodW5rO1xuIiwidmFyIENodW5rID0gcmVxdWlyZSgnLi9jaHVuaycpO1xuXG52YXIgQ2h1bmtzID0gZnVuY3Rpb24oY2h1bmtTaXplKSB7XG4gIHRoaXMubWFwID0ge307XG4gIHRoaXMuY2h1bmtTaXplID0gY2h1bmtTaXplIHx8IDE2O1xufTtcblxuQ2h1bmtzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gIHZhciBvcmlnaW4gPSB0aGlzLmdldE9yaWdpbihpLCBqLCBrKTtcbiAgdmFyIGhhc2ggPSBvcmlnaW4udG9BcnJheSgpLmpvaW4oJywnKTtcbiAgaWYgKHRoaXMubWFwW2hhc2hdID09IG51bGwpIHtcbiAgICB0aGlzLm1hcFtoYXNoXSA9IHtcbiAgICAgIGNodW5rOiBuZXcgQ2h1bmsoW3RoaXMuY2h1bmtTaXplLCB0aGlzLmNodW5rU2l6ZSwgdGhpcy5jaHVua1NpemVdKSxcbiAgICAgIG9yaWdpbjogb3JpZ2luXG4gICAgfVxuICB9XG5cbiAgdGhpcy5tYXBbaGFzaF0uZGlydHkgPSB0cnVlO1xuICB0aGlzLm1hcFtoYXNoXS5jaHVuay5zZXQoaSAtIG9yaWdpbi54LCBqIC0gb3JpZ2luLnksIGsgLSBvcmlnaW4ueiwgdik7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgdmFyIG9yaWdpbiA9IHRoaXMuZ2V0T3JpZ2luKGksIGosIGspO1xuICB2YXIgaGFzaCA9IG9yaWdpbi50b0FycmF5KCkuam9pbignLCcpO1xuICBpZiAodGhpcy5tYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBvcmlnaW4gPSB0aGlzLm1hcFtoYXNoXS5vcmlnaW47XG4gIHJldHVybiB0aGlzLm1hcFtoYXNoXS5jaHVuay5nZXQoaSAtIG9yaWdpbi54LCBqIC0gb3JpZ2luLnksIGsgLSBvcmlnaW4ueik7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLmdldE9yaWdpbiA9IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgIE1hdGguZmxvb3IoaSAvIHRoaXMuY2h1bmtTaXplKSxcbiAgICBNYXRoLmZsb29yKGogLyB0aGlzLmNodW5rU2l6ZSksXG4gICAgTWF0aC5mbG9vcihrIC8gdGhpcy5jaHVua1NpemUpXG4gICkubXVsdGlwbHlTY2FsYXIodGhpcy5jaHVua1NpemUpO1xufTtcblxuQ2h1bmtzLnByb3RvdHlwZS52aXNpdCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIGZvciAodmFyIGlkIGluIHRoaXMubWFwKSB7XG4gICAgdmFyIGNodW5rID0gdGhpcy5tYXBbaWRdLmNodW5rO1xuICAgIHZhciBvcmlnaW4gPSB0aGlzLm1hcFtpZF0ub3JpZ2luO1xuICAgIHZhciBzaGFwZSA9IGNodW5rLnNoYXBlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaGFwZVswXTsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNoYXBlWzBdOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaGFwZVswXTsgaysrKSB7XG4gICAgICAgICAgdmFyIHYgPSBjaHVuay5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soaSArIG9yaWdpbi54LCBqICsgb3JpZ2luLnksIGsgKyBvcmlnaW4ueiwgdik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkNodW5rcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaWQgaW4gdGhpcy5tYXApIHtcbiAgICB2YXIgY2h1bmsgPSB0aGlzLm1hcFtpZF07XG4gICAgaWYgKGNodW5rLm1lc2ggIT0gbnVsbCkge1xuICAgICAgY2h1bmsubWVzaC5wYXJlbnQucmVtb3ZlKGNodW5rLm1lc2gpO1xuICAgICAgY2h1bmsubWVzaC5nZW9tZXRyeS5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG4gIHRoaXMubWFwID0ge307XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLmRlc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSwgb2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8fCBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIHNlbGYuc2V0KHZbMF0gKyBvZmZzZXQueCwgdlsxXSArIG9mZnNldC55LCB2WzJdICsgb2Zmc2V0LnosIHZbM10pO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2h1bmtzO1xuIiwidmFyIEdyZWVkeU1lc2ggPSAoZnVuY3Rpb24oKSB7XG4gIC8vQ2FjaGUgYnVmZmVyIGludGVybmFsbHlcbiAgdmFyIG1hc2sgPSBuZXcgSW50MzJBcnJheSg0MDk2KTtcblxuICByZXR1cm4gZnVuY3Rpb24oZiwgZGltcykge1xuICAgIHZhciB2ZXJ0aWNlcyA9IFtdLFxuICAgICAgZmFjZXMgPSBbXSxcbiAgICAgIHV2cyA9IFtdLFxuICAgICAgZGltc1ggPSBkaW1zWzBdLFxuICAgICAgZGltc1kgPSBkaW1zWzFdLFxuICAgICAgZGltc1hZID0gZGltc1ggKiBkaW1zWTtcblxuICAgIC8vU3dlZXAgb3ZlciAzLWF4ZXNcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IDM7ICsrZCkge1xuICAgICAgdmFyIGksIGosIGssIGwsIHcsIFcsIGgsIG4sIGMsXG4gICAgICAgIHUgPSAoZCArIDEpICUgMyxcbiAgICAgICAgdiA9IChkICsgMikgJSAzLFxuICAgICAgICB4ID0gWzAsIDAsIDBdLFxuICAgICAgICBxID0gWzAsIDAsIDBdLFxuICAgICAgICBkdSA9IFswLCAwLCAwXSxcbiAgICAgICAgZHYgPSBbMCwgMCwgMF0sXG4gICAgICAgIGRpbXNEID0gZGltc1tkXSxcbiAgICAgICAgZGltc1UgPSBkaW1zW3VdLFxuICAgICAgICBkaW1zViA9IGRpbXNbdl0sXG4gICAgICAgIHFkaW1zWCwgcWRpbXNYWSwgeGQ7XG5cbiAgICAgIHZhciBmbGlwLCBpbmRleCwgdmFsdWU7XG5cbiAgICAgIGlmIChtYXNrLmxlbmd0aCA8IGRpbXNVICogZGltc1YpIHtcbiAgICAgICAgbWFzayA9IG5ldyBJbnQzMkFycmF5KGRpbXNVICogZGltc1YpO1xuICAgICAgfVxuXG4gICAgICBxW2RdID0gMTtcbiAgICAgIHhbZF0gPSAtMTtcblxuICAgICAgcWRpbXNYID0gZGltc1ggKiBxWzFdXG4gICAgICBxZGltc1hZID0gZGltc1hZICogcVsyXVxuXG4gICAgICAvLyBDb21wdXRlIG1hc2tcbiAgICAgIHdoaWxlICh4W2RdIDwgZGltc0QpIHtcbiAgICAgICAgeGQgPSB4W2RdXG4gICAgICAgIG4gPSAwO1xuXG4gICAgICAgIGZvciAoeFt2XSA9IDA7IHhbdl0gPCBkaW1zVjsgKyt4W3ZdKSB7XG4gICAgICAgICAgZm9yICh4W3VdID0gMDsgeFt1XSA8IGRpbXNVOyArK3hbdV0sICsrbikge1xuICAgICAgICAgICAgdmFyIGEgPSB4ZCA+PSAwICYmIGYoeFswXSwgeFsxXSwgeFsyXSksXG4gICAgICAgICAgICAgIGIgPSB4ZCA8IGRpbXNEIC0gMSAmJiBmKHhbMF0gKyBxWzBdLCB4WzFdICsgcVsxXSwgeFsyXSArIHFbMl0pXG4gICAgICAgICAgICBpZiAoYSA/IGIgOiAhYikge1xuICAgICAgICAgICAgICBtYXNrW25dID0gMDtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZsaXAgPSAhYTtcblxuICAgICAgICAgICAgaW5kZXggPSBkICogMjtcbiAgICAgICAgICAgIGlmIChmbGlwKSB7XG4gICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlID0gKGEgfHwgYilbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAoZmxpcCkge1xuICAgICAgICAgICAgICB2YWx1ZSAqPSAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFza1tuXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICsreFtkXTtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBtZXNoIGZvciBtYXNrIHVzaW5nIGxleGljb2dyYXBoaWMgb3JkZXJpbmdcbiAgICAgICAgbiA9IDA7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBkaW1zVjsgKytqKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRpbXNVOykge1xuICAgICAgICAgICAgYyA9IG1hc2tbbl07XG4gICAgICAgICAgICBpZiAoIWMpIHtcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICBuKys7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0NvbXB1dGUgd2lkdGhcbiAgICAgICAgICAgIHcgPSAxO1xuICAgICAgICAgICAgd2hpbGUgKGMgPT09IG1hc2tbbiArIHddICYmIGkgKyB3IDwgZGltc1UpIHcrKztcblxuICAgICAgICAgICAgLy9Db21wdXRlIGhlaWdodCAodGhpcyBpcyBzbGlnaHRseSBhd2t3YXJkKVxuICAgICAgICAgICAgZm9yIChoID0gMTsgaiArIGggPCBkaW1zVjsgKytoKSB7XG4gICAgICAgICAgICAgIGsgPSAwO1xuICAgICAgICAgICAgICB3aGlsZSAoayA8IHcgJiYgYyA9PT0gbWFza1tuICsgayArIGggKiBkaW1zVV0pIGsrK1xuICAgICAgICAgICAgICAgIGlmIChrIDwgdykgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBxdWFkXG4gICAgICAgICAgICAvLyBUaGUgZHUvZHYgYXJyYXlzIGFyZSByZXVzZWQvcmVzZXRcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIGl0ZXJhdGlvbi5cbiAgICAgICAgICAgIGR1W2RdID0gMDtcbiAgICAgICAgICAgIGR2W2RdID0gMDtcbiAgICAgICAgICAgIHhbdV0gPSBpO1xuICAgICAgICAgICAgeFt2XSA9IGo7XG5cbiAgICAgICAgICAgIGlmIChjID4gMCkge1xuICAgICAgICAgICAgICBkdlt2XSA9IGg7XG4gICAgICAgICAgICAgIGR2W3VdID0gMDtcbiAgICAgICAgICAgICAgZHVbdV0gPSB3O1xuICAgICAgICAgICAgICBkdVt2XSA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjID0gLWM7XG4gICAgICAgICAgICAgIGR1W3ZdID0gaDtcbiAgICAgICAgICAgICAgZHVbdV0gPSAwO1xuICAgICAgICAgICAgICBkdlt1XSA9IHc7XG4gICAgICAgICAgICAgIGR2W3ZdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhfY291bnQgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdLCB4WzFdLCB4WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHVbMF0sIHhbMV0gKyBkdVsxXSwgeFsyXSArIGR1WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHVbMF0gKyBkdlswXSwgeFsxXSArIGR1WzFdICsgZHZbMV0sIHhbMl0gKyBkdVsyXSArIGR2WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHZbMF0sIHhbMV0gKyBkdlsxXSwgeFsyXSArIGR2WzJdXSk7XG4gICAgICAgICAgICB1dnMucHVzaChcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFswLCAwXSxcbiAgICAgICAgICAgICAgICBbZHVbdV0sIGR1W3ZdXSxcbiAgICAgICAgICAgICAgICBbZHVbdV0gKyBkdlt1XSwgZHVbdl0gKyBkdlt2XV0sXG4gICAgICAgICAgICAgICAgW2R2W3VdLCBkdlt2XV1cbiAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGZhY2VzLnB1c2goW3ZlcnRleF9jb3VudCwgdmVydGV4X2NvdW50ICsgMSwgdmVydGV4X2NvdW50ICsgMiwgdmVydGV4X2NvdW50ICsgMywgY10pO1xuXG4gICAgICAgICAgICAvL1plcm8tb3V0IG1hc2tcbiAgICAgICAgICAgIFcgPSBuICsgdztcbiAgICAgICAgICAgIGZvciAobCA9IDA7IGwgPCBoOyArK2wpIHtcbiAgICAgICAgICAgICAgZm9yIChrID0gbjsgayA8IFc7ICsraykge1xuICAgICAgICAgICAgICAgIG1hc2tbayArIGwgKiBkaW1zVV0gPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vSW5jcmVtZW50IGNvdW50ZXJzIGFuZCBjb250aW51ZVxuICAgICAgICAgICAgaSArPSB3O1xuICAgICAgICAgICAgbiArPSB3O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB2ZXJ0aWNlczogdmVydGljZXMsIGZhY2VzOiBmYWNlcywgdXZzOiB1dnMgfTtcbiAgfVxufSkoKTtcblxuaWYgKGV4cG9ydHMpIHtcbiAgZXhwb3J0cy5tZXNoZXIgPSBHcmVlZHlNZXNoO1xufVxuIiwidmFyIFZveGVsID0ge1xuICBDaHVuazogcmVxdWlyZSgnLi9jaHVuaycpLFxuICBDaHVua3M6IHJlcXVpcmUoJy4vY2h1bmtzJyksXG4gIG1lc2hDaHVua3M6IHJlcXVpcmUoJy4vbWVzaGNodW5rcycpLFxuICBtZXNoZXI6IHJlcXVpcmUoJy4vbWVzaGVyJylcbn07XG5cbmZ1bmN0aW9uIHZpc2l0U2hhcGUoc2hhcGUsIGNhbGxiYWNrKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2hhcGVbMF07IGkrKykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2hhcGVbMV07IGorKykge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaGFwZVsyXTsgaysrKSB7XG4gICAgICAgIGNhbGxiYWNrKGksIGosIGspO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gY29weUNodW5rcyhmcm9tLCB0bywgb2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8fCBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICBmcm9tLnZpc2l0KGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgICB0by5zZXQoaSArIG9mZnNldC54LCBqICsgb2Zmc2V0LnksIGsgKyBvZmZzZXQueiwgdik7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gcmVtb3ZlRmxvYXRpbmcoY2h1bmtzLCBzdGFydENvb3JkKSB7XG4gIHZhciBtYXAgPSB7fTtcbiAgY2h1bmtzLnZpc2l0KGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgICB2YXIgaGFzaCA9IFtpLCBqLCBrXS5qb2luKCcsJyk7XG4gICAgbWFwW2hhc2hdID0ge1xuICAgICAgdmlzaXRlZDogZmFsc2UsXG4gICAgICBjb29yZDogW2ksIGosIGtdXG4gICAgfTtcbiAgfSk7XG5cbiAgdmFyIGxlYWRzID0gW3N0YXJ0Q29vcmRdO1xuXG4gIHdoaWxlIChsZWFkcy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHJlc3VsdCA9IHZpc2l0KFsxLCAwLCAwXSkgfHxcbiAgICAgIHZpc2l0KFswLCAxLCAwXSkgfHxcbiAgICAgIHZpc2l0KFswLCAwLCAxXSkgfHxcbiAgICAgIHZpc2l0KFstMSwgMCwgMF0pIHx8XG4gICAgICB2aXNpdChbMCwgLTEsIDBdKSB8fFxuICAgICAgdmlzaXQoWzAsIDAsIC0xXSk7XG5cbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgbGVhZHMucG9wKCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgZm9yICh2YXIgaWQgaW4gbWFwKSB7XG4gICAgaWYgKCFtYXBbaWRdLnZpc2l0ZWQpIHtcbiAgICAgIHZhciBjb29yZCA9IG1hcFtpZF0uY29vcmQ7XG4gICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHZpc2l0KGRpcykge1xuICAgIHZhciBjdXJyZW50ID0gbGVhZHNbbGVhZHMubGVuZ3RoIC0gMV07XG5cbiAgICB2YXIgbmV4dCA9IFtjdXJyZW50WzBdICsgZGlzWzBdLFxuICAgICAgY3VycmVudFsxXSArIGRpc1sxXSxcbiAgICAgIGN1cnJlbnRbMl0gKyBkaXNbMl1cbiAgICBdO1xuXG4gICAgdmFyIGhhc2ggPSBuZXh0LmpvaW4oJywnKTtcblxuICAgIGlmIChtYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChtYXBbaGFzaF0udmlzaXRlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB2ID0gY2h1bmtzLmdldChuZXh0WzBdLCBuZXh0WzFdLCBuZXh0WzJdKTtcbiAgICBpZiAoISF2KSB7XG4gICAgICBtYXBbaGFzaF0udmlzaXRlZCA9IHRydWU7XG4gICAgICBsZWFkcy5wdXNoKG5leHQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xufTtcblxuVm94ZWwudmlzaXRTaGFwZSA9IHZpc2l0U2hhcGU7XG5Wb3hlbC5jb3B5Q2h1bmtzID0gY29weUNodW5rcztcblZveGVsLnJlbW92ZUZsb2F0aW5nID0gcmVtb3ZlRmxvYXRpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gVm94ZWw7XG4iLCJ2YXIgbWVzaGVyID0gcmVxdWlyZSgnLi9tZXNoZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaHVua3MsIHBhcmVudCwgbWF0ZXJpYWwsIGNhY2hlZCkge1xuICBmb3IgKHZhciBpZCBpbiBjaHVua3MubWFwKSB7XG4gICAgdmFyIGNodW5rID0gY2h1bmtzLm1hcFtpZF07XG4gICAgdmFyIGRhdGEgPSBjaHVuay5jaHVuaztcbiAgICBpZiAoY2h1bmsuZGlydHkpIHtcblxuICAgICAgaWYgKGNodW5rLm1lc2ggIT0gbnVsbCkge1xuICAgICAgICBjaHVuay5tZXNoLnBhcmVudC5yZW1vdmUoY2h1bmsubWVzaCk7XG4gICAgICAgIGNodW5rLm1lc2guZ2VvbWV0cnkuZGlzcG9zZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3JpZ2luID0gY2h1bmsub3JpZ2luO1xuXG4gICAgICB2YXIgY2FjaGVkR2VvbWV0cnkgPSBjYWNoZWQgPT0gbnVsbCA/IG51bGwgOiBjYWNoZWRbaWRdO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gY2FjaGVkR2VvbWV0cnkgfHwgbWVzaGVyKGNodW5rLmNodW5rKTtcbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG1lc2gucG9zaXRpb24uY29weShjaHVuay5vcmlnaW4pO1xuICAgICAgcGFyZW50LmFkZChtZXNoKTtcblxuICAgICAgaWYgKGNhY2hlZCAhPSBudWxsKSB7XG4gICAgICAgIGNhY2hlZFtpZF0gPSBnZW9tZXRyeTtcbiAgICAgIH1cblxuICAgICAgY2h1bmsuZGlydHkgPSBmYWxzZTtcbiAgICAgIGNodW5rLm1lc2ggPSBtZXNoO1xuICAgIH1cbiAgfVxufVxuIiwidmFyIGdyZWVkeU1lc2hlciA9IHJlcXVpcmUoJy4vZ3JlZWR5JykubWVzaGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNodW5rLCBmKSB7XG4gIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gIGYgPSBmIHx8IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgICByZXR1cm4gY2h1bmsuZ2V0KGksIGosIGspO1xuICB9O1xuICB2YXIgcmVzdWx0ID0gZ3JlZWR5TWVzaGVyKGYsIGNodW5rLnNoYXBlKTtcblxuICByZXN1bHQudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgdmFyIHZlcnRpY2UgPSBuZXcgVEhSRUUuVmVjdG9yMyh2WzBdLCB2WzFdLCB2WzJdKTtcbiAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKHZlcnRpY2UpO1xuICB9KTtcblxuICByZXN1bHQuZmFjZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgdmFyIGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMoZlswXSwgZlsxXSwgZlsyXSk7XG4gICAgZmFjZS5tYXRlcmlhbEluZGV4ID0gZls0XTtcbiAgICBnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xuXG4gICAgZmFjZSA9IG5ldyBUSFJFRS5GYWNlMyhmWzJdLCBmWzNdLCBmWzBdKTtcbiAgICBmYWNlLm1hdGVyaWFsSW5kZXggPSBmWzRdO1xuICAgIGdlb21ldHJ5LmZhY2VzLnB1c2goZmFjZSk7XG4gIH0pO1xuXG4gIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbMF0gPSBbXTtcbiAgcmVzdWx0LnV2cy5mb3JFYWNoKGZ1bmN0aW9uKHV2KSB7XG4gICAgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1swXS5wdXNoKFtcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzBdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzFdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzJdKVxuICAgIF0sIFtcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzJdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzNdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzBdKVxuICAgIF0pO1xuICB9KTtcblxuICBnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcblxuICByZXR1cm4gZ2VvbWV0cnk7XG59O1xuIl19
