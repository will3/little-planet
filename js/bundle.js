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

},{"../dir":8,"../voxel/chunks":16,"../voxel/meshchunks":19,"../voxel/mesher":20,"simplex-noise":5}],10:[function(require,module,exports){
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

},{"../../dir":8,"../../voxel":18,"./surfacemap":11,"simplex-noise":5}],11:[function(require,module,exports){
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

},{"../../Dir":6,"../../voxel":18,"node-dijkstra":2}],12:[function(require,module,exports){
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

  var sparse = 0.2;
  var treeNum = 0.5;

  function add(coord, dir) {

    var chunks2 = require('./pine')(coord, dir);

    copyChunks(chunks2, chunks, coord);
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

},{"../../dir":8,"../../voxel":18,"./pine":13}],13:[function(require,module,exports){
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

},{"../../dir":8,"../../voxel":18}],14:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var keycode = require('keycode');
var Dir = require('./dir');
var config = require('./config');
var app = {};
var env = config.env || 'production';

// Init stats
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
var size = 16;
var modelSize = 5;
var disScale = 1.2 * modelSize;

// Objects
var object;
var noAoLayer;

var entities = [];

// Materials, Textures
var blockMaterial = new THREE.MultiMaterial();
blockMaterial.materials = [null];
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

function loadResources() {
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
  
};

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

var cloud = require('./entities/cloud')(size + 11, object, blockMaterial);
entities.push(cloud);

var terrian = require('./entities/terrian')(size, object, blockMaterial);

var tree = require('./entities/tree')(terrian.object, blockMaterial, terrian);

animate();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./config":7,"./dir":8,"./entities/cloud":9,"./entities/terrian":10,"./entities/tree":12,"keycode":1}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./chunk":15}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"./chunk":15,"./chunks":16,"./meshchunks":19,"./mesher":20}],19:[function(require,module,exports){
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

},{"./mesher":20}],20:[function(require,module,exports){
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

},{"./greedy":17}]},{},[14])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva2V5Y29kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWRpamtzdHJhL2dyYXBoLmpzIiwibm9kZV9tb2R1bGVzL25vZGUtZGlqa3N0cmEvbGlicy9xdWV1ZS5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWRpamtzdHJhL25vZGVfbW9kdWxlcy8xMDEvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZXgtbm9pc2Uvc2ltcGxleC1ub2lzZS5qcyIsInNyYy9EaXIuanMiLCJzcmMvY29uZmlnLmpzb24iLCJzcmMvZW50aXRpZXMvY2xvdWQuanMiLCJzcmMvZW50aXRpZXMvdGVycmlhbi9pbmRleC5qcyIsInNyYy9lbnRpdGllcy90ZXJyaWFuL3N1cmZhY2VtYXAuanMiLCJzcmMvZW50aXRpZXMvdHJlZS9pbmRleC5qcyIsInNyYy9lbnRpdGllcy90cmVlL3BpbmUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy92b3hlbC9jaHVuay5qcyIsInNyYy92b3hlbC9jaHVua3MuanMiLCJzcmMvdm94ZWwvZ3JlZWR5LmpzIiwic3JjL3ZveGVsL2luZGV4LmpzIiwic3JjL3ZveGVsL21lc2hjaHVua3MuanMiLCJzcmMvdm94ZWwvbWVzaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3piQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBTb3VyY2U6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvdld4OFYvXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MDMxOTUvZnVsbC1saXN0LW9mLWphdmFzY3JpcHQta2V5Y29kZXNcblxuLyoqXG4gKiBDb25lbmllbmNlIG1ldGhvZCByZXR1cm5zIGNvcnJlc3BvbmRpbmcgdmFsdWUgZm9yIGdpdmVuIGtleU5hbWUgb3Iga2V5Q29kZS5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBrZXlDb2RlIHtOdW1iZXJ9IG9yIGtleU5hbWUge1N0cmluZ31cbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWFyY2hJbnB1dCkge1xuICAvLyBLZXlib2FyZCBFdmVudHNcbiAgaWYgKHNlYXJjaElucHV0ICYmICdvYmplY3QnID09PSB0eXBlb2Ygc2VhcmNoSW5wdXQpIHtcbiAgICB2YXIgaGFzS2V5Q29kZSA9IHNlYXJjaElucHV0LndoaWNoIHx8IHNlYXJjaElucHV0LmtleUNvZGUgfHwgc2VhcmNoSW5wdXQuY2hhckNvZGVcbiAgICBpZiAoaGFzS2V5Q29kZSkgc2VhcmNoSW5wdXQgPSBoYXNLZXlDb2RlXG4gIH1cblxuICAvLyBOdW1iZXJzXG4gIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHNlYXJjaElucHV0KSByZXR1cm4gbmFtZXNbc2VhcmNoSW5wdXRdXG5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIChjYXN0IHRvIHN0cmluZylcbiAgdmFyIHNlYXJjaCA9IFN0cmluZyhzZWFyY2hJbnB1dClcblxuICAvLyBjaGVjayBjb2Rlc1xuICB2YXIgZm91bmROYW1lZEtleSA9IGNvZGVzW3NlYXJjaC50b0xvd2VyQ2FzZSgpXVxuICBpZiAoZm91bmROYW1lZEtleSkgcmV0dXJuIGZvdW5kTmFtZWRLZXlcblxuICAvLyBjaGVjayBhbGlhc2VzXG4gIHZhciBmb3VuZE5hbWVkS2V5ID0gYWxpYXNlc1tzZWFyY2gudG9Mb3dlckNhc2UoKV1cbiAgaWYgKGZvdW5kTmFtZWRLZXkpIHJldHVybiBmb3VuZE5hbWVkS2V5XG5cbiAgLy8gd2VpcmQgY2hhcmFjdGVyP1xuICBpZiAoc2VhcmNoLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHNlYXJjaC5jaGFyQ29kZUF0KDApXG5cbiAgcmV0dXJuIHVuZGVmaW5lZFxufVxuXG4vKipcbiAqIEdldCBieSBuYW1lXG4gKlxuICogICBleHBvcnRzLmNvZGVbJ2VudGVyJ10gLy8gPT4gMTNcbiAqL1xuXG52YXIgY29kZXMgPSBleHBvcnRzLmNvZGUgPSBleHBvcnRzLmNvZGVzID0ge1xuICAnYmFja3NwYWNlJzogOCxcbiAgJ3RhYic6IDksXG4gICdlbnRlcic6IDEzLFxuICAnc2hpZnQnOiAxNixcbiAgJ2N0cmwnOiAxNyxcbiAgJ2FsdCc6IDE4LFxuICAncGF1c2UvYnJlYWsnOiAxOSxcbiAgJ2NhcHMgbG9jayc6IDIwLFxuICAnZXNjJzogMjcsXG4gICdzcGFjZSc6IDMyLFxuICAncGFnZSB1cCc6IDMzLFxuICAncGFnZSBkb3duJzogMzQsXG4gICdlbmQnOiAzNSxcbiAgJ2hvbWUnOiAzNixcbiAgJ2xlZnQnOiAzNyxcbiAgJ3VwJzogMzgsXG4gICdyaWdodCc6IDM5LFxuICAnZG93bic6IDQwLFxuICAnaW5zZXJ0JzogNDUsXG4gICdkZWxldGUnOiA0NixcbiAgJ2NvbW1hbmQnOiA5MSxcbiAgJ2xlZnQgY29tbWFuZCc6IDkxLFxuICAncmlnaHQgY29tbWFuZCc6IDkzLFxuICAnbnVtcGFkIConOiAxMDYsXG4gICdudW1wYWQgKyc6IDEwNyxcbiAgJ251bXBhZCAtJzogMTA5LFxuICAnbnVtcGFkIC4nOiAxMTAsXG4gICdudW1wYWQgLyc6IDExMSxcbiAgJ251bSBsb2NrJzogMTQ0LFxuICAnc2Nyb2xsIGxvY2snOiAxNDUsXG4gICdteSBjb21wdXRlcic6IDE4MixcbiAgJ215IGNhbGN1bGF0b3InOiAxODMsXG4gICc7JzogMTg2LFxuICAnPSc6IDE4NyxcbiAgJywnOiAxODgsXG4gICctJzogMTg5LFxuICAnLic6IDE5MCxcbiAgJy8nOiAxOTEsXG4gICdgJzogMTkyLFxuICAnWyc6IDIxOSxcbiAgJ1xcXFwnOiAyMjAsXG4gICddJzogMjIxLFxuICBcIidcIjogMjIyXG59XG5cbi8vIEhlbHBlciBhbGlhc2VzXG5cbnZhciBhbGlhc2VzID0gZXhwb3J0cy5hbGlhc2VzID0ge1xuICAnd2luZG93cyc6IDkxLFxuICAn4oenJzogMTYsXG4gICfijKUnOiAxOCxcbiAgJ+KMgyc6IDE3LFxuICAn4oyYJzogOTEsXG4gICdjdGwnOiAxNyxcbiAgJ2NvbnRyb2wnOiAxNyxcbiAgJ29wdGlvbic6IDE4LFxuICAncGF1c2UnOiAxOSxcbiAgJ2JyZWFrJzogMTksXG4gICdjYXBzJzogMjAsXG4gICdyZXR1cm4nOiAxMyxcbiAgJ2VzY2FwZSc6IDI3LFxuICAnc3BjJzogMzIsXG4gICdwZ3VwJzogMzMsXG4gICdwZ2RuJzogMzQsXG4gICdpbnMnOiA0NSxcbiAgJ2RlbCc6IDQ2LFxuICAnY21kJzogOTFcbn1cblxuXG4vKiFcbiAqIFByb2dyYW1hdGljYWxseSBhZGQgdGhlIGZvbGxvd2luZ1xuICovXG5cbi8vIGxvd2VyIGNhc2UgY2hhcnNcbmZvciAoaSA9IDk3OyBpIDwgMTIzOyBpKyspIGNvZGVzW1N0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaSAtIDMyXG5cbi8vIG51bWJlcnNcbmZvciAodmFyIGkgPSA0ODsgaSA8IDU4OyBpKyspIGNvZGVzW2kgLSA0OF0gPSBpXG5cbi8vIGZ1bmN0aW9uIGtleXNcbmZvciAoaSA9IDE7IGkgPCAxMzsgaSsrKSBjb2Rlc1snZicraV0gPSBpICsgMTExXG5cbi8vIG51bXBhZCBrZXlzXG5mb3IgKGkgPSAwOyBpIDwgMTA7IGkrKykgY29kZXNbJ251bXBhZCAnK2ldID0gaSArIDk2XG5cbi8qKlxuICogR2V0IGJ5IGNvZGVcbiAqXG4gKiAgIGV4cG9ydHMubmFtZVsxM10gLy8gPT4gJ0VudGVyJ1xuICovXG5cbnZhciBuYW1lcyA9IGV4cG9ydHMubmFtZXMgPSBleHBvcnRzLnRpdGxlID0ge30gLy8gdGl0bGUgZm9yIGJhY2t3YXJkIGNvbXBhdFxuXG4vLyBDcmVhdGUgcmV2ZXJzZSBtYXBwaW5nXG5mb3IgKGkgaW4gY29kZXMpIG5hbWVzW2NvZGVzW2ldXSA9IGlcblxuLy8gQWRkIGFsaWFzZXNcbmZvciAodmFyIGFsaWFzIGluIGFsaWFzZXMpIHtcbiAgY29kZXNbYWxpYXNdID0gYWxpYXNlc1thbGlhc11cbn1cbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCcxMDEvYXNzaWduJyk7XG52YXIgUHJpb3JpdHlRdWV1ZSA9IHJlcXVpcmUoJy4vbGlicy9xdWV1ZScpO1xuXG4vLyBjb3N0cnVjdFxudmFyIEdyYXBoID0gZnVuY3Rpb24odmVydGljZXMpIHtcbiAgLy8geW91IGNhbiBlaXRoZXIgcGFzcyBhIHZlcnRpY2llcyBvYmplY3Qgb3IgYWRkIGV2ZXJ5XG4gIHRoaXMudmVydGljZXMgPSB2ZXJ0aWNlcyB8fCB7fTtcbn1cblxuYXNzaWduKEdyYXBoLnByb3RvdHlwZSwge1xuICAvLyBhZGQgYSB2ZXJ0ZXggdG8gdGhlIGdyYXBoXG4gIGFkZFZlcnRleDogZnVuY3Rpb24obmFtZSwgZWRnZXMpIHtcbiAgICB0aGlzLnZlcnRpY2VzW25hbWVdID0gZWRnZXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLy8gY29tcHV0ZSB0aGUgcGF0aFxuICBzaG9ydGVzdFBhdGg6IGZ1bmN0aW9uKHN0YXJ0LCBmaW5pc2gsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBnZXREaXN0YW5jZSA9IG9wdGlvbnMuZ2V0RGlzdGFuY2U7XG5cbiAgICB0aGlzLm5vZGVzID0gbmV3IFByaW9yaXR5UXVldWUoKTtcbiAgICB0aGlzLmRpc3RhbmNlcyA9IHt9O1xuICAgIHRoaXMucHJldmlvdXMgPSB7fTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5maW5pc2ggPSBmaW5pc2g7XG5cbiAgICAvLyBTZXQgdGhlIHN0YXJ0aW5nIHZhbHVlcyBmb3IgZGlzdGFuY2VzXG4gICAgdGhpcy5zZXRCYXNlbGluZS5jYWxsKHRoaXMpO1xuXG4gICAgLy8gbG9vcCB1bnRpbCB3ZSBjaGVja2VkIGV2ZXJ5IG5vZGUgaW4gdGhlIHF1ZXVlXG4gICAgdmFyIHNtYWxsZXN0O1xuICAgIHZhciBwYXRoID0gW107XG4gICAgdmFyIGFsdDtcbiAgICB3aGlsZSAoIXRoaXMubm9kZXMuaXNFbXB0eSgpKSB7XG4gICAgICBzbWFsbGVzdCA9IHRoaXMubm9kZXMuZGVxdWV1ZSgpO1xuXG4gICAgICBpZiAoc21hbGxlc3QgPT09IGZpbmlzaCkge1xuICAgICAgICB3aGlsZSAodGhpcy5wcmV2aW91c1tzbWFsbGVzdF0pIHtcbiAgICAgICAgICBwYXRoLnB1c2goc21hbGxlc3QpO1xuICAgICAgICAgIHNtYWxsZXN0ID0gdGhpcy5wcmV2aW91c1tzbWFsbGVzdF07XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKCFzbWFsbGVzdCB8fCB0aGlzLmRpc3RhbmNlc1tzbWFsbGVzdF0gPT09IEluZmluaXR5KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBuZWlnaGJvciBpbiB0aGlzLnZlcnRpY2VzW3NtYWxsZXN0XSkge1xuICAgICAgICBhbHQgPSB0aGlzLmRpc3RhbmNlc1tzbWFsbGVzdF0gKyBnZXREaXN0YW5jZShzbWFsbGVzdCwgbmVpZ2hib3IpO1xuXG4gICAgICAgIGlmIChhbHQgPCB0aGlzLmRpc3RhbmNlc1tuZWlnaGJvcl0pIHtcbiAgICAgICAgICB0aGlzLmRpc3RhbmNlc1tuZWlnaGJvcl0gPSBhbHQ7XG4gICAgICAgICAgdGhpcy5wcmV2aW91c1tuZWlnaGJvcl0gPSBzbWFsbGVzdDtcblxuICAgICAgICAgIHRoaXMubm9kZXMuZW5xdWV1ZShhbHQsIG5laWdoYm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwYXRoLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnRyaW0pIHtcbiAgICAgIHBhdGguc2hpZnQoKVxuICAgICAgICAvLyBgcGF0aGAgaXMgZ2VuZXJhdGVkIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgIGlmIChvcHRpb25zLnJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGF0aC5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgcGF0aCA9IHBhdGguY29uY2F0KFtzdGFydF0pO1xuICAgIGlmIChvcHRpb25zLnJldmVyc2UpIHtcbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aC5yZXZlcnNlKCk7XG4gIH0sXG5cbiAgLy8gc2V0IHRoZSBzdGFydGluZyBwb2ludCB0byAwIGFuZCBhbGwgdGhlIG90aGVycyB0byBpbmZpbml0ZVxuICBzZXRCYXNlbGluZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZlcnRleDtcbiAgICBmb3IgKHZlcnRleCBpbiB0aGlzLnZlcnRpY2VzKSB7XG4gICAgICBpZiAodmVydGV4ID09PSB0aGlzLnN0YXJ0KSB7XG4gICAgICAgIHRoaXMuZGlzdGFuY2VzW3ZlcnRleF0gPSAwO1xuICAgICAgICB0aGlzLm5vZGVzLmVucXVldWUoMCwgdmVydGV4LCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzdGFuY2VzW3ZlcnRleF0gPSBJbmZpbml0eTtcbiAgICAgICAgdGhpcy5ub2Rlcy5lbnF1ZXVlKEluZmluaXR5LCB2ZXJ0ZXgsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByZXZpb3VzW3ZlcnRleF0gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMubm9kZXMuc29ydCgpO1xuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJzEwMS9hc3NpZ24nKTtcblxuLy8gUHJpb3JpdHkgUXVldWVcbi8vIC0tLS0tLS0tLS0tLS0tXG5cbi8vIGJhc2ljIHByaW9yaXR5IHF1ZXVlIGltcGxlbWVudGF0aW9uXG52YXIgUHJpb3JpdHlRdWV1ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm5vZGVzID0gW107XG59XG5cbmFzc2lnbihQcmlvcml0eVF1ZXVlLnByb3RvdHlwZSwge1xuXG4gIGVucXVldWU6IGZ1bmN0aW9uKHByaW9yaXR5LCBrZXksIHNraXBTb3J0KSB7XG4gICAgdGhpcy5ub2Rlcy5wdXNoKHtrZXk6IGtleSwgcHJpb3JpdHk6IHByaW9yaXR5fSk7XG4gICAgaWYoc2tpcFNvcnQgIT09IHRydWUpIHtcbiAgICAgIHRoaXMuc29ydC5jYWxsKHRoaXMpOyAgXG4gICAgfVxuICB9LFxuXG4gIGRlcXVldWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVzLnNoaWZ0KCkua2V5O1xuICB9LFxuXG4gIHNvcnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubm9kZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XG4gICAgfSk7XG4gIH0sXG5cbiAgaXNFbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICF0aGlzLm5vZGVzLmxlbmd0aDtcbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmlvcml0eVF1ZXVlO1xuIiwiLyoqXG4gKiBAbW9kdWxlIDEwMS9hc3NpZ25cbiAqL1xuXG4vKipcbiAqIENvcGllcyBlbnVtZXJhYmxlIGFuZCBvd24gcHJvcGVydGllcyBmcm9tIGEgc291cmNlIG9iamVjdChzKSB0byBhIHRhcmdldCBvYmplY3QsIGFrYSBleHRlbmQuXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG4gKiBJIGFkZGVkIGZ1bmN0aW9uYWxpdHkgdG8gc3VwcG9ydCBhc3NpZ24gYXMgYSBwYXJ0aWFsIGZ1bmN0aW9uXG4gKiBAZnVuY3Rpb24gbW9kdWxlOjEwMS9hc3NpZ25cbiAqIEBwYXJhbSB7b2JqZWN0fSBbdGFyZ2V0XSAtIG9iamVjdCB3aGljaCBzb3VyY2Ugb2JqZWN0cyBhcmUgZXh0ZW5kaW5nIChiZWluZyBhc3NpZ25lZCB0bylcbiAqIEBwYXJhbSB7b2JqZWN0fSBzb3VyY2VzLi4uIC0gb2JqZWN0cyB3aG9zZSBwcm9wZXJ0aWVzIGFyZSBiZWluZyBhc3NpZ25lZCB0byB0aGUgc291cmNlIG9iamVjdFxuICogQHJldHVybiB7b2JqZWN0fSBzb3VyY2Ugd2l0aCBleHRlbmRlZCBwcm9wZXJ0aWVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuXG5mdW5jdGlvbiBhc3NpZ24gKHRhcmdldCwgZmlyc3RTb3VyY2UpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBmaXJzdFNvdXJjZSA9IGFyZ3VtZW50c1swXTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgcmV0dXJuIGFzc2lnbih0YXJnZXQsIGZpcnN0U291cmNlKTtcbiAgICB9O1xuICB9XG4gIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgZmlyc3QgYXJndW1lbnQgdG8gb2JqZWN0Jyk7XG4gIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgdmFyIGtleXNBcnJheSA9IE9iamVjdC5rZXlzKE9iamVjdChuZXh0U291cmNlKSk7XG4gICAgZm9yICh2YXIgbmV4dEluZGV4ID0gMCwgbGVuID0ga2V5c0FycmF5Lmxlbmd0aDsgbmV4dEluZGV4IDwgbGVuOyBuZXh0SW5kZXgrKykge1xuICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAvLyBJIGNoYW5nZWQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIGdldCAxMDAlIHRlc3QgY292ZXJhZ2UuXG4gICAgICAvLyBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuZW51bWVyYWJsZSkgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgLy8gSSB3YXMgdW5hYmxlIHRvIGZpbmQgYSBzY2VuYXJpbyB3aGVyZSBkZXNjIHdhcyB1bmRlZmluZWQgb3IgdGhhdCBkZXNjLmVudW1lcmFibGUgd2FzIGZhbHNlOlxuICAgICAgLy8gICAxKSBPYmplY3QuZGVmaW5lUHJvcGVydHkgZG9lcyBub3QgYWNjZXB0IHVuZGVmaW5lZCBhcyBhIGRlc2NcbiAgICAgIC8vICAgMikgT2JqZWN0LmtleXMgZG9lcyBub3QgcmV0dXJuIG5vbi1lbnVtZXJhYmxlIGtleXMuXG4gICAgICAvLyBMZXQgbWUga25vdyBpZiB0aGlzIGlzIGEgY3Jvc3MgYnJvd3NlciB0aGluZy5cbiAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvO1xufSIsIi8qXG4gKiBBIGZhc3QgamF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBzaW1wbGV4IG5vaXNlIGJ5IEpvbmFzIFdhZ25lclxuICpcbiAqIEJhc2VkIG9uIGEgc3BlZWQtaW1wcm92ZWQgc2ltcGxleCBub2lzZSBhbGdvcml0aG0gZm9yIDJELCAzRCBhbmQgNEQgaW4gSmF2YS5cbiAqIFdoaWNoIGlzIGJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cbiAqIFdpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXG4gKiBCZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxuICpcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgSm9uYXMgV2FnbmVyXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG4gKiBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbiAqIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuICogZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuICogV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG4oZnVuY3Rpb24gKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGMiA9IDAuNSAqIChNYXRoLnNxcnQoMy4wKSAtIDEuMCksXG4gICAgRzIgPSAoMy4wIC0gTWF0aC5zcXJ0KDMuMCkpIC8gNi4wLFxuICAgIEYzID0gMS4wIC8gMy4wLFxuICAgIEczID0gMS4wIC8gNi4wLFxuICAgIEY0ID0gKE1hdGguc3FydCg1LjApIC0gMS4wKSAvIDQuMCxcbiAgICBHNCA9ICg1LjAgLSBNYXRoLnNxcnQoNS4wKSkgLyAyMC4wO1xuXG5cbmZ1bmN0aW9uIFNpbXBsZXhOb2lzZShyYW5kb20pIHtcbiAgICBpZiAoIXJhbmRvbSkgcmFuZG9tID0gTWF0aC5yYW5kb207XG4gICAgdGhpcy5wID0gbmV3IFVpbnQ4QXJyYXkoMjU2KTtcbiAgICB0aGlzLnBlcm0gPSBuZXcgVWludDhBcnJheSg1MTIpO1xuICAgIHRoaXMucGVybU1vZDEyID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAgIHRoaXMucFtpXSA9IHJhbmRvbSgpICogMjU2O1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICAgICAgdGhpcy5wZXJtW2ldID0gdGhpcy5wW2kgJiAyNTVdO1xuICAgICAgICB0aGlzLnBlcm1Nb2QxMltpXSA9IHRoaXMucGVybVtpXSAlIDEyO1xuICAgIH1cblxufVxuU2ltcGxleE5vaXNlLnByb3RvdHlwZSA9IHtcbiAgICBncmFkMzogbmV3IEZsb2F0MzJBcnJheShbMSwgMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgLSAxLCAwLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAtIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMCwgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDAsIDEsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgMSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIC0gMSwgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgLSAxLCAtIDFdKSxcbiAgICBncmFkNDogbmV3IEZsb2F0MzJBcnJheShbMCwgMSwgMSwgMSwgMCwgMSwgMSwgLSAxLCAwLCAxLCAtIDEsIDEsIDAsIDEsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIC0gMSwgMSwgMSwgMCwgLSAxLCAxLCAtIDEsIDAsIC0gMSwgLSAxLCAxLCAwLCAtIDEsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDAsIDEsIDEsIDEsIDAsIDEsIC0gMSwgMSwgMCwgLSAxLCAxLCAxLCAwLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDAsIDEsIDEsIC0gMSwgMCwgMSwgLSAxLCAtIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAxLCAwLCAxLCAxLCAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgMSwgMSwgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAxLCAwLCAxLCAtIDEsIDEsIDAsIC0gMSwgLSAxLCAtIDEsIDAsIDEsIC0gMSwgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMSwgMSwgMCwgMSwgMSwgLSAxLCAwLCAxLCAtIDEsIDEsIDAsIDEsIC0gMSwgLSAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMSwgMSwgMCwgLSAxLCAxLCAtIDEsIDAsIC0gMSwgLSAxLCAxLCAwLCAtIDEsIC0gMSwgLSAxLCAwXSksXG4gICAgbm9pc2UyRDogZnVuY3Rpb24gKHhpbiwgeWluKSB7XG4gICAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMixcbiAgICAgICAgICAgIHBlcm0gPSB0aGlzLnBlcm0sXG4gICAgICAgICAgICBncmFkMyA9IHRoaXMuZ3JhZDM7XG4gICAgICAgIHZhciBuMD0wLCBuMT0wLCBuMj0wOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4aW4gKyB5aW4pICogRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XG4gICAgICAgIHZhciB0ID0gKGkgKyBqKSAqIEcyO1xuICAgICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkpIHNwYWNlXG4gICAgICAgIHZhciBZMCA9IGogLSB0O1xuICAgICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgdmFyIHkwID0geWluIC0gWTA7XG4gICAgICAgIC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgdmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuICAgICAgICBpZiAoeDAgPiB5MCkge1xuICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICB9IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgfSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcbiAgICAgICAgLy8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXG4gICAgICAgIC8vIGMgPSAoMy1zcXJ0KDMpKS82XG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkxID0geTAgLSBqMSArIEcyO1xuICAgICAgICB2YXIgeDIgPSB4MCAtIDEuMCArIDIuMCAqIEcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSAxLjAgKyAyLjAgKiBHMjtcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgICAgdmFyIGpqID0gaiAmIDI1NTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjUgLSB4MCAqIHgwIC0geTAgKiB5MDtcbiAgICAgICAgaWYgKHQwID49IDApIHtcbiAgICAgICAgICAgIHZhciBnaTAgPSBwZXJtTW9kMTJbaWkgKyBwZXJtW2pqXV0gKiAzO1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCk7IC8vICh4LHkpIG9mIGdyYWQzIHVzZWQgZm9yIDJEIGdyYWRpZW50XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC41IC0geDEgKiB4MSAtIHkxICogeTE7XG4gICAgICAgIGlmICh0MSA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgZ2kxID0gcGVybU1vZDEyW2lpICsgaTEgKyBwZXJtW2pqICsgajFdXSAqIDM7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkM1tnaTFdICogeDEgKyBncmFkM1tnaTEgKyAxXSAqIHkxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjUgLSB4MiAqIHgyIC0geTIgKiB5MjtcbiAgICAgICAgaWYgKHQyID49IDApIHtcbiAgICAgICAgICAgIHZhciBnaTIgPSBwZXJtTW9kMTJbaWkgKyAxICsgcGVybVtqaiArIDFdXSAqIDM7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHJldHVybiB2YWx1ZXMgaW4gdGhlIGludGVydmFsIFstMSwxXS5cbiAgICAgICAgcmV0dXJuIDcwLjAgKiAobjAgKyBuMSArIG4yKTtcbiAgICB9LFxuICAgIC8vIDNEIHNpbXBsZXggbm9pc2VcbiAgICBub2lzZTNEOiBmdW5jdGlvbiAoeGluLCB5aW4sIHppbikge1xuICAgICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTIsXG4gICAgICAgICAgICBwZXJtID0gdGhpcy5wZXJtLFxuICAgICAgICAgICAgZ3JhZDMgPSB0aGlzLmdyYWQzO1xuICAgICAgICB2YXIgbjAsIG4xLCBuMiwgbjM7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgZm91ciBjb3JuZXJzXG4gICAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cbiAgICAgICAgdmFyIHMgPSAoeGluICsgeWluICsgemluKSAqIEYzOyAvLyBWZXJ5IG5pY2UgYW5kIHNpbXBsZSBza2V3IGZhY3RvciBmb3IgM0RcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XG4gICAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6aW4gKyBzKTtcbiAgICAgICAgdmFyIHQgPSAoaSArIGogKyBrKSAqIEczO1xuICAgICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseikgc3BhY2VcbiAgICAgICAgdmFyIFkwID0gaiAtIHQ7XG4gICAgICAgIHZhciBaMCA9IGsgLSB0O1xuICAgICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSx6IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgICB2YXIgeTAgPSB5aW4gLSBZMDtcbiAgICAgICAgdmFyIHowID0gemluIC0gWjA7XG4gICAgICAgIC8vIEZvciB0aGUgM0QgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYSBzbGlnaHRseSBpcnJlZ3VsYXIgdGV0cmFoZWRyb24uXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgdmFyIGkxLCBqMSwgazE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqLGspIGNvb3Jkc1xuICAgICAgICB2YXIgaTIsIGoyLCBrMjsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaixrKSBjb29yZHNcbiAgICAgICAgaWYgKHgwID49IHkwKSB7XG4gICAgICAgICAgICBpZiAoeTAgPj0gejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMDtcbiAgICAgICAgICAgIH0gLy8gWCBZIFogb3JkZXJcbiAgICAgICAgICAgIGVsc2UgaWYgKHgwID49IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMDtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFggWiBZIG9yZGVyXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMTtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAwO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWiBYIFkgb3JkZXJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8geDA8eTBcbiAgICAgICAgICAgIGlmICh5MCA8IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDE7XG4gICAgICAgICAgICAgICAgaTIgPSAwO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFogWSBYIG9yZGVyXG4gICAgICAgICAgICBlbHNlIGlmICh4MCA8IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAwO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFkgWiBYIG9yZGVyXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAxO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMDtcbiAgICAgICAgICAgIH0gLy8gWSBYIFogb3JkZXJcbiAgICAgICAgfVxuICAgICAgICAvLyBBIHN0ZXAgb2YgKDEsMCwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jLC1jKSBpbiAoeCx5LHopLFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMSwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jLC1jKSBpbiAoeCx5LHopLCBhbmRcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDAsMSkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKC1jLC1jLDEtYykgaW4gKHgseSx6KSwgd2hlcmVcbiAgICAgICAgLy8gYyA9IDEvNi5cbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEczOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMztcbiAgICAgICAgdmFyIHoxID0gejAgLSBrMSArIEczO1xuICAgICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzM7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xuICAgICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzM7XG4gICAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHMztcbiAgICAgICAgdmFyIHgzID0geDAgLSAxLjAgKyAzLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcbiAgICAgICAgdmFyIHkzID0geTAgLSAxLjAgKyAzLjAgKiBHMztcbiAgICAgICAgdmFyIHozID0gejAgLSAxLjAgKyAzLjAgKiBHMztcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmb3VyIHNpbXBsZXggY29ybmVyc1xuICAgICAgICB2YXIgaWkgPSBpICYgMjU1O1xuICAgICAgICB2YXIgamogPSBqICYgMjU1O1xuICAgICAgICB2YXIga2sgPSBrICYgMjU1O1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcbiAgICAgICAgdmFyIHQwID0gMC42IC0geDAgKiB4MCAtIHkwICogeTAgLSB6MCAqIHowO1xuICAgICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kwID0gcGVybU1vZDEyW2lpICsgcGVybVtqaiArIHBlcm1ba2tdXV0gKiAzO1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCArIGdyYWQzW2dpMCArIDJdICogejApO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MTtcbiAgICAgICAgaWYgKHQxIDwgMCkgbjEgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMSA9IHBlcm1Nb2QxMltpaSArIGkxICsgcGVybVtqaiArIGoxICsgcGVybVtrayArIGsxXV1dICogMztcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQzW2dpMV0gKiB4MSArIGdyYWQzW2dpMSArIDFdICogeTEgKyBncmFkM1tnaTEgKyAyXSAqIHoxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejI7XG4gICAgICAgIGlmICh0MiA8IDApIG4yID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTIgPSBwZXJtTW9kMTJbaWkgKyBpMiArIHBlcm1bamogKyBqMiArIHBlcm1ba2sgKyBrMl1dXSAqIDM7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyICsgZ3JhZDNbZ2kyICsgMl0gKiB6Mik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozO1xuICAgICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kzID0gcGVybU1vZDEyW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDFdXV0gKiAzO1xuICAgICAgICAgICAgdDMgKj0gdDM7XG4gICAgICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDNbZ2kzXSAqIHgzICsgZ3JhZDNbZ2kzICsgMV0gKiB5MyArIGdyYWQzW2dpMyArIDJdICogejMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cbiAgICAgICAgLy8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gc3RheSBqdXN0IGluc2lkZSBbLTEsMV1cbiAgICAgICAgcmV0dXJuIDMyLjAgKiAobjAgKyBuMSArIG4yICsgbjMpO1xuICAgIH0sXG4gICAgLy8gNEQgc2ltcGxleCBub2lzZSwgYmV0dGVyIHNpbXBsZXggcmFuayBvcmRlcmluZyBtZXRob2QgMjAxMi0wMy0wOVxuICAgIG5vaXNlNEQ6IGZ1bmN0aW9uICh4LCB5LCB6LCB3KSB7XG4gICAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMixcbiAgICAgICAgICAgIHBlcm0gPSB0aGlzLnBlcm0sXG4gICAgICAgICAgICBncmFkNCA9IHRoaXMuZ3JhZDQ7XG5cbiAgICAgICAgdmFyIG4wLCBuMSwgbjIsIG4zLCBuNDsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSBmaXZlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgKHgseSx6LHcpIHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBjZWxsIG9mIDI0IHNpbXBsaWNlcyB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4ICsgeSArIHogKyB3KSAqIEY0OyAvLyBGYWN0b3IgZm9yIDREIHNrZXdpbmdcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHggKyBzKTtcbiAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHkgKyBzKTtcbiAgICAgICAgdmFyIGsgPSBNYXRoLmZsb29yKHogKyBzKTtcbiAgICAgICAgdmFyIGwgPSBNYXRoLmZsb29yKHcgKyBzKTtcbiAgICAgICAgdmFyIHQgPSAoaSArIGogKyBrICsgbCkgKiBHNDsgLy8gRmFjdG9yIGZvciA0RCB1bnNrZXdpbmdcbiAgICAgICAgdmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5LHosdykgc3BhY2VcbiAgICAgICAgdmFyIFkwID0gaiAtIHQ7XG4gICAgICAgIHZhciBaMCA9IGsgLSB0O1xuICAgICAgICB2YXIgVzAgPSBsIC0gdDtcbiAgICAgICAgdmFyIHgwID0geCAtIFgwOyAvLyBUaGUgeCx5LHosdyBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgdmFyIHkwID0geSAtIFkwO1xuICAgICAgICB2YXIgejAgPSB6IC0gWjA7XG4gICAgICAgIHZhciB3MCA9IHcgLSBXMDtcbiAgICAgICAgLy8gRm9yIHRoZSA0RCBjYXNlLCB0aGUgc2ltcGxleCBpcyBhIDREIHNoYXBlIEkgd29uJ3QgZXZlbiB0cnkgdG8gZGVzY3JpYmUuXG4gICAgICAgIC8vIFRvIGZpbmQgb3V0IHdoaWNoIG9mIHRoZSAyNCBwb3NzaWJsZSBzaW1wbGljZXMgd2UncmUgaW4sIHdlIG5lZWQgdG9cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBtYWduaXR1ZGUgb3JkZXJpbmcgb2YgeDAsIHkwLCB6MCBhbmQgdzAuXG4gICAgICAgIC8vIFNpeCBwYWlyLXdpc2UgY29tcGFyaXNvbnMgYXJlIHBlcmZvcm1lZCBiZXR3ZWVuIGVhY2ggcG9zc2libGUgcGFpclxuICAgICAgICAvLyBvZiB0aGUgZm91ciBjb29yZGluYXRlcywgYW5kIHRoZSByZXN1bHRzIGFyZSB1c2VkIHRvIHJhbmsgdGhlIG51bWJlcnMuXG4gICAgICAgIHZhciByYW5reCA9IDA7XG4gICAgICAgIHZhciByYW5reSA9IDA7XG4gICAgICAgIHZhciByYW5reiA9IDA7XG4gICAgICAgIHZhciByYW5rdyA9IDA7XG4gICAgICAgIGlmICh4MCA+IHkwKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt5Kys7XG4gICAgICAgIGlmICh4MCA+IHowKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt6Kys7XG4gICAgICAgIGlmICh4MCA+IHcwKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIGlmICh5MCA+IHowKSByYW5reSsrO1xuICAgICAgICBlbHNlIHJhbmt6Kys7XG4gICAgICAgIGlmICh5MCA+IHcwKSByYW5reSsrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIGlmICh6MCA+IHcwKSByYW5reisrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIHZhciBpMSwgajEsIGsxLCBsMTsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIHNlY29uZCBzaW1wbGV4IGNvcm5lclxuICAgICAgICB2YXIgaTIsIGoyLCBrMiwgbDI7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSB0aGlyZCBzaW1wbGV4IGNvcm5lclxuICAgICAgICB2YXIgaTMsIGozLCBrMywgbDM7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSBmb3VydGggc2ltcGxleCBjb3JuZXJcbiAgICAgICAgLy8gc2ltcGxleFtjXSBpcyBhIDQtdmVjdG9yIHdpdGggdGhlIG51bWJlcnMgMCwgMSwgMiBhbmQgMyBpbiBzb21lIG9yZGVyLlxuICAgICAgICAvLyBNYW55IHZhbHVlcyBvZiBjIHdpbGwgbmV2ZXIgb2NjdXIsIHNpbmNlIGUuZy4geD55Pno+dyBtYWtlcyB4PHosIHk8dyBhbmQgeDx3XG4gICAgICAgIC8vIGltcG9zc2libGUuIE9ubHkgdGhlIDI0IGluZGljZXMgd2hpY2ggaGF2ZSBub24temVybyBlbnRyaWVzIG1ha2UgYW55IHNlbnNlLlxuICAgICAgICAvLyBXZSB1c2UgYSB0aHJlc2hvbGRpbmcgdG8gc2V0IHRoZSBjb29yZGluYXRlcyBpbiB0dXJuIGZyb20gdGhlIGxhcmdlc3QgbWFnbml0dWRlLlxuICAgICAgICAvLyBSYW5rIDMgZGVub3RlcyB0aGUgbGFyZ2VzdCBjb29yZGluYXRlLlxuICAgICAgICBpMSA9IHJhbmt4ID49IDMgPyAxIDogMDtcbiAgICAgICAgajEgPSByYW5reSA+PSAzID8gMSA6IDA7XG4gICAgICAgIGsxID0gcmFua3ogPj0gMyA/IDEgOiAwO1xuICAgICAgICBsMSA9IHJhbmt3ID49IDMgPyAxIDogMDtcbiAgICAgICAgLy8gUmFuayAyIGRlbm90ZXMgdGhlIHNlY29uZCBsYXJnZXN0IGNvb3JkaW5hdGUuXG4gICAgICAgIGkyID0gcmFua3ggPj0gMiA/IDEgOiAwO1xuICAgICAgICBqMiA9IHJhbmt5ID49IDIgPyAxIDogMDtcbiAgICAgICAgazIgPSByYW5reiA+PSAyID8gMSA6IDA7XG4gICAgICAgIGwyID0gcmFua3cgPj0gMiA/IDEgOiAwO1xuICAgICAgICAvLyBSYW5rIDEgZGVub3RlcyB0aGUgc2Vjb25kIHNtYWxsZXN0IGNvb3JkaW5hdGUuXG4gICAgICAgIGkzID0gcmFua3ggPj0gMSA/IDEgOiAwO1xuICAgICAgICBqMyA9IHJhbmt5ID49IDEgPyAxIDogMDtcbiAgICAgICAgazMgPSByYW5reiA+PSAxID8gMSA6IDA7XG4gICAgICAgIGwzID0gcmFua3cgPj0gMSA/IDEgOiAwO1xuICAgICAgICAvLyBUaGUgZmlmdGggY29ybmVyIGhhcyBhbGwgY29vcmRpbmF0ZSBvZmZzZXRzID0gMSwgc28gbm8gbmVlZCB0byBjb21wdXRlIHRoYXQuXG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHNDsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHNDtcbiAgICAgICAgdmFyIHoxID0gejAgLSBrMSArIEc0O1xuICAgICAgICB2YXIgdzEgPSB3MCAtIGwxICsgRzQ7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gaTIgKyAyLjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSBqMiArIDIuMCAqIEc0O1xuICAgICAgICB2YXIgejIgPSB6MCAtIGsyICsgMi4wICogRzQ7XG4gICAgICAgIHZhciB3MiA9IHcwIC0gbDIgKyAyLjAgKiBHNDtcbiAgICAgICAgdmFyIHgzID0geDAgLSBpMyArIDMuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciBmb3VydGggY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHkzID0geTAgLSBqMyArIDMuMCAqIEc0O1xuICAgICAgICB2YXIgejMgPSB6MCAtIGszICsgMy4wICogRzQ7XG4gICAgICAgIHZhciB3MyA9IHcwIC0gbDMgKyAzLjAgKiBHNDtcbiAgICAgICAgdmFyIHg0ID0geDAgLSAxLjAgKyA0LjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTQgPSB5MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICB2YXIgejQgPSB6MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICB2YXIgdzQgPSB3MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIGZpdmUgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIHZhciBpaSA9IGkgJiAyNTU7XG4gICAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICAgIHZhciBrayA9IGsgJiAyNTU7XG4gICAgICAgIHZhciBsbCA9IGwgJiAyNTU7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIGZpdmUgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjYgLSB4MCAqIHgwIC0geTAgKiB5MCAtIHowICogejAgLSB3MCAqIHcwO1xuICAgICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kwID0gKHBlcm1baWkgKyBwZXJtW2pqICsgcGVybVtrayArIHBlcm1bbGxdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQ0W2dpMF0gKiB4MCArIGdyYWQ0W2dpMCArIDFdICogeTAgKyBncmFkNFtnaTAgKyAyXSAqIHowICsgZ3JhZDRbZ2kwICsgM10gKiB3MCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC42IC0geDEgKiB4MSAtIHkxICogeTEgLSB6MSAqIHoxIC0gdzEgKiB3MTtcbiAgICAgICAgaWYgKHQxIDwgMCkgbjEgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMSA9IChwZXJtW2lpICsgaTEgKyBwZXJtW2pqICsgajEgKyBwZXJtW2trICsgazEgKyBwZXJtW2xsICsgbDFdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQ0W2dpMV0gKiB4MSArIGdyYWQ0W2dpMSArIDFdICogeTEgKyBncmFkNFtnaTEgKyAyXSAqIHoxICsgZ3JhZDRbZ2kxICsgM10gKiB3MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC42IC0geDIgKiB4MiAtIHkyICogeTIgLSB6MiAqIHoyIC0gdzIgKiB3MjtcbiAgICAgICAgaWYgKHQyIDwgMCkgbjIgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMiA9IChwZXJtW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazIgKyBwZXJtW2xsICsgbDJdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWQ0W2dpMl0gKiB4MiArIGdyYWQ0W2dpMiArIDFdICogeTIgKyBncmFkNFtnaTIgKyAyXSAqIHoyICsgZ3JhZDRbZ2kyICsgM10gKiB3Mik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozIC0gdzMgKiB3MztcbiAgICAgICAgaWYgKHQzIDwgMCkgbjMgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMyA9IChwZXJtW2lpICsgaTMgKyBwZXJtW2pqICsgajMgKyBwZXJtW2trICsgazMgKyBwZXJtW2xsICsgbDNdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQzICo9IHQzO1xuICAgICAgICAgICAgbjMgPSB0MyAqIHQzICogKGdyYWQ0W2dpM10gKiB4MyArIGdyYWQ0W2dpMyArIDFdICogeTMgKyBncmFkNFtnaTMgKyAyXSAqIHozICsgZ3JhZDRbZ2kzICsgM10gKiB3Myk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQ0ID0gMC42IC0geDQgKiB4NCAtIHk0ICogeTQgLSB6NCAqIHo0IC0gdzQgKiB3NDtcbiAgICAgICAgaWYgKHQ0IDwgMCkgbjQgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpNCA9IChwZXJtW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDEgKyBwZXJtW2xsICsgMV1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDQgKj0gdDQ7XG4gICAgICAgICAgICBuNCA9IHQ0ICogdDQgKiAoZ3JhZDRbZ2k0XSAqIHg0ICsgZ3JhZDRbZ2k0ICsgMV0gKiB5NCArIGdyYWQ0W2dpNCArIDJdICogejQgKyBncmFkNFtnaTQgKyAzXSAqIHc0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdW0gdXAgYW5kIHNjYWxlIHRoZSByZXN1bHQgdG8gY292ZXIgdGhlIHJhbmdlIFstMSwxXVxuICAgICAgICByZXR1cm4gMjcuMCAqIChuMCArIG4xICsgbjIgKyBuMyArIG40KTtcbiAgICB9XG5cblxufTtcblxuLy8gYW1kXG5pZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIFNpbXBsZXhOb2lzZTt9KTtcbi8vY29tbW9uIGpzXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSBleHBvcnRzLlNpbXBsZXhOb2lzZSA9IFNpbXBsZXhOb2lzZTtcbi8vIGJyb3dzZXJcbmVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB3aW5kb3cuU2ltcGxleE5vaXNlID0gU2ltcGxleE5vaXNlO1xuLy8gbm9kZWpzXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNpbXBsZXhOb2lzZTtcbn1cblxufSkoKTtcbiIsInZhciBEaXIgPSB7fTtcblxuRGlyLkxFRlQgPSAwO1xuRGlyLlJJR0hUID0gMTtcbkRpci5CT1RUT00gPSAyO1xuRGlyLlVQID0gMztcbkRpci5CQUNLID0gNDtcbkRpci5GUk9OVCA9IDU7XG5cbkRpci5nZXRVbml0VmVjdG9yID0gZnVuY3Rpb24oZGlyKSB7XG4gIHN3aXRjaCAoZGlyKSB7XG4gICAgY2FzZSBcIjBcIjpcbiAgICBjYXNlIERpci5MRUZUOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKC0xLCAwLCAwKVxuICAgIGNhc2UgXCIxXCI6XG4gICAgY2FzZSBEaXIuUklHSFQ6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMClcbiAgICBjYXNlIFwiMlwiOlxuICAgIGNhc2UgRGlyLkJPVFRPTTpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAtMSwgMClcbiAgICBjYXNlIFwiM1wiOlxuICAgIGNhc2UgRGlyLlVQOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApXG4gICAgY2FzZSBcIjRcIjpcbiAgICBjYXNlIERpci5CQUNLOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIC0xKVxuICAgIGNhc2UgXCI1XCI6XG4gICAgY2FzZSBEaXIuRlJPTlQ6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSlcbiAgfVxufTtcblxuRGlyLnVuaXRWZWN0b3JUb0RpciA9IGZ1bmN0aW9uKHVuaXRWZWN0b3IpIHtcbiAgaWYgKHVuaXRWZWN0b3IuZXF1YWxzKG5ldyBUSFJFRS5WZWN0b3IzKC0xLCAwLCAwKSkpIHtcbiAgICByZXR1cm4gRGlyLkxFRlQ7XG4gIH0gZWxzZSBpZiAodW5pdFZlY3Rvci5lcXVhbHMobmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMCkpKSB7XG4gICAgcmV0dXJuIERpci5SSUdIVDtcbiAgfSBlbHNlIGlmICh1bml0VmVjdG9yLmVxdWFscyhuZXcgVEhSRUUuVmVjdG9yMygwLCAtMSwgMCkpKSB7XG4gICAgcmV0dXJuIERpci5CT1RUT007XG4gIH0gZWxzZSBpZiAodW5pdFZlY3Rvci5lcXVhbHMobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCkpKSB7XG4gICAgcmV0dXJuIERpci5VUDtcbiAgfSBlbHNlIGlmICh1bml0VmVjdG9yLmVxdWFscyhuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAtMSkpKSB7XG4gICAgcmV0dXJuIERpci5CQUNLO1xuICB9IGVsc2UgaWYgKHVuaXRWZWN0b3IuZXF1YWxzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpKSkge1xuICAgIHJldHVybiBEaXIuRlJPTlQ7XG4gIH1cbn07XG5cbnZhciBnZXRRdWF0UmVzdWx0ID0ge307XG5EaXIuZ2V0UXVhdCA9IGZ1bmN0aW9uKGRpcikge1xuICBpZiAoZ2V0UXVhdFJlc3VsdFtkaXJdID09IG51bGwpIHtcbiAgICBnZXRRdWF0UmVzdWx0W2Rpcl0gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgRGlyLmdldFVuaXRWZWN0b3IoZGlyKSk7XG4gIH1cbiAgcmV0dXJuIGdldFF1YXRSZXN1bHRbZGlyXTtcbn07XG5cbkRpci5nZXRPcHBvc2l0ZSA9IGZ1bmN0aW9uKGRpcikge1xuICB2YXIgb3Bwb3NpdGVzID0ge1xuICAgIDA6IDEsXG4gICAgMTogMCxcbiAgICAyOiAzLFxuICAgIDM6IDIsXG4gICAgNDogNSxcbiAgICA1OiA0XG4gIH07XG5cbiAgcmV0dXJuIG9wcG9zaXRlc1tkaXJdO1xufTtcblxuRGlyLmlzT3Bwb3NpdGUgPSBmdW5jdGlvbihkaXIsIGRpcjIpIHtcbiAgcmV0dXJuIERpci5nZXRPcHBvc2l0ZShkaXIpID09PSBkaXIyO1xufTtcblxuRGlyLmlzQWRqYWNlbnQgPSBmdW5jdGlvbihkaXIsIGRpcjIpIHtcbiAgcmV0dXJuIGRpciAhPT0gZGlyMiAmJiAhdGhpcy5pc09wcG9zaXRlKGRpciwgZGlyMik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcjtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJlbnZcIjogXCJkZXZcIlxufSIsInZhciBTaW1wbGV4Tm9pc2UgPSByZXF1aXJlKCdzaW1wbGV4LW5vaXNlJyk7XG5cbnZhciBtZXNoZXIgPSByZXF1aXJlKCcuLi92b3hlbC9tZXNoZXInKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuLi9kaXInKTtcbnZhciBDaHVua3MgPSByZXF1aXJlKCcuLi92b3hlbC9jaHVua3MnKTtcbnZhciBtZXNoQ2h1bmtzID0gcmVxdWlyZSgnLi4vdm94ZWwvbWVzaGNodW5rcycpO1xuXG52YXIgQ0xPVUQgPSAxMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaXplLCBwYXJlbnQsIG1hdGVyaWFsKSB7XG5cbiAgdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcbiAgdmFyIGRhdGFNYXAgPSB7fTtcbiAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBwYXJlbnQuYWRkKG9iamVjdCk7XG5cbiAgdmFyIG5vaXNlMSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGMSA9IDAuMTtcbiAgdmFyIG5vaXNlMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGMiA9IDAuMDU7XG4gIHZhciBub2lzZV9wcmVzc3VyZSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VfcHJlc3N1cmVGID0gMC4wMDI7XG4gIHZhciBjbG91ZEFtb3VudCA9IC0xLjA7XG4gIHZhciBjb3VudGVyID0gMDtcbiAgdmFyIGNvb2xkb3duID0gNC4yO1xuXG4gIHZhciBhbGxDb29yZHMgPSB7fTtcblxuICB2YXIgY2VudGVyTnVtID0gKHNpemUgLyAyKTtcbiAgdmFyIGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKC1zaXplIC8gMiwgLXNpemUgLyAyLCAtc2l6ZSAvIDIpO1xuXG4gIHZhciBjbG91ZFZveGVsID0gW1xuICAgIENMT1VELCBDTE9VRCwgQ0xPVUQsIENMT1VELCBDTE9VRCwgQ0xPVURcbiAgXTtcblxuICBpbml0RGF0YSgpO1xuXG4gIGZ1bmN0aW9uIGluaXREYXRhKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuXG4gICAgZm9yICh2YXIgZGlyID0gMDsgZGlyIDwgNjsgZGlyKyspIHtcbiAgICAgIHZhciBkID0gTWF0aC5mbG9vcihkaXIgLyAyKTtcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuICAgICAgdmFyIGNvb3JkRCA9IGRpciAlIDIgPyAwIDogc2l6ZSAtIDE7XG4gICAgICB2YXIgZmFsbERpciA9IGNvb3JkRCA9PT0gMCA/IDEgOiAtMTtcbiAgICAgIHZhciBmYWxsQ29vcmREID0gY29vcmREICsgZmFsbERpcjtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgICBjb29yZFtkXSA9IGNvb3JkRDtcbiAgICAgICAgICBjb29yZFt1XSA9IGk7XG4gICAgICAgICAgY29vcmRbdl0gPSBqO1xuXG4gICAgICAgICAgdmFyIHJlbCA9IFtcbiAgICAgICAgICAgIChjb29yZFswXSArIGNlbnRlci54KSxcbiAgICAgICAgICAgIChjb29yZFsxXSArIGNlbnRlci55KSxcbiAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlci56KVxuICAgICAgICAgIF07XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHByZXNzdXJlOiBub2lzZV9wcmVzc3VyZS5ub2lzZTNEKFxuICAgICAgICAgICAgICByZWxbMF0gKiBub2lzZV9wcmVzc3VyZUYsXG4gICAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlX3ByZXNzdXJlRixcbiAgICAgICAgICAgICAgcmVsWzJdICogbm9pc2VfcHJlc3N1cmVGXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgYW1vdW50OiAwLFxuICAgICAgICAgICAgZGVsdGE6IDAsXG4gICAgICAgICAgICBjb29yZDogW2Nvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl1dXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBoYXNoID0gY29vcmQuam9pbignLCcpO1xuICAgICAgICAgIGFsbENvb3Jkc1toYXNoXSA9IFtjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdXTtcbiAgICAgICAgICBkYXRhTWFwW2hhc2hdID0gZGF0YTtcblxuICAgICAgICAgIHZhciB2YWx1ZSA9IG5vaXNlMS5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMSxcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjEsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYxXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTIgPSBub2lzZTIubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUYyLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGMlxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB2YWx1ZSA9IE1hdGgucG93KHZhbHVlICsgdmFsdWUyLCAxKSArIGNsb3VkQW1vdW50O1xuXG4gICAgICAgICAgaWYgKHZhbHVlID4gMC4wKSB7XG4gICAgICAgICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGNsb3VkVm94ZWwpO1xuICAgICAgICAgICAgZGF0YS5hbW91bnQgKz0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXRhLm5laWdoYm91cnMgPSBbXTtcblxuXG4gICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpIC0gMSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpID09PSBzaXplIC0gMSkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGkgKyAxLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpLCBqIC0gMSwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChqID09PSBzaXplIC0gMSkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGksIGogKyAxLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRpciA9PT0gMCkge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMF07XG4gICAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09IDEpIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzFdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAyKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1szXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gMykge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMl07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZWxJID0gaSAtIGNlbnRlck51bTtcbiAgICAgICAgICAgIHZhciByZWxKID0gaiAtIGNlbnRlck51bTtcblxuICAgICAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihyZWxJLCByZWxKKTtcbiAgICAgICAgICAgIGFuZ2xlID0gbm9ybWFsaXplQW5nbGUoYW5nbGUpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBub3JtYWxpemVBbmdsZShhbmdsZSkge1xuICAgICAgICAgICAgICBhbmdsZSAlPSAoTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgICBpZiAoYW5nbGUgPCBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgKz0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgLT0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IE1hdGguUEkgLyA0O1xuICAgICAgICAgICAgdmFyIHN0ZXAgPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IC1NYXRoLlBJO1xuXG4gICAgICAgICAgICBpZiAoYW5nbGUgPj0gb2Zmc2V0ICYmIGFuZ2xlIDwgb2Zmc2V0ICsgc3RlcCkge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5nbGUgPj0gb2Zmc2V0ICsgc3RlcCAmJiBhbmdsZSA8IG9mZnNldCArIHN0ZXAgKiAyKSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbmdsZSA+PSBvZmZzZXQgLSBzdGVwICYmIGFuZ2xlIDwgb2Zmc2V0KSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzNdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdldENvb3JkKGksIGosIGssIGQsIHUsIHYpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICBjb29yZFtkXSA9IGk7XG4gICAgY29vcmRbdV0gPSBqO1xuICAgIGNvb3JkW3ZdID0gaztcbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cblxuICB1cGRhdGVNZXNoKCk7XG5cbiAgb2JqZWN0LnBvc2l0aW9uLmNvcHkoY2VudGVyKTtcblxuICBmdW5jdGlvbiB0aWNrKGR0KSB7XG4gICAgY291bnRlciArPSBkdDtcbiAgICBpZiAoY291bnRlciA+IGNvb2xkb3duKSB7XG4gICAgICBjb3VudGVyIC09IGNvb2xkb3duO1xuXG4gICAgICB2YXIgY2hhbmdlZCA9IHt9O1xuICAgICAgZm9yICh2YXIgaWQgaW4gYWxsQ29vcmRzKSB7XG4gICAgICAgIHZhciBjb29yZCA9IGFsbENvb3Jkc1tpZF07XG4gICAgICAgIHZhciBkYXRhID0gZGF0YU1hcFtpZF07XG4gICAgICAgIHZhciBuZXh0Q29vcmQgPSBkYXRhLm5leHRDb29yZDtcbiAgICAgICAgaWYgKG5leHRDb29yZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YS5hbW91bnQgPD0gMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5leHRIYXNoID0gbmV4dENvb3JkLmpvaW4oJywnKTtcbiAgICAgICAgdmFyIG5leHREYXRhID0gZGF0YU1hcFtuZXh0SGFzaF07XG4gICAgICAgIGNoYW5nZWRbbmV4dEhhc2hdID0gdHJ1ZTtcbiAgICAgICAgY2hhbmdlZFtpZF0gPSB0cnVlO1xuXG4gICAgICAgIG5leHREYXRhLmRlbHRhICs9IDEuMDtcbiAgICAgICAgZGF0YS5kZWx0YSArPSAtMS4wO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpZCBpbiBjaGFuZ2VkKSB7XG4gICAgICAgIHZhciBkYXRhID0gZGF0YU1hcFtpZF07XG4gICAgICAgIHZhciBjb29yZCA9IGRhdGEuY29vcmQ7XG4gICAgICAgIGRhdGEuYW1vdW50ICs9IGRhdGEuZGVsdGE7XG4gICAgICAgIGRhdGEuZGVsdGEgPSAwO1xuXG4gICAgICAgIGlmIChkYXRhLmFtb3VudCA+PSAxLjApIHtcbiAgICAgICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGNsb3VkVm94ZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNodW5rcy5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlTWVzaCgpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiB1cGRhdGVNZXNoKCkge1xuICAgIG1lc2hDaHVua3MoY2h1bmtzLCBvYmplY3QsIG1hdGVyaWFsKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHRpY2s6IHRpY2tcbiAgfTtcbn1cbiIsInZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFNpbXBsZXhOb2lzZSA9IHJlcXVpcmUoJ3NpbXBsZXgtbm9pc2UnKTtcblxudmFyIFZveGVsID0gcmVxdWlyZSgnLi4vLi4vdm94ZWwnKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuLi8uLi9kaXInKTtcbnZhciBTdXJmYWNlTWFwID0gcmVxdWlyZSgnLi9zdXJmYWNlbWFwJyk7XG5cbnZhciBDaHVua3MgPSBWb3hlbC5DaHVua3M7XG52YXIgbWVzaENodW5rcyA9IFZveGVsLm1lc2hDaHVua3M7XG52YXIgcmVtb3ZlRmxvYXRpbmcgPSBWb3hlbC5yZW1vdmVGbG9hdGluZztcblxudmFyIEdSQVNTID0gMTtcbnZhciBTT0lMID0gMjtcbnZhciBTT0lMX0VER0UgPSAzO1xudmFyIFNUT05FID0gNDtcbnZhciBTRUEgPSA1O1xudmFyIFNBTkQgPSA2O1xuXG52YXIgTEVWRUxfU1VSRkFDRSA9IDE7XG52YXIgTEVWRUxfTUlERExFID0gMjtcbnZhciBMRVZFTF9DT1JFID0gMztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaXplLCBwYXJlbnQsIG1hdGVyaWFsKSB7XG4gIHZhciBub2lzZV9zdXJmYWNlID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfc3VyZmFjZSA9IDAuMTtcbiAgdmFyIG5vaXNlX3N1cmZhY2UyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfc3VyZmFjZTIgPSAwLjA0O1xuXG4gIHZhciBub2lzZV9iaW9tZXMgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlX2Jpb21lczIgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlX2Jpb21lczMgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcblxuICB2YXIgbm9pc2VfYmlvbWVzX3RyZWVzID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfYmlvbWVzX3RyZWVzID0gMC4xO1xuXG4gIHZhciBub2lzZV9iaW9tZXNfdHJlZXMyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfYmlvbWVzX3RyZWVzMiA9IDAuMDQ7XG5cbiAgdmFyIEJJT01FX1ZBTFVFX1NUT05FID0gLTAuODtcbiAgdmFyIEJJT01FX1ZBTFVFX1NPSUwgPSAwO1xuXG4gIHZhciBzdXJmYWNlTWFwID0gbmV3IFN1cmZhY2VNYXAoKTtcblxuICB2YXIgZ3JvdW5kID0gbmV3IENodW5rcygpO1xuICB2YXIgd2F0ZXIgPSBuZXcgQ2h1bmtzKCk7XG4gIHZhciBib3VuZHMgPSB7XG4gICAgbWluOiBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSxcbiAgICBzaXplOiBuZXcgVEhSRUUuVmVjdG9yMyhzaXplLCBzaXplLCBzaXplKVxuICB9O1xuXG4gIHZhciBjZW50ZXIgPSBbLXNpemUgLyAyICsgMC41LCAtc2l6ZSAvIDIgKyAwLjUsIC1zaXplIC8gMiArIDAuNV07XG4gIHZhciBjZW50ZXJDb29yZCA9IFtcbiAgICBNYXRoLmZsb29yKHNpemUgLyAyKSxcbiAgICBNYXRoLmZsb29yKHNpemUgLyAyKSxcbiAgICBNYXRoLmZsb29yKHNpemUgLyAyKVxuICBdO1xuXG4gIC8vIGhhc2ggLT4gZGF0YVxuICAvLyBncmF2aXR5OiBncmF2aXR5IChzKVxuICAvLyBiaW9tZTogYmlvbWUgZGF0YVxuICAvLyBoZWlnaHQ6IGhlaWdodCBvZiBzdXJmYWNlXG4gIHZhciBkYXRhTWFwID0ge307XG4gIHZhciBzdXJmYWNlTnVtID0gNjtcbiAgdmFyIHNlYUxldmVsID0gMjtcblxuICB2YXIgcGl2b3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgdmFyIGdyb3VuZE9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIGluaXQoKTtcbiAgICBnZW5lcmF0ZUdyYXZpdHlNYXAoKTtcbiAgICBnZW5lcmF0ZUJ1bXBzKCk7XG4gICAgcmVtb3ZlRmxvYXRpbmcoZ3JvdW5kLCBjZW50ZXJDb29yZCk7XG4gICAgZ2VuZXJhdGVTZWEoKTtcbiAgICBnZW5lcmF0ZUJpb21lcygpO1xuICAgIGdlbmVyYXRlVGlsZXMoKTtcbiAgICBnZW5lcmF0ZVN1cmZhY2UoKTtcblxuICAgIHBpdm90LmFkZChncm91bmRPYmplY3QpO1xuICAgIG1lc2hDaHVua3MoZ3JvdW5kLCBncm91bmRPYmplY3QsIG1hdGVyaWFsKTtcbiAgICBtZXNoQ2h1bmtzKHdhdGVyLCBwaXZvdCwgbWF0ZXJpYWwpO1xuXG4gICAgdmFyIHBvc2l0aW9uQ2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgICAgLnN1YlZlY3RvcnMoYm91bmRzLm1pbiwgYm91bmRzLnNpemUpXG4gICAgICAubXVsdGlwbHlTY2FsYXIoMC41KTtcbiAgICBwaXZvdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uQ2VudGVyKTtcbiAgICBwYXJlbnQuYWRkKHBpdm90KTtcbiAgfTtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNpemU7IGsrKykge1xuICAgICAgICAgIGdyb3VuZC5zZXQoaSwgaiwgaywgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVTZWEoKSB7XG4gICAgdmFyIGNvb3JkID0gW107XG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCAzOyBkKyspIHtcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuICAgICAgW3NlYUxldmVsLCBzaXplIC0gc2VhTGV2ZWwgLSAxXS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IHNlYUxldmVsOyBpIDwgc2l6ZSAtIHNlYUxldmVsOyBpKyspIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gc2VhTGV2ZWw7IGogPCBzaXplIC0gc2VhTGV2ZWw7IGorKykge1xuICAgICAgICAgICAgY29vcmRbZF0gPSBjO1xuICAgICAgICAgICAgY29vcmRbdV0gPSBpO1xuICAgICAgICAgICAgY29vcmRbdl0gPSBqO1xuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gICAgICAgICAgICB2YXIgZ3Jhdml0eSA9IGRhdGEuZ3Jhdml0eTtcblxuICAgICAgICAgICAgdmFyIGJsb2NrID0gW1xuICAgICAgICAgICAgICAwLCAwLCAwLCAwLCAwLCAwXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBnIGluIGdyYXZpdHkpIHtcbiAgICAgICAgICAgICAgYmxvY2tbZ10gPSBTRUE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZ3JvdW5kLmdldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKSkge1xuICAgICAgICAgICAgICB3YXRlci5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQmlvbWVzKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNpemU7IGsrKykge1xuICAgICAgICAgIHZhciB2ID0gZ3JvdW5kLmdldChpLCBqLCBrKTtcbiAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBkID0gTWF0aC5tYXgoXG4gICAgICAgICAgICBNYXRoLmFicyhpICsgY2VudGVyWzBdKSxcbiAgICAgICAgICAgIE1hdGguYWJzKGogKyBjZW50ZXJbMV0pLFxuICAgICAgICAgICAgTWF0aC5hYnMoayArIGNlbnRlclsyXSkpO1xuXG4gICAgICAgICAgdmFyIHJlbFNlYUxldmVsID0gKHNpemUgLyAyIC0gZCAtIHNlYUxldmVsIC0gMC41KTtcblxuICAgICAgICAgIGQgLz0gKHNpemUgLyAyKTtcblxuICAgICAgICAgIHZhciBub2lzZUYgPSAwLjA1O1xuICAgICAgICAgIHZhciBub2lzZUYyID0gMC4wMjtcbiAgICAgICAgICB2YXIgbm9pc2VGMyA9IDAuMDI7XG5cbiAgICAgICAgICB2YXIgcmVsID0gW2kgKyBjZW50ZXJbMF0sIGogKyBjZW50ZXJbMV0sIGsgKyBjZW50ZXJbMl1dO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG5vaXNlX2Jpb21lcy5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTIgPSBub2lzZV9iaW9tZXMyLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYyLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGMixcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRjIpO1xuXG4gICAgICAgICAgdmFyIHZhbHVlMyA9IG5vaXNlX2Jpb21lczMubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRjMsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUYzLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGM1xuICAgICAgICAgICkgKyB2YWx1ZTtcblxuICAgICAgICAgIHZhbHVlID0gdmFsdWUgKiAwLjUgKyB2YWx1ZTIgKiAyLjA7XG5cbiAgICAgICAgICB2YXIgYmlvbWUgPSB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICB2YWx1ZTI6IHZhbHVlMyxcbiAgICAgICAgICAgIHJlbFNlYUxldmVsOiByZWxTZWFMZXZlbFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgdmFsdWVUcmVlID0gbm9pc2VfYmlvbWVzX3RyZWVzLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUZfYmlvbWVzX3RyZWVzLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGX2Jpb21lc190cmVlcyxcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXNcbiAgICAgICAgICApICsgbm9pc2VfYmlvbWVzX3RyZWVzMi5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGX2Jpb21lc190cmVlczIsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUZfYmlvbWVzX3RyZWVzMixcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMyXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vIEJJT01FIGJpYXMgZm9yIHRyZWVcbiAgICAgICAgICBpZiAodmFsdWUgPCBCSU9NRV9WQUxVRV9TVE9ORSkge1xuICAgICAgICAgICAgdmFsdWVUcmVlIC09IDEuMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIDwgQklPTUVfVkFMVUVfU09JTCkge1xuICAgICAgICAgICAgdmFsdWVUcmVlIC09IDAuNTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBiaW9tZS50cmVlID0gdmFsdWVUcmVlO1xuXG4gICAgICAgICAgdmFyIGxldmVsO1xuXG4gICAgICAgICAgaWYgKGQgPiAwLjcpIHtcbiAgICAgICAgICAgIC8vIHN1cmZhY2VcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfU1VSRkFDRTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGQgPiAwLjMpIHtcbiAgICAgICAgICAgIC8vIG1pZGRsZVxuICAgICAgICAgICAgbGV2ZWwgPSBMRVZFTF9NSURETEU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvcmVcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfQ09SRTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBiaW9tZS5sZXZlbCA9IGxldmVsO1xuXG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGksIGosIGspO1xuICAgICAgICAgIGRhdGEuYmlvbWUgPSBiaW9tZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUdyYXZpdHlNYXAoKSB7XG4gICAgdmFyIHBhZGRpbmcgPSAyO1xuICAgIGZvciAodmFyIGkgPSAtcGFkZGluZzsgaSA8IHNpemUgKyBwYWRkaW5nOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAtcGFkZGluZzsgaiA8IHNpemUgKyBwYWRkaW5nOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IC1wYWRkaW5nOyBrIDwgc2l6ZSArIHBhZGRpbmc7IGsrKykge1xuICAgICAgICAgIHZhciBtYXAgPSB7fTtcbiAgICAgICAgICB2YXIgZ3Jhdml0eSA9IGNhbGNHcmF2aXR5KGksIGosIGspO1xuICAgICAgICAgIGdyYXZpdHkuZm9yRWFjaChmdW5jdGlvbihnKSB7XG4gICAgICAgICAgICBtYXBbZ10gPSB7XG4gICAgICAgICAgICAgIGRpcjogZ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoaSwgaiwgayk7XG4gICAgICAgICAgZGF0YS5ncmF2aXR5ID0gbWFwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGNhbGNHcmF2aXR5KGksIGosIGspIHtcbiAgICB2YXIgYXJyYXkgPSBbXG4gICAgICBpICsgY2VudGVyWzBdLFxuICAgICAgaiArIGNlbnRlclsxXSxcbiAgICAgIGsgKyBjZW50ZXJbMl1cbiAgICBdO1xuICAgIHZhciBtYXggPSAtSW5maW5pdHk7XG4gICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICB2YXIgZjtcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGFycmF5Lmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgYSA9IE1hdGguYWJzKGFycmF5W2RdKTtcbiAgICAgIGlmIChhID4gbWF4KSB7XG4gICAgICAgIG1heCA9IGE7XG4gICAgICAgIGYgPSBkICogMiArIChhcnJheVtkXSA+IDAgPyAwIDogMSk7XG4gICAgICAgIGluZGV4ZXMgPSBbZl07XG4gICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGEgLSBtYXgpIDwgMC4wMSkge1xuICAgICAgICBmID0gZCAqIDIgKyAoYXJyYXlbZF0gPiAwID8gMCA6IDEpO1xuICAgICAgICBpbmRleGVzLnB1c2goZik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleGVzO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQnVtcHMoKSB7XG4gICAgLy8gR2VuZXJhdGUgc3VyZmFjZVxuXG4gICAgdmFyIGNSYW5nZSA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdXJmYWNlTnVtOyBpKyspIHtcbiAgICAgIGNSYW5nZS5wdXNoKDAgKyBpLCBzaXplIC0gMSAtIGkpO1xuICAgIH1cblxuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgZCsrKSB7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIGNSYW5nZS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNpemU7IGsrKykge1xuXG4gICAgICAgICAgICB2YXIgZGlzID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgIE1hdGguYWJzKGNvb3JkWzBdICsgY2VudGVyWzBdKSxcbiAgICAgICAgICAgICAgTWF0aC5hYnMoY29vcmRbMV0gKyBjZW50ZXJbMV0pLFxuICAgICAgICAgICAgICBNYXRoLmFicyhjb29yZFsyXSArIGNlbnRlclsyXSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHZhciBkaXNCaWFzID0gMSAtIChzaXplIC8gMiArIDAuNSAtIGRpcykgLyBzdXJmYWNlTnVtO1xuXG4gICAgICAgICAgICBjb29yZFtkXSA9IGM7XG4gICAgICAgICAgICBjb29yZFt1XSA9IGo7XG4gICAgICAgICAgICBjb29yZFt2XSA9IGs7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBbMCwgMCwgMF07XG4gICAgICAgICAgICB2YXIgb2Zmc2V0MiA9IFswLCAwLCAwXTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlID0gbm9pc2Vfc3VyZmFjZS5ub2lzZTNEKFxuICAgICAgICAgICAgICAoY29vcmRbMF0gKyBjZW50ZXJbMF0gKyBvZmZzZXRbMF0pICogbm9pc2VGX3N1cmZhY2UsXG4gICAgICAgICAgICAgIChjb29yZFsxXSArIGNlbnRlclsxXSArIG9mZnNldFsxXSkgKiBub2lzZUZfc3VyZmFjZSxcbiAgICAgICAgICAgICAgKGNvb3JkWzJdICsgY2VudGVyWzJdICsgb2Zmc2V0WzJdKSAqIG5vaXNlRl9zdXJmYWNlKTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlMiA9IG5vaXNlX3N1cmZhY2UyLm5vaXNlM0QoXG4gICAgICAgICAgICAgIChjb29yZFswXSArIGNlbnRlclswXSArIG9mZnNldDJbMF0pICogbm9pc2VGX3N1cmZhY2UyLFxuICAgICAgICAgICAgICAoY29vcmRbMV0gKyBjZW50ZXJbMV0gKyBvZmZzZXQyWzFdKSAqIG5vaXNlRl9zdXJmYWNlMixcbiAgICAgICAgICAgICAgKGNvb3JkWzJdICsgY2VudGVyWzJdICsgb2Zmc2V0MlsyXSkgKiBub2lzZUZfc3VyZmFjZTIpO1xuXG4gICAgICAgICAgICB2YWx1ZSA9XG4gICAgICAgICAgICAgIChNYXRoLnBvdyh2YWx1ZTIgLyAxLjUsIDEpICogZGlzQmlhcykgK1xuICAgICAgICAgICAgICAoLU1hdGgucG93KGRpc0JpYXMsIDEuMCkgKiAxLjAgKyAwLjYpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAwLjApIHtcbiAgICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgICBkYXRhLmhlaWdodCA9IHZhbHVlO1xuICAgICAgICAgICAgICBncm91bmQuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU3VyZmFjZSgpIHtcbiAgICBzdXJmYWNlTWFwLnVwZGF0ZShzZWxmKTtcbiAgfTtcblxuICBmdW5jdGlvbiBpc1N1cmZhY2UoaSwgaiwgaywgZikge1xuICAgIHZhciBkID0gTWF0aC5mbG9vcihmIC8gMik7IC8vIDAgMSAyIFxuICAgIHZhciBkZCA9IChmIC0gZCAqIDIpID8gLTEgOiAxOyAvLyAtMSBvciAxXG5cbiAgICB2YXIgY29vcmQgPSBbaSwgaiwga107XG4gICAgY29vcmRbZF0gKz0gZGQ7XG5cbiAgICByZXR1cm4gIWdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSkgJiYgIXdhdGVyLmdldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVRpbGVzKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIC8vIEdlbmVyYXRlIGdyYXNzZXNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGdyb3VuZC5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBncm91bmQuc2V0KGksIGosIGssIFtcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDApLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMSksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAyKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDMpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgNCksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCA1KVxuICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KHBvcywgZikge1xuICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKGYgLyAyKTsgLy8gMCAxIDJcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuXG4gICAgICB2YXIgZGQgPSAoZiAtIGQgKiAyKSA/IC0xIDogMTsgLy8gLTEgb3IgMVxuXG4gICAgICBjb29yZFtkXSA9IHBvc1tkXSArIGRkO1xuICAgICAgY29vcmRbdV0gPSBwb3NbdV07XG4gICAgICBjb29yZFt2XSA9IHBvc1t2XTtcblxuICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKHBvc1swXSwgcG9zWzFdLCBwb3NbMl0pO1xuICAgICAgdmFyIGJpb21lID0gZGF0YS5iaW9tZTtcblxuICAgICAgdmFyIGxldmVsID0gYmlvbWUubGV2ZWw7XG4gICAgICB2YXIgdmFsdWUgPSBiaW9tZS52YWx1ZTtcblxuICAgICAgaWYgKGxldmVsID09PSBMRVZFTF9TVVJGQUNFKSB7XG5cbiAgICAgICAgLy8gSWYgYXQgc2VhIGxldmVsLCBnZW5lcmF0ZSBzYW5kXG4gICAgICAgIGlmIChiaW9tZS5yZWxTZWFMZXZlbCA9PT0gMCkge1xuICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICB2YXIgaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICAgICAgaWYgKGJpb21lLnZhbHVlMiAqIGhlaWdodCA8IC0wLjEpIHtcbiAgICAgICAgICAgIHZhciBhYm92ZSA9IGdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gICAgICAgICAgICB2YXIgaXNTdXJmYWNlID0gIWFib3ZlO1xuICAgICAgICAgICAgaWYgKGlzU3VyZmFjZSkge1xuICAgICAgICAgICAgICByZXR1cm4gU0FORDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPCBCSU9NRV9WQUxVRV9TVE9ORSkge1xuICAgICAgICAgIHJldHVybiBTVE9ORTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IEJJT01FX1ZBTFVFX1NPSUwpIHtcbiAgICAgICAgICByZXR1cm4gU09JTDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdSQVNTXG5cbiAgICAgICAgLy8gbm8gZ3Jhc3MgYmVsb3dcbiAgICAgICAgLy8gaWYgKGJpb21lLnJlbFNlYUxldmVsID4gMCkge1xuICAgICAgICAvLyAgIHJldHVybiBTT0lMO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gT24gZWRnZVxuICAgICAgICB2YXIgZ3Jhdml0eSA9IGRhdGEuZ3Jhdml0eTtcbiAgICAgICAgaWYgKGdyYXZpdHlbZl0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBHUkFTUztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gU09JTDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PT0gTEVWRUxfTUlERExFKSB7XG5cbiAgICAgIH0gZWxzZSBpZiAobGV2ZWwgPT09IExFVkVMX0NPUkUpIHtcblxuICAgICAgfVxuXG4gICAgICByZXR1cm4gU1RPTkU7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZXREYXRhKGksIGosIGspIHtcbiAgICB2YXIgaGFzaCA9IFtpLCBqLCBrXS5qb2luKCcsJyk7XG4gICAgaWYgKGRhdGFNYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgICAgZGF0YU1hcFtoYXNoXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gZGF0YU1hcFtoYXNoXTtcbiAgfTtcblxuICB2YXIgc2VsZiA9IHtcbiAgICBncm91bmQ6IGdyb3VuZCxcbiAgICB3YXRlcjogd2F0ZXIsXG4gICAgYm91bmRzOiBib3VuZHMsXG4gICAgb2JqZWN0OiBwaXZvdCxcbiAgICBjYWxjR3Jhdml0eTogY2FsY0dyYXZpdHksXG4gICAgc3VyZmFjZU1hcDogc3VyZmFjZU1hcCxcbiAgICBncm91bmRPYmplY3Q6IGdyb3VuZE9iamVjdCxcbiAgICBnZXREYXRhOiBnZXREYXRhLFxuICAgIGlzU3VyZmFjZTogaXNTdXJmYWNlXG4gIH07XG5cbiAgc3RhcnQoKTtcblxuICByZXR1cm4gc2VsZjtcbn07XG4iLCJ2YXIgVm94ZWwgPSByZXF1aXJlKCcuLi8uLi92b3hlbCcpO1xudmFyIERpciA9IHJlcXVpcmUoJy4uLy4uL0RpcicpO1xudmFyIENodW5rcyA9IFZveGVsLkNodW5rcztcbnZhciBHcmFwaCA9IHJlcXVpcmUoJ25vZGUtZGlqa3N0cmEnKTtcblxudmFyIFN1cmZhY2VNYXAgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jaHVua3MgPSBuZXcgQ2h1bmtzKCk7XG4gIHRoaXMuZ3JhcGhNYXAgPSB7fTtcbiAgdGhpcy5ncmFwaCA9IG5ldyBHcmFwaCgpO1xuICB0aGlzLmxvb2t1cCA9IHt9O1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGVycmlhbikge1xuICB2YXIgdXBWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKTtcbiAgdmFyIGNlbnRlck9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKDAuNSwgMC41LCAwLjUpO1xuICB2YXIgZ3JvdW5kID0gdGVycmlhbi5ncm91bmQ7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBncm91bmQudmlzaXQoZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICAgIHZhciBkYXRhID0gdGVycmlhbi5nZXREYXRhKGksIGosIGspO1xuICAgIHZhciBzdXJmYWNlID0gZGF0YS5zdXJmYWNlIHx8IHt9O1xuICAgIHZhciBncmF2aXR5ID0gZGF0YS5ncmF2aXR5O1xuXG4gICAgZm9yICh2YXIgZiBpbiBncmF2aXR5KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdGVycmlhbi5pc1N1cmZhY2UoaSwgaiwgaywgZik7XG5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdmFyIHN1cmZhY2VzID0gc2VsZi5jaHVua3MuZ2V0KGksIGosIGspO1xuICAgICAgICBpZiAoc3VyZmFjZXMgPT0gbnVsbCkge1xuICAgICAgICAgIHN1cmZhY2VzID0ge307XG4gICAgICAgICAgc2VsZi5jaHVua3Muc2V0KGksIGosIGssIHN1cmZhY2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1bml0VmVjdG9yID0gRGlyLmdldFVuaXRWZWN0b3IoZikubXVsdGlwbHlTY2FsYXIoLTEpO1xuICAgICAgICB2YXIgcG9zaXRpb25BYm92ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKGksIGosIGspLmFkZCh1bml0VmVjdG9yKS5hZGQoY2VudGVyT2Zmc2V0KTtcbiAgICAgICAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyh1cFZlY3RvciwgdW5pdFZlY3Rvcik7XG4gICAgICAgIHZhciBpbnZlcnNlUXVhdCA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbVVuaXRWZWN0b3JzKHVuaXRWZWN0b3IsIHVwVmVjdG9yKTtcblxuICAgICAgICB2YXIgaGFzaCA9IFtpLCBqLCBrLCBmXS5qb2luKCcsJyk7XG4gICAgICAgIHN1cmZhY2VzW2ZdID0ge1xuICAgICAgICAgIGNvb3JkOiBbaSwgaiwga10sXG4gICAgICAgICAgaGFzaDogaGFzaCxcbiAgICAgICAgICBmYWNlOiBmLFxuICAgICAgICAgIHBvc2l0aW9uQWJvdmU6IHBvc2l0aW9uQWJvdmUsXG4gICAgICAgICAgcXVhdDogcXVhdCxcbiAgICAgICAgICBpbnZlcnNlUXVhdDogaW52ZXJzZVF1YXQsXG4gICAgICAgICAgY29ubmVjdGlvbnM6IHt9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmxvb2t1cFtoYXNoXSA9IHN1cmZhY2VzW2ZdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLnZpc2l0KGZ1bmN0aW9uKHN1cmZhY2UpIHtcbiAgICBzZWxmLnVwZGF0ZUNvbm5lY3Rpb25zKHN1cmZhY2UpO1xuICB9KTtcblxuICB0aGlzLmdyYXBoID0gbmV3IEdyYXBoKHRoaXMuZ3JhcGhNYXApO1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUudXBkYXRlQ29ubmVjdGlvbnMgPSBmdW5jdGlvbihzdXJmYWNlKSB7XG4gIHZhciBjb29yZCA9IHN1cmZhY2UuY29vcmQ7XG4gIHZhciBmID0gc3VyZmFjZS5mYWNlO1xuICB2YXIgZCA9IE1hdGguZmxvb3Ioc3VyZmFjZS5mYWNlIC8gMik7XG4gIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gIHZhciB2ID0gKGQgKyAyKSAlIDM7XG5cbiAgZm9yICh2YXIgaSA9IC0xOyBpIDw9IDE7IGkrKykge1xuICAgIGZvciAodmFyIGogPSAtMTsgaiA8PSAxOyBqKyspIHtcbiAgICAgIGZvciAodmFyIGsgPSAtMTsgayA8PSAxOyBrKyspIHtcbiAgICAgICAgdmFyIGNvb3JkMiA9IFtjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdXTtcbiAgICAgICAgY29vcmQyW2RdICs9IGk7XG4gICAgICAgIGNvb3JkMlt1XSArPSBqO1xuICAgICAgICBjb29yZDJbdl0gKz0gaztcbiAgICAgICAgdmFyIHN1cmZhY2VzID0gdGhpcy5nZXRBdChjb29yZDJbMF0sIGNvb3JkMlsxXSwgY29vcmQyWzJdKTtcbiAgICAgICAgdmFyIGZvcndhcmRWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKTtcblxuICAgICAgICBmb3IgKHZhciBmMiBpbiBzdXJmYWNlcykge1xuICAgICAgICAgIHZhciBzdXJmYWNlMiA9IHN1cmZhY2VzW2YyXTtcblxuICAgICAgICAgIGlmIChzdXJmYWNlID09PSBzdXJmYWNlMikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGRpc1ZlY3RvciA9IHN1cmZhY2UyLnBvc2l0aW9uQWJvdmUuY2xvbmUoKS5zdWIoc3VyZmFjZS5wb3NpdGlvbkFib3ZlKTtcbiAgICAgICAgICB2YXIgZGlzID0gZGlzVmVjdG9yLmxlbmd0aCgpO1xuICAgICAgICAgIHZhciBxdWF0VmVjdG9yID0gZGlzVmVjdG9yLmNsb25lKCkubm9ybWFsaXplKCk7XG4gICAgICAgICAgdmFyIHF1YXRWZWN0b3JBcnJheSA9IHF1YXRWZWN0b3IudG9BcnJheSgpO1xuICAgICAgICAgIHF1YXRWZWN0b3JBcnJheVtkXSA9IDA7XG4gICAgICAgICAgcXVhdFZlY3RvclxuICAgICAgICAgICAgLmZyb21BcnJheShxdWF0VmVjdG9yQXJyYXkpXG4gICAgICAgICAgICAubm9ybWFsaXplKClcbiAgICAgICAgICAgIC5hcHBseVF1YXRlcm5pb24oc3VyZmFjZS5pbnZlcnNlUXVhdCk7XG5cbiAgICAgICAgICBpZiAoZGlzIDwgMikge1xuICAgICAgICAgICAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyhcbiAgICAgICAgICAgICAgZm9yd2FyZFZlY3RvcixcbiAgICAgICAgICAgICAgcXVhdFZlY3Rvcik7XG4gICAgICAgICAgICBzdXJmYWNlLmNvbm5lY3Rpb25zW3N1cmZhY2UyLmhhc2hdID0ge1xuICAgICAgICAgICAgICBzdXJmYWNlOiBzdXJmYWNlMixcbiAgICAgICAgICAgICAgZGlzOiBkaXMsXG4gICAgICAgICAgICAgIHF1YXQ6IHF1YXRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdyYXBoTWFwW3N1cmZhY2UuaGFzaF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLmdyYXBoTWFwW3N1cmZhY2UuaGFzaF0gPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ3JhcGhNYXBbc3VyZmFjZS5oYXNoXVtzdXJmYWNlMi5oYXNoXSA9IGRpcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblN1cmZhY2VNYXAucHJvdG90eXBlLmZpbmRTaG9ydGVzdCA9IGZ1bmN0aW9uKHN1cmZhY2UsIHN1cmZhY2UyLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge1xuICAgIGdldERpc3RhbmNlOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgICB2YXIgZGlzRGlmZlJhdGlvID0gMTAuMFxuICAgICAgdmFyIHN1cmZhY2VBID0gc2VsZi5nZXRXaXRoSGFzaChhKTtcbiAgICAgIHZhciBzdXJmYWNlQiA9IHNlbGYuZ2V0V2l0aEhhc2goYik7XG4gICAgICBpZiAoc3VyZmFjZUEuYmxvY2tlZCB8fCBzdXJmYWNlQi5ibG9ja2VkKSB7XG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgIH1cbiAgICAgIHZhciBkZXN0ID0gc3VyZmFjZTI7XG5cbiAgICAgIHZhciBkaXMgPSBzZWxmLmdyYXBoTWFwW2FdW2JdO1xuXG4gICAgICB2YXIgZGlzRGlmZiA9IChzdXJmYWNlQi5wb3NpdGlvbkFib3ZlLmNsb25lKCkuZGlzdGFuY2VUbyhkZXN0LnBvc2l0aW9uQWJvdmUpKSAtXG4gICAgICAgIChzdXJmYWNlQS5wb3NpdGlvbkFib3ZlLmNsb25lKCkuZGlzdGFuY2VUbyhkZXN0LnBvc2l0aW9uQWJvdmUpKTtcblxuICAgICAgcmV0dXJuIGRpcyArIGRpc0RpZmYgKiBkaXNEaWZmUmF0aW87XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzLmdyYXBoLnNob3J0ZXN0UGF0aChzdXJmYWNlLmhhc2gsIHN1cmZhY2UyLmhhc2gsIG9wdGlvbnMpO1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUuZ2V0QXQgPSBmdW5jdGlvbihpLCBqLCBrKSB7XG4gIHJldHVybiB0aGlzLmNodW5rcy5nZXQoaSwgaiwgaykgfHwge307XG59O1xuXG5TdXJmYWNlTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpLCBqLCBrLCBmKSB7XG4gIHJldHVybiB0aGlzLmdldEF0KGksIGosIGspW2ZdO1xufTtcblxuU3VyZmFjZU1hcC5wcm90b3R5cGUuZ2V0V2l0aEhhc2ggPSBmdW5jdGlvbihoYXNoKSB7XG4gIHJldHVybiB0aGlzLmxvb2t1cFtoYXNoXTtcbn07XG5cblN1cmZhY2VNYXAucHJvdG90eXBlLnZpc2l0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdGhpcy5jaHVua3MudmlzaXQoZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICAgIGZvciAodmFyIGYgaW4gdikge1xuICAgICAgY2FsbGJhY2sodltmXSk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3VyZmFjZU1hcDtcbiIsInZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFZveGVsID0gcmVxdWlyZSgnLi4vLi4vdm94ZWwnKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuLi8uLi9kaXInKTtcblxudmFyIENodW5rcyA9IFZveGVsLkNodW5rcztcbnZhciB2aXNpdFNoYXBlID0gVm94ZWwudmlzaXRTaGFwZTtcbnZhciBtZXNoQ2h1bmtzID0gVm94ZWwubWVzaENodW5rcztcbnZhciBjb3B5Q2h1bmtzID0gVm94ZWwuY29weUNodW5rcztcbnZhciByZW1vdmVGbG9hdGluZyA9IFZveGVsLnJlbW92ZUZsb2F0aW5nO1xuXG52YXIgVFJVTksgPSBbMjAsIDIwLCAyMCwgMjAsIDIwLCAyMF07XG52YXIgTEVBRiA9IFsyMSwgMjEsIDIxLCAyMSwgMjEsIDIxXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJlbnQsIGJsb2NrTWF0ZXJpYWwsIHRlcnJpYW4pIHtcbiAgdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcblxuICB2YXIgc3BhcnNlID0gMC4yO1xuICB2YXIgdHJlZU51bSA9IDAuNTtcblxuICBmdW5jdGlvbiBhZGQoY29vcmQsIGRpcikge1xuXG4gICAgdmFyIGNodW5rczIgPSByZXF1aXJlKCcuL3BpbmUnKShjb29yZCwgZGlyKTtcblxuICAgIGNvcHlDaHVua3MoY2h1bmtzMiwgY2h1bmtzLCBjb29yZCk7XG4gICAgbWVzaENodW5rcyhjaHVua3MsIG9iamVjdCwgYmxvY2tNYXRlcmlhbCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgdmFyIGludmVyc2VTY2FsZSA9IDEgLyBzZWxmLnNjYWxlO1xuICAgIG9iamVjdC5zY2FsZS5zZXQoc2VsZi5zY2FsZSwgc2VsZi5zY2FsZSwgc2VsZi5zY2FsZSk7XG4gICAgcGFyZW50LmFkZChvYmplY3QpO1xuXG4gICAgdGVycmlhbi5zdXJmYWNlTWFwLnZpc2l0KGZ1bmN0aW9uKHN1cmZhY2UpIHtcbiAgICAgIHZhciBkYXRhID0gdGVycmlhbi5nZXREYXRhKHN1cmZhY2UuY29vcmRbMF0sIHN1cmZhY2UuY29vcmRbMV0sIHN1cmZhY2UuY29vcmRbMl0pO1xuXG4gICAgICAvLyBObyB0cmVlcyB1bmRlciBzZWEgbGV2ZWxcbiAgICAgIGlmIChkYXRhLmJpb21lLnJlbFNlYUxldmVsID4gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEhvdyBzcGFyc2UgdHJlZXMgc2hvdWxkIGJlXG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IHNwYXJzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLmJpb21lLnRyZWUgPCB0cmVlTnVtKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGYgPSBEaXIuZ2V0T3Bwb3NpdGUoc3VyZmFjZS5mYWNlKTtcblxuICAgICAgLy8gU3RhcnQgZnJvbSBjZW50ZXIgb2YgYmxvY2ssIGV4dGVuZCBmb3IgaGFsZiBhIGJsb2NrXG4gICAgICB2YXIgY29vcmQgPVxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMyhzdXJmYWNlLmNvb3JkWzBdLCBzdXJmYWNlLmNvb3JkWzFdLCBzdXJmYWNlLmNvb3JkWzJdKVxuICAgICAgICAuYWRkKG5ldyBUSFJFRS5WZWN0b3IzKDAuNSwgMC41LCAwLjUpKVxuICAgICAgICAuYWRkKERpci5nZXRVbml0VmVjdG9yKGYpLm11bHRpcGx5U2NhbGFyKDAuNSkpO1xuXG4gICAgICAvLyByYW5kb21pemUgdXYgY29vcmRcbiAgICAgIHZhciBkID0gTWF0aC5mbG9vcihmIC8gMik7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcblxuICAgICAgdmFyIHV2ID0gWzAsIDAsIDBdO1xuXG4gICAgICBjb29yZC5hZGQobmV3IFRIUkVFLlZlY3RvcjMoKS5mcm9tQXJyYXkodXYpKTtcblxuICAgICAgLy8gMSB0cmVlIHBlciB0ZXJyaWFuIGdyaWRcbiAgICAgIGNvb3JkLm11bHRpcGx5U2NhbGFyKDEgLyBzZWxmLnNjYWxlKTtcblxuICAgICAgY29vcmQueCA9IE1hdGgucm91bmQoY29vcmQueCk7XG4gICAgICBjb29yZC55ID0gTWF0aC5yb3VuZChjb29yZC55KTtcbiAgICAgIGNvb3JkLnogPSBNYXRoLnJvdW5kKGNvb3JkLnopO1xuXG4gICAgICB2YXIgYXJyYXkgPSBjb29yZC50b0FycmF5KCk7XG4gICAgICBhcnJheVt1XSAtPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpbnZlcnNlU2NhbGUpO1xuICAgICAgYXJyYXlbdl0gLT0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaW52ZXJzZVNjYWxlKTtcbiAgICAgIGNvb3JkLmZyb21BcnJheShhcnJheSk7XG5cbiAgICAgIGFkZChjb29yZCwgZik7XG5cbiAgICAgIHN1cmZhY2UuYmxvY2tlZCA9IHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICB2YXIgc2VsZiA9IHtcbiAgICBhZGQ6IGFkZCxcbiAgICBvYmplY3Q6IG9iamVjdCxcbiAgICBzY2FsZTogKDEgLyAyLjApXG4gIH07XG5cbiAgc3RhcnQoKTtcblxuICByZXR1cm4gc2VsZjtcbn07IiwidmFyIERpciA9IHJlcXVpcmUoJy4uLy4uL2RpcicpO1xudmFyIFZveGVsID0gcmVxdWlyZSgnLi4vLi4vdm94ZWwnKTtcbnZhciBDaHVua3MgPSBWb3hlbC5DaHVua3M7XG52YXIgdmlzaXRTaGFwZSA9IFZveGVsLnZpc2l0U2hhcGU7XG52YXIgcmVtb3ZlRmxvYXRpbmcgPSBWb3hlbC5yZW1vdmVGbG9hdGluZztcblxudmFyIExFQUYgPSBbMjEsIDIxLCAyMSwgMjEsIDIxLCAyMV07XG52YXIgVFJVTksgPSBbMjAsIDIwLCAyMCwgMjAsIDIwLCAyMF07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29vcmQsIGRpcikge1xuICAvLyBMZWFmIGhlaWdodCAvIHdpZHRoXG4gIHZhciBzaGFwZVJhdGlvID0gMjtcbiAgLy8gRGVuc2l0eSBvZiBsZWFmc1xuICB2YXIgZGVuc2l0eSA9IDAuOTtcbiAgLy8gVmFyaWFibGUgc2l6ZVxuICB2YXIgdmFyU2l6ZSA9IDM7XG4gIC8vIEJhc2Ugc2l6ZVxuICB2YXIgYmFzZVNpemUgPSAzO1xuICAvLyBDdXJ2ZSBmb3IgdmFyaWFibGUgc2l6ZVxuICB2YXIgdmFyU2l6ZUN1cnZlID0gMi4wO1xuXG4gIHZhciByYW4gPSBNYXRoLnJhbmRvbSgpO1xuICB2YXIgcmFkaXVzID0gTWF0aC5wb3cocmFuLCB2YXJTaXplQ3VydmUpICogdmFyU2l6ZSArIGJhc2VTaXplO1xuICB2YXIgc2hhcGUyID0gcmFkaXVzICogc2hhcGVSYXRpbztcbiAgdmFyIGxlYWZIZWlnaHQgPSByYW4gPCAwLjUgPyAyIDogMztcbiAgdmFyIHRydW5rSGVpZ2h0ID0gbGVhZkhlaWdodCArIHNoYXBlMiAtIDQ7XG5cbiAgdmFyIHJhZGl1cyA9IHJhZGl1cyAqIE1hdGguc3FydCgyKSAvIDI7XG5cbiAgaWYgKGRpciA9PSBudWxsKSB7XG4gICAgdmFyIHRlcnJpYW5Db29yZCA9IGNvb3JkLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2VsZi5zY2FsZSk7XG4gICAgdmFyIGdyYXZpdHkgPSB0ZXJyaWFuLmNhbGNHcmF2aXR5KHRlcnJpYW5Db29yZC54LCB0ZXJyaWFuQ29vcmQueSwgdGVycmlhbkNvb3JkLnopO1xuICAgIGRpciA9IERpci5nZXRPcHBvc2l0ZShncmF2aXR5W01hdGguZmxvb3IoZ3Jhdml0eS5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV0pO1xuICB9XG5cbiAgdmFyIHVwVmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCk7XG4gIHZhciB1bml0VmVjdG9yID0gRGlyLmdldFVuaXRWZWN0b3IoZGlyKTtcbiAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyh1cFZlY3RvciwgdW5pdFZlY3Rvcik7XG4gIHZhciBkID0gTWF0aC5mbG9vcihkaXIgLyAyKTtcbiAgdmFyIHNpZGUgPSBkaXIgJSAyID09PSAwO1xuXG4gIHZhciBsZWFmU2hhcGUgPSBbcmFkaXVzLCBzaGFwZTIsIHJhZGl1c107XG5cbiAgdmFyIGxlYWZDZW50ZXIgPSBbXG4gICAgTWF0aC5yb3VuZCgtbGVhZlNoYXBlWzBdIC8gMiksXG4gICAgTWF0aC5yb3VuZCgtbGVhZlNoYXBlWzFdIC8gMiksXG4gICAgTWF0aC5yb3VuZCgtbGVhZlNoYXBlWzJdIC8gMilcbiAgXTtcblxuICB2YXIgY2h1bmtzMiA9IG5ldyBDaHVua3MoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRydW5rSGVpZ2h0OyBpKyspIHtcbiAgICB2YXIgYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIGksIDApLmFwcGx5UXVhdGVybmlvbihxdWF0KTtcbiAgICBpZiAoc2lkZSkge1xuICAgICAgYy5hZGQodW5pdFZlY3Rvcik7XG4gICAgfVxuXG4gICAgcm91bmRWZWN0b3IoYyk7XG4gICAgY2h1bmtzMi5zZXQoYy54LCBjLnksIGMueiwgVFJVTkspO1xuICB9XG5cbiAgdmlzaXRTaGFwZShsZWFmU2hhcGUsIGZ1bmN0aW9uKGksIGosIGspIHtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IGRlbnNpdHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGMgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgIGxlYWZDZW50ZXJbMF0gKyBpLFxuICAgICAgbGVhZkhlaWdodCArIGosXG4gICAgICBsZWFmQ2VudGVyWzJdICsga1xuICAgICk7XG5cbiAgICB2YXIgZGlzID0gTWF0aC5zcXJ0KGMueCAqIGMueCArIGMueiAqIGMueik7XG4gICAgdmFyIG1heERpcyA9IChzaGFwZTIgLSBqKSAvIHNoYXBlMiAqIHJhZGl1cztcblxuICAgIHZhciBkaWZmID0gbWF4RGlzIC0gZGlzO1xuICAgIGlmIChkaWZmIDwgMC4wKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRpZmYgPCAwLjUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjLmFwcGx5UXVhdGVybmlvbihxdWF0KTtcblxuICAgIHJvdW5kVmVjdG9yKGMpO1xuXG4gICAgaWYgKHNpZGUpIHtcbiAgICAgIGMuYWRkKHVuaXRWZWN0b3IpO1xuICAgIH1cblxuICAgIGNodW5rczIuc2V0KGMueCwgYy55LCBjLnosIExFQUYpO1xuICB9KTtcblxuICByZW1vdmVGbG9hdGluZyhjaHVua3MyLCBbMCwgMCwgMF0pO1xuXG4gIHJldHVybiBjaHVua3MyO1xufTtcblxuZnVuY3Rpb24gcm91bmRWZWN0b3Iodikge1xuICB2LnggPSBNYXRoLnJvdW5kKHYueCk7XG4gIHYueSA9IE1hdGgucm91bmQodi55KTtcbiAgdi56ID0gTWF0aC5yb3VuZCh2LnopO1xuICByZXR1cm4gdjtcbn07XG4iLCJ2YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBrZXljb2RlID0gcmVxdWlyZSgna2V5Y29kZScpO1xudmFyIERpciA9IHJlcXVpcmUoJy4vZGlyJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcbnZhciBhcHAgPSB7fTtcbnZhciBlbnYgPSBjb25maWcuZW52IHx8ICdwcm9kdWN0aW9uJztcblxuLy8gSW5pdCBzdGF0c1xuaWYgKGVudiA9PT0gJ2RldicpIHtcbiAgdmFyIHN0YXRzID0gbmV3IFN0YXRzKCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcbn1cblxuLy8gUG9zdCBwcm9jZXNzaW5nIHNldHRpbmdcbnZhciBwb3N0cHJvY2Vzc2luZyA9IHsgZW5hYmxlZDogdHJ1ZSwgcmVuZGVyTW9kZTogMCB9O1xuXG4vLyBSZW5kZXJlciwgc2NlbmUsIGNhbWVyYVxudmFyIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweEJCRDlGNyk7XG5cbnZhciBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xudmFyIGZvdiA9IDYwO1xudmFyIHpvb21TcGVlZCA9IDEuMTtcbnZhciBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoZm92LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgMC4xLCAxMDAwKTtcbnZhciBjYW1lcmFVcCwgY2FtZXJhRGlyLCBjYW1lcmFSaWdodDtcblxuLy8gUG9zdCBwcm9jZXNzaW5nXG52YXIgZGVwdGhNYXRlcmlhbDtcbnZhciBkZXB0aFJlbmRlclRhcmdldDtcbnZhciBzc2FvUGFzcztcbnZhciBlZmZlY3RDb21wb3NlcjtcbnZhciBmaW5hbENvbXBvc2VyO1xuXG4vLyBTaXplXG52YXIgc2l6ZSA9IDE2O1xudmFyIG1vZGVsU2l6ZSA9IDU7XG52YXIgZGlzU2NhbGUgPSAxLjIgKiBtb2RlbFNpemU7XG5cbi8vIE9iamVjdHNcbnZhciBvYmplY3Q7XG52YXIgbm9Bb0xheWVyO1xuXG52YXIgZW50aXRpZXMgPSBbXTtcblxuLy8gTWF0ZXJpYWxzLCBUZXh0dXJlc1xudmFyIGJsb2NrTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTXVsdGlNYXRlcmlhbCgpO1xuYmxvY2tNYXRlcmlhbC5tYXRlcmlhbHMgPSBbbnVsbF07XG52YXIgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG52YXIgYmxvY2tUZXh0dXJlcyA9IFtdO1xudmFyIHRleHR1cmVzID0ge307XG5cbi8vIElucHV0IHN0YXRlc1xudmFyIGtleWhvbGRzID0ge307XG52YXIgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xudmFyIHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoKTtcbnZhciByYXljYXN0ZXJEaXI7XG5cbi8vIGZyYW1lIHRpbWVcbnZhciBkdCA9IDEgLyA2MDtcblxuZnVuY3Rpb24gaW5pdFBvc3Rwcm9jZXNzaW5nKCkge1xuICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgdmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAvLyBTZXR1cCByZW5kZXIgcGFzc1xuICB2YXIgcmVuZGVyUGFzcyA9IG5ldyBUSFJFRS5SZW5kZXJQYXNzKHNjZW5lLCBjYW1lcmEpO1xuXG4gIC8vIFNldHVwIGRlcHRoIHBhc3NcbiAgZGVwdGhNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoRGVwdGhNYXRlcmlhbCgpO1xuICBkZXB0aE1hdGVyaWFsLmRlcHRoUGFja2luZyA9IFRIUkVFLlJHQkFEZXB0aFBhY2tpbmc7XG4gIGRlcHRoTWF0ZXJpYWwuYmxlbmRpbmcgPSBUSFJFRS5Ob0JsZW5kaW5nO1xuXG4gIHZhciBwYXJzID0geyBtaW5GaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciwgbWFnRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIgfTtcbiAgZGVwdGhSZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwgcGFycyk7XG5cbiAgLy8gU2V0dXAgU1NBTyBwYXNzXG4gIHNzYW9QYXNzID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuU1NBT1NoYWRlcik7XG5cbiAgLy9zc2FvUGFzcy51bmlmb3Jtc1sgXCJ0RGlmZnVzZVwiIF0udmFsdWUgd2lsbCBiZSBzZXQgYnkgU2hhZGVyUGFzc1xuICBzc2FvUGFzcy51bmlmb3Jtc1tcInREZXB0aFwiXS52YWx1ZSA9IGRlcHRoUmVuZGVyVGFyZ2V0LnRleHR1cmU7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydzaXplJ10udmFsdWUuc2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snY2FtZXJhTmVhciddLnZhbHVlID0gY2FtZXJhLm5lYXI7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydjYW1lcmFGYXInXS52YWx1ZSA9IGNhbWVyYS5mYXI7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydvbmx5QU8nXS52YWx1ZSA9IChwb3N0cHJvY2Vzc2luZy5yZW5kZXJNb2RlID09IDEpO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snYW9DbGFtcCddLnZhbHVlID0gMTAwLjA7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydsdW1JbmZsdWVuY2UnXS52YWx1ZSA9IDAuNztcbiAgc3Nhb1Bhc3MucmVuZGVyVG9TY3JlZW4gPSB0cnVlO1xuXG4gIC8vIEFkZCBwYXNzIHRvIGVmZmVjdCBjb21wb3NlclxuICBlZmZlY3RDb21wb3NlciA9IG5ldyBUSFJFRS5FZmZlY3RDb21wb3NlcihyZW5kZXJlcik7XG4gIGVmZmVjdENvbXBvc2VyLmFkZFBhc3MocmVuZGVyUGFzcyk7XG4gIGVmZmVjdENvbXBvc2VyLmFkZFBhc3Moc3Nhb1Bhc3MpO1xufTtcblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAvLyBSZXNpemUgcmVuZGVyVGFyZ2V0c1xuICBzc2FvUGFzcy51bmlmb3Jtc1snc2l6ZSddLnZhbHVlLnNldCh3aWR0aCwgaGVpZ2h0KTtcblxuICB2YXIgcGl4ZWxSYXRpbyA9IHJlbmRlcmVyLmdldFBpeGVsUmF0aW8oKTtcbiAgdmFyIG5ld1dpZHRoID0gTWF0aC5mbG9vcih3aWR0aCAvIHBpeGVsUmF0aW8pIHx8IDE7XG4gIHZhciBuZXdIZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCAvIHBpeGVsUmF0aW8pIHx8IDE7XG4gIGRlcHRoUmVuZGVyVGFyZ2V0LnNldFNpemUobmV3V2lkdGgsIG5ld0hlaWdodCk7XG4gIGVmZmVjdENvbXBvc2VyLnNldFNpemUobmV3V2lkdGgsIG5ld0hlaWdodCk7XG59O1xuXG5mdW5jdGlvbiBpbml0U2NlbmUoKSB7XG4gIHZhciBkaXMgPSBzaXplICogZGlzU2NhbGU7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gZGlzO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IGRpcztcbiAgY2FtZXJhLnBvc2l0aW9uLnogPSBkaXM7XG4gIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoKSk7XG5cbiAgY2FtZXJhVXAgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKTtcbiAgY2FtZXJhRGlyID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSkuYXBwbHlFdWxlcihjYW1lcmEucm90YXRpb24pO1xuICBjYW1lcmFSaWdodCA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY3Jvc3NWZWN0b3JzKGNhbWVyYVVwLCBjYW1lcmFEaXIpO1xuXG4gIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBvYmplY3Quc2NhbGUuc2V0KG1vZGVsU2l6ZSwgbW9kZWxTaXplLCBtb2RlbFNpemUpO1xuICBzY2VuZS5hZGQob2JqZWN0KTtcbiAgbm9Bb0xheWVyID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIG9iamVjdC5hZGQobm9Bb0xheWVyKTtcbiAgdmFyIGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg4ODg4ODgpO1xuICBvYmplY3QuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgdmFyIGRpcmVjdGlvbmFsTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC42KTtcbiAgZGlyZWN0aW9uYWxMaWdodC5wb3NpdGlvbi5zZXQoMC4zLCAxLjAsIDAuNSk7XG4gIG9iamVjdC5hZGQoZGlyZWN0aW9uYWxMaWdodCk7XG5cbiAgdmFyIGRpcmVjdGlvbmFsTGlnaHQyID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuNik7XG4gIGRpcmVjdGlvbmFsTGlnaHQyLnBvc2l0aW9uLnNldCgtMC4zLCAtMS4wLCAtMC41KTtcbiAgb2JqZWN0LmFkZChkaXJlY3Rpb25hbExpZ2h0Mik7XG59O1xuXG5mdW5jdGlvbiBsb2FkUmVzb3VyY2VzKCkge1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnZ3Jhc3MnLCAxKTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NvaWwnLCAyKTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NvaWwyJywgMyk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzdG9uZScsIDQpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnc2VhJywgNSwgMC44KTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NhbmQnLCA2KTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3dhbGwnLCA3KTtcblxuICBsb2FkQmxvY2tNYXRlcmlhbCgnd2luZG93JywgOCwgMC44KTtcblxuICBsb2FkQmxvY2tNYXRlcmlhbCgnY2xvdWQnLCAxMCwgMC43KTtcblxuICBsb2FkQmxvY2tNYXRlcmlhbCgndHJ1bmsnLCAyMCk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdsZWFmJywgMjEpO1xuXG4gIGxvYWRCbG9ja01hdGVyaWFsKCdnbG93JywgMzAsIG51bGwpO1xufTtcblxuZnVuY3Rpb24gbG9hZEJsb2NrTWF0ZXJpYWwobmFtZSwgaW5kZXgsIGFscGhhKSB7XG4gIHZhciB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKCd0ZXh0dXJlcy8nICsgbmFtZSArICcucG5nJyk7XG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICB0ZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gIHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgYmxvY2tUZXh0dXJlcy5wdXNoKHRleHR1cmUpO1xuXG4gIHZhciBtID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG5cbiAgaWYgKGFscGhhICE9IG51bGwpIHtcbiAgICBtLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICBtLm9wYWNpdHkgPSBhbHBoYTtcbiAgfVxuXG4gIGJsb2NrTWF0ZXJpYWwubWF0ZXJpYWxzW2luZGV4XSA9IG07XG5cbiAgcmV0dXJuIG07XG59O1xuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIGlmIChlbnYgPT09ICdkZXYnKSB7XG4gICAgc3RhdHMuYmVnaW4oKTtcbiAgfVxuXG4gIGlmIChwb3N0cHJvY2Vzc2luZy5lbmFibGVkKSB7XG4gICAgLy8gUmVuZGVyIGRlcHRoIGludG8gZGVwdGhSZW5kZXJUYXJnZXRcbiAgICBub0FvTGF5ZXIudmlzaWJsZSA9IGZhbHNlO1xuICAgIHNjZW5lLm92ZXJyaWRlTWF0ZXJpYWwgPSBkZXB0aE1hdGVyaWFsO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhLCBkZXB0aFJlbmRlclRhcmdldCwgdHJ1ZSk7XG4gICAgbm9Bb0xheWVyLnZpc2libGUgPSB0cnVlO1xuICAgIHNjZW5lLm92ZXJyaWRlTWF0ZXJpYWwgPSBudWxsO1xuXG4gICAgZWZmZWN0Q29tcG9zZXIucmVuZGVyKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICB9XG5cbiAgdmFyIHJvdGF0ZVkgPSAwO1xuICBpZiAoa2V5aG9sZHNbJ3JpZ2h0J10pIHtcbiAgICByb3RhdGVZIC09IDAuMTtcbiAgfSBlbHNlIGlmIChrZXlob2xkc1snbGVmdCddKSB7XG4gICAgcm90YXRlWSArPSAwLjE7XG4gIH1cblxuICB2YXIgcXVhdEludmVyc2UgPSBvYmplY3QucXVhdGVybmlvbi5jbG9uZSgpLmludmVyc2UoKTtcbiAgdmFyIGF4aXMgPSBjYW1lcmFVcC5jbG9uZSgpLmFwcGx5UXVhdGVybmlvbihxdWF0SW52ZXJzZSkubm9ybWFsaXplKCk7XG4gIG9iamVjdC5xdWF0ZXJuaW9uXG4gICAgLm11bHRpcGx5KG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZShheGlzLCByb3RhdGVZKSk7XG5cbiAgdmFyIHJvdGF0ZVggPSAwO1xuICBpZiAoa2V5aG9sZHNbJ3VwJ10pIHtcbiAgICByb3RhdGVYIC09IDAuMTtcbiAgfSBlbHNlIGlmIChrZXlob2xkc1snZG93biddKSB7XG4gICAgcm90YXRlWCArPSAwLjE7XG4gIH1cblxuICBheGlzID0gY2FtZXJhUmlnaHQuY2xvbmUoKS5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpLm5vcm1hbGl6ZSgpO1xuICBvYmplY3QucXVhdGVybmlvblxuICAgIC5tdWx0aXBseShuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUoYXhpcywgcm90YXRlWCkpO1xuXG4gIGlmIChlbnYgPT09ICdkZXYnKSB7XG4gICAgc3RhdHMuZW5kKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIGVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgZW50aXR5LnRpY2soZHQpO1xuICB9KTtcbiAgcmVuZGVyKCk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn07XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlLnggPSAoZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIDIgLSAxO1xuICBtb3VzZS55ID0gLShldmVudC5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSAqIDIgKyAxO1xuXG4gIC8vIHVwZGF0ZSB0aGUgcGlja2luZyByYXkgd2l0aCB0aGUgY2FtZXJhIGFuZCBtb3VzZSBwb3NpdGlvbiAgXG4gIHJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKG1vdXNlLCBjYW1lcmEpO1xuICByYXljYXN0ZXJEaXIgPSByYXljYXN0ZXIucmF5LmRpcmVjdGlvbi5jbG9uZSgpO1xufTtcblxuZnVuY3Rpb24gb25Nb3VzZURvd24oZXZlbnQpIHtcbiAgaWYgKHRlcnJpYW4gPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGNhbGN1bGF0ZSBvYmplY3RzIGludGVyc2VjdGluZyB0aGUgcGlja2luZyByYXlcbiAgdmFyIGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0KHRlcnJpYW4ub2JqZWN0LCB0cnVlKTtcbiAgaWYgKGludGVyc2VjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHBvaW50ID0gaW50ZXJzZWN0c1swXS5wb2ludC5jbG9uZSgpXG4gICAgLmFkZChyYXljYXN0ZXJEaXIuY2xvbmUoKS5tdWx0aXBseVNjYWxhcigtMC4wMSkpO1xuXG4gIHZhciBsb2NhbFBvaW50ID0gdGVycmlhbi5vYmplY3Qud29ybGRUb0xvY2FsKHBvaW50KTtcbiAgdmFyIGNvb3JkID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgTWF0aC5mbG9vcihsb2NhbFBvaW50LngpLFxuICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC55KSxcbiAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQueilcbiAgKTtcblxuICB2YXIgcG9pbnQyID0gaW50ZXJzZWN0c1swXS5wb2ludC5jbG9uZSgpXG4gICAgLmFkZChyYXljYXN0ZXJEaXIuY2xvbmUoKS5tdWx0aXBseVNjYWxhcigwLjAxKSk7XG4gIHZhciBsb2NhbFBvaW50MiA9IHRlcnJpYW4ub2JqZWN0LndvcmxkVG9Mb2NhbChwb2ludDIpO1xuICB2YXIgY29vcmQyID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgTWF0aC5mbG9vcihsb2NhbFBvaW50Mi54KSxcbiAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQyLnkpLFxuICAgIE1hdGguZmxvb3IobG9jYWxQb2ludDIueilcbiAgKTtcblxuICB2YXIgdW5pdFZlY3RvciA9IGNvb3JkMi5jbG9uZSgpLnN1Yihjb29yZCk7XG4gIHZhciBmID0gRGlyLnVuaXRWZWN0b3JUb0Rpcih1bml0VmVjdG9yKTtcbiAgaWYgKGYgIT0gbnVsbCkge1xuICAgIG9uQ2xpY2tlZFN1cmZhY2UoZXZlbnQsIGNvb3JkMiwgZik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIG9uQ2xpY2tlZFN1cmZhY2UoZXZlbnQsIGNvb3JkLCBmKSB7XG4gIFxufTtcblxuZnVuY3Rpb24gb25Nb3VzZVVwKGV2ZW50KSB7XG5cbn07XG5cbmZ1bmN0aW9uIG9uS2V5RG93bihlKSB7XG4gIHZhciBrZXkgPSBrZXljb2RlKGUpO1xuICBrZXlob2xkc1trZXldID0gdHJ1ZTtcblxuICBpZiAoa2V5ID09PSAnZycpIHtcbiAgICB0ZXJyaWFuLmdyb3VuZE9iamVjdC52aXNpYmxlID0gIXRlcnJpYW4uZ3JvdW5kT2JqZWN0LnZpc2libGU7XG4gIH1cblxuICBpZiAoa2V5ID09PSAnPScpIHtcbiAgICBjYW1lcmEuZm92IC89IHpvb21TcGVlZDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB9XG5cbiAgaWYgKGtleSA9PT0gJy0nKSB7XG4gICAgY2FtZXJhLmZvdiAqPSB6b29tU3BlZWQ7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gb25LZXlVcChlKSB7XG4gIHZhciBrZXkgPSBrZXljb2RlKGUpO1xuICBrZXlob2xkc1trZXldID0gZmFsc2U7XG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xuXG5sb2FkUmVzb3VyY2VzKCk7XG5pbml0UG9zdHByb2Nlc3NpbmcoKTtcbmluaXRTY2VuZSgpO1xuXG4vLyBJbml0IGFwcFxuXG52YXIgY2xvdWQgPSByZXF1aXJlKCcuL2VudGl0aWVzL2Nsb3VkJykoc2l6ZSArIDExLCBvYmplY3QsIGJsb2NrTWF0ZXJpYWwpO1xuZW50aXRpZXMucHVzaChjbG91ZCk7XG5cbnZhciB0ZXJyaWFuID0gcmVxdWlyZSgnLi9lbnRpdGllcy90ZXJyaWFuJykoc2l6ZSwgb2JqZWN0LCBibG9ja01hdGVyaWFsKTtcblxudmFyIHRyZWUgPSByZXF1aXJlKCcuL2VudGl0aWVzL3RyZWUnKSh0ZXJyaWFuLm9iamVjdCwgYmxvY2tNYXRlcmlhbCwgdGVycmlhbik7XG5cbmFuaW1hdGUoKTtcbiIsInZhciBDaHVuayA9IGZ1bmN0aW9uKHNoYXBlKSB7XG4gIHRoaXMudm9sdW1lID0gW107XG4gIHRoaXMuc2hhcGUgPSBzaGFwZSB8fCBbMTYsIDE2LCAxNl07XG4gIHRoaXMuZGltWCA9IHRoaXMuc2hhcGVbMF07XG4gIHRoaXMuZGltWFkgPSB0aGlzLnNoYXBlWzBdICogdGhpcy5zaGFwZVsxXTtcbn07XG5cbkNodW5rLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpLCBqLCBrKSB7XG4gIHJldHVybiB0aGlzLnZvbHVtZVtpICogdGhpcy5kaW1YWSArIGogKiB0aGlzLmRpbVggKyBrXTtcbn07XG5cbkNodW5rLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gIHRoaXMudm9sdW1lW2kgKiB0aGlzLmRpbVhZICsgaiAqIHRoaXMuZGltWCArIGtdID0gdjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2h1bms7XG4iLCJ2YXIgQ2h1bmsgPSByZXF1aXJlKCcuL2NodW5rJyk7XG5cbnZhciBDaHVua3MgPSBmdW5jdGlvbihjaHVua1NpemUpIHtcbiAgdGhpcy5tYXAgPSB7fTtcbiAgdGhpcy5jaHVua1NpemUgPSBjaHVua1NpemUgfHwgMTY7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgdmFyIG9yaWdpbiA9IHRoaXMuZ2V0T3JpZ2luKGksIGosIGspO1xuICB2YXIgaGFzaCA9IG9yaWdpbi50b0FycmF5KCkuam9pbignLCcpO1xuICBpZiAodGhpcy5tYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgIHRoaXMubWFwW2hhc2hdID0ge1xuICAgICAgY2h1bms6IG5ldyBDaHVuayhbdGhpcy5jaHVua1NpemUsIHRoaXMuY2h1bmtTaXplLCB0aGlzLmNodW5rU2l6ZV0pLFxuICAgICAgb3JpZ2luOiBvcmlnaW5cbiAgICB9XG4gIH1cblxuICB0aGlzLm1hcFtoYXNoXS5kaXJ0eSA9IHRydWU7XG4gIHRoaXMubWFwW2hhc2hdLmNodW5rLnNldChpIC0gb3JpZ2luLngsIGogLSBvcmlnaW4ueSwgayAtIG9yaWdpbi56LCB2KTtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICB2YXIgb3JpZ2luID0gdGhpcy5nZXRPcmlnaW4oaSwgaiwgayk7XG4gIHZhciBoYXNoID0gb3JpZ2luLnRvQXJyYXkoKS5qb2luKCcsJyk7XG4gIGlmICh0aGlzLm1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIG9yaWdpbiA9IHRoaXMubWFwW2hhc2hdLm9yaWdpbjtcbiAgcmV0dXJuIHRoaXMubWFwW2hhc2hdLmNodW5rLmdldChpIC0gb3JpZ2luLngsIGogLSBvcmlnaW4ueSwgayAtIG9yaWdpbi56KTtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuZ2V0T3JpZ2luID0gZnVuY3Rpb24oaSwgaiwgaykge1xuICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgTWF0aC5mbG9vcihpIC8gdGhpcy5jaHVua1NpemUpLFxuICAgIE1hdGguZmxvb3IoaiAvIHRoaXMuY2h1bmtTaXplKSxcbiAgICBNYXRoLmZsb29yKGsgLyB0aGlzLmNodW5rU2l6ZSlcbiAgKS5tdWx0aXBseVNjYWxhcih0aGlzLmNodW5rU2l6ZSk7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLnZpc2l0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaWQgaW4gdGhpcy5tYXApIHtcbiAgICB2YXIgY2h1bmsgPSB0aGlzLm1hcFtpZF0uY2h1bms7XG4gICAgdmFyIG9yaWdpbiA9IHRoaXMubWFwW2lkXS5vcmlnaW47XG4gICAgdmFyIHNoYXBlID0gY2h1bmsuc2hhcGU7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNoYXBlWzBdOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2hhcGVbMF07IGorKykge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNoYXBlWzBdOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGNodW5rLmdldChpLCBqLCBrKTtcbiAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjayhpICsgb3JpZ2luLngsIGogKyBvcmlnaW4ueSwgayArIG9yaWdpbi56LCB2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuQ2h1bmtzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpZCBpbiB0aGlzLm1hcCkge1xuICAgIHZhciBjaHVuayA9IHRoaXMubWFwW2lkXTtcbiAgICBpZiAoY2h1bmsubWVzaCAhPSBudWxsKSB7XG4gICAgICBjaHVuay5tZXNoLnBhcmVudC5yZW1vdmUoY2h1bmsubWVzaCk7XG4gICAgICBjaHVuay5tZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cbiAgdGhpcy5tYXAgPSB7fTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuZGVzZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhLCBvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHx8IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgc2VsZi5zZXQodlswXSArIG9mZnNldC54LCB2WzFdICsgb2Zmc2V0LnksIHZbMl0gKyBvZmZzZXQueiwgdlszXSk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaHVua3M7XG4iLCJ2YXIgR3JlZWR5TWVzaCA9IChmdW5jdGlvbigpIHtcbiAgLy9DYWNoZSBidWZmZXIgaW50ZXJuYWxseVxuICB2YXIgbWFzayA9IG5ldyBJbnQzMkFycmF5KDQwOTYpO1xuXG4gIHJldHVybiBmdW5jdGlvbihmLCBkaW1zKSB7XG4gICAgdmFyIHZlcnRpY2VzID0gW10sXG4gICAgICBmYWNlcyA9IFtdLFxuICAgICAgdXZzID0gW10sXG4gICAgICBkaW1zWCA9IGRpbXNbMF0sXG4gICAgICBkaW1zWSA9IGRpbXNbMV0sXG4gICAgICBkaW1zWFkgPSBkaW1zWCAqIGRpbXNZO1xuXG4gICAgLy9Td2VlcCBvdmVyIDMtYXhlc1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgKytkKSB7XG4gICAgICB2YXIgaSwgaiwgaywgbCwgdywgVywgaCwgbiwgYyxcbiAgICAgICAgdSA9IChkICsgMSkgJSAzLFxuICAgICAgICB2ID0gKGQgKyAyKSAlIDMsXG4gICAgICAgIHggPSBbMCwgMCwgMF0sXG4gICAgICAgIHEgPSBbMCwgMCwgMF0sXG4gICAgICAgIGR1ID0gWzAsIDAsIDBdLFxuICAgICAgICBkdiA9IFswLCAwLCAwXSxcbiAgICAgICAgZGltc0QgPSBkaW1zW2RdLFxuICAgICAgICBkaW1zVSA9IGRpbXNbdV0sXG4gICAgICAgIGRpbXNWID0gZGltc1t2XSxcbiAgICAgICAgcWRpbXNYLCBxZGltc1hZLCB4ZDtcblxuICAgICAgdmFyIGZsaXAsIGluZGV4LCB2YWx1ZTtcblxuICAgICAgaWYgKG1hc2subGVuZ3RoIDwgZGltc1UgKiBkaW1zVikge1xuICAgICAgICBtYXNrID0gbmV3IEludDMyQXJyYXkoZGltc1UgKiBkaW1zVik7XG4gICAgICB9XG5cbiAgICAgIHFbZF0gPSAxO1xuICAgICAgeFtkXSA9IC0xO1xuXG4gICAgICBxZGltc1ggPSBkaW1zWCAqIHFbMV1cbiAgICAgIHFkaW1zWFkgPSBkaW1zWFkgKiBxWzJdXG5cbiAgICAgIC8vIENvbXB1dGUgbWFza1xuICAgICAgd2hpbGUgKHhbZF0gPCBkaW1zRCkge1xuICAgICAgICB4ZCA9IHhbZF1cbiAgICAgICAgbiA9IDA7XG5cbiAgICAgICAgZm9yICh4W3ZdID0gMDsgeFt2XSA8IGRpbXNWOyArK3hbdl0pIHtcbiAgICAgICAgICBmb3IgKHhbdV0gPSAwOyB4W3VdIDwgZGltc1U7ICsreFt1XSwgKytuKSB7XG4gICAgICAgICAgICB2YXIgYSA9IHhkID49IDAgJiYgZih4WzBdLCB4WzFdLCB4WzJdKSxcbiAgICAgICAgICAgICAgYiA9IHhkIDwgZGltc0QgLSAxICYmIGYoeFswXSArIHFbMF0sIHhbMV0gKyBxWzFdLCB4WzJdICsgcVsyXSlcbiAgICAgICAgICAgIGlmIChhID8gYiA6ICFiKSB7XG4gICAgICAgICAgICAgIG1hc2tbbl0gPSAwO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmxpcCA9ICFhO1xuXG4gICAgICAgICAgICBpbmRleCA9IGQgKiAyO1xuICAgICAgICAgICAgaWYgKGZsaXApIHtcbiAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsdWUgPSAoYSB8fCBiKVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmIChmbGlwKSB7XG4gICAgICAgICAgICAgIHZhbHVlICo9IC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXNrW25dID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgKyt4W2RdO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIG1lc2ggZm9yIG1hc2sgdXNpbmcgbGV4aWNvZ3JhcGhpYyBvcmRlcmluZ1xuICAgICAgICBuID0gMDtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGRpbXNWOyArK2opIHtcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGltc1U7KSB7XG4gICAgICAgICAgICBjID0gbWFza1tuXTtcbiAgICAgICAgICAgIGlmICghYykge1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgIG4rKztcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQ29tcHV0ZSB3aWR0aFxuICAgICAgICAgICAgdyA9IDE7XG4gICAgICAgICAgICB3aGlsZSAoYyA9PT0gbWFza1tuICsgd10gJiYgaSArIHcgPCBkaW1zVSkgdysrO1xuXG4gICAgICAgICAgICAvL0NvbXB1dGUgaGVpZ2h0ICh0aGlzIGlzIHNsaWdodGx5IGF3a3dhcmQpXG4gICAgICAgICAgICBmb3IgKGggPSAxOyBqICsgaCA8IGRpbXNWOyArK2gpIHtcbiAgICAgICAgICAgICAgayA9IDA7XG4gICAgICAgICAgICAgIHdoaWxlIChrIDwgdyAmJiBjID09PSBtYXNrW24gKyBrICsgaCAqIGRpbXNVXSkgaysrXG4gICAgICAgICAgICAgICAgaWYgKGsgPCB3KSBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIHF1YWRcbiAgICAgICAgICAgIC8vIFRoZSBkdS9kdiBhcnJheXMgYXJlIHJldXNlZC9yZXNldFxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggaXRlcmF0aW9uLlxuICAgICAgICAgICAgZHVbZF0gPSAwO1xuICAgICAgICAgICAgZHZbZF0gPSAwO1xuICAgICAgICAgICAgeFt1XSA9IGk7XG4gICAgICAgICAgICB4W3ZdID0gajtcblxuICAgICAgICAgICAgaWYgKGMgPiAwKSB7XG4gICAgICAgICAgICAgIGR2W3ZdID0gaDtcbiAgICAgICAgICAgICAgZHZbdV0gPSAwO1xuICAgICAgICAgICAgICBkdVt1XSA9IHc7XG4gICAgICAgICAgICAgIGR1W3ZdID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGMgPSAtYztcbiAgICAgICAgICAgICAgZHVbdl0gPSBoO1xuICAgICAgICAgICAgICBkdVt1XSA9IDA7XG4gICAgICAgICAgICAgIGR2W3VdID0gdztcbiAgICAgICAgICAgICAgZHZbdl0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZlcnRleF9jb3VudCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goW3hbMF0sIHhbMV0sIHhbMl1dKTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goW3hbMF0gKyBkdVswXSwgeFsxXSArIGR1WzFdLCB4WzJdICsgZHVbMl1dKTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goW3hbMF0gKyBkdVswXSArIGR2WzBdLCB4WzFdICsgZHVbMV0gKyBkdlsxXSwgeFsyXSArIGR1WzJdICsgZHZbMl1dKTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goW3hbMF0gKyBkdlswXSwgeFsxXSArIGR2WzFdLCB4WzJdICsgZHZbMl1dKTtcbiAgICAgICAgICAgIHV2cy5wdXNoKFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgWzAsIDBdLFxuICAgICAgICAgICAgICAgIFtkdVt1XSwgZHVbdl1dLFxuICAgICAgICAgICAgICAgIFtkdVt1XSArIGR2W3VdLCBkdVt2XSArIGR2W3ZdXSxcbiAgICAgICAgICAgICAgICBbZHZbdV0sIGR2W3ZdXVxuICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgZmFjZXMucHVzaChbdmVydGV4X2NvdW50LCB2ZXJ0ZXhfY291bnQgKyAxLCB2ZXJ0ZXhfY291bnQgKyAyLCB2ZXJ0ZXhfY291bnQgKyAzLCBjXSk7XG5cbiAgICAgICAgICAgIC8vWmVyby1vdXQgbWFza1xuICAgICAgICAgICAgVyA9IG4gKyB3O1xuICAgICAgICAgICAgZm9yIChsID0gMDsgbCA8IGg7ICsrbCkge1xuICAgICAgICAgICAgICBmb3IgKGsgPSBuOyBrIDwgVzsgKytrKSB7XG4gICAgICAgICAgICAgICAgbWFza1trICsgbCAqIGRpbXNVXSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9JbmNyZW1lbnQgY291bnRlcnMgYW5kIGNvbnRpbnVlXG4gICAgICAgICAgICBpICs9IHc7XG4gICAgICAgICAgICBuICs9IHc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHZlcnRpY2VzOiB2ZXJ0aWNlcywgZmFjZXM6IGZhY2VzLCB1dnM6IHV2cyB9O1xuICB9XG59KSgpO1xuXG5pZiAoZXhwb3J0cykge1xuICBleHBvcnRzLm1lc2hlciA9IEdyZWVkeU1lc2g7XG59XG4iLCJ2YXIgVm94ZWwgPSB7XG4gIENodW5rOiByZXF1aXJlKCcuL2NodW5rJyksXG4gIENodW5rczogcmVxdWlyZSgnLi9jaHVua3MnKSxcbiAgbWVzaENodW5rczogcmVxdWlyZSgnLi9tZXNoY2h1bmtzJyksXG4gIG1lc2hlcjogcmVxdWlyZSgnLi9tZXNoZXInKVxufTtcblxuZnVuY3Rpb24gdmlzaXRTaGFwZShzaGFwZSwgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaGFwZVswXTsgaSsrKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaGFwZVsxXTsgaisrKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNoYXBlWzJdOyBrKyspIHtcbiAgICAgICAgY2FsbGJhY2soaSwgaiwgayk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBjb3B5Q2h1bmtzKGZyb20sIHRvLCBvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHx8IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIGZyb20udmlzaXQoZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICAgIHRvLnNldChpICsgb2Zmc2V0LngsIGogKyBvZmZzZXQueSwgayArIG9mZnNldC56LCB2KTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiByZW1vdmVGbG9hdGluZyhjaHVua3MsIHN0YXJ0Q29vcmQpIHtcbiAgdmFyIG1hcCA9IHt9O1xuICBjaHVua3MudmlzaXQoZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICAgIHZhciBoYXNoID0gW2ksIGosIGtdLmpvaW4oJywnKTtcbiAgICBtYXBbaGFzaF0gPSB7XG4gICAgICB2aXNpdGVkOiBmYWxzZSxcbiAgICAgIGNvb3JkOiBbaSwgaiwga11cbiAgICB9O1xuICB9KTtcblxuICB2YXIgbGVhZHMgPSBbc3RhcnRDb29yZF07XG5cbiAgd2hpbGUgKGxlYWRzLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgcmVzdWx0ID0gdmlzaXQoWzEsIDAsIDBdKSB8fFxuICAgICAgdmlzaXQoWzAsIDEsIDBdKSB8fFxuICAgICAgdmlzaXQoWzAsIDAsIDFdKSB8fFxuICAgICAgdmlzaXQoWy0xLCAwLCAwXSkgfHxcbiAgICAgIHZpc2l0KFswLCAtMSwgMF0pIHx8XG4gICAgICB2aXNpdChbMCwgMCwgLTFdKTtcblxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICBsZWFkcy5wb3AoKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY291bnQgPSAwO1xuICBmb3IgKHZhciBpZCBpbiBtYXApIHtcbiAgICBpZiAoIW1hcFtpZF0udmlzaXRlZCkge1xuICAgICAgdmFyIGNvb3JkID0gbWFwW2lkXS5jb29yZDtcbiAgICAgIGNodW5rcy5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdmlzaXQoZGlzKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBsZWFkc1tsZWFkcy5sZW5ndGggLSAxXTtcblxuICAgIHZhciBuZXh0ID0gW2N1cnJlbnRbMF0gKyBkaXNbMF0sXG4gICAgICBjdXJyZW50WzFdICsgZGlzWzFdLFxuICAgICAgY3VycmVudFsyXSArIGRpc1syXVxuICAgIF07XG5cbiAgICB2YXIgaGFzaCA9IG5leHQuam9pbignLCcpO1xuXG4gICAgaWYgKG1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG1hcFtoYXNoXS52aXNpdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHYgPSBjaHVua3MuZ2V0KG5leHRbMF0sIG5leHRbMV0sIG5leHRbMl0pO1xuICAgIGlmICghIXYpIHtcbiAgICAgIG1hcFtoYXNoXS52aXNpdGVkID0gdHJ1ZTtcbiAgICAgIGxlYWRzLnB1c2gobmV4dCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG59O1xuXG5Wb3hlbC52aXNpdFNoYXBlID0gdmlzaXRTaGFwZTtcblZveGVsLmNvcHlDaHVua3MgPSBjb3B5Q2h1bmtzO1xuVm94ZWwucmVtb3ZlRmxvYXRpbmcgPSByZW1vdmVGbG9hdGluZztcblxubW9kdWxlLmV4cG9ydHMgPSBWb3hlbDtcbiIsInZhciBtZXNoZXIgPSByZXF1aXJlKCcuL21lc2hlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNodW5rcywgcGFyZW50LCBtYXRlcmlhbCwgY2FjaGVkKSB7XG4gIGZvciAodmFyIGlkIGluIGNodW5rcy5tYXApIHtcbiAgICB2YXIgY2h1bmsgPSBjaHVua3MubWFwW2lkXTtcbiAgICB2YXIgZGF0YSA9IGNodW5rLmNodW5rO1xuICAgIGlmIChjaHVuay5kaXJ0eSkge1xuXG4gICAgICBpZiAoY2h1bmsubWVzaCAhPSBudWxsKSB7XG4gICAgICAgIGNodW5rLm1lc2gucGFyZW50LnJlbW92ZShjaHVuay5tZXNoKTtcbiAgICAgICAgY2h1bmsubWVzaC5nZW9tZXRyeS5kaXNwb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcmlnaW4gPSBjaHVuay5vcmlnaW47XG5cbiAgICAgIHZhciBjYWNoZWRHZW9tZXRyeSA9IGNhY2hlZCA9PSBudWxsID8gbnVsbCA6IGNhY2hlZFtpZF07XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBjYWNoZWRHZW9tZXRyeSB8fCBtZXNoZXIoY2h1bmsuY2h1bmspO1xuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgbWVzaC5wb3NpdGlvbi5jb3B5KGNodW5rLm9yaWdpbik7XG4gICAgICBwYXJlbnQuYWRkKG1lc2gpO1xuXG4gICAgICBpZiAoY2FjaGVkICE9IG51bGwpIHtcbiAgICAgICAgY2FjaGVkW2lkXSA9IGdlb21ldHJ5O1xuICAgICAgfVxuXG4gICAgICBjaHVuay5kaXJ0eSA9IGZhbHNlO1xuICAgICAgY2h1bmsubWVzaCA9IG1lc2g7XG4gICAgfVxuICB9XG59XG4iLCJ2YXIgZ3JlZWR5TWVzaGVyID0gcmVxdWlyZSgnLi9ncmVlZHknKS5tZXNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2h1bmssIGYpIHtcbiAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cbiAgZiA9IGYgfHwgZnVuY3Rpb24oaSwgaiwgaykge1xuICAgIHJldHVybiBjaHVuay5nZXQoaSwgaiwgayk7XG4gIH07XG4gIHZhciByZXN1bHQgPSBncmVlZHlNZXNoZXIoZiwgY2h1bmsuc2hhcGUpO1xuXG4gIHJlc3VsdC52ZXJ0aWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgdmVydGljZSA9IG5ldyBUSFJFRS5WZWN0b3IzKHZbMF0sIHZbMV0sIHZbMl0pO1xuICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2godmVydGljZSk7XG4gIH0pO1xuXG4gIHJlc3VsdC5mYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgZmFjZSA9IG5ldyBUSFJFRS5GYWNlMyhmWzBdLCBmWzFdLCBmWzJdKTtcbiAgICBmYWNlLm1hdGVyaWFsSW5kZXggPSBmWzRdO1xuICAgIGdlb21ldHJ5LmZhY2VzLnB1c2goZmFjZSk7XG5cbiAgICBmYWNlID0gbmV3IFRIUkVFLkZhY2UzKGZbMl0sIGZbM10sIGZbMF0pO1xuICAgIGZhY2UubWF0ZXJpYWxJbmRleCA9IGZbNF07XG4gICAgZ2VvbWV0cnkuZmFjZXMucHVzaChmYWNlKTtcbiAgfSk7XG5cbiAgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1swXSA9IFtdO1xuICByZXN1bHQudXZzLmZvckVhY2goZnVuY3Rpb24odXYpIHtcbiAgICBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWzBdLnB1c2goW1xuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMF0pLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMV0pLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMl0pXG4gICAgXSwgW1xuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMl0pLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbM10pLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMF0pXG4gICAgXSk7XG4gIH0pO1xuXG4gIGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xuXG4gIHJldHVybiBnZW9tZXRyeTtcbn07XG4iXX0=
