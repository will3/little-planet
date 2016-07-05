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

},{}],3:[function(require,module,exports){
var Dir = {};

Dir.LEFT = 0;
Dir.RIGHT = 1;
Dir.BOTTOM = 2;
Dir.UP = 3;
Dir.BACK = 4;
Dir.FRONT = 5;

Dir.getUnitVector = function(dir) {
  switch (dir) {
    case Dir.LEFT:
      return new THREE.Vector3(-1, 0, 0)
    case Dir.RIGHT:
      return new THREE.Vector3(1, 0, 0)
    case Dir.BOTTOM:
      return new THREE.Vector3(0, -1, 0)
    case Dir.UP:
      return new THREE.Vector3(0, 1, 0)
    case Dir.BACK:
      return new THREE.Vector3(0, 0, -1)
    case Dir.FRONT:
      return new THREE.Vector3(0, 0, 1)
  }
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

module.exports = Dir;

},{}],4:[function(require,module,exports){
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

  var size = 41;
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

},{"../dir":3,"../voxel/chunks":9,"../voxel/meshchunks":12,"../voxel/mesher":13,"simplex-noise":2}],5:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var SimplexNoise = require('simplex-noise');

var Voxel = require('../voxel');
var Dir = require('../dir');

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
  var surfaceMap = {};

  var surfaceNum = 6;
  var seaLevel = 2;

  init();
  generateGravityMap();
  generateBumps();
  removeFloating(ground, centerCoord);
  generateSea();
  generateBiomes();
  generateTiles();
  generateSurface();

  var pivot = new THREE.Object3D();

  var groundObject = new THREE.Object3D();
  pivot.add(groundObject);
  meshChunks(ground, groundObject, material);
  meshChunks(water, pivot, material);

  var positionCenter = new THREE.Vector3()
    .subVectors(bounds.min, bounds.size)
    .multiplyScalar(0.5);
  pivot.position.copy(positionCenter);
  parent.add(pivot);

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
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        for (var k = 0; k < size; k++) {
          var map = {};
          var gravity = calcGravity(i, j, k);
          gravity.forEach(function(g) {
            map[g] = true;
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
    ground.visit(function(i, j, k, v) {
      var data = getData(i, j, k);
      var surface = data.surface || {};
      var gravity = data.gravity;

      for (var f in gravity) {
        var result = isSurface(i, j, k, f);

        if (result) {
          var hash = [i, j, k, f].join(',');
          surfaceMap[hash] = [i, j, k, f];
        }

        var gravity = data.gravity;
        if (gravity[f]) {
          surface[f] = result;
        }
      }
    });
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
        if (pos[d] === 0 || pos[d] === size - 1) {
          return GRASS;
        }

        var above = ground.get(coord[0], coord[1], coord[2]);

        var isSurface = !above;

        return isSurface ? GRASS : SOIL;

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

  return {
    ground: ground,
    water: water,
    bounds: bounds,
    object: pivot,
    calcGravity: calcGravity,
    surfaceMap: surfaceMap,
    groundObject: groundObject,
    getData: getData
  };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../dir":3,"../voxel":11,"simplex-noise":2}],6:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var Voxel = require('../voxel');
var Dir = require('../dir');

var Chunks = Voxel.Chunks;
var visitShape = Voxel.visitShape;
var meshChunks = Voxel.meshChunks;
var copyChunks = Voxel.copyChunks;
var removeFloating = Voxel.removeFloating;

var TRUNK = [20, 20, 20, 20, 20, 20];
var LEAF = [21, 21, 21, 21, 21, 21];

module.exports = function(parent, blockMaterial, terrian) {
  var chunks = new Chunks();

  function add(coord, dir) {

    var shapeRatio = 2;
    var leafHeight = 3;
    var density = 0.8;
    var size1 = 3;
    var size2 = 3;
    var shape1 = Math.random() * size1 + size2;
    var shape2 = shape1 * shapeRatio;
    var trunkHeight = leafHeight + shape2 - 4;

    var radius = shape1 * Math.sqrt(2) / 2;

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

    var leafShape = [shape1, shape2, shape1];

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
        if (diff > Math.random()) {
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

    copyChunks(chunks2, chunks, coord);
    meshChunks(chunks, object, blockMaterial);
  };

  function start() {
    object.scale.set(self.scale, self.scale, self.scale);
    parent.add(object);

    var count = 0;
    for (var id in terrian.surfaceMap) {
      var surface = terrian.surfaceMap[id];

      var data = terrian.getData(surface[0], surface[1], surface[2]);

      // No trees under sea level
      if (data.biome.relSeaLevel > 0) {
        continue;
      }

      // How sparse trees should be
      if (Math.random() < 0.7) {
        continue;
      }

      if (data.biome.tree < 0.5) {
        continue;
      }

      // if (count > 200) {
      //   break;
      // }

      var f = Dir.getOpposite(surface[3]);

      // Start from center of block, extend for half a block
      var coord =
        new THREE.Vector3(surface[0], surface[1], surface[2])
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

      count++;
    };
  };

  var object = new THREE.Object3D();
  var self = {
    add: add,
    object: object,
    scale: (1 / 3.0)
  };

  start();

  return self;
};

function roundVector(v) {
  v.x = Math.round(v.x);
  v.y = Math.round(v.y);
  v.z = Math.round(v.z);
  return v;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../dir":3,"../voxel":11}],7:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var keycode = require('keycode');
var Dir = require('./dir');

var app = {};

// Post processing setting
var postprocessing = { enabled: true, renderMode: 0 };

// Renderer, scene, camera
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xBBD9F7);
// renderer.setClearColor(0x222222);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,
  0.1, 1000);
var cameraUp, cameraDir, cameraRight;

// Post processing
var depthMaterial;
var depthRenderTarget;
var ssaoPass;
var effectComposer;

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

function initPostprocessing() {

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
  ssaoPass.renderToScreen = true;
  //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
  ssaoPass.uniforms["tDepth"].value = depthRenderTarget.texture;
  ssaoPass.uniforms['size'].value.set(window.innerWidth, window.innerHeight);
  ssaoPass.uniforms['cameraNear'].value = camera.near;
  ssaoPass.uniforms['cameraFar'].value = camera.far;
  ssaoPass.uniforms['onlyAO'].value = (postprocessing.renderMode == 1);
  ssaoPass.uniforms['aoClamp'].value = 100.0;
  ssaoPass.uniforms['lumInfluence'].value = 0.7;

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
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(0.3, 1.0, 0.5);
  object.add(ambientLight);
  object.add(directionalLight);
};

function loadResources() {
  loadBlockMaterial('grass', 1);
  loadBlockMaterial('soil', 2);
  loadBlockMaterial('soil2', 3);
  loadBlockMaterial('stone', 4);
  loadBlockMaterial('sea', 5, 0.8);
  loadBlockMaterial('sand', 6);
  loadBlockMaterial('wall', 7);
  loadBlockMaterial('trunk', 20);
  loadBlockMaterial('leaf', 21);

  loadBlockMaterial('window', 8, 0.8);

  loadBlockMaterial('cloud', 10, 0.8, null, function(m) {
    m.emissive = new THREE.Color(0x888888);
  });
};

function loadBlockMaterial(name, index, alpha, materialType, transform) {
  var texture = textureLoader.load('textures/' + name + '.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  blockTextures.push(texture);

  materialType = materialType || THREE.MeshLambertMaterial;

  var m = new materialType({
    map: texture
  });

  if (alpha != null) {
    m.transparent = true;
    m.opacity = alpha;
  }

  if (transform != null) {
    transform(m);
  }

  material.materials[index] = m;
};

function render() {
  if (postprocessing.enabled) {
    noAoLayer.visible = false;
    // Render depth into depthRenderTarget
    scene.overrideMaterial = depthMaterial;
    renderer.render(scene, camera, depthRenderTarget, true);

    noAoLayer.visible = true;
    // Render renderPass and SSAO shaderPass
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

  var localPoint = tree.object.worldToLocal(point);
  var coord = new THREE.Vector3(
    Math.floor(localPoint.x),
    Math.floor(localPoint.y),
    Math.floor(localPoint.z)
  );

  tree.add(coord);

  // if (intersects.length === 0) {
  //   return;
  // }

  // var point = intersects[0].point;
  // point.add(raycaster.ray.direction.clone().normalize().multiplyScalar(0.01));
  // point = mesh.worldToLocal(point);

  // var coord = [
  //   Math.floor(point.x),
  //   Math.floor(point.y),
  //   Math.floor(point.z)
  // ];
  // terrian.chunk.set(coord[0], coord[1], coord[2], null);

  // mesh.parent.remove(mesh);
  // geometry.dispose();
  // geometry = mesher(terrian.chunk);

  // mesh = new THREE.Mesh(geometry, material);
  // object.add(mesh);
  // mesh.position.copy(center);
};

function onMouseUp(event) {

};

function onKeyDown(e) {
  var key = keycode(e);
  keyholds[key] = true;

  if (key === 'g') {
    terrian.groundObject.visible = !terrian.groundObject.visible;
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

},{"./dir":3,"./entities/cloud":4,"./entities/terrian":5,"./entities/tree":6,"keycode":1}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

module.exports = Chunks;

},{"./chunk":8}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./chunk":8,"./chunks":9,"./meshchunks":12,"./mesher":13}],12:[function(require,module,exports){
var mesher = require('./mesher');

module.exports = function(chunks, parent, material) {
  for (var id in chunks.map) {
    var chunk = chunks.map[id];
    var data = chunk.chunk;
    if (chunk.dirty) {

      if (chunk.mesh != null) {
        chunk.mesh.parent.remove(chunk.mesh);
        chunk.mesh.geometry.dispose();
      }

      var origin = chunk.origin;

      var geometry = mesher(chunk.chunk);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(chunk.origin);
      parent.add(mesh);

      chunk.dirty = false;
      chunk.mesh = mesh;
    }
  }
}

},{"./mesher":13}],13:[function(require,module,exports){
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

},{"./greedy":10}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva2V5Y29kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGV4LW5vaXNlL3NpbXBsZXgtbm9pc2UuanMiLCJzcmMvZGlyLmpzIiwic3JjL2VudGl0aWVzL2Nsb3VkLmpzIiwic3JjL2VudGl0aWVzL3RlcnJpYW4uanMiLCJzcmMvZW50aXRpZXMvdHJlZS5qcyIsInNyYy9tYWluLmpzIiwic3JjL3ZveGVsL2NodW5rLmpzIiwic3JjL3ZveGVsL2NodW5rcy5qcyIsInNyYy92b3hlbC9ncmVlZHkuanMiLCJzcmMvdm94ZWwvaW5kZXguanMiLCJzcmMvdm94ZWwvbWVzaGNodW5rcy5qcyIsInNyYy92b3hlbC9tZXNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDcGNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNuVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFNvdXJjZTogaHR0cDovL2pzZmlkZGxlLm5ldC92V3g4Vi9cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYwMzE5NS9mdWxsLWxpc3Qtb2YtamF2YXNjcmlwdC1rZXljb2Rlc1xuXG4vKipcbiAqIENvbmVuaWVuY2UgbWV0aG9kIHJldHVybnMgY29ycmVzcG9uZGluZyB2YWx1ZSBmb3IgZ2l2ZW4ga2V5TmFtZSBvciBrZXlDb2RlLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IGtleUNvZGUge051bWJlcn0gb3Iga2V5TmFtZSB7U3RyaW5nfVxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlYXJjaElucHV0KSB7XG4gIC8vIEtleWJvYXJkIEV2ZW50c1xuICBpZiAoc2VhcmNoSW5wdXQgJiYgJ29iamVjdCcgPT09IHR5cGVvZiBzZWFyY2hJbnB1dCkge1xuICAgIHZhciBoYXNLZXlDb2RlID0gc2VhcmNoSW5wdXQud2hpY2ggfHwgc2VhcmNoSW5wdXQua2V5Q29kZSB8fCBzZWFyY2hJbnB1dC5jaGFyQ29kZVxuICAgIGlmIChoYXNLZXlDb2RlKSBzZWFyY2hJbnB1dCA9IGhhc0tleUNvZGVcbiAgfVxuXG4gIC8vIE51bWJlcnNcbiAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc2VhcmNoSW5wdXQpIHJldHVybiBuYW1lc1tzZWFyY2hJbnB1dF1cblxuICAvLyBFdmVyeXRoaW5nIGVsc2UgKGNhc3QgdG8gc3RyaW5nKVxuICB2YXIgc2VhcmNoID0gU3RyaW5nKHNlYXJjaElucHV0KVxuXG4gIC8vIGNoZWNrIGNvZGVzXG4gIHZhciBmb3VuZE5hbWVkS2V5ID0gY29kZXNbc2VhcmNoLnRvTG93ZXJDYXNlKCldXG4gIGlmIChmb3VuZE5hbWVkS2V5KSByZXR1cm4gZm91bmROYW1lZEtleVxuXG4gIC8vIGNoZWNrIGFsaWFzZXNcbiAgdmFyIGZvdW5kTmFtZWRLZXkgPSBhbGlhc2VzW3NlYXJjaC50b0xvd2VyQ2FzZSgpXVxuICBpZiAoZm91bmROYW1lZEtleSkgcmV0dXJuIGZvdW5kTmFtZWRLZXlcblxuICAvLyB3ZWlyZCBjaGFyYWN0ZXI/XG4gIGlmIChzZWFyY2gubGVuZ3RoID09PSAxKSByZXR1cm4gc2VhcmNoLmNoYXJDb2RlQXQoMClcblxuICByZXR1cm4gdW5kZWZpbmVkXG59XG5cbi8qKlxuICogR2V0IGJ5IG5hbWVcbiAqXG4gKiAgIGV4cG9ydHMuY29kZVsnZW50ZXInXSAvLyA9PiAxM1xuICovXG5cbnZhciBjb2RlcyA9IGV4cG9ydHMuY29kZSA9IGV4cG9ydHMuY29kZXMgPSB7XG4gICdiYWNrc3BhY2UnOiA4LFxuICAndGFiJzogOSxcbiAgJ2VudGVyJzogMTMsXG4gICdzaGlmdCc6IDE2LFxuICAnY3RybCc6IDE3LFxuICAnYWx0JzogMTgsXG4gICdwYXVzZS9icmVhayc6IDE5LFxuICAnY2FwcyBsb2NrJzogMjAsXG4gICdlc2MnOiAyNyxcbiAgJ3NwYWNlJzogMzIsXG4gICdwYWdlIHVwJzogMzMsXG4gICdwYWdlIGRvd24nOiAzNCxcbiAgJ2VuZCc6IDM1LFxuICAnaG9tZSc6IDM2LFxuICAnbGVmdCc6IDM3LFxuICAndXAnOiAzOCxcbiAgJ3JpZ2h0JzogMzksXG4gICdkb3duJzogNDAsXG4gICdpbnNlcnQnOiA0NSxcbiAgJ2RlbGV0ZSc6IDQ2LFxuICAnY29tbWFuZCc6IDkxLFxuICAnbGVmdCBjb21tYW5kJzogOTEsXG4gICdyaWdodCBjb21tYW5kJzogOTMsXG4gICdudW1wYWQgKic6IDEwNixcbiAgJ251bXBhZCArJzogMTA3LFxuICAnbnVtcGFkIC0nOiAxMDksXG4gICdudW1wYWQgLic6IDExMCxcbiAgJ251bXBhZCAvJzogMTExLFxuICAnbnVtIGxvY2snOiAxNDQsXG4gICdzY3JvbGwgbG9jayc6IDE0NSxcbiAgJ215IGNvbXB1dGVyJzogMTgyLFxuICAnbXkgY2FsY3VsYXRvcic6IDE4MyxcbiAgJzsnOiAxODYsXG4gICc9JzogMTg3LFxuICAnLCc6IDE4OCxcbiAgJy0nOiAxODksXG4gICcuJzogMTkwLFxuICAnLyc6IDE5MSxcbiAgJ2AnOiAxOTIsXG4gICdbJzogMjE5LFxuICAnXFxcXCc6IDIyMCxcbiAgJ10nOiAyMjEsXG4gIFwiJ1wiOiAyMjJcbn1cblxuLy8gSGVscGVyIGFsaWFzZXNcblxudmFyIGFsaWFzZXMgPSBleHBvcnRzLmFsaWFzZXMgPSB7XG4gICd3aW5kb3dzJzogOTEsXG4gICfih6cnOiAxNixcbiAgJ+KMpSc6IDE4LFxuICAn4oyDJzogMTcsXG4gICfijJgnOiA5MSxcbiAgJ2N0bCc6IDE3LFxuICAnY29udHJvbCc6IDE3LFxuICAnb3B0aW9uJzogMTgsXG4gICdwYXVzZSc6IDE5LFxuICAnYnJlYWsnOiAxOSxcbiAgJ2NhcHMnOiAyMCxcbiAgJ3JldHVybic6IDEzLFxuICAnZXNjYXBlJzogMjcsXG4gICdzcGMnOiAzMixcbiAgJ3BndXAnOiAzMyxcbiAgJ3BnZG4nOiAzNCxcbiAgJ2lucyc6IDQ1LFxuICAnZGVsJzogNDYsXG4gICdjbWQnOiA5MVxufVxuXG5cbi8qIVxuICogUHJvZ3JhbWF0aWNhbGx5IGFkZCB0aGUgZm9sbG93aW5nXG4gKi9cblxuLy8gbG93ZXIgY2FzZSBjaGFyc1xuZm9yIChpID0gOTc7IGkgPCAxMjM7IGkrKykgY29kZXNbU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpIC0gMzJcblxuLy8gbnVtYmVyc1xuZm9yICh2YXIgaSA9IDQ4OyBpIDwgNTg7IGkrKykgY29kZXNbaSAtIDQ4XSA9IGlcblxuLy8gZnVuY3Rpb24ga2V5c1xuZm9yIChpID0gMTsgaSA8IDEzOyBpKyspIGNvZGVzWydmJytpXSA9IGkgKyAxMTFcblxuLy8gbnVtcGFkIGtleXNcbmZvciAoaSA9IDA7IGkgPCAxMDsgaSsrKSBjb2Rlc1snbnVtcGFkICcraV0gPSBpICsgOTZcblxuLyoqXG4gKiBHZXQgYnkgY29kZVxuICpcbiAqICAgZXhwb3J0cy5uYW1lWzEzXSAvLyA9PiAnRW50ZXInXG4gKi9cblxudmFyIG5hbWVzID0gZXhwb3J0cy5uYW1lcyA9IGV4cG9ydHMudGl0bGUgPSB7fSAvLyB0aXRsZSBmb3IgYmFja3dhcmQgY29tcGF0XG5cbi8vIENyZWF0ZSByZXZlcnNlIG1hcHBpbmdcbmZvciAoaSBpbiBjb2RlcykgbmFtZXNbY29kZXNbaV1dID0gaVxuXG4vLyBBZGQgYWxpYXNlc1xuZm9yICh2YXIgYWxpYXMgaW4gYWxpYXNlcykge1xuICBjb2Rlc1thbGlhc10gPSBhbGlhc2VzW2FsaWFzXVxufVxuIiwiLypcbiAqIEEgZmFzdCBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHNpbXBsZXggbm9pc2UgYnkgSm9uYXMgV2FnbmVyXG4gKlxuICogQmFzZWQgb24gYSBzcGVlZC1pbXByb3ZlZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobSBmb3IgMkQsIDNEIGFuZCA0RCBpbiBKYXZhLlxuICogV2hpY2ggaXMgYmFzZWQgb24gZXhhbXBsZSBjb2RlIGJ5IFN0ZWZhbiBHdXN0YXZzb24gKHN0ZWd1QGl0bi5saXUuc2UpLlxuICogV2l0aCBPcHRpbWlzYXRpb25zIGJ5IFBldGVyIEVhc3RtYW4gKHBlYXN0bWFuQGRyaXp6bGUuc3RhbmZvcmQuZWR1KS5cbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXG4gKlxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMiBKb25hcyBXYWduZXJcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbiAqIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuICogXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4gKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4gKiBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuICogdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4gKiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqXG4gKi9cbihmdW5jdGlvbiAoKSB7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEYyID0gMC41ICogKE1hdGguc3FydCgzLjApIC0gMS4wKSxcbiAgICBHMiA9ICgzLjAgLSBNYXRoLnNxcnQoMy4wKSkgLyA2LjAsXG4gICAgRjMgPSAxLjAgLyAzLjAsXG4gICAgRzMgPSAxLjAgLyA2LjAsXG4gICAgRjQgPSAoTWF0aC5zcXJ0KDUuMCkgLSAxLjApIC8gNC4wLFxuICAgIEc0ID0gKDUuMCAtIE1hdGguc3FydCg1LjApKSAvIDIwLjA7XG5cblxuZnVuY3Rpb24gU2ltcGxleE5vaXNlKHJhbmRvbSkge1xuICAgIGlmICghcmFuZG9tKSByYW5kb20gPSBNYXRoLnJhbmRvbTtcbiAgICB0aGlzLnAgPSBuZXcgVWludDhBcnJheSgyNTYpO1xuICAgIHRoaXMucGVybSA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgdGhpcy5wZXJtTW9kMTIgPSBuZXcgVWludDhBcnJheSg1MTIpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgICAgdGhpcy5wW2ldID0gcmFuZG9tKCkgKiAyNTY7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCA1MTI7IGkrKykge1xuICAgICAgICB0aGlzLnBlcm1baV0gPSB0aGlzLnBbaSAmIDI1NV07XG4gICAgICAgIHRoaXMucGVybU1vZDEyW2ldID0gdGhpcy5wZXJtW2ldICUgMTI7XG4gICAgfVxuXG59XG5TaW1wbGV4Tm9pc2UucHJvdG90eXBlID0ge1xuICAgIGdyYWQzOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAtIDEsIDAsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIC0gMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAwLCAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMCwgMSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDAsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDAsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAxLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgLSAxLCAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAtIDEsIC0gMV0pLFxuICAgIGdyYWQ0OiBuZXcgRmxvYXQzMkFycmF5KFswLCAxLCAxLCAxLCAwLCAxLCAxLCAtIDEsIDAsIDEsIC0gMSwgMSwgMCwgMSwgLSAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgLSAxLCAxLCAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgLSAxLCAtIDEsIDEsIDAsIC0gMSwgLSAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMCwgMSwgMSwgMSwgMCwgMSwgLSAxLCAxLCAwLCAtIDEsIDEsIDEsIDAsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMCwgMSwgMSwgLSAxLCAwLCAxLCAtIDEsIC0gMSwgMCwgLSAxLCAxLCAtIDEsIDAsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDEsIDAsIDEsIDEsIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAxLCAxLCAtIDEsIDAsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDEsIDAsIDEsIC0gMSwgMSwgMCwgLSAxLCAtIDEsIC0gMSwgMCwgMSwgLSAxLCAtIDEsIDAsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAxLCAxLCAwLCAxLCAxLCAtIDEsIDAsIDEsIC0gMSwgMSwgMCwgMSwgLSAxLCAtIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAxLCAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgLSAxLCAtIDEsIDEsIDAsIC0gMSwgLSAxLCAtIDEsIDBdKSxcbiAgICBub2lzZTJEOiBmdW5jdGlvbiAoeGluLCB5aW4pIHtcbiAgICAgICAgdmFyIHBlcm1Nb2QxMiA9IHRoaXMucGVybU1vZDEyLFxuICAgICAgICAgICAgcGVybSA9IHRoaXMucGVybSxcbiAgICAgICAgICAgIGdyYWQzID0gdGhpcy5ncmFkMztcbiAgICAgICAgdmFyIG4wPTAsIG4xPTAsIG4yPTA7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXG4gICAgICAgIHZhciBzID0gKHhpbiArIHlpbikgKiBGMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XG4gICAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5aW4gKyBzKTtcbiAgICAgICAgdmFyIHQgPSAoaSArIGopICogRzI7XG4gICAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSkgc3BhY2VcbiAgICAgICAgdmFyIFkwID0gaiAtIHQ7XG4gICAgICAgIHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgICB2YXIgeTAgPSB5aW4gLSBZMDtcbiAgICAgICAgLy8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxuICAgICAgICB2YXIgaTEsIGoxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgKG1pZGRsZSkgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaikgY29vcmRzXG4gICAgICAgIGlmICh4MCA+IHkwKSB7XG4gICAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgIH0gLy8gbG93ZXIgdHJpYW5nbGUsIFhZIG9yZGVyOiAoMCwwKS0+KDEsMCktPigxLDEpXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgajEgPSAxO1xuICAgICAgICB9IC8vIHVwcGVyIHRyaWFuZ2xlLCBZWCBvcmRlcjogKDAsMCktPigwLDEpLT4oMSwxKVxuICAgICAgICAvLyBBIHN0ZXAgb2YgKDEsMCkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMpIGluICh4LHkpLCBhbmRcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcbiAgICAgICAgLy8gYyA9ICgzLXNxcnQoMykpLzZcbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEcyOyAvLyBPZmZzZXRzIGZvciBtaWRkbGUgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzI7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gMS4wICsgMi4wICogRzI7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICB2YXIgeTIgPSB5MCAtIDEuMCArIDIuMCAqIEcyO1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xuICAgICAgICB2YXIgaWkgPSBpICYgMjU1O1xuICAgICAgICB2YXIgamogPSBqICYgMjU1O1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICAgIHZhciB0MCA9IDAuNSAtIHgwICogeDAgLSB5MCAqIHkwO1xuICAgICAgICBpZiAodDAgPj0gMCkge1xuICAgICAgICAgICAgdmFyIGdpMCA9IHBlcm1Nb2QxMltpaSArIHBlcm1bampdXSAqIDM7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkM1tnaTBdICogeDAgKyBncmFkM1tnaTAgKyAxXSAqIHkwKTsgLy8gKHgseSkgb2YgZ3JhZDMgdXNlZCBmb3IgMkQgZ3JhZGllbnRcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDEgPSAwLjUgLSB4MSAqIHgxIC0geTEgKiB5MTtcbiAgICAgICAgaWYgKHQxID49IDApIHtcbiAgICAgICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMV1dICogMztcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQzW2dpMV0gKiB4MSArIGdyYWQzW2dpMSArIDFdICogeTEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MiA9IDAuNSAtIHgyICogeDIgLSB5MiAqIHkyO1xuICAgICAgICBpZiAodDIgPj0gMCkge1xuICAgICAgICAgICAgdmFyIGdpMiA9IHBlcm1Nb2QxMltpaSArIDEgKyBwZXJtW2pqICsgMV1dICogMztcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWQzW2dpMl0gKiB4MiArIGdyYWQzW2dpMiArIDFdICogeTIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cbiAgICAgICAgLy8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gcmV0dXJuIHZhbHVlcyBpbiB0aGUgaW50ZXJ2YWwgWy0xLDFdLlxuICAgICAgICByZXR1cm4gNzAuMCAqIChuMCArIG4xICsgbjIpO1xuICAgIH0sXG4gICAgLy8gM0Qgc2ltcGxleCBub2lzZVxuICAgIG5vaXNlM0Q6IGZ1bmN0aW9uICh4aW4sIHlpbiwgemluKSB7XG4gICAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMixcbiAgICAgICAgICAgIHBlcm0gPSB0aGlzLnBlcm0sXG4gICAgICAgICAgICBncmFkMyA9IHRoaXMuZ3JhZDM7XG4gICAgICAgIHZhciBuMCwgbjEsIG4yLCBuMzsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4aW4gKyB5aW4gKyB6aW4pICogRjM7IC8vIFZlcnkgbmljZSBhbmQgc2ltcGxlIHNrZXcgZmFjdG9yIGZvciAzRFxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XG4gICAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5aW4gKyBzKTtcbiAgICAgICAgdmFyIGsgPSBNYXRoLmZsb29yKHppbiArIHMpO1xuICAgICAgICB2YXIgdCA9IChpICsgaiArIGspICogRzM7XG4gICAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSx6KSBzcGFjZVxuICAgICAgICB2YXIgWTAgPSBqIC0gdDtcbiAgICAgICAgdmFyIFowID0gayAtIHQ7XG4gICAgICAgIHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5LHogZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXG4gICAgICAgIHZhciB5MCA9IHlpbiAtIFkwO1xuICAgICAgICB2YXIgejAgPSB6aW4gLSBaMDtcbiAgICAgICAgLy8gRm9yIHRoZSAzRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhIHNsaWdodGx5IGlycmVndWxhciB0ZXRyYWhlZHJvbi5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxuICAgICAgICB2YXIgaTEsIGoxLCBrMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGosaykgY29vcmRzXG4gICAgICAgIHZhciBpMiwgajIsIGsyOyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqLGspIGNvb3Jkc1xuICAgICAgICBpZiAoeDAgPj0geTApIHtcbiAgICAgICAgICAgIGlmICh5MCA+PSB6MCkge1xuICAgICAgICAgICAgICAgIGkxID0gMTtcbiAgICAgICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgICAgICAgazEgPSAwO1xuICAgICAgICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICAgICAgICBqMiA9IDE7XG4gICAgICAgICAgICAgICAgazIgPSAwO1xuICAgICAgICAgICAgfSAvLyBYIFkgWiBvcmRlclxuICAgICAgICAgICAgZWxzZSBpZiAoeDAgPj0gejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAwO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWCBaIFkgb3JkZXJcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgICAgICAgazEgPSAxO1xuICAgICAgICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICAgICAgICBqMiA9IDA7XG4gICAgICAgICAgICAgICAgazIgPSAxO1xuICAgICAgICAgICAgfSAvLyBaIFggWSBvcmRlclxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyB4MDx5MFxuICAgICAgICAgICAgaWYgKHkwIDwgejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMTtcbiAgICAgICAgICAgICAgICBpMiA9IDA7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWiBZIFggb3JkZXJcbiAgICAgICAgICAgIGVsc2UgaWYgKHgwIDwgejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAxO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDA7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWSBaIFggb3JkZXJcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgICAgICBqMSA9IDE7XG4gICAgICAgICAgICAgICAgazEgPSAwO1xuICAgICAgICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICAgICAgICBqMiA9IDE7XG4gICAgICAgICAgICAgICAgazIgPSAwO1xuICAgICAgICAgICAgfSAvLyBZIFggWiBvcmRlclxuICAgICAgICB9XG4gICAgICAgIC8vIEEgc3RlcCBvZiAoMSwwLDApIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMsLWMpIGluICh4LHkseiksXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwxLDApIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMsLWMpIGluICh4LHkseiksIGFuZFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMCwxKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsLWMsMS1jKSBpbiAoeCx5LHopLCB3aGVyZVxuICAgICAgICAvLyBjID0gMS82LlxuICAgICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzM7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcbiAgICAgICAgdmFyIHkxID0geTAgLSBqMSArIEczO1xuICAgICAgICB2YXIgejEgPSB6MCAtIGsxICsgRzM7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gaTIgKyAyLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXG4gICAgICAgIHZhciB5MiA9IHkwIC0gajIgKyAyLjAgKiBHMztcbiAgICAgICAgdmFyIHoyID0gejAgLSBrMiArIDIuMCAqIEczO1xuICAgICAgICB2YXIgeDMgPSB4MCAtIDEuMCArIDMuMCAqIEczOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xuICAgICAgICB2YXIgeTMgPSB5MCAtIDEuMCArIDMuMCAqIEczO1xuICAgICAgICB2YXIgejMgPSB6MCAtIDEuMCArIDMuMCAqIEczO1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIGZvdXIgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIHZhciBpaSA9IGkgJiAyNTU7XG4gICAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICAgIHZhciBrayA9IGsgJiAyNTU7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIGZvdXIgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjYgLSB4MCAqIHgwIC0geTAgKiB5MCAtIHowICogejA7XG4gICAgICAgIGlmICh0MCA8IDApIG4wID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTAgPSBwZXJtTW9kMTJbaWkgKyBwZXJtW2pqICsgcGVybVtra11dXSAqIDM7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkM1tnaTBdICogeDAgKyBncmFkM1tnaTAgKyAxXSAqIHkwICsgZ3JhZDNbZ2kwICsgMl0gKiB6MCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC42IC0geDEgKiB4MSAtIHkxICogeTEgLSB6MSAqIHoxO1xuICAgICAgICBpZiAodDEgPCAwKSBuMSA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kxID0gcGVybU1vZDEyW2lpICsgaTEgKyBwZXJtW2pqICsgajEgKyBwZXJtW2trICsgazFdXV0gKiAzO1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSArIGdyYWQzW2dpMSArIDJdICogejEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MiA9IDAuNiAtIHgyICogeDIgLSB5MiAqIHkyIC0gejIgKiB6MjtcbiAgICAgICAgaWYgKHQyIDwgMCkgbjIgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMiA9IHBlcm1Nb2QxMltpaSArIGkyICsgcGVybVtqaiArIGoyICsgcGVybVtrayArIGsyXV1dICogMztcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWQzW2dpMl0gKiB4MiArIGdyYWQzW2dpMiArIDFdICogeTIgKyBncmFkM1tnaTIgKyAyXSAqIHoyKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDMgPSAwLjYgLSB4MyAqIHgzIC0geTMgKiB5MyAtIHozICogejM7XG4gICAgICAgIGlmICh0MyA8IDApIG4zID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTMgPSBwZXJtTW9kMTJbaWkgKyAxICsgcGVybVtqaiArIDEgKyBwZXJtW2trICsgMV1dXSAqIDM7XG4gICAgICAgICAgICB0MyAqPSB0MztcbiAgICAgICAgICAgIG4zID0gdDMgKiB0MyAqIChncmFkM1tnaTNdICogeDMgKyBncmFkM1tnaTMgKyAxXSAqIHkzICsgZ3JhZDNbZ2kzICsgMl0gKiB6Myk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuICAgICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byBzdGF5IGp1c3QgaW5zaWRlIFstMSwxXVxuICAgICAgICByZXR1cm4gMzIuMCAqIChuMCArIG4xICsgbjIgKyBuMyk7XG4gICAgfSxcbiAgICAvLyA0RCBzaW1wbGV4IG5vaXNlLCBiZXR0ZXIgc2ltcGxleCByYW5rIG9yZGVyaW5nIG1ldGhvZCAyMDEyLTAzLTA5XG4gICAgbm9pc2U0RDogZnVuY3Rpb24gKHgsIHksIHosIHcpIHtcbiAgICAgICAgdmFyIHBlcm1Nb2QxMiA9IHRoaXMucGVybU1vZDEyLFxuICAgICAgICAgICAgcGVybSA9IHRoaXMucGVybSxcbiAgICAgICAgICAgIGdyYWQ0ID0gdGhpcy5ncmFkNDtcblxuICAgICAgICB2YXIgbjAsIG4xLCBuMiwgbjMsIG40OyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIGZpdmUgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSAoeCx5LHosdykgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIGNlbGwgb2YgMjQgc2ltcGxpY2VzIHdlJ3JlIGluXG4gICAgICAgIHZhciBzID0gKHggKyB5ICsgeiArIHcpICogRjQ7IC8vIEZhY3RvciBmb3IgNEQgc2tld2luZ1xuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeCArIHMpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeSArIHMpO1xuICAgICAgICB2YXIgayA9IE1hdGguZmxvb3IoeiArIHMpO1xuICAgICAgICB2YXIgbCA9IE1hdGguZmxvb3IodyArIHMpO1xuICAgICAgICB2YXIgdCA9IChpICsgaiArIGsgKyBsKSAqIEc0OyAvLyBGYWN0b3IgZm9yIDREIHVuc2tld2luZ1xuICAgICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseix3KSBzcGFjZVxuICAgICAgICB2YXIgWTAgPSBqIC0gdDtcbiAgICAgICAgdmFyIFowID0gayAtIHQ7XG4gICAgICAgIHZhciBXMCA9IGwgLSB0O1xuICAgICAgICB2YXIgeDAgPSB4IC0gWDA7IC8vIFRoZSB4LHkseix3IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgICB2YXIgeTAgPSB5IC0gWTA7XG4gICAgICAgIHZhciB6MCA9IHogLSBaMDtcbiAgICAgICAgdmFyIHcwID0gdyAtIFcwO1xuICAgICAgICAvLyBGb3IgdGhlIDREIGNhc2UsIHRoZSBzaW1wbGV4IGlzIGEgNEQgc2hhcGUgSSB3b24ndCBldmVuIHRyeSB0byBkZXNjcmliZS5cbiAgICAgICAgLy8gVG8gZmluZCBvdXQgd2hpY2ggb2YgdGhlIDI0IHBvc3NpYmxlIHNpbXBsaWNlcyB3ZSdyZSBpbiwgd2UgbmVlZCB0b1xuICAgICAgICAvLyBkZXRlcm1pbmUgdGhlIG1hZ25pdHVkZSBvcmRlcmluZyBvZiB4MCwgeTAsIHowIGFuZCB3MC5cbiAgICAgICAgLy8gU2l4IHBhaXItd2lzZSBjb21wYXJpc29ucyBhcmUgcGVyZm9ybWVkIGJldHdlZW4gZWFjaCBwb3NzaWJsZSBwYWlyXG4gICAgICAgIC8vIG9mIHRoZSBmb3VyIGNvb3JkaW5hdGVzLCBhbmQgdGhlIHJlc3VsdHMgYXJlIHVzZWQgdG8gcmFuayB0aGUgbnVtYmVycy5cbiAgICAgICAgdmFyIHJhbmt4ID0gMDtcbiAgICAgICAgdmFyIHJhbmt5ID0gMDtcbiAgICAgICAgdmFyIHJhbmt6ID0gMDtcbiAgICAgICAgdmFyIHJhbmt3ID0gMDtcbiAgICAgICAgaWYgKHgwID4geTApIHJhbmt4Kys7XG4gICAgICAgIGVsc2UgcmFua3krKztcbiAgICAgICAgaWYgKHgwID4gejApIHJhbmt4Kys7XG4gICAgICAgIGVsc2UgcmFua3orKztcbiAgICAgICAgaWYgKHgwID4gdzApIHJhbmt4Kys7XG4gICAgICAgIGVsc2UgcmFua3crKztcbiAgICAgICAgaWYgKHkwID4gejApIHJhbmt5Kys7XG4gICAgICAgIGVsc2UgcmFua3orKztcbiAgICAgICAgaWYgKHkwID4gdzApIHJhbmt5Kys7XG4gICAgICAgIGVsc2UgcmFua3crKztcbiAgICAgICAgaWYgKHowID4gdzApIHJhbmt6Kys7XG4gICAgICAgIGVsc2UgcmFua3crKztcbiAgICAgICAgdmFyIGkxLCBqMSwgazEsIGwxOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgc2Vjb25kIHNpbXBsZXggY29ybmVyXG4gICAgICAgIHZhciBpMiwgajIsIGsyLCBsMjsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIHRoaXJkIHNpbXBsZXggY29ybmVyXG4gICAgICAgIHZhciBpMywgajMsIGszLCBsMzsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIGZvdXJ0aCBzaW1wbGV4IGNvcm5lclxuICAgICAgICAvLyBzaW1wbGV4W2NdIGlzIGEgNC12ZWN0b3Igd2l0aCB0aGUgbnVtYmVycyAwLCAxLCAyIGFuZCAzIGluIHNvbWUgb3JkZXIuXG4gICAgICAgIC8vIE1hbnkgdmFsdWVzIG9mIGMgd2lsbCBuZXZlciBvY2N1ciwgc2luY2UgZS5nLiB4Pnk+ej53IG1ha2VzIHg8eiwgeTx3IGFuZCB4PHdcbiAgICAgICAgLy8gaW1wb3NzaWJsZS4gT25seSB0aGUgMjQgaW5kaWNlcyB3aGljaCBoYXZlIG5vbi16ZXJvIGVudHJpZXMgbWFrZSBhbnkgc2Vuc2UuXG4gICAgICAgIC8vIFdlIHVzZSBhIHRocmVzaG9sZGluZyB0byBzZXQgdGhlIGNvb3JkaW5hdGVzIGluIHR1cm4gZnJvbSB0aGUgbGFyZ2VzdCBtYWduaXR1ZGUuXG4gICAgICAgIC8vIFJhbmsgMyBkZW5vdGVzIHRoZSBsYXJnZXN0IGNvb3JkaW5hdGUuXG4gICAgICAgIGkxID0gcmFua3ggPj0gMyA/IDEgOiAwO1xuICAgICAgICBqMSA9IHJhbmt5ID49IDMgPyAxIDogMDtcbiAgICAgICAgazEgPSByYW5reiA+PSAzID8gMSA6IDA7XG4gICAgICAgIGwxID0gcmFua3cgPj0gMyA/IDEgOiAwO1xuICAgICAgICAvLyBSYW5rIDIgZGVub3RlcyB0aGUgc2Vjb25kIGxhcmdlc3QgY29vcmRpbmF0ZS5cbiAgICAgICAgaTIgPSByYW5reCA+PSAyID8gMSA6IDA7XG4gICAgICAgIGoyID0gcmFua3kgPj0gMiA/IDEgOiAwO1xuICAgICAgICBrMiA9IHJhbmt6ID49IDIgPyAxIDogMDtcbiAgICAgICAgbDIgPSByYW5rdyA+PSAyID8gMSA6IDA7XG4gICAgICAgIC8vIFJhbmsgMSBkZW5vdGVzIHRoZSBzZWNvbmQgc21hbGxlc3QgY29vcmRpbmF0ZS5cbiAgICAgICAgaTMgPSByYW5reCA+PSAxID8gMSA6IDA7XG4gICAgICAgIGozID0gcmFua3kgPj0gMSA/IDEgOiAwO1xuICAgICAgICBrMyA9IHJhbmt6ID49IDEgPyAxIDogMDtcbiAgICAgICAgbDMgPSByYW5rdyA+PSAxID8gMSA6IDA7XG4gICAgICAgIC8vIFRoZSBmaWZ0aCBjb3JuZXIgaGFzIGFsbCBjb29yZGluYXRlIG9mZnNldHMgPSAxLCBzbyBubyBuZWVkIHRvIGNvbXB1dGUgdGhhdC5cbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEc0OyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHkxID0geTAgLSBqMSArIEc0O1xuICAgICAgICB2YXIgejEgPSB6MCAtIGsxICsgRzQ7XG4gICAgICAgIHZhciB3MSA9IHcwIC0gbDEgKyBHNDtcbiAgICAgICAgdmFyIHgyID0geDAgLSBpMiArIDIuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzQ7XG4gICAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHNDtcbiAgICAgICAgdmFyIHcyID0gdzAgLSBsMiArIDIuMCAqIEc0O1xuICAgICAgICB2YXIgeDMgPSB4MCAtIGkzICsgMy4wICogRzQ7IC8vIE9mZnNldHMgZm9yIGZvdXJ0aCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTMgPSB5MCAtIGozICsgMy4wICogRzQ7XG4gICAgICAgIHZhciB6MyA9IHowIC0gazMgKyAzLjAgKiBHNDtcbiAgICAgICAgdmFyIHczID0gdzAgLSBsMyArIDMuMCAqIEc0O1xuICAgICAgICB2YXIgeDQgPSB4MCAtIDEuMCArIDQuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5NCA9IHkwIC0gMS4wICsgNC4wICogRzQ7XG4gICAgICAgIHZhciB6NCA9IHowIC0gMS4wICsgNC4wICogRzQ7XG4gICAgICAgIHZhciB3NCA9IHcwIC0gMS4wICsgNC4wICogRzQ7XG4gICAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgZml2ZSBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgICAgdmFyIGpqID0gaiAmIDI1NTtcbiAgICAgICAgdmFyIGtrID0gayAmIDI1NTtcbiAgICAgICAgdmFyIGxsID0gbCAmIDI1NTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgZml2ZSBjb3JuZXJzXG4gICAgICAgIHZhciB0MCA9IDAuNiAtIHgwICogeDAgLSB5MCAqIHkwIC0gejAgKiB6MCAtIHcwICogdzA7XG4gICAgICAgIGlmICh0MCA8IDApIG4wID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTAgPSAocGVybVtpaSArIHBlcm1bamogKyBwZXJtW2trICsgcGVybVtsbF1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDRbZ2kwXSAqIHgwICsgZ3JhZDRbZ2kwICsgMV0gKiB5MCArIGdyYWQ0W2dpMCArIDJdICogejAgKyBncmFkNFtnaTAgKyAzXSAqIHcwKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDEgPSAwLjYgLSB4MSAqIHgxIC0geTEgKiB5MSAtIHoxICogejEgLSB3MSAqIHcxO1xuICAgICAgICBpZiAodDEgPCAwKSBuMSA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kxID0gKHBlcm1baWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMSArIHBlcm1bbGwgKyBsMV1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDRbZ2kxXSAqIHgxICsgZ3JhZDRbZ2kxICsgMV0gKiB5MSArIGdyYWQ0W2dpMSArIDJdICogejEgKyBncmFkNFtnaTEgKyAzXSAqIHcxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejIgLSB3MiAqIHcyO1xuICAgICAgICBpZiAodDIgPCAwKSBuMiA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kyID0gKHBlcm1baWkgKyBpMiArIHBlcm1bamogKyBqMiArIHBlcm1ba2sgKyBrMiArIHBlcm1bbGwgKyBsMl1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDRbZ2kyXSAqIHgyICsgZ3JhZDRbZ2kyICsgMV0gKiB5MiArIGdyYWQ0W2dpMiArIDJdICogejIgKyBncmFkNFtnaTIgKyAzXSAqIHcyKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDMgPSAwLjYgLSB4MyAqIHgzIC0geTMgKiB5MyAtIHozICogejMgLSB3MyAqIHczO1xuICAgICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kzID0gKHBlcm1baWkgKyBpMyArIHBlcm1bamogKyBqMyArIHBlcm1ba2sgKyBrMyArIHBlcm1bbGwgKyBsM11dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDMgKj0gdDM7XG4gICAgICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDRbZ2kzXSAqIHgzICsgZ3JhZDRbZ2kzICsgMV0gKiB5MyArIGdyYWQ0W2dpMyArIDJdICogejMgKyBncmFkNFtnaTMgKyAzXSAqIHczKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDQgPSAwLjYgLSB4NCAqIHg0IC0geTQgKiB5NCAtIHo0ICogejQgLSB3NCAqIHc0O1xuICAgICAgICBpZiAodDQgPCAwKSBuNCA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2k0ID0gKHBlcm1baWkgKyAxICsgcGVybVtqaiArIDEgKyBwZXJtW2trICsgMSArIHBlcm1bbGwgKyAxXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0NCAqPSB0NDtcbiAgICAgICAgICAgIG40ID0gdDQgKiB0NCAqIChncmFkNFtnaTRdICogeDQgKyBncmFkNFtnaTQgKyAxXSAqIHk0ICsgZ3JhZDRbZ2k0ICsgMl0gKiB6NCArIGdyYWQ0W2dpNCArIDNdICogdzQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFN1bSB1cCBhbmQgc2NhbGUgdGhlIHJlc3VsdCB0byBjb3ZlciB0aGUgcmFuZ2UgWy0xLDFdXG4gICAgICAgIHJldHVybiAyNy4wICogKG4wICsgbjEgKyBuMiArIG4zICsgbjQpO1xuICAgIH1cblxuXG59O1xuXG4vLyBhbWRcbmlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gU2ltcGxleE5vaXNlO30pO1xuLy9jb21tb24ganNcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIGV4cG9ydHMuU2ltcGxleE5vaXNlID0gU2ltcGxleE5vaXNlO1xuLy8gYnJvd3NlclxuZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHdpbmRvdy5TaW1wbGV4Tm9pc2UgPSBTaW1wbGV4Tm9pc2U7XG4vLyBub2RlanNcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gU2ltcGxleE5vaXNlO1xufVxuXG59KSgpO1xuIiwidmFyIERpciA9IHt9O1xuXG5EaXIuTEVGVCA9IDA7XG5EaXIuUklHSFQgPSAxO1xuRGlyLkJPVFRPTSA9IDI7XG5EaXIuVVAgPSAzO1xuRGlyLkJBQ0sgPSA0O1xuRGlyLkZST05UID0gNTtcblxuRGlyLmdldFVuaXRWZWN0b3IgPSBmdW5jdGlvbihkaXIpIHtcbiAgc3dpdGNoIChkaXIpIHtcbiAgICBjYXNlIERpci5MRUZUOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKC0xLCAwLCAwKVxuICAgIGNhc2UgRGlyLlJJR0hUOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDEsIDAsIDApXG4gICAgY2FzZSBEaXIuQk9UVE9NOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIC0xLCAwKVxuICAgIGNhc2UgRGlyLlVQOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApXG4gICAgY2FzZSBEaXIuQkFDSzpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAtMSlcbiAgICBjYXNlIERpci5GUk9OVDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKVxuICB9XG59O1xuXG5EaXIuZ2V0T3Bwb3NpdGUgPSBmdW5jdGlvbihkaXIpIHtcbiAgdmFyIG9wcG9zaXRlcyA9IHtcbiAgICAwOiAxLFxuICAgIDE6IDAsXG4gICAgMjogMyxcbiAgICAzOiAyLFxuICAgIDQ6IDUsXG4gICAgNTogNFxuICB9O1xuXG4gIHJldHVybiBvcHBvc2l0ZXNbZGlyXTtcbn07XG5cbkRpci5pc09wcG9zaXRlID0gZnVuY3Rpb24oZGlyLCBkaXIyKSB7XG4gIHJldHVybiBEaXIuZ2V0T3Bwb3NpdGUoZGlyKSA9PT0gZGlyMjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyO1xuIiwidmFyIFNpbXBsZXhOb2lzZSA9IHJlcXVpcmUoJ3NpbXBsZXgtbm9pc2UnKTtcblxudmFyIG1lc2hlciA9IHJlcXVpcmUoJy4uL3ZveGVsL21lc2hlcicpO1xudmFyIERpciA9IHJlcXVpcmUoJy4uL2RpcicpO1xudmFyIENodW5rcyA9IHJlcXVpcmUoJy4uL3ZveGVsL2NodW5rcycpO1xudmFyIG1lc2hDaHVua3MgPSByZXF1aXJlKCcuLi92b3hlbC9tZXNoY2h1bmtzJyk7XG5cbnZhciBDTE9VRCA9IDEwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBhcmVudCwgbWF0ZXJpYWwpIHtcblxuICB2YXIgY2h1bmtzID0gbmV3IENodW5rcygpO1xuICB2YXIgZGF0YU1hcCA9IHt9O1xuICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIHBhcmVudC5hZGQob2JqZWN0KTtcblxuICB2YXIgbm9pc2UxID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUYxID0gMC4xO1xuICB2YXIgbm9pc2UyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUYyID0gMC4wNTtcbiAgdmFyIG5vaXNlX3ByZXNzdXJlID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZV9wcmVzc3VyZUYgPSAwLjAwMjtcbiAgdmFyIGNsb3VkQW1vdW50ID0gLTEuMDtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICB2YXIgY29vbGRvd24gPSA0LjI7XG5cbiAgdmFyIGFsbENvb3JkcyA9IHt9O1xuXG4gIHZhciBzaXplID0gNDE7XG4gIHZhciBjZW50ZXJOdW0gPSAoc2l6ZSAvIDIpO1xuICB2YXIgY2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoLXNpemUgLyAyLCAtc2l6ZSAvIDIsIC1zaXplIC8gMik7XG5cbiAgdmFyIGNsb3VkVm94ZWwgPSBbXG4gICAgQ0xPVUQsIENMT1VELCBDTE9VRCwgQ0xPVUQsIENMT1VELCBDTE9VRFxuICBdO1xuXG4gIGluaXREYXRhKCk7XG5cbiAgZnVuY3Rpb24gaW5pdERhdGEoKSB7XG4gICAgdmFyIGNvb3JkID0gW107XG5cbiAgICBmb3IgKHZhciBkaXIgPSAwOyBkaXIgPCA2OyBkaXIrKykge1xuICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKGRpciAvIDIpO1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG4gICAgICB2YXIgY29vcmREID0gZGlyICUgMiA/IDAgOiBzaXplIC0gMTtcbiAgICAgIHZhciBmYWxsRGlyID0gY29vcmREID09PSAwID8gMSA6IC0xO1xuICAgICAgdmFyIGZhbGxDb29yZEQgPSBjb29yZEQgKyBmYWxsRGlyO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICAgIGNvb3JkW2RdID0gY29vcmREO1xuICAgICAgICAgIGNvb3JkW3VdID0gaTtcbiAgICAgICAgICBjb29yZFt2XSA9IGo7XG5cbiAgICAgICAgICB2YXIgcmVsID0gW1xuICAgICAgICAgICAgKGNvb3JkWzBdICsgY2VudGVyLngpLFxuICAgICAgICAgICAgKGNvb3JkWzFdICsgY2VudGVyLnkpLFxuICAgICAgICAgICAgKGNvb3JkWzJdICsgY2VudGVyLnopXG4gICAgICAgICAgXTtcblxuICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgcHJlc3N1cmU6IG5vaXNlX3ByZXNzdXJlLm5vaXNlM0QoXG4gICAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlX3ByZXNzdXJlRixcbiAgICAgICAgICAgICAgcmVsWzFdICogbm9pc2VfcHJlc3N1cmVGLFxuICAgICAgICAgICAgICByZWxbMl0gKiBub2lzZV9wcmVzc3VyZUZcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBhbW91bnQ6IDAsXG4gICAgICAgICAgICBkZWx0YTogMCxcbiAgICAgICAgICAgIGNvb3JkOiBbY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXV1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIGhhc2ggPSBjb29yZC5qb2luKCcsJyk7XG4gICAgICAgICAgYWxsQ29vcmRzW2hhc2hdID0gW2Nvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl1dO1xuICAgICAgICAgIGRhdGFNYXBbaGFzaF0gPSBkYXRhO1xuXG4gICAgICAgICAgdmFyIHZhbHVlID0gbm9pc2UxLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYxLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGMSxcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRjFcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdmFyIHZhbHVlMiA9IG5vaXNlMi5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYyXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHZhbHVlID0gTWF0aC5wb3codmFsdWUgKyB2YWx1ZTIsIDEpICsgY2xvdWRBbW91bnQ7XG5cbiAgICAgICAgICBpZiAodmFsdWUgPiAwLjApIHtcbiAgICAgICAgICAgIGNodW5rcy5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgY2xvdWRWb3hlbCk7XG4gICAgICAgICAgICBkYXRhLmFtb3VudCArPSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRhdGEubmVpZ2hib3VycyA9IFtdO1xuXG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGkgLSAxLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGkgPT09IHNpemUgLSAxKSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChmYWxsQ29vcmRELCBpLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGNvb3JkRCwgaSArIDEsIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGksIGogLSAxLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGogPT09IHNpemUgLSAxKSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChmYWxsQ29vcmRELCBpLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGNvb3JkRCwgaSwgaiArIDEsIGQsIHUsIHYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZGlyID09PSAwKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1swXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gMSkge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMV07XG4gICAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09IDIpIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAzKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1syXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlbEkgPSBpIC0gY2VudGVyTnVtO1xuICAgICAgICAgICAgdmFyIHJlbEogPSBqIC0gY2VudGVyTnVtO1xuXG4gICAgICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKHJlbEksIHJlbEopO1xuICAgICAgICAgICAgYW5nbGUgPSBub3JtYWxpemVBbmdsZShhbmdsZSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZUFuZ2xlKGFuZ2xlKSB7XG4gICAgICAgICAgICAgIGFuZ2xlICU9IChNYXRoLlBJICogMik7XG4gICAgICAgICAgICAgIGlmIChhbmdsZSA8IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICBhbmdsZSArPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmdsZSA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICBhbmdsZSAtPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gYW5nbGU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gTWF0aC5QSSAvIDQ7XG4gICAgICAgICAgICB2YXIgc3RlcCA9IE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gLU1hdGguUEk7XG5cbiAgICAgICAgICAgIGlmIChhbmdsZSA+PSBvZmZzZXQgJiYgYW5nbGUgPCBvZmZzZXQgKyBzdGVwKSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbmdsZSA+PSBvZmZzZXQgKyBzdGVwICYmIGFuZ2xlIDwgb2Zmc2V0ICsgc3RlcCAqIDIpIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMl07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ2xlID49IG9mZnNldCAtIHN0ZXAgJiYgYW5nbGUgPCBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbM107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0Q29vcmQoaSwgaiwgaywgZCwgdSwgdikge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGNvb3JkW2RdID0gaTtcbiAgICBjb29yZFt1XSA9IGo7XG4gICAgY29vcmRbdl0gPSBrO1xuICAgIHJldHVybiBjb29yZDtcbiAgfVxuXG4gIHVwZGF0ZU1lc2goKTtcblxuICBvYmplY3QucG9zaXRpb24uY29weShjZW50ZXIpO1xuXG4gIGZ1bmN0aW9uIHRpY2soZHQpIHtcbiAgICBjb3VudGVyICs9IGR0O1xuICAgIGlmIChjb3VudGVyID4gY29vbGRvd24pIHtcbiAgICAgIGNvdW50ZXIgLT0gY29vbGRvd247XG5cbiAgICAgIHZhciBjaGFuZ2VkID0ge307XG4gICAgICBmb3IgKHZhciBpZCBpbiBhbGxDb29yZHMpIHtcbiAgICAgICAgdmFyIGNvb3JkID0gYWxsQ29vcmRzW2lkXTtcbiAgICAgICAgdmFyIGRhdGEgPSBkYXRhTWFwW2lkXTtcbiAgICAgICAgdmFyIG5leHRDb29yZCA9IGRhdGEubmV4dENvb3JkO1xuICAgICAgICBpZiAobmV4dENvb3JkID09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLmFtb3VudCA8PSAwKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV4dEhhc2ggPSBuZXh0Q29vcmQuam9pbignLCcpO1xuICAgICAgICB2YXIgbmV4dERhdGEgPSBkYXRhTWFwW25leHRIYXNoXTtcbiAgICAgICAgY2hhbmdlZFtuZXh0SGFzaF0gPSB0cnVlO1xuICAgICAgICBjaGFuZ2VkW2lkXSA9IHRydWU7XG5cbiAgICAgICAgbmV4dERhdGEuZGVsdGEgKz0gMS4wO1xuICAgICAgICBkYXRhLmRlbHRhICs9IC0xLjA7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGlkIGluIGNoYW5nZWQpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBkYXRhTWFwW2lkXTtcbiAgICAgICAgdmFyIGNvb3JkID0gZGF0YS5jb29yZDtcbiAgICAgICAgZGF0YS5hbW91bnQgKz0gZGF0YS5kZWx0YTtcbiAgICAgICAgZGF0YS5kZWx0YSA9IDA7XG5cbiAgICAgICAgaWYgKGRhdGEuYW1vdW50ID49IDEuMCkge1xuICAgICAgICAgIGNodW5rcy5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgY2xvdWRWb3hlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2h1bmtzLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cGRhdGVNZXNoKCk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZU1lc2goKSB7XG4gICAgbWVzaENodW5rcyhjaHVua3MsIG9iamVjdCwgbWF0ZXJpYWwpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdGljazogdGlja1xuICB9O1xufVxuIiwidmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIgU2ltcGxleE5vaXNlID0gcmVxdWlyZSgnc2ltcGxleC1ub2lzZScpO1xuXG52YXIgVm94ZWwgPSByZXF1aXJlKCcuLi92b3hlbCcpO1xudmFyIERpciA9IHJlcXVpcmUoJy4uL2RpcicpO1xuXG52YXIgQ2h1bmtzID0gVm94ZWwuQ2h1bmtzO1xudmFyIG1lc2hDaHVua3MgPSBWb3hlbC5tZXNoQ2h1bmtzO1xudmFyIHJlbW92ZUZsb2F0aW5nID0gVm94ZWwucmVtb3ZlRmxvYXRpbmc7XG5cbnZhciBHUkFTUyA9IDE7XG52YXIgU09JTCA9IDI7XG52YXIgU09JTF9FREdFID0gMztcbnZhciBTVE9ORSA9IDQ7XG52YXIgU0VBID0gNTtcbnZhciBTQU5EID0gNjtcblxudmFyIExFVkVMX1NVUkZBQ0UgPSAxO1xudmFyIExFVkVMX01JRERMRSA9IDI7XG52YXIgTEVWRUxfQ09SRSA9IDM7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2l6ZSwgcGFyZW50LCBtYXRlcmlhbCkge1xuICB2YXIgbm9pc2Vfc3VyZmFjZSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX3N1cmZhY2UgPSAwLjE7XG4gIHZhciBub2lzZV9zdXJmYWNlMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX3N1cmZhY2UyID0gMC4wNDtcblxuICB2YXIgbm9pc2VfYmlvbWVzID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZV9iaW9tZXMyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZV9iaW9tZXMzID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG5cbiAgdmFyIG5vaXNlX2Jpb21lc190cmVlcyA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX2Jpb21lc190cmVlcyA9IDAuMTtcblxuICB2YXIgbm9pc2VfYmlvbWVzX3RyZWVzMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX2Jpb21lc190cmVlczIgPSAwLjA0O1xuXG4gIHZhciBCSU9NRV9WQUxVRV9TVE9ORSA9IC0wLjg7XG4gIHZhciBCSU9NRV9WQUxVRV9TT0lMID0gMDtcblxuICB2YXIgZ3JvdW5kID0gbmV3IENodW5rcygpO1xuICB2YXIgd2F0ZXIgPSBuZXcgQ2h1bmtzKCk7XG4gIHZhciBib3VuZHMgPSB7XG4gICAgbWluOiBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSxcbiAgICBzaXplOiBuZXcgVEhSRUUuVmVjdG9yMyhzaXplLCBzaXplLCBzaXplKVxuICB9O1xuXG4gIHZhciBjZW50ZXIgPSBbLXNpemUgLyAyICsgMC41LCAtc2l6ZSAvIDIgKyAwLjUsIC1zaXplIC8gMiArIDAuNV07XG4gIHZhciBjZW50ZXJDb29yZCA9IFtcbiAgICBNYXRoLmZsb29yKHNpemUgLyAyKSxcbiAgICBNYXRoLmZsb29yKHNpemUgLyAyKSxcbiAgICBNYXRoLmZsb29yKHNpemUgLyAyKVxuICBdO1xuXG4gIC8vIGhhc2ggLT4gZGF0YVxuICAvLyBncmF2aXR5OiBncmF2aXR5IChzKVxuICAvLyBiaW9tZTogYmlvbWUgZGF0YVxuICAvLyBoZWlnaHQ6IGhlaWdodCBvZiBzdXJmYWNlXG4gIHZhciBkYXRhTWFwID0ge307XG4gIHZhciBzdXJmYWNlTWFwID0ge307XG5cbiAgdmFyIHN1cmZhY2VOdW0gPSA2O1xuICB2YXIgc2VhTGV2ZWwgPSAyO1xuXG4gIGluaXQoKTtcbiAgZ2VuZXJhdGVHcmF2aXR5TWFwKCk7XG4gIGdlbmVyYXRlQnVtcHMoKTtcbiAgcmVtb3ZlRmxvYXRpbmcoZ3JvdW5kLCBjZW50ZXJDb29yZCk7XG4gIGdlbmVyYXRlU2VhKCk7XG4gIGdlbmVyYXRlQmlvbWVzKCk7XG4gIGdlbmVyYXRlVGlsZXMoKTtcbiAgZ2VuZXJhdGVTdXJmYWNlKCk7XG5cbiAgdmFyIHBpdm90ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgdmFyIGdyb3VuZE9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBwaXZvdC5hZGQoZ3JvdW5kT2JqZWN0KTtcbiAgbWVzaENodW5rcyhncm91bmQsIGdyb3VuZE9iamVjdCwgbWF0ZXJpYWwpO1xuICBtZXNoQ2h1bmtzKHdhdGVyLCBwaXZvdCwgbWF0ZXJpYWwpO1xuXG4gIHZhciBwb3NpdGlvbkNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICAuc3ViVmVjdG9ycyhib3VuZHMubWluLCBib3VuZHMuc2l6ZSlcbiAgICAubXVsdGlwbHlTY2FsYXIoMC41KTtcbiAgcGl2b3QucG9zaXRpb24uY29weShwb3NpdGlvbkNlbnRlcik7XG4gIHBhcmVudC5hZGQocGl2b3QpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XG4gICAgICAgICAgZ3JvdW5kLnNldChpLCBqLCBrLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVNlYSgpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IDM7IGQrKykge1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG4gICAgICBbc2VhTGV2ZWwsIHNpemUgLSBzZWFMZXZlbCAtIDFdLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgICAgICBmb3IgKHZhciBpID0gc2VhTGV2ZWw7IGkgPCBzaXplIC0gc2VhTGV2ZWw7IGkrKykge1xuICAgICAgICAgIGZvciAodmFyIGogPSBzZWFMZXZlbDsgaiA8IHNpemUgLSBzZWFMZXZlbDsgaisrKSB7XG4gICAgICAgICAgICBjb29yZFtkXSA9IGM7XG4gICAgICAgICAgICBjb29yZFt1XSA9IGk7XG4gICAgICAgICAgICBjb29yZFt2XSA9IGo7XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICAgIHZhciBncmF2aXR5ID0gZGF0YS5ncmF2aXR5O1xuXG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBbXG4gICAgICAgICAgICAgIDAsIDAsIDAsIDAsIDAsIDBcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGcgaW4gZ3Jhdml0eSkge1xuICAgICAgICAgICAgICBibG9ja1tnXSA9IFNFQTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFncm91bmQuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pKSB7XG4gICAgICAgICAgICAgIHdhdGVyLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCBibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVCaW9tZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XG4gICAgICAgICAgdmFyIHYgPSBncm91bmQuZ2V0KGksIGosIGspO1xuICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGQgPSBNYXRoLm1heChcbiAgICAgICAgICAgIE1hdGguYWJzKGkgKyBjZW50ZXJbMF0pLFxuICAgICAgICAgICAgTWF0aC5hYnMoaiArIGNlbnRlclsxXSksXG4gICAgICAgICAgICBNYXRoLmFicyhrICsgY2VudGVyWzJdKSk7XG5cbiAgICAgICAgICB2YXIgcmVsU2VhTGV2ZWwgPSAoc2l6ZSAvIDIgLSBkIC0gc2VhTGV2ZWwgLSAwLjUpO1xuXG4gICAgICAgICAgZCAvPSAoc2l6ZSAvIDIpO1xuXG4gICAgICAgICAgdmFyIG5vaXNlRiA9IDAuMDU7XG4gICAgICAgICAgdmFyIG5vaXNlRjIgPSAwLjAyO1xuICAgICAgICAgIHZhciBub2lzZUYzID0gMC4wMjtcblxuICAgICAgICAgIHZhciByZWwgPSBbaSArIGNlbnRlclswXSwgaiArIGNlbnRlclsxXSwgayArIGNlbnRlclsyXV07XG4gICAgICAgICAgdmFyIHZhbHVlID0gbm9pc2VfYmlvbWVzLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUYsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYpO1xuXG4gICAgICAgICAgdmFyIHZhbHVlMiA9IG5vaXNlX2Jpb21lczIubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUYyLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGMik7XG5cbiAgICAgICAgICB2YXIgdmFsdWUzID0gbm9pc2VfYmlvbWVzMy5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMyxcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjMsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYzXG4gICAgICAgICAgKSArIHZhbHVlO1xuXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSAqIDAuNSArIHZhbHVlMiAqIDIuMDtcblxuICAgICAgICAgIHZhciBiaW9tZSA9IHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbHVlMjogdmFsdWUzLFxuICAgICAgICAgICAgcmVsU2VhTGV2ZWw6IHJlbFNlYUxldmVsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciB2YWx1ZVRyZWUgPSBub2lzZV9iaW9tZXNfdHJlZXMubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUZfYmlvbWVzX3RyZWVzLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGX2Jpb21lc190cmVlc1xuICAgICAgICAgICkgKyBub2lzZV9iaW9tZXNfdHJlZXMyLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUZfYmlvbWVzX3RyZWVzMixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMyLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGX2Jpb21lc190cmVlczJcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gQklPTUUgYmlhcyBmb3IgdHJlZVxuICAgICAgICAgIGlmICh2YWx1ZSA8IEJJT01FX1ZBTFVFX1NUT05FKSB7XG4gICAgICAgICAgICB2YWx1ZVRyZWUgLT0gMS4wO1xuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPCBCSU9NRV9WQUxVRV9TT0lMKSB7XG4gICAgICAgICAgICB2YWx1ZVRyZWUgLT0gMC41O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJpb21lLnRyZWUgPSB2YWx1ZVRyZWU7XG5cbiAgICAgICAgICB2YXIgbGV2ZWw7XG5cbiAgICAgICAgICBpZiAoZCA+IDAuNykge1xuICAgICAgICAgICAgLy8gc3VyZmFjZVxuICAgICAgICAgICAgbGV2ZWwgPSBMRVZFTF9TVVJGQUNFO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZCA+IDAuMykge1xuICAgICAgICAgICAgLy8gbWlkZGxlXG4gICAgICAgICAgICBsZXZlbCA9IExFVkVMX01JRERMRTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29yZVxuICAgICAgICAgICAgbGV2ZWwgPSBMRVZFTF9DT1JFO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJpb21lLmxldmVsID0gbGV2ZWw7XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoaSwgaiwgayk7XG4gICAgICAgICAgZGF0YS5iaW9tZSA9IGJpb21lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlR3Jhdml0eU1hcCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICB2YXIgbWFwID0ge307XG4gICAgICAgICAgdmFyIGdyYXZpdHkgPSBjYWxjR3Jhdml0eShpLCBqLCBrKTtcbiAgICAgICAgICBncmF2aXR5LmZvckVhY2goZnVuY3Rpb24oZykge1xuICAgICAgICAgICAgbWFwW2ddID0gdHJ1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoaSwgaiwgayk7XG4gICAgICAgICAgZGF0YS5ncmF2aXR5ID0gbWFwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGNhbGNHcmF2aXR5KGksIGosIGspIHtcbiAgICB2YXIgYXJyYXkgPSBbXG4gICAgICBpICsgY2VudGVyWzBdLFxuICAgICAgaiArIGNlbnRlclsxXSxcbiAgICAgIGsgKyBjZW50ZXJbMl1cbiAgICBdO1xuICAgIHZhciBtYXggPSAtSW5maW5pdHk7XG4gICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICB2YXIgZjtcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGFycmF5Lmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgYSA9IE1hdGguYWJzKGFycmF5W2RdKTtcbiAgICAgIGlmIChhID4gbWF4KSB7XG4gICAgICAgIG1heCA9IGE7XG4gICAgICAgIGYgPSBkICogMiArIChhcnJheVtkXSA+IDAgPyAwIDogMSk7XG4gICAgICAgIGluZGV4ZXMgPSBbZl07XG4gICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGEgLSBtYXgpIDwgMC4wMSkge1xuICAgICAgICBmID0gZCAqIDIgKyAoYXJyYXlbZF0gPiAwID8gMCA6IDEpO1xuICAgICAgICBpbmRleGVzLnB1c2goZik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleGVzO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQnVtcHMoKSB7XG4gICAgLy8gR2VuZXJhdGUgc3VyZmFjZVxuXG4gICAgdmFyIGNSYW5nZSA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdXJmYWNlTnVtOyBpKyspIHtcbiAgICAgIGNSYW5nZS5wdXNoKDAgKyBpLCBzaXplIC0gMSAtIGkpO1xuICAgIH1cblxuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgZCsrKSB7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIGNSYW5nZS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNpemU7IGsrKykge1xuXG4gICAgICAgICAgICB2YXIgZGlzID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgIE1hdGguYWJzKGNvb3JkWzBdICsgY2VudGVyWzBdKSxcbiAgICAgICAgICAgICAgTWF0aC5hYnMoY29vcmRbMV0gKyBjZW50ZXJbMV0pLFxuICAgICAgICAgICAgICBNYXRoLmFicyhjb29yZFsyXSArIGNlbnRlclsyXSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHZhciBkaXNCaWFzID0gMSAtIChzaXplIC8gMiArIDAuNSAtIGRpcykgLyBzdXJmYWNlTnVtO1xuXG4gICAgICAgICAgICBjb29yZFtkXSA9IGM7XG4gICAgICAgICAgICBjb29yZFt1XSA9IGo7XG4gICAgICAgICAgICBjb29yZFt2XSA9IGs7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBbMCwgMCwgMF07XG4gICAgICAgICAgICB2YXIgb2Zmc2V0MiA9IFswLCAwLCAwXTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlID0gbm9pc2Vfc3VyZmFjZS5ub2lzZTNEKFxuICAgICAgICAgICAgICAoY29vcmRbMF0gKyBjZW50ZXJbMF0gKyBvZmZzZXRbMF0pICogbm9pc2VGX3N1cmZhY2UsXG4gICAgICAgICAgICAgIChjb29yZFsxXSArIGNlbnRlclsxXSArIG9mZnNldFsxXSkgKiBub2lzZUZfc3VyZmFjZSxcbiAgICAgICAgICAgICAgKGNvb3JkWzJdICsgY2VudGVyWzJdICsgb2Zmc2V0WzJdKSAqIG5vaXNlRl9zdXJmYWNlKTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlMiA9IG5vaXNlX3N1cmZhY2UyLm5vaXNlM0QoXG4gICAgICAgICAgICAgIChjb29yZFswXSArIGNlbnRlclswXSArIG9mZnNldDJbMF0pICogbm9pc2VGX3N1cmZhY2UyLFxuICAgICAgICAgICAgICAoY29vcmRbMV0gKyBjZW50ZXJbMV0gKyBvZmZzZXQyWzFdKSAqIG5vaXNlRl9zdXJmYWNlMixcbiAgICAgICAgICAgICAgKGNvb3JkWzJdICsgY2VudGVyWzJdICsgb2Zmc2V0MlsyXSkgKiBub2lzZUZfc3VyZmFjZTIpO1xuXG4gICAgICAgICAgICB2YWx1ZSA9XG4gICAgICAgICAgICAgIChNYXRoLnBvdyh2YWx1ZTIgLyAxLjUsIDEpICogZGlzQmlhcykgK1xuICAgICAgICAgICAgICAoLU1hdGgucG93KGRpc0JpYXMsIDEuMCkgKiAxLjAgKyAwLjYpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAwLjApIHtcbiAgICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgICBkYXRhLmhlaWdodCA9IHZhbHVlO1xuICAgICAgICAgICAgICBncm91bmQuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU3VyZmFjZSgpIHtcbiAgICBncm91bmQudmlzaXQoZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGksIGosIGspO1xuICAgICAgdmFyIHN1cmZhY2UgPSBkYXRhLnN1cmZhY2UgfHwge307XG4gICAgICB2YXIgZ3Jhdml0eSA9IGRhdGEuZ3Jhdml0eTtcblxuICAgICAgZm9yICh2YXIgZiBpbiBncmF2aXR5KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBpc1N1cmZhY2UoaSwgaiwgaywgZik7XG5cbiAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgIHZhciBoYXNoID0gW2ksIGosIGssIGZdLmpvaW4oJywnKTtcbiAgICAgICAgICBzdXJmYWNlTWFwW2hhc2hdID0gW2ksIGosIGssIGZdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdyYXZpdHkgPSBkYXRhLmdyYXZpdHk7XG4gICAgICAgIGlmIChncmF2aXR5W2ZdKSB7XG4gICAgICAgICAgc3VyZmFjZVtmXSA9IHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGlzU3VyZmFjZShpLCBqLCBrLCBmKSB7XG4gICAgdmFyIGQgPSBNYXRoLmZsb29yKGYgLyAyKTsgLy8gMCAxIDIgXG4gICAgdmFyIGRkID0gKGYgLSBkICogMikgPyAtMSA6IDE7IC8vIC0xIG9yIDFcblxuICAgIHZhciBjb29yZCA9IFtpLCBqLCBrXTtcbiAgICBjb29yZFtkXSArPSBkZDtcblxuICAgIHJldHVybiAhZ3JvdW5kLmdldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKSAmJiAhd2F0ZXIuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlVGlsZXMoKSB7XG4gICAgdmFyIGNvb3JkID0gW107XG4gICAgLy8gR2VuZXJhdGUgZ3Jhc3Nlc1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNpemU7IGsrKykge1xuICAgICAgICAgIHZhciB2ID0gZ3JvdW5kLmdldChpLCBqLCBrKTtcbiAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGdyb3VuZC5zZXQoaSwgaiwgaywgW1xuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMCksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAxKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDIpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMyksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCA0KSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDUpXG4gICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQocG9zLCBmKSB7XG4gICAgICB2YXIgZCA9IE1hdGguZmxvb3IoZiAvIDIpOyAvLyAwIDEgMlxuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG5cbiAgICAgIHZhciBkZCA9IChmIC0gZCAqIDIpID8gLTEgOiAxOyAvLyAtMSBvciAxXG5cbiAgICAgIGNvb3JkW2RdID0gcG9zW2RdICsgZGQ7XG4gICAgICBjb29yZFt1XSA9IHBvc1t1XTtcbiAgICAgIGNvb3JkW3ZdID0gcG9zW3ZdO1xuXG4gICAgICB2YXIgZGF0YSA9IGdldERhdGEocG9zWzBdLCBwb3NbMV0sIHBvc1syXSk7XG4gICAgICB2YXIgYmlvbWUgPSBkYXRhLmJpb21lO1xuXG4gICAgICB2YXIgbGV2ZWwgPSBiaW9tZS5sZXZlbDtcbiAgICAgIHZhciB2YWx1ZSA9IGJpb21lLnZhbHVlO1xuXG4gICAgICBpZiAobGV2ZWwgPT09IExFVkVMX1NVUkZBQ0UpIHtcblxuICAgICAgICAvLyBJZiBhdCBzZWEgbGV2ZWwsIGdlbmVyYXRlIHNhbmRcbiAgICAgICAgaWYgKGJpb21lLnJlbFNlYUxldmVsID09PSAwKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgIHZhciBoZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgICAgICBpZiAoYmlvbWUudmFsdWUyICogaGVpZ2h0IDwgLTAuMSkge1xuICAgICAgICAgICAgdmFyIGFib3ZlID0gZ3JvdW5kLmdldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICAgIHZhciBpc1N1cmZhY2UgPSAhYWJvdmU7XG4gICAgICAgICAgICBpZiAoaXNTdXJmYWNlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBTQU5EO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZSA8IEJJT01FX1ZBTFVFX1NUT05FKSB7XG4gICAgICAgICAgcmV0dXJuIFNUT05FO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIDwgQklPTUVfVkFMVUVfU09JTCkge1xuICAgICAgICAgIHJldHVybiBTT0lMO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR1JBU1NcblxuICAgICAgICAvLyBubyBncmFzcyBiZWxvd1xuICAgICAgICAvLyBpZiAoYmlvbWUucmVsU2VhTGV2ZWwgPiAwKSB7XG4gICAgICAgIC8vICAgcmV0dXJuIFNPSUw7XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyBPbiBlZGdlXG4gICAgICAgIGlmIChwb3NbZF0gPT09IDAgfHwgcG9zW2RdID09PSBzaXplIC0gMSkge1xuICAgICAgICAgIHJldHVybiBHUkFTUztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhYm92ZSA9IGdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG5cbiAgICAgICAgdmFyIGlzU3VyZmFjZSA9ICFhYm92ZTtcblxuICAgICAgICByZXR1cm4gaXNTdXJmYWNlID8gR1JBU1MgOiBTT0lMO1xuXG4gICAgICB9IGVsc2UgaWYgKGxldmVsID09PSBMRVZFTF9NSURETEUpIHtcblxuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PT0gTEVWRUxfQ09SRSkge1xuXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBTVE9ORTtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldERhdGEoaSwgaiwgaykge1xuICAgIHZhciBoYXNoID0gW2ksIGosIGtdLmpvaW4oJywnKTtcbiAgICBpZiAoZGF0YU1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgICBkYXRhTWFwW2hhc2hdID0ge307XG4gICAgfVxuICAgIHJldHVybiBkYXRhTWFwW2hhc2hdO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ3JvdW5kOiBncm91bmQsXG4gICAgd2F0ZXI6IHdhdGVyLFxuICAgIGJvdW5kczogYm91bmRzLFxuICAgIG9iamVjdDogcGl2b3QsXG4gICAgY2FsY0dyYXZpdHk6IGNhbGNHcmF2aXR5LFxuICAgIHN1cmZhY2VNYXA6IHN1cmZhY2VNYXAsXG4gICAgZ3JvdW5kT2JqZWN0OiBncm91bmRPYmplY3QsXG4gICAgZ2V0RGF0YTogZ2V0RGF0YVxuICB9O1xufTtcbiIsInZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFZveGVsID0gcmVxdWlyZSgnLi4vdm94ZWwnKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuLi9kaXInKTtcblxudmFyIENodW5rcyA9IFZveGVsLkNodW5rcztcbnZhciB2aXNpdFNoYXBlID0gVm94ZWwudmlzaXRTaGFwZTtcbnZhciBtZXNoQ2h1bmtzID0gVm94ZWwubWVzaENodW5rcztcbnZhciBjb3B5Q2h1bmtzID0gVm94ZWwuY29weUNodW5rcztcbnZhciByZW1vdmVGbG9hdGluZyA9IFZveGVsLnJlbW92ZUZsb2F0aW5nO1xuXG52YXIgVFJVTksgPSBbMjAsIDIwLCAyMCwgMjAsIDIwLCAyMF07XG52YXIgTEVBRiA9IFsyMSwgMjEsIDIxLCAyMSwgMjEsIDIxXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJlbnQsIGJsb2NrTWF0ZXJpYWwsIHRlcnJpYW4pIHtcbiAgdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcblxuICBmdW5jdGlvbiBhZGQoY29vcmQsIGRpcikge1xuXG4gICAgdmFyIHNoYXBlUmF0aW8gPSAyO1xuICAgIHZhciBsZWFmSGVpZ2h0ID0gMztcbiAgICB2YXIgZGVuc2l0eSA9IDAuODtcbiAgICB2YXIgc2l6ZTEgPSAzO1xuICAgIHZhciBzaXplMiA9IDM7XG4gICAgdmFyIHNoYXBlMSA9IE1hdGgucmFuZG9tKCkgKiBzaXplMSArIHNpemUyO1xuICAgIHZhciBzaGFwZTIgPSBzaGFwZTEgKiBzaGFwZVJhdGlvO1xuICAgIHZhciB0cnVua0hlaWdodCA9IGxlYWZIZWlnaHQgKyBzaGFwZTIgLSA0O1xuXG4gICAgdmFyIHJhZGl1cyA9IHNoYXBlMSAqIE1hdGguc3FydCgyKSAvIDI7XG5cbiAgICBpZiAoZGlyID09IG51bGwpIHtcbiAgICAgIHZhciB0ZXJyaWFuQ29vcmQgPSBjb29yZC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNlbGYuc2NhbGUpO1xuICAgICAgdmFyIGdyYXZpdHkgPSB0ZXJyaWFuLmNhbGNHcmF2aXR5KHRlcnJpYW5Db29yZC54LCB0ZXJyaWFuQ29vcmQueSwgdGVycmlhbkNvb3JkLnopO1xuICAgICAgZGlyID0gRGlyLmdldE9wcG9zaXRlKGdyYXZpdHlbTWF0aC5mbG9vcihncmF2aXR5Lmxlbmd0aCAqIE1hdGgucmFuZG9tKCkpXSk7XG4gICAgfVxuXG4gICAgdmFyIHVwVmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCk7XG4gICAgdmFyIHVuaXRWZWN0b3IgPSBEaXIuZ2V0VW5pdFZlY3RvcihkaXIpO1xuICAgIHZhciBxdWF0ID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tVW5pdFZlY3RvcnModXBWZWN0b3IsIHVuaXRWZWN0b3IpO1xuICAgIHZhciBkID0gTWF0aC5mbG9vcihkaXIgLyAyKTtcbiAgICB2YXIgc2lkZSA9IGRpciAlIDIgPT09IDA7XG5cbiAgICB2YXIgbGVhZlNoYXBlID0gW3NoYXBlMSwgc2hhcGUyLCBzaGFwZTFdO1xuXG4gICAgdmFyIGxlYWZDZW50ZXIgPSBbXG4gICAgICBNYXRoLnJvdW5kKC1sZWFmU2hhcGVbMF0gLyAyKSxcbiAgICAgIE1hdGgucm91bmQoLWxlYWZTaGFwZVsxXSAvIDIpLFxuICAgICAgTWF0aC5yb3VuZCgtbGVhZlNoYXBlWzJdIC8gMilcbiAgICBdO1xuXG4gICAgdmFyIGNodW5rczIgPSBuZXcgQ2h1bmtzKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRydW5rSGVpZ2h0OyBpKyspIHtcbiAgICAgIHZhciBjID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgaSwgMCkuYXBwbHlRdWF0ZXJuaW9uKHF1YXQpO1xuICAgICAgaWYgKHNpZGUpIHtcbiAgICAgICAgYy5hZGQodW5pdFZlY3Rvcik7XG4gICAgICB9XG5cbiAgICAgIHJvdW5kVmVjdG9yKGMpO1xuICAgICAgY2h1bmtzMi5zZXQoYy54LCBjLnksIGMueiwgVFJVTkspO1xuICAgIH1cblxuICAgIHZpc2l0U2hhcGUobGVhZlNoYXBlLCBmdW5jdGlvbihpLCBqLCBrKSB7XG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IGRlbnNpdHkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGMgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgICAgbGVhZkNlbnRlclswXSArIGksXG4gICAgICAgIGxlYWZIZWlnaHQgKyBqLFxuICAgICAgICBsZWFmQ2VudGVyWzJdICsga1xuICAgICAgKTtcblxuICAgICAgdmFyIGRpcyA9IE1hdGguc3FydChjLnggKiBjLnggKyBjLnogKiBjLnopO1xuICAgICAgdmFyIG1heERpcyA9IChzaGFwZTIgLSBqKSAvIHNoYXBlMiAqIHJhZGl1cztcblxuICAgICAgdmFyIGRpZmYgPSBtYXhEaXMgLSBkaXM7XG4gICAgICBpZiAoZGlmZiA8IDAuMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChkaWZmIDwgMSkge1xuICAgICAgICBpZiAoZGlmZiA+IE1hdGgucmFuZG9tKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYy5hcHBseVF1YXRlcm5pb24ocXVhdCk7XG5cbiAgICAgIHJvdW5kVmVjdG9yKGMpO1xuXG4gICAgICBpZiAoc2lkZSkge1xuICAgICAgICBjLmFkZCh1bml0VmVjdG9yKTtcbiAgICAgIH1cblxuICAgICAgY2h1bmtzMi5zZXQoYy54LCBjLnksIGMueiwgTEVBRik7XG4gICAgfSk7XG5cbiAgICByZW1vdmVGbG9hdGluZyhjaHVua3MyLCBbMCwgMCwgMF0pO1xuXG4gICAgY29weUNodW5rcyhjaHVua3MyLCBjaHVua3MsIGNvb3JkKTtcbiAgICBtZXNoQ2h1bmtzKGNodW5rcywgb2JqZWN0LCBibG9ja01hdGVyaWFsKTtcbiAgfTtcblxuICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICBvYmplY3Quc2NhbGUuc2V0KHNlbGYuc2NhbGUsIHNlbGYuc2NhbGUsIHNlbGYuc2NhbGUpO1xuICAgIHBhcmVudC5hZGQob2JqZWN0KTtcblxuICAgIHZhciBjb3VudCA9IDA7XG4gICAgZm9yICh2YXIgaWQgaW4gdGVycmlhbi5zdXJmYWNlTWFwKSB7XG4gICAgICB2YXIgc3VyZmFjZSA9IHRlcnJpYW4uc3VyZmFjZU1hcFtpZF07XG5cbiAgICAgIHZhciBkYXRhID0gdGVycmlhbi5nZXREYXRhKHN1cmZhY2VbMF0sIHN1cmZhY2VbMV0sIHN1cmZhY2VbMl0pO1xuXG4gICAgICAvLyBObyB0cmVlcyB1bmRlciBzZWEgbGV2ZWxcbiAgICAgIGlmIChkYXRhLmJpb21lLnJlbFNlYUxldmVsID4gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSG93IHNwYXJzZSB0cmVlcyBzaG91bGQgYmVcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC43KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5iaW9tZS50cmVlIDwgMC41KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiAoY291bnQgPiAyMDApIHtcbiAgICAgIC8vICAgYnJlYWs7XG4gICAgICAvLyB9XG5cbiAgICAgIHZhciBmID0gRGlyLmdldE9wcG9zaXRlKHN1cmZhY2VbM10pO1xuXG4gICAgICAvLyBTdGFydCBmcm9tIGNlbnRlciBvZiBibG9jaywgZXh0ZW5kIGZvciBoYWxmIGEgYmxvY2tcbiAgICAgIHZhciBjb29yZCA9XG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN1cmZhY2VbMF0sIHN1cmZhY2VbMV0sIHN1cmZhY2VbMl0pXG4gICAgICAgIC5hZGQobmV3IFRIUkVFLlZlY3RvcjMoMC41LCAwLjUsIDAuNSkpXG4gICAgICAgIC5hZGQoRGlyLmdldFVuaXRWZWN0b3IoZikubXVsdGlwbHlTY2FsYXIoMC41KSk7XG5cbiAgICAgIC8vIHJhbmRvbWl6ZSB1diBjb29yZFxuICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKGYgLyAyKTtcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuXG4gICAgICB2YXIgdXYgPSBbMCwgMCwgMF07XG4gICAgICB1dlt1XSA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICB1dlt2XSA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG5cbiAgICAgIGNvb3JkLmFkZChuZXcgVEhSRUUuVmVjdG9yMygpLmZyb21BcnJheSh1dikpO1xuXG4gICAgICAvLyAxIHRyZWUgcGVyIHRlcnJpYW4gZ3JpZFxuICAgICAgY29vcmQubXVsdGlwbHlTY2FsYXIoMSAvIHNlbGYuc2NhbGUpO1xuXG4gICAgICBjb29yZC54ID0gTWF0aC5yb3VuZChjb29yZC54KTtcbiAgICAgIGNvb3JkLnkgPSBNYXRoLnJvdW5kKGNvb3JkLnkpO1xuICAgICAgY29vcmQueiA9IE1hdGgucm91bmQoY29vcmQueik7XG4gICAgICBhZGQoY29vcmQsIGYpO1xuXG4gICAgICBjb3VudCsrO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICB2YXIgc2VsZiA9IHtcbiAgICBhZGQ6IGFkZCxcbiAgICBvYmplY3Q6IG9iamVjdCxcbiAgICBzY2FsZTogKDEgLyAzLjApXG4gIH07XG5cbiAgc3RhcnQoKTtcblxuICByZXR1cm4gc2VsZjtcbn07XG5cbmZ1bmN0aW9uIHJvdW5kVmVjdG9yKHYpIHtcbiAgdi54ID0gTWF0aC5yb3VuZCh2LngpO1xuICB2LnkgPSBNYXRoLnJvdW5kKHYueSk7XG4gIHYueiA9IE1hdGgucm91bmQodi56KTtcbiAgcmV0dXJuIHY7XG59O1xuIiwidmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIga2V5Y29kZSA9IHJlcXVpcmUoJ2tleWNvZGUnKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuL2RpcicpO1xuXG52YXIgYXBwID0ge307XG5cbi8vIFBvc3QgcHJvY2Vzc2luZyBzZXR0aW5nXG52YXIgcG9zdHByb2Nlc3NpbmcgPSB7IGVuYWJsZWQ6IHRydWUsIHJlbmRlck1vZGU6IDAgfTtcblxuLy8gUmVuZGVyZXIsIHNjZW5lLCBjYW1lcmFcbnZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgYW50aWFsaWFzOiB0cnVlXG59KTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweEJCRDlGNyk7XG4vLyByZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MjIyMjIyKTtcbnZhciBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xudmFyIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg2MCwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gIDAuMSwgMTAwMCk7XG52YXIgY2FtZXJhVXAsIGNhbWVyYURpciwgY2FtZXJhUmlnaHQ7XG5cbi8vIFBvc3QgcHJvY2Vzc2luZ1xudmFyIGRlcHRoTWF0ZXJpYWw7XG52YXIgZGVwdGhSZW5kZXJUYXJnZXQ7XG52YXIgc3Nhb1Bhc3M7XG52YXIgZWZmZWN0Q29tcG9zZXI7XG5cbi8vIFNpemVcbnZhciBzaXplID0gMzI7XG52YXIgbW9kZWxTaXplID0gNTtcbnZhciBkaXNTY2FsZSA9IDEuMiAqIG1vZGVsU2l6ZTtcblxuLy8gT2JqZWN0c1xudmFyIG9iamVjdDtcbnZhciBub0FvTGF5ZXI7XG5cbnZhciBlbnRpdGllcyA9IFtdO1xuXG4vLyBNYXRlcmlhbHMsIFRleHR1cmVzXG52YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTXVsdGlNYXRlcmlhbCgpO1xubWF0ZXJpYWwubWF0ZXJpYWxzID0gW251bGxdO1xudmFyIHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xudmFyIGJsb2NrVGV4dHVyZXMgPSBbXTtcbnZhciB0ZXh0dXJlcyA9IHt9O1xuXG4vLyBJbnB1dCBzdGF0ZXNcbnZhciBrZXlob2xkcyA9IHt9O1xudmFyIG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbnZhciByYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKCk7XG52YXIgcmF5Y2FzdGVyRGlyO1xuXG4vLyBmcmFtZSB0aW1lXG52YXIgZHQgPSAxIC8gNjA7XG5cbmZ1bmN0aW9uIGluaXRQb3N0cHJvY2Vzc2luZygpIHtcblxuICAvLyBTZXR1cCByZW5kZXIgcGFzc1xuICB2YXIgcmVuZGVyUGFzcyA9IG5ldyBUSFJFRS5SZW5kZXJQYXNzKHNjZW5lLCBjYW1lcmEpO1xuXG4gIC8vIFNldHVwIGRlcHRoIHBhc3NcbiAgZGVwdGhNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoRGVwdGhNYXRlcmlhbCgpO1xuICBkZXB0aE1hdGVyaWFsLmRlcHRoUGFja2luZyA9IFRIUkVFLlJHQkFEZXB0aFBhY2tpbmc7XG4gIGRlcHRoTWF0ZXJpYWwuYmxlbmRpbmcgPSBUSFJFRS5Ob0JsZW5kaW5nO1xuXG4gIHZhciBwYXJzID0geyBtaW5GaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciwgbWFnRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIgfTtcbiAgZGVwdGhSZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwgcGFycyk7XG5cbiAgLy8gU2V0dXAgU1NBTyBwYXNzXG4gIHNzYW9QYXNzID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuU1NBT1NoYWRlcik7XG4gIHNzYW9QYXNzLnJlbmRlclRvU2NyZWVuID0gdHJ1ZTtcbiAgLy9zc2FvUGFzcy51bmlmb3Jtc1sgXCJ0RGlmZnVzZVwiIF0udmFsdWUgd2lsbCBiZSBzZXQgYnkgU2hhZGVyUGFzc1xuICBzc2FvUGFzcy51bmlmb3Jtc1tcInREZXB0aFwiXS52YWx1ZSA9IGRlcHRoUmVuZGVyVGFyZ2V0LnRleHR1cmU7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydzaXplJ10udmFsdWUuc2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snY2FtZXJhTmVhciddLnZhbHVlID0gY2FtZXJhLm5lYXI7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydjYW1lcmFGYXInXS52YWx1ZSA9IGNhbWVyYS5mYXI7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydvbmx5QU8nXS52YWx1ZSA9IChwb3N0cHJvY2Vzc2luZy5yZW5kZXJNb2RlID09IDEpO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snYW9DbGFtcCddLnZhbHVlID0gMTAwLjA7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydsdW1JbmZsdWVuY2UnXS52YWx1ZSA9IDAuNztcblxuICAvLyBBZGQgcGFzcyB0byBlZmZlY3QgY29tcG9zZXJcbiAgZWZmZWN0Q29tcG9zZXIgPSBuZXcgVEhSRUUuRWZmZWN0Q29tcG9zZXIocmVuZGVyZXIpO1xuICBlZmZlY3RDb21wb3Nlci5hZGRQYXNzKHJlbmRlclBhc3MpO1xuICBlZmZlY3RDb21wb3Nlci5hZGRQYXNzKHNzYW9QYXNzKTtcblxufTtcblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAvLyBSZXNpemUgcmVuZGVyVGFyZ2V0c1xuICBzc2FvUGFzcy51bmlmb3Jtc1snc2l6ZSddLnZhbHVlLnNldCh3aWR0aCwgaGVpZ2h0KTtcblxuICB2YXIgcGl4ZWxSYXRpbyA9IHJlbmRlcmVyLmdldFBpeGVsUmF0aW8oKTtcbiAgdmFyIG5ld1dpZHRoID0gTWF0aC5mbG9vcih3aWR0aCAvIHBpeGVsUmF0aW8pIHx8IDE7XG4gIHZhciBuZXdIZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCAvIHBpeGVsUmF0aW8pIHx8IDE7XG4gIGRlcHRoUmVuZGVyVGFyZ2V0LnNldFNpemUobmV3V2lkdGgsIG5ld0hlaWdodCk7XG4gIGVmZmVjdENvbXBvc2VyLnNldFNpemUobmV3V2lkdGgsIG5ld0hlaWdodCk7XG59O1xuXG5mdW5jdGlvbiBpbml0U2NlbmUoKSB7XG4gIHZhciBkaXMgPSBzaXplICogZGlzU2NhbGU7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gZGlzO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IGRpcztcbiAgY2FtZXJhLnBvc2l0aW9uLnogPSBkaXM7XG4gIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoKSk7XG5cbiAgY2FtZXJhVXAgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKTtcbiAgY2FtZXJhRGlyID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSkuYXBwbHlFdWxlcihjYW1lcmEucm90YXRpb24pO1xuICBjYW1lcmFSaWdodCA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY3Jvc3NWZWN0b3JzKGNhbWVyYVVwLCBjYW1lcmFEaXIpO1xuXG4gIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBvYmplY3Quc2NhbGUuc2V0KG1vZGVsU2l6ZSwgbW9kZWxTaXplLCBtb2RlbFNpemUpO1xuICBzY2VuZS5hZGQob2JqZWN0KTtcbiAgbm9Bb0xheWVyID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIG9iamVjdC5hZGQobm9Bb0xheWVyKTtcbiAgdmFyIGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg4ODg4ODgpO1xuICB2YXIgZGlyZWN0aW9uYWxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjYpO1xuICBkaXJlY3Rpb25hbExpZ2h0LnBvc2l0aW9uLnNldCgwLjMsIDEuMCwgMC41KTtcbiAgb2JqZWN0LmFkZChhbWJpZW50TGlnaHQpO1xuICBvYmplY3QuYWRkKGRpcmVjdGlvbmFsTGlnaHQpO1xufTtcblxuZnVuY3Rpb24gbG9hZFJlc291cmNlcygpIHtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2dyYXNzJywgMSk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzb2lsJywgMik7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzb2lsMicsIDMpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnc3RvbmUnLCA0KTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NlYScsIDUsIDAuOCk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzYW5kJywgNik7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCd3YWxsJywgNyk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCd0cnVuaycsIDIwKTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2xlYWYnLCAyMSk7XG5cbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3dpbmRvdycsIDgsIDAuOCk7XG5cbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2Nsb3VkJywgMTAsIDAuOCwgbnVsbCwgZnVuY3Rpb24obSkge1xuICAgIG0uZW1pc3NpdmUgPSBuZXcgVEhSRUUuQ29sb3IoMHg4ODg4ODgpO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGxvYWRCbG9ja01hdGVyaWFsKG5hbWUsIGluZGV4LCBhbHBoYSwgbWF0ZXJpYWxUeXBlLCB0cmFuc2Zvcm0pIHtcbiAgdmFyIHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ3RleHR1cmVzLycgKyBuYW1lICsgJy5wbmcnKTtcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XG4gIHRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgdGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICBibG9ja1RleHR1cmVzLnB1c2godGV4dHVyZSk7XG5cbiAgbWF0ZXJpYWxUeXBlID0gbWF0ZXJpYWxUeXBlIHx8IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWw7XG5cbiAgdmFyIG0gPSBuZXcgbWF0ZXJpYWxUeXBlKHtcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG5cbiAgaWYgKGFscGhhICE9IG51bGwpIHtcbiAgICBtLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICBtLm9wYWNpdHkgPSBhbHBoYTtcbiAgfVxuXG4gIGlmICh0cmFuc2Zvcm0gIT0gbnVsbCkge1xuICAgIHRyYW5zZm9ybShtKTtcbiAgfVxuXG4gIG1hdGVyaWFsLm1hdGVyaWFsc1tpbmRleF0gPSBtO1xufTtcblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICBpZiAocG9zdHByb2Nlc3NpbmcuZW5hYmxlZCkge1xuICAgIG5vQW9MYXllci52aXNpYmxlID0gZmFsc2U7XG4gICAgLy8gUmVuZGVyIGRlcHRoIGludG8gZGVwdGhSZW5kZXJUYXJnZXRcbiAgICBzY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gZGVwdGhNYXRlcmlhbDtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSwgZGVwdGhSZW5kZXJUYXJnZXQsIHRydWUpO1xuXG4gICAgbm9Bb0xheWVyLnZpc2libGUgPSB0cnVlO1xuICAgIC8vIFJlbmRlciByZW5kZXJQYXNzIGFuZCBTU0FPIHNoYWRlclBhc3NcbiAgICBzY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gbnVsbDtcbiAgICBlZmZlY3RDb21wb3Nlci5yZW5kZXIoKTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIH1cblxuICB2YXIgcm90YXRlWSA9IDA7XG4gIGlmIChrZXlob2xkc1sncmlnaHQnXSkge1xuICAgIHJvdGF0ZVkgLT0gMC4xO1xuICB9IGVsc2UgaWYgKGtleWhvbGRzWydsZWZ0J10pIHtcbiAgICByb3RhdGVZICs9IDAuMTtcbiAgfVxuXG4gIHZhciBxdWF0SW52ZXJzZSA9IG9iamVjdC5xdWF0ZXJuaW9uLmNsb25lKCkuaW52ZXJzZSgpO1xuICB2YXIgYXhpcyA9IGNhbWVyYVVwLmNsb25lKCkuYXBwbHlRdWF0ZXJuaW9uKHF1YXRJbnZlcnNlKS5ub3JtYWxpemUoKTtcbiAgb2JqZWN0LnF1YXRlcm5pb25cbiAgICAubXVsdGlwbHkobmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tQXhpc0FuZ2xlKGF4aXMsIHJvdGF0ZVkpKTtcblxuICB2YXIgcm90YXRlWCA9IDA7XG4gIGlmIChrZXlob2xkc1sndXAnXSkge1xuICAgIHJvdGF0ZVggLT0gMC4xO1xuICB9IGVsc2UgaWYgKGtleWhvbGRzWydkb3duJ10pIHtcbiAgICByb3RhdGVYICs9IDAuMTtcbiAgfVxuXG4gIGF4aXMgPSBjYW1lcmFSaWdodC5jbG9uZSgpLmFwcGx5UXVhdGVybmlvbihxdWF0SW52ZXJzZSkubm9ybWFsaXplKCk7XG4gIG9iamVjdC5xdWF0ZXJuaW9uXG4gICAgLm11bHRpcGx5KG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZShheGlzLCByb3RhdGVYKSk7XG59O1xuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBlbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIGVudGl0eS50aWNrKGR0KTtcbiAgfSk7XG4gIHJlbmRlcigpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59O1xuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZS54ID0gKGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMTtcbiAgbW91c2UueSA9IC0oZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMTtcblxuICAvLyB1cGRhdGUgdGhlIHBpY2tpbmcgcmF5IHdpdGggdGhlIGNhbWVyYSBhbmQgbW91c2UgcG9zaXRpb24gIFxuICByYXljYXN0ZXIuc2V0RnJvbUNhbWVyYShtb3VzZSwgY2FtZXJhKTtcbiAgcmF5Y2FzdGVyRGlyID0gcmF5Y2FzdGVyLnJheS5kaXJlY3Rpb24uY2xvbmUoKTtcbn07XG5cbmZ1bmN0aW9uIG9uTW91c2VEb3duKGV2ZW50KSB7XG4gIGlmICh0ZXJyaWFuID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBjYWxjdWxhdGUgb2JqZWN0cyBpbnRlcnNlY3RpbmcgdGhlIHBpY2tpbmcgcmF5XG4gIHZhciBpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdCh0ZXJyaWFuLm9iamVjdCwgdHJ1ZSk7XG4gIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBwb2ludCA9IGludGVyc2VjdHNbMF0ucG9pbnQuY2xvbmUoKVxuICAgIC5hZGQocmF5Y2FzdGVyRGlyLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoLTAuMDEpKTtcblxuICB2YXIgbG9jYWxQb2ludCA9IHRyZWUub2JqZWN0LndvcmxkVG9Mb2NhbChwb2ludCk7XG4gIHZhciBjb29yZCA9IG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC54KSxcbiAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQueSksXG4gICAgTWF0aC5mbG9vcihsb2NhbFBvaW50LnopXG4gICk7XG5cbiAgdHJlZS5hZGQoY29vcmQpO1xuXG4gIC8vIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA9PT0gMCkge1xuICAvLyAgIHJldHVybjtcbiAgLy8gfVxuXG4gIC8vIHZhciBwb2ludCA9IGludGVyc2VjdHNbMF0ucG9pbnQ7XG4gIC8vIHBvaW50LmFkZChyYXljYXN0ZXIucmF5LmRpcmVjdGlvbi5jbG9uZSgpLm5vcm1hbGl6ZSgpLm11bHRpcGx5U2NhbGFyKDAuMDEpKTtcbiAgLy8gcG9pbnQgPSBtZXNoLndvcmxkVG9Mb2NhbChwb2ludCk7XG5cbiAgLy8gdmFyIGNvb3JkID0gW1xuICAvLyAgIE1hdGguZmxvb3IocG9pbnQueCksXG4gIC8vICAgTWF0aC5mbG9vcihwb2ludC55KSxcbiAgLy8gICBNYXRoLmZsb29yKHBvaW50LnopXG4gIC8vIF07XG4gIC8vIHRlcnJpYW4uY2h1bmsuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIG51bGwpO1xuXG4gIC8vIG1lc2gucGFyZW50LnJlbW92ZShtZXNoKTtcbiAgLy8gZ2VvbWV0cnkuZGlzcG9zZSgpO1xuICAvLyBnZW9tZXRyeSA9IG1lc2hlcih0ZXJyaWFuLmNodW5rKTtcblxuICAvLyBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgLy8gb2JqZWN0LmFkZChtZXNoKTtcbiAgLy8gbWVzaC5wb3NpdGlvbi5jb3B5KGNlbnRlcik7XG59O1xuXG5mdW5jdGlvbiBvbk1vdXNlVXAoZXZlbnQpIHtcblxufTtcblxuZnVuY3Rpb24gb25LZXlEb3duKGUpIHtcbiAgdmFyIGtleSA9IGtleWNvZGUoZSk7XG4gIGtleWhvbGRzW2tleV0gPSB0cnVlO1xuXG4gIGlmIChrZXkgPT09ICdnJykge1xuICAgIHRlcnJpYW4uZ3JvdW5kT2JqZWN0LnZpc2libGUgPSAhdGVycmlhbi5ncm91bmRPYmplY3QudmlzaWJsZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gb25LZXlVcChlKSB7XG4gIHZhciBrZXkgPSBrZXljb2RlKGUpO1xuICBrZXlob2xkc1trZXldID0gZmFsc2U7XG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xuXG5sb2FkUmVzb3VyY2VzKCk7XG5pbml0UG9zdHByb2Nlc3NpbmcoKTtcbmluaXRTY2VuZSgpO1xuXG4vLyBJbml0IGFwcFxuXG52YXIgY2xvdWQgPSByZXF1aXJlKCcuL2VudGl0aWVzL2Nsb3VkJykob2JqZWN0LCBtYXRlcmlhbCk7XG5lbnRpdGllcy5wdXNoKGNsb3VkKTtcblxudmFyIHRlcnJpYW4gPSByZXF1aXJlKCcuL2VudGl0aWVzL3RlcnJpYW4nKShzaXplLCBvYmplY3QsIG1hdGVyaWFsKTtcblxudmFyIHRyZWUgPSByZXF1aXJlKCcuL2VudGl0aWVzL3RyZWUnKSh0ZXJyaWFuLm9iamVjdCwgbWF0ZXJpYWwsIHRlcnJpYW4pO1xuXG4vLyB2YXIgQ2h1bmtzID0gcmVxdWlyZSgnLi92b3hlbC9jaHVua3MnKTtcbi8vIHZhciBjaHVua3MgPSBuZXcgQ2h1bmtzKCk7XG4vLyB2YXIgbGVuID0gMzI7XG5cbi8vIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NdWx0aU1hdGVyaWFsKCk7XG4vLyBtYXRlcmlhbC5tYXRlcmlhbHMucHVzaChudWxsLCBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuLy8gICBjb2xvcjogMHhmZmZmZmYsXG4vLyAgIHRyYW5zcGFyZW50OiB0cnVlLFxuLy8gICBvcGFjaXR5OiAwLjVcbi8vIH0pKTtcblxuLy8gZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuLy8gICBmb3IgKHZhciBqID0gMDsgaiA8IGxlbjsgaisrKSB7XG4vLyAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBsZW47IGsrKykge1xuLy8gICAgICAgY2h1bmtzLnNldChpLCBqLCBrLCBbMSwgMSwgMSwgMSwgMSwgMV0pO1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfVxuXG4vLyB2YXIgbWVzaENodW5rcyA9IHJlcXVpcmUoJy4vdm94ZWwvbWVzaGNodW5rcycpO1xuLy8gdmFyIHRlc3RPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbi8vIHRlc3RPYmplY3Quc2NhbGUuc2V0KDUsIDUsIDUpO1xuLy8gc2NlbmUuYWRkKHRlc3RPYmplY3QpO1xuLy8gbWVzaENodW5rcyhjaHVua3MsIHRlc3RPYmplY3QsIG1hdGVyaWFsKTtcblxuYW5pbWF0ZSgpO1xuIiwidmFyIENodW5rID0gZnVuY3Rpb24oc2hhcGUpIHtcbiAgdGhpcy52b2x1bWUgPSBbXTtcbiAgdGhpcy5zaGFwZSA9IHNoYXBlIHx8IFsxNiwgMTYsIDE2XTtcbiAgdGhpcy5kaW1YID0gdGhpcy5zaGFwZVswXTtcbiAgdGhpcy5kaW1YWSA9IHRoaXMuc2hhcGVbMF0gKiB0aGlzLnNoYXBlWzFdO1xufTtcblxuQ2h1bmsucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgcmV0dXJuIHRoaXMudm9sdW1lW2kgKiB0aGlzLmRpbVhZICsgaiAqIHRoaXMuZGltWCArIGtdO1xufTtcblxuQ2h1bmsucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgdGhpcy52b2x1bWVbaSAqIHRoaXMuZGltWFkgKyBqICogdGhpcy5kaW1YICsga10gPSB2O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaHVuaztcbiIsInZhciBDaHVuayA9IHJlcXVpcmUoJy4vY2h1bmsnKTtcblxudmFyIENodW5rcyA9IGZ1bmN0aW9uKGNodW5rU2l6ZSkge1xuICB0aGlzLm1hcCA9IHt9O1xuICB0aGlzLmNodW5rU2l6ZSA9IGNodW5rU2l6ZSB8fCAxNjtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICB2YXIgb3JpZ2luID0gdGhpcy5nZXRPcmlnaW4oaSwgaiwgayk7XG4gIHZhciBoYXNoID0gb3JpZ2luLnRvQXJyYXkoKS5qb2luKCcsJyk7XG4gIGlmICh0aGlzLm1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgdGhpcy5tYXBbaGFzaF0gPSB7XG4gICAgICBjaHVuazogbmV3IENodW5rKFt0aGlzLmNodW5rU2l6ZSwgdGhpcy5jaHVua1NpemUsIHRoaXMuY2h1bmtTaXplXSksXG4gICAgICBvcmlnaW46IG9yaWdpblxuICAgIH1cbiAgfVxuXG4gIHRoaXMubWFwW2hhc2hdLmRpcnR5ID0gdHJ1ZTtcbiAgdGhpcy5tYXBbaGFzaF0uY2h1bmsuc2V0KGkgLSBvcmlnaW4ueCwgaiAtIG9yaWdpbi55LCBrIC0gb3JpZ2luLnosIHYpO1xufTtcblxuQ2h1bmtzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gIHZhciBvcmlnaW4gPSB0aGlzLmdldE9yaWdpbihpLCBqLCBrKTtcbiAgdmFyIGhhc2ggPSBvcmlnaW4udG9BcnJheSgpLmpvaW4oJywnKTtcbiAgaWYgKHRoaXMubWFwW2hhc2hdID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgb3JpZ2luID0gdGhpcy5tYXBbaGFzaF0ub3JpZ2luO1xuICByZXR1cm4gdGhpcy5tYXBbaGFzaF0uY2h1bmsuZ2V0KGkgLSBvcmlnaW4ueCwgaiAtIG9yaWdpbi55LCBrIC0gb3JpZ2luLnopO1xufTtcblxuQ2h1bmtzLnByb3RvdHlwZS5nZXRPcmlnaW4gPSBmdW5jdGlvbihpLCBqLCBrKSB7XG4gIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICBNYXRoLmZsb29yKGkgLyB0aGlzLmNodW5rU2l6ZSksXG4gICAgTWF0aC5mbG9vcihqIC8gdGhpcy5jaHVua1NpemUpLFxuICAgIE1hdGguZmxvb3IoayAvIHRoaXMuY2h1bmtTaXplKVxuICApLm11bHRpcGx5U2NhbGFyKHRoaXMuY2h1bmtTaXplKTtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUudmlzaXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICBmb3IgKHZhciBpZCBpbiB0aGlzLm1hcCkge1xuICAgIHZhciBjaHVuayA9IHRoaXMubWFwW2lkXS5jaHVuaztcbiAgICB2YXIgb3JpZ2luID0gdGhpcy5tYXBbaWRdLm9yaWdpbjtcbiAgICB2YXIgc2hhcGUgPSBjaHVuay5zaGFwZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2hhcGVbMF07IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaGFwZVswXTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2hhcGVbMF07IGsrKykge1xuICAgICAgICAgIHZhciB2ID0gY2h1bmsuZ2V0KGksIGosIGspO1xuICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbGxiYWNrKGkgKyBvcmlnaW4ueCwgaiArIG9yaWdpbi55LCBrICsgb3JpZ2luLnosIHYpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENodW5rcztcbiIsInZhciBHcmVlZHlNZXNoID0gKGZ1bmN0aW9uKCkge1xuICAvL0NhY2hlIGJ1ZmZlciBpbnRlcm5hbGx5XG4gIHZhciBtYXNrID0gbmV3IEludDMyQXJyYXkoNDA5Nik7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGYsIGRpbXMpIHtcbiAgICB2YXIgdmVydGljZXMgPSBbXSxcbiAgICAgIGZhY2VzID0gW10sXG4gICAgICB1dnMgPSBbXSxcbiAgICAgIGRpbXNYID0gZGltc1swXSxcbiAgICAgIGRpbXNZID0gZGltc1sxXSxcbiAgICAgIGRpbXNYWSA9IGRpbXNYICogZGltc1k7XG5cbiAgICAvL1N3ZWVwIG92ZXIgMy1heGVzXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCAzOyArK2QpIHtcbiAgICAgIHZhciBpLCBqLCBrLCBsLCB3LCBXLCBoLCBuLCBjLFxuICAgICAgICB1ID0gKGQgKyAxKSAlIDMsXG4gICAgICAgIHYgPSAoZCArIDIpICUgMyxcbiAgICAgICAgeCA9IFswLCAwLCAwXSxcbiAgICAgICAgcSA9IFswLCAwLCAwXSxcbiAgICAgICAgZHUgPSBbMCwgMCwgMF0sXG4gICAgICAgIGR2ID0gWzAsIDAsIDBdLFxuICAgICAgICBkaW1zRCA9IGRpbXNbZF0sXG4gICAgICAgIGRpbXNVID0gZGltc1t1XSxcbiAgICAgICAgZGltc1YgPSBkaW1zW3ZdLFxuICAgICAgICBxZGltc1gsIHFkaW1zWFksIHhkO1xuXG4gICAgICB2YXIgZmxpcCwgaW5kZXgsIHZhbHVlO1xuXG4gICAgICBpZiAobWFzay5sZW5ndGggPCBkaW1zVSAqIGRpbXNWKSB7XG4gICAgICAgIG1hc2sgPSBuZXcgSW50MzJBcnJheShkaW1zVSAqIGRpbXNWKTtcbiAgICAgIH1cblxuICAgICAgcVtkXSA9IDE7XG4gICAgICB4W2RdID0gLTE7XG5cbiAgICAgIHFkaW1zWCA9IGRpbXNYICogcVsxXVxuICAgICAgcWRpbXNYWSA9IGRpbXNYWSAqIHFbMl1cblxuICAgICAgLy8gQ29tcHV0ZSBtYXNrXG4gICAgICB3aGlsZSAoeFtkXSA8IGRpbXNEKSB7XG4gICAgICAgIHhkID0geFtkXVxuICAgICAgICBuID0gMDtcblxuICAgICAgICBmb3IgKHhbdl0gPSAwOyB4W3ZdIDwgZGltc1Y7ICsreFt2XSkge1xuICAgICAgICAgIGZvciAoeFt1XSA9IDA7IHhbdV0gPCBkaW1zVTsgKyt4W3VdLCArK24pIHtcbiAgICAgICAgICAgIHZhciBhID0geGQgPj0gMCAmJiBmKHhbMF0sIHhbMV0sIHhbMl0pLFxuICAgICAgICAgICAgICBiID0geGQgPCBkaW1zRCAtIDEgJiYgZih4WzBdICsgcVswXSwgeFsxXSArIHFbMV0sIHhbMl0gKyBxWzJdKVxuICAgICAgICAgICAgaWYgKGEgPyBiIDogIWIpIHtcbiAgICAgICAgICAgICAgbWFza1tuXSA9IDA7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmbGlwID0gIWE7XG5cbiAgICAgICAgICAgIGluZGV4ID0gZCAqIDI7XG4gICAgICAgICAgICBpZiAoZmxpcCkge1xuICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZSA9IChhIHx8IGIpW2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKGZsaXApIHtcbiAgICAgICAgICAgICAgdmFsdWUgKj0gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hc2tbbl0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICArK3hbZF07XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgbWVzaCBmb3IgbWFzayB1c2luZyBsZXhpY29ncmFwaGljIG9yZGVyaW5nXG4gICAgICAgIG4gPSAwO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgZGltc1Y7ICsraikge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBkaW1zVTspIHtcbiAgICAgICAgICAgIGMgPSBtYXNrW25dO1xuICAgICAgICAgICAgaWYgKCFjKSB7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Db21wdXRlIHdpZHRoXG4gICAgICAgICAgICB3ID0gMTtcbiAgICAgICAgICAgIHdoaWxlIChjID09PSBtYXNrW24gKyB3XSAmJiBpICsgdyA8IGRpbXNVKSB3Kys7XG5cbiAgICAgICAgICAgIC8vQ29tcHV0ZSBoZWlnaHQgKHRoaXMgaXMgc2xpZ2h0bHkgYXdrd2FyZClcbiAgICAgICAgICAgIGZvciAoaCA9IDE7IGogKyBoIDwgZGltc1Y7ICsraCkge1xuICAgICAgICAgICAgICBrID0gMDtcbiAgICAgICAgICAgICAgd2hpbGUgKGsgPCB3ICYmIGMgPT09IG1hc2tbbiArIGsgKyBoICogZGltc1VdKSBrKytcbiAgICAgICAgICAgICAgICBpZiAoayA8IHcpIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgcXVhZFxuICAgICAgICAgICAgLy8gVGhlIGR1L2R2IGFycmF5cyBhcmUgcmV1c2VkL3Jlc2V0XG4gICAgICAgICAgICAvLyBmb3IgZWFjaCBpdGVyYXRpb24uXG4gICAgICAgICAgICBkdVtkXSA9IDA7XG4gICAgICAgICAgICBkdltkXSA9IDA7XG4gICAgICAgICAgICB4W3VdID0gaTtcbiAgICAgICAgICAgIHhbdl0gPSBqO1xuXG4gICAgICAgICAgICBpZiAoYyA+IDApIHtcbiAgICAgICAgICAgICAgZHZbdl0gPSBoO1xuICAgICAgICAgICAgICBkdlt1XSA9IDA7XG4gICAgICAgICAgICAgIGR1W3VdID0gdztcbiAgICAgICAgICAgICAgZHVbdl0gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYyA9IC1jO1xuICAgICAgICAgICAgICBkdVt2XSA9IGg7XG4gICAgICAgICAgICAgIGR1W3VdID0gMDtcbiAgICAgICAgICAgICAgZHZbdV0gPSB3O1xuICAgICAgICAgICAgICBkdlt2XSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmVydGV4X2NvdW50ID0gdmVydGljZXMubGVuZ3RoO1xuICAgICAgICAgICAgdmVydGljZXMucHVzaChbeFswXSwgeFsxXSwgeFsyXV0pO1xuICAgICAgICAgICAgdmVydGljZXMucHVzaChbeFswXSArIGR1WzBdLCB4WzFdICsgZHVbMV0sIHhbMl0gKyBkdVsyXV0pO1xuICAgICAgICAgICAgdmVydGljZXMucHVzaChbeFswXSArIGR1WzBdICsgZHZbMF0sIHhbMV0gKyBkdVsxXSArIGR2WzFdLCB4WzJdICsgZHVbMl0gKyBkdlsyXV0pO1xuICAgICAgICAgICAgdmVydGljZXMucHVzaChbeFswXSArIGR2WzBdLCB4WzFdICsgZHZbMV0sIHhbMl0gKyBkdlsyXV0pO1xuICAgICAgICAgICAgdXZzLnB1c2goXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBbMCwgMF0sXG4gICAgICAgICAgICAgICAgW2R1W3VdLCBkdVt2XV0sXG4gICAgICAgICAgICAgICAgW2R1W3VdICsgZHZbdV0sIGR1W3ZdICsgZHZbdl1dLFxuICAgICAgICAgICAgICAgIFtkdlt1XSwgZHZbdl1dXG4gICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBmYWNlcy5wdXNoKFt2ZXJ0ZXhfY291bnQsIHZlcnRleF9jb3VudCArIDEsIHZlcnRleF9jb3VudCArIDIsIHZlcnRleF9jb3VudCArIDMsIGNdKTtcblxuICAgICAgICAgICAgLy9aZXJvLW91dCBtYXNrXG4gICAgICAgICAgICBXID0gbiArIHc7XG4gICAgICAgICAgICBmb3IgKGwgPSAwOyBsIDwgaDsgKytsKSB7XG4gICAgICAgICAgICAgIGZvciAoayA9IG47IGsgPCBXOyArK2spIHtcbiAgICAgICAgICAgICAgICBtYXNrW2sgKyBsICogZGltc1VdID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0luY3JlbWVudCBjb3VudGVycyBhbmQgY29udGludWVcbiAgICAgICAgICAgIGkgKz0gdztcbiAgICAgICAgICAgIG4gKz0gdztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgdmVydGljZXM6IHZlcnRpY2VzLCBmYWNlczogZmFjZXMsIHV2czogdXZzIH07XG4gIH1cbn0pKCk7XG5cbmlmIChleHBvcnRzKSB7XG4gIGV4cG9ydHMubWVzaGVyID0gR3JlZWR5TWVzaDtcbn1cbiIsInZhciBWb3hlbCA9IHtcbiAgQ2h1bms6IHJlcXVpcmUoJy4vY2h1bmsnKSxcbiAgQ2h1bmtzOiByZXF1aXJlKCcuL2NodW5rcycpLFxuICBtZXNoQ2h1bmtzOiByZXF1aXJlKCcuL21lc2hjaHVua3MnKSxcbiAgbWVzaGVyOiByZXF1aXJlKCcuL21lc2hlcicpXG59O1xuXG5mdW5jdGlvbiB2aXNpdFNoYXBlKHNoYXBlLCBjYWxsYmFjaykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNoYXBlWzBdOyBpKyspIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNoYXBlWzFdOyBqKyspIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2hhcGVbMl07IGsrKykge1xuICAgICAgICBjYWxsYmFjayhpLCBqLCBrKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNvcHlDaHVua3MoZnJvbSwgdG8sIG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfHwgbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgZnJvbS52aXNpdChmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gICAgdG8uc2V0KGkgKyBvZmZzZXQueCwgaiArIG9mZnNldC55LCBrICsgb2Zmc2V0LnosIHYpO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIHJlbW92ZUZsb2F0aW5nKGNodW5rcywgc3RhcnRDb29yZCkge1xuICB2YXIgbWFwID0ge307XG4gIGNodW5rcy52aXNpdChmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gICAgdmFyIGhhc2ggPSBbaSwgaiwga10uam9pbignLCcpO1xuICAgIG1hcFtoYXNoXSA9IHtcbiAgICAgIHZpc2l0ZWQ6IGZhbHNlLFxuICAgICAgY29vcmQ6IFtpLCBqLCBrXVxuICAgIH07XG4gIH0pO1xuXG4gIHZhciBsZWFkcyA9IFtzdGFydENvb3JkXTtcblxuICB3aGlsZSAobGVhZHMubGVuZ3RoID4gMCkge1xuICAgIHZhciByZXN1bHQgPSB2aXNpdChbMSwgMCwgMF0pIHx8XG4gICAgICB2aXNpdChbMCwgMSwgMF0pIHx8XG4gICAgICB2aXNpdChbMCwgMCwgMV0pIHx8XG4gICAgICB2aXNpdChbLTEsIDAsIDBdKSB8fFxuICAgICAgdmlzaXQoWzAsIC0xLCAwXSkgfHxcbiAgICAgIHZpc2l0KFswLCAwLCAtMV0pO1xuXG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIGxlYWRzLnBvcCgpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb3VudCA9IDA7XG4gIGZvciAodmFyIGlkIGluIG1hcCkge1xuICAgIGlmICghbWFwW2lkXS52aXNpdGVkKSB7XG4gICAgICB2YXIgY29vcmQgPSBtYXBbaWRdLmNvb3JkO1xuICAgICAgY2h1bmtzLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCBudWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB2aXNpdChkaXMpIHtcbiAgICB2YXIgY3VycmVudCA9IGxlYWRzW2xlYWRzLmxlbmd0aCAtIDFdO1xuXG4gICAgdmFyIG5leHQgPSBbY3VycmVudFswXSArIGRpc1swXSxcbiAgICAgIGN1cnJlbnRbMV0gKyBkaXNbMV0sXG4gICAgICBjdXJyZW50WzJdICsgZGlzWzJdXG4gICAgXTtcblxuICAgIHZhciBoYXNoID0gbmV4dC5qb2luKCcsJyk7XG5cbiAgICBpZiAobWFwW2hhc2hdID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobWFwW2hhc2hdLnZpc2l0ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgdiA9IGNodW5rcy5nZXQobmV4dFswXSwgbmV4dFsxXSwgbmV4dFsyXSk7XG4gICAgaWYgKCEhdikge1xuICAgICAgbWFwW2hhc2hdLnZpc2l0ZWQgPSB0cnVlO1xuICAgICAgbGVhZHMucHVzaChuZXh0KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcbn07XG5cblZveGVsLnZpc2l0U2hhcGUgPSB2aXNpdFNoYXBlO1xuVm94ZWwuY29weUNodW5rcyA9IGNvcHlDaHVua3M7XG5Wb3hlbC5yZW1vdmVGbG9hdGluZyA9IHJlbW92ZUZsb2F0aW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZveGVsO1xuIiwidmFyIG1lc2hlciA9IHJlcXVpcmUoJy4vbWVzaGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2h1bmtzLCBwYXJlbnQsIG1hdGVyaWFsKSB7XG4gIGZvciAodmFyIGlkIGluIGNodW5rcy5tYXApIHtcbiAgICB2YXIgY2h1bmsgPSBjaHVua3MubWFwW2lkXTtcbiAgICB2YXIgZGF0YSA9IGNodW5rLmNodW5rO1xuICAgIGlmIChjaHVuay5kaXJ0eSkge1xuXG4gICAgICBpZiAoY2h1bmsubWVzaCAhPSBudWxsKSB7XG4gICAgICAgIGNodW5rLm1lc2gucGFyZW50LnJlbW92ZShjaHVuay5tZXNoKTtcbiAgICAgICAgY2h1bmsubWVzaC5nZW9tZXRyeS5kaXNwb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcmlnaW4gPSBjaHVuay5vcmlnaW47XG5cbiAgICAgIHZhciBnZW9tZXRyeSA9IG1lc2hlcihjaHVuay5jaHVuayk7XG4gICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBtZXNoLnBvc2l0aW9uLmNvcHkoY2h1bmsub3JpZ2luKTtcbiAgICAgIHBhcmVudC5hZGQobWVzaCk7XG5cbiAgICAgIGNodW5rLmRpcnR5ID0gZmFsc2U7XG4gICAgICBjaHVuay5tZXNoID0gbWVzaDtcbiAgICB9XG4gIH1cbn1cbiIsInZhciBncmVlZHlNZXNoZXIgPSByZXF1aXJlKCcuL2dyZWVkeScpLm1lc2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaHVuaywgZikge1xuICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblxuICBmID0gZiB8fCBmdW5jdGlvbihpLCBqLCBrKSB7XG4gICAgcmV0dXJuIGNodW5rLmdldChpLCBqLCBrKTtcbiAgfTtcbiAgdmFyIHJlc3VsdCA9IGdyZWVkeU1lc2hlcihmLCBjaHVuay5zaGFwZSk7XG5cbiAgcmVzdWx0LnZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIHZhciB2ZXJ0aWNlID0gbmV3IFRIUkVFLlZlY3RvcjModlswXSwgdlsxXSwgdlsyXSk7XG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaCh2ZXJ0aWNlKTtcbiAgfSk7XG5cbiAgcmVzdWx0LmZhY2VzLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgIHZhciBmYWNlID0gbmV3IFRIUkVFLkZhY2UzKGZbMF0sIGZbMV0sIGZbMl0pO1xuICAgIGZhY2UubWF0ZXJpYWxJbmRleCA9IGZbNF07XG4gICAgZ2VvbWV0cnkuZmFjZXMucHVzaChmYWNlKTtcblxuICAgIGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMoZlsyXSwgZlszXSwgZlswXSk7XG4gICAgZmFjZS5tYXRlcmlhbEluZGV4ID0gZls0XTtcbiAgICBnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xuICB9KTtcblxuICBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWzBdID0gW107XG4gIHJlc3VsdC51dnMuZm9yRWFjaChmdW5jdGlvbih1dikge1xuICAgIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbMF0ucHVzaChbXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMigpLmZyb21BcnJheSh1dlswXSksXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMigpLmZyb21BcnJheSh1dlsxXSksXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMigpLmZyb21BcnJheSh1dlsyXSlcbiAgICBdLCBbXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMigpLmZyb21BcnJheSh1dlsyXSksXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMigpLmZyb21BcnJheSh1dlszXSksXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMigpLmZyb21BcnJheSh1dlswXSlcbiAgICBdKTtcbiAgfSk7XG5cbiAgZ2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XG5cbiAgcmV0dXJuIGdlb21ldHJ5O1xufTtcbiJdfQ==
