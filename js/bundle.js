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
var TRUNK = [20, 20, 20, 20, 20, 20];
var LEAF = [21, 21, 21, 21, 21, 21];

var body0 = [
  [2, 1, 1, TRUNK],
  [2, 2, 1, TRUNK],
  [2, 3, 1, TRUNK],
  [3, 3, 1, TRUNK],
  [4, 3, 1, TRUNK],
  [2, 4, 1, LEAF],
  [3, 4, 1, LEAF],
  [4, 4, 1, TRUNK],
  [2, 5, 1, TRUNK],
  [3, 5, 1, TRUNK],
  [4, 5, 1, TRUNK],

  [1, 3, 1, TRUNK],
  [0, 3, 1, TRUNK],
  [1, 4, 1, LEAF],
  [0, 4, 1, TRUNK],
  [1, 5, 1, TRUNK],
  [0, 5, 1, TRUNK]
];

var feet0 = [
  [3, 0, 1, TRUNK],
  [3, 1, 1, TRUNK],
  [1, 0, 1, TRUNK],
  [1, 1, 1, TRUNK]
];

var feet1 = [
  [3, 0, 2, TRUNK],
  [3, 1, 2, TRUNK],
  [1, 0, 0, TRUNK],
  [1, 1, 0, TRUNK]
];

var feet2 = [
  [3, 0, 0, TRUNK],
  [3, 1, 0, TRUNK],
  [1, 0, 2, TRUNK],
  [1, 1, 2, TRUNK]
];

var frames = [
  body0.concat(feet0),
  body0.concat(feet1),
  body0.concat(feet0),
  body0.concat(feet2)
];


function calcBounds(frames) {
  var min = new THREE.Vector3(Infinity, Infinity, Infinity);
  var max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

  frames.forEach(function(frame) {
    frame.forEach(function(v) {
      if (v[0] < min.x) { min.x = v[0]; }
      if (v[1] < min.y) { min.y = v[1]; }
      if (v[2] < min.z) { min.z = v[2]; }
      if (v[0] > max.x) { max.x = v[0]; }
      if (v[1] > max.y) { max.y = v[1]; }
      if (v[2] > max.z) { max.z = v[2]; }
    });
  });

  return {
    min: min,
    max: max
  };
};

module.exports = {
  frames: frames,
  bounds: calcBounds(frames)
};

},{}],4:[function(require,module,exports){
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

module.exports = Dir;

},{}],5:[function(require,module,exports){
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

},{"../dir":4,"../voxel/chunks":11,"../voxel/meshchunks":14,"../voxel/mesher":15,"simplex-noise":2}],6:[function(require,module,exports){
var Voxel = require('../voxel');
var Chunks = Voxel.Chunks;
var meshChunks = Voxel.meshChunks;
var copyChunks = Voxel.copyChunks;
var Dir = require('../dir');

module.exports = function(parent, blockMaterial, terrian) {
  var scale = 1 / 5.0;
  var inverseScale = 1 / scale;
  // var position = new THREE.Vector3(15, 33, 15);
  var position = new THREE.Vector3(15, 33, 15);

  var chunks = new Chunks();

  var data = require('../data/critter0');
  var frames = data.frames;
  var bounds = data.bounds;

  var offset = bounds.max.clone().sub(bounds.min).multiplyScalar(-0.5);
  offset.x = Math.round(offset.x);
  offset.y = 0;
  offset.z = Math.round(offset.z);

  var object = new THREE.Object3D();
  var pivot = new THREE.Object3D();
  pivot.position.copy(offset);
  parent.add(object);
  object.add(pivot);

  object.scale.set(scale, scale, scale);
  meshChunks(chunks, pivot, blockMaterial);

  var frameTime = 0.4;
  var counter = 0;
  var currentFrame = 0;
  var totalFrame = frames.length;

  var currentGravity = 0;
  var fallSpeed = 0.01;
  var centerOffset = new THREE.Vector3(0.5, 0, 0.5);

  drawChunk();

  function tick(dt) {
    counter += dt;

    var coord = new THREE.Vector3(
      Math.floor(position.x),
      Math.floor(position.y),
      Math.floor(position.z)
    );

    var data = terrian.getData(coord.x, coord.y, coord.z);
    var gravity = data.gravity;

    var hasSameGravity = false;
    for (var id in gravity) {
      if (currentGravity === id) {
        hasSameGravity = true;
      }
    }

    if (!hasSameGravity) {
      currentGravity = Object.keys(gravity)[0];
      var quat = Dir.getQuat(Dir.getOpposite(currentGravity));
      object.quaternion.copy(quat);
    }

    var dirVector = Dir.getUnitVector(currentGravity);
    var coordBelow = coord.clone().add(dirVector);

    var vBelow = terrian.ground.get(coordBelow.x, coordBelow.y, coordBelow.z);

    if (!vBelow) {
      position.add(dirVector.clone().multiplyScalar(0.1));
    }

    // Advance frame
    if (counter > frameTime) {
      counter -= frameTime;
      currentFrame++;
      currentFrame %= totalFrame;

      drawChunk();
    }

    object.position
      .copy(position)
      .add(centerOffset);
  };

  function drawChunk() {
    chunks.clear().deserialize(frames[currentFrame]);
    meshChunks(chunks, pivot, blockMaterial);
  };

  function setCoord(coord) {
    position.copy(coord);
  };

  return {
    tick: tick,
    setCoord: setCoord
  };
};

},{"../data/critter0":3,"../dir":4,"../voxel":13}],7:[function(require,module,exports){
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

},{"../dir":4,"../voxel":13,"simplex-noise":2}],8:[function(require,module,exports){
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

  var sparse = 0.2;

  function add(coord, dir) {

    var shapeRatio = 2;
    var leafHeight = 2;
    var density = 0.8;
    var size1 = 4;
    var size2 = 3;
    var shape1 = Math.pow(Math.random(), 1.5) * size1 + size2;
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
      if (Math.random() > sparse) {
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

},{"../dir":4,"../voxel":13}],9:[function(require,module,exports){
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

  // // Add tree at clicked point
  // var localPoint = tree.object.worldToLocal(point);
  // var coord = new THREE.Vector3(
  //   Math.floor(localPoint.x),
  //   Math.floor(localPoint.y),
  //   Math.floor(localPoint.z)
  // );  
  // tree.add(coord);

  // Change critter position
  var localPoint = terrian.object.worldToLocal(point);
  var coord = new THREE.Vector3(
    Math.floor(localPoint.x),
    Math.floor(localPoint.y),
    Math.floor(localPoint.z)
  );
  critter.setCoord(coord);
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

var critter = require('./entities/critter')(terrian.object, material, terrian);
entities.push(critter);

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

},{"./dir":4,"./entities/cloud":5,"./entities/critter":6,"./entities/terrian":7,"./entities/tree":8,"keycode":1}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./chunk":10}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./chunk":10,"./chunks":11,"./meshchunks":14,"./mesher":15}],14:[function(require,module,exports){
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

},{"./mesher":15}],15:[function(require,module,exports){
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

},{"./greedy":12}]},{},[9])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva2V5Y29kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGV4LW5vaXNlL3NpbXBsZXgtbm9pc2UuanMiLCJzcmMvZGF0YS9jcml0dGVyMC5qcyIsInNyYy9kaXIuanMiLCJzcmMvZW50aXRpZXMvY2xvdWQuanMiLCJzcmMvZW50aXRpZXMvY3JpdHRlci5qcyIsInNyYy9lbnRpdGllcy90ZXJyaWFuLmpzIiwic3JjL2VudGl0aWVzL3RyZWUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy92b3hlbC9jaHVuay5qcyIsInNyYy92b3hlbC9jaHVua3MuanMiLCJzcmMvdm94ZWwvZ3JlZWR5LmpzIiwic3JjL3ZveGVsL2luZGV4LmpzIiwic3JjL3ZveGVsL21lc2hjaHVua3MuanMiLCJzcmMvdm94ZWwvbWVzaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3ZjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gU291cmNlOiBodHRwOi8vanNmaWRkbGUubmV0L3ZXeDhWL1xuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjAzMTk1L2Z1bGwtbGlzdC1vZi1qYXZhc2NyaXB0LWtleWNvZGVzXG5cbi8qKlxuICogQ29uZW5pZW5jZSBtZXRob2QgcmV0dXJucyBjb3JyZXNwb25kaW5nIHZhbHVlIGZvciBnaXZlbiBrZXlOYW1lIG9yIGtleUNvZGUuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0ga2V5Q29kZSB7TnVtYmVyfSBvciBrZXlOYW1lIHtTdHJpbmd9XG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VhcmNoSW5wdXQpIHtcbiAgLy8gS2V5Ym9hcmQgRXZlbnRzXG4gIGlmIChzZWFyY2hJbnB1dCAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlYXJjaElucHV0KSB7XG4gICAgdmFyIGhhc0tleUNvZGUgPSBzZWFyY2hJbnB1dC53aGljaCB8fCBzZWFyY2hJbnB1dC5rZXlDb2RlIHx8IHNlYXJjaElucHV0LmNoYXJDb2RlXG4gICAgaWYgKGhhc0tleUNvZGUpIHNlYXJjaElucHV0ID0gaGFzS2V5Q29kZVxuICB9XG5cbiAgLy8gTnVtYmVyc1xuICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzZWFyY2hJbnB1dCkgcmV0dXJuIG5hbWVzW3NlYXJjaElucHV0XVxuXG4gIC8vIEV2ZXJ5dGhpbmcgZWxzZSAoY2FzdCB0byBzdHJpbmcpXG4gIHZhciBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoSW5wdXQpXG5cbiAgLy8gY2hlY2sgY29kZXNcbiAgdmFyIGZvdW5kTmFtZWRLZXkgPSBjb2Rlc1tzZWFyY2gudG9Mb3dlckNhc2UoKV1cbiAgaWYgKGZvdW5kTmFtZWRLZXkpIHJldHVybiBmb3VuZE5hbWVkS2V5XG5cbiAgLy8gY2hlY2sgYWxpYXNlc1xuICB2YXIgZm91bmROYW1lZEtleSA9IGFsaWFzZXNbc2VhcmNoLnRvTG93ZXJDYXNlKCldXG4gIGlmIChmb3VuZE5hbWVkS2V5KSByZXR1cm4gZm91bmROYW1lZEtleVxuXG4gIC8vIHdlaXJkIGNoYXJhY3Rlcj9cbiAgaWYgKHNlYXJjaC5sZW5ndGggPT09IDEpIHJldHVybiBzZWFyY2guY2hhckNvZGVBdCgwKVxuXG4gIHJldHVybiB1bmRlZmluZWRcbn1cblxuLyoqXG4gKiBHZXQgYnkgbmFtZVxuICpcbiAqICAgZXhwb3J0cy5jb2RlWydlbnRlciddIC8vID0+IDEzXG4gKi9cblxudmFyIGNvZGVzID0gZXhwb3J0cy5jb2RlID0gZXhwb3J0cy5jb2RlcyA9IHtcbiAgJ2JhY2tzcGFjZSc6IDgsXG4gICd0YWInOiA5LFxuICAnZW50ZXInOiAxMyxcbiAgJ3NoaWZ0JzogMTYsXG4gICdjdHJsJzogMTcsXG4gICdhbHQnOiAxOCxcbiAgJ3BhdXNlL2JyZWFrJzogMTksXG4gICdjYXBzIGxvY2snOiAyMCxcbiAgJ2VzYyc6IDI3LFxuICAnc3BhY2UnOiAzMixcbiAgJ3BhZ2UgdXAnOiAzMyxcbiAgJ3BhZ2UgZG93bic6IDM0LFxuICAnZW5kJzogMzUsXG4gICdob21lJzogMzYsXG4gICdsZWZ0JzogMzcsXG4gICd1cCc6IDM4LFxuICAncmlnaHQnOiAzOSxcbiAgJ2Rvd24nOiA0MCxcbiAgJ2luc2VydCc6IDQ1LFxuICAnZGVsZXRlJzogNDYsXG4gICdjb21tYW5kJzogOTEsXG4gICdsZWZ0IGNvbW1hbmQnOiA5MSxcbiAgJ3JpZ2h0IGNvbW1hbmQnOiA5MyxcbiAgJ251bXBhZCAqJzogMTA2LFxuICAnbnVtcGFkICsnOiAxMDcsXG4gICdudW1wYWQgLSc6IDEwOSxcbiAgJ251bXBhZCAuJzogMTEwLFxuICAnbnVtcGFkIC8nOiAxMTEsXG4gICdudW0gbG9jayc6IDE0NCxcbiAgJ3Njcm9sbCBsb2NrJzogMTQ1LFxuICAnbXkgY29tcHV0ZXInOiAxODIsXG4gICdteSBjYWxjdWxhdG9yJzogMTgzLFxuICAnOyc6IDE4NixcbiAgJz0nOiAxODcsXG4gICcsJzogMTg4LFxuICAnLSc6IDE4OSxcbiAgJy4nOiAxOTAsXG4gICcvJzogMTkxLFxuICAnYCc6IDE5MixcbiAgJ1snOiAyMTksXG4gICdcXFxcJzogMjIwLFxuICAnXSc6IDIyMSxcbiAgXCInXCI6IDIyMlxufVxuXG4vLyBIZWxwZXIgYWxpYXNlc1xuXG52YXIgYWxpYXNlcyA9IGV4cG9ydHMuYWxpYXNlcyA9IHtcbiAgJ3dpbmRvd3MnOiA5MSxcbiAgJ+KHpyc6IDE2LFxuICAn4oylJzogMTgsXG4gICfijIMnOiAxNyxcbiAgJ+KMmCc6IDkxLFxuICAnY3RsJzogMTcsXG4gICdjb250cm9sJzogMTcsXG4gICdvcHRpb24nOiAxOCxcbiAgJ3BhdXNlJzogMTksXG4gICdicmVhayc6IDE5LFxuICAnY2Fwcyc6IDIwLFxuICAncmV0dXJuJzogMTMsXG4gICdlc2NhcGUnOiAyNyxcbiAgJ3NwYyc6IDMyLFxuICAncGd1cCc6IDMzLFxuICAncGdkbic6IDM0LFxuICAnaW5zJzogNDUsXG4gICdkZWwnOiA0NixcbiAgJ2NtZCc6IDkxXG59XG5cblxuLyohXG4gKiBQcm9ncmFtYXRpY2FsbHkgYWRkIHRoZSBmb2xsb3dpbmdcbiAqL1xuXG4vLyBsb3dlciBjYXNlIGNoYXJzXG5mb3IgKGkgPSA5NzsgaSA8IDEyMzsgaSsrKSBjb2Rlc1tTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGkgLSAzMlxuXG4vLyBudW1iZXJzXG5mb3IgKHZhciBpID0gNDg7IGkgPCA1ODsgaSsrKSBjb2Rlc1tpIC0gNDhdID0gaVxuXG4vLyBmdW5jdGlvbiBrZXlzXG5mb3IgKGkgPSAxOyBpIDwgMTM7IGkrKykgY29kZXNbJ2YnK2ldID0gaSArIDExMVxuXG4vLyBudW1wYWQga2V5c1xuZm9yIChpID0gMDsgaSA8IDEwOyBpKyspIGNvZGVzWydudW1wYWQgJytpXSA9IGkgKyA5NlxuXG4vKipcbiAqIEdldCBieSBjb2RlXG4gKlxuICogICBleHBvcnRzLm5hbWVbMTNdIC8vID0+ICdFbnRlcidcbiAqL1xuXG52YXIgbmFtZXMgPSBleHBvcnRzLm5hbWVzID0gZXhwb3J0cy50aXRsZSA9IHt9IC8vIHRpdGxlIGZvciBiYWNrd2FyZCBjb21wYXRcblxuLy8gQ3JlYXRlIHJldmVyc2UgbWFwcGluZ1xuZm9yIChpIGluIGNvZGVzKSBuYW1lc1tjb2Rlc1tpXV0gPSBpXG5cbi8vIEFkZCBhbGlhc2VzXG5mb3IgKHZhciBhbGlhcyBpbiBhbGlhc2VzKSB7XG4gIGNvZGVzW2FsaWFzXSA9IGFsaWFzZXNbYWxpYXNdXG59XG4iLCIvKlxuICogQSBmYXN0IGphdmFzY3JpcHQgaW1wbGVtZW50YXRpb24gb2Ygc2ltcGxleCBub2lzZSBieSBKb25hcyBXYWduZXJcbiAqXG4gKiBCYXNlZCBvbiBhIHNwZWVkLWltcHJvdmVkIHNpbXBsZXggbm9pc2UgYWxnb3JpdGhtIGZvciAyRCwgM0QgYW5kIDREIGluIEphdmEuXG4gKiBXaGljaCBpcyBiYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXG4gKiBXaXRoIE9wdGltaXNhdGlvbnMgYnkgUGV0ZXIgRWFzdG1hbiAocGVhc3RtYW5AZHJpenpsZS5zdGFuZm9yZC5lZHUpLlxuICogQmV0dGVyIHJhbmsgb3JkZXJpbmcgbWV0aG9kIGJ5IFN0ZWZhbiBHdXN0YXZzb24gaW4gMjAxMi5cbiAqXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDEyIEpvbmFzIFdhZ25lclxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuICogYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4gKiBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbiAqIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbiAqIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG4gKiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAqIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbiAqIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICpcbiAqL1xuKGZ1bmN0aW9uICgpIHtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgRjIgPSAwLjUgKiAoTWF0aC5zcXJ0KDMuMCkgLSAxLjApLFxuICAgIEcyID0gKDMuMCAtIE1hdGguc3FydCgzLjApKSAvIDYuMCxcbiAgICBGMyA9IDEuMCAvIDMuMCxcbiAgICBHMyA9IDEuMCAvIDYuMCxcbiAgICBGNCA9IChNYXRoLnNxcnQoNS4wKSAtIDEuMCkgLyA0LjAsXG4gICAgRzQgPSAoNS4wIC0gTWF0aC5zcXJ0KDUuMCkpIC8gMjAuMDtcblxuXG5mdW5jdGlvbiBTaW1wbGV4Tm9pc2UocmFuZG9tKSB7XG4gICAgaWYgKCFyYW5kb20pIHJhbmRvbSA9IE1hdGgucmFuZG9tO1xuICAgIHRoaXMucCA9IG5ldyBVaW50OEFycmF5KDI1Nik7XG4gICAgdGhpcy5wZXJtID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICB0aGlzLnBlcm1Nb2QxMiA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgICAgICB0aGlzLnBbaV0gPSByYW5kb20oKSAqIDI1NjtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IDUxMjsgaSsrKSB7XG4gICAgICAgIHRoaXMucGVybVtpXSA9IHRoaXMucFtpICYgMjU1XTtcbiAgICAgICAgdGhpcy5wZXJtTW9kMTJbaV0gPSB0aGlzLnBlcm1baV0gJSAxMjtcbiAgICB9XG5cbn1cblNpbXBsZXhOb2lzZS5wcm90b3R5cGUgPSB7XG4gICAgZ3JhZDM6IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIC0gMSwgMCxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgLSAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDAsIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAwLCAxLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMCwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMCwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDEsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAtIDEsIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIC0gMSwgLSAxXSksXG4gICAgZ3JhZDQ6IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDEsIDEsIDEsIDAsIDEsIDEsIC0gMSwgMCwgMSwgLSAxLCAxLCAwLCAxLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAtIDEsIDEsIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAtIDEsIC0gMSwgMSwgMCwgLSAxLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAwLCAxLCAxLCAxLCAwLCAxLCAtIDEsIDEsIDAsIC0gMSwgMSwgMSwgMCwgLSAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAwLCAxLCAxLCAtIDEsIDAsIDEsIC0gMSwgLSAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgLSAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMSwgMCwgMSwgMSwgMSwgMCwgLSAxLCAxLCAtIDEsIDAsIDEsIDEsIC0gMSwgMCwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMSwgMCwgMSwgLSAxLCAxLCAwLCAtIDEsIC0gMSwgLSAxLCAwLCAxLCAtIDEsIC0gMSwgMCwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDEsIDEsIDAsIDEsIDEsIC0gMSwgMCwgMSwgLSAxLCAxLCAwLCAxLCAtIDEsIC0gMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDEsIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAtIDEsIC0gMSwgMSwgMCwgLSAxLCAtIDEsIC0gMSwgMF0pLFxuICAgIG5vaXNlMkQ6IGZ1bmN0aW9uICh4aW4sIHlpbikge1xuICAgICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTIsXG4gICAgICAgICAgICBwZXJtID0gdGhpcy5wZXJtLFxuICAgICAgICAgICAgZ3JhZDMgPSB0aGlzLmdyYWQzO1xuICAgICAgICB2YXIgbjA9MCwgbjE9MCwgbjI9MDsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cbiAgICAgICAgdmFyIHMgPSAoeGluICsgeWluKSAqIEYyOyAvLyBIYWlyeSBmYWN0b3IgZm9yIDJEXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4aW4gKyBzKTtcbiAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xuICAgICAgICB2YXIgdCA9IChpICsgaikgKiBHMjtcbiAgICAgICAgdmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5KSBzcGFjZVxuICAgICAgICB2YXIgWTAgPSBqIC0gdDtcbiAgICAgICAgdmFyIHgwID0geGluIC0gWDA7IC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXG4gICAgICAgIHZhciB5MCA9IHlpbiAtIFkwO1xuICAgICAgICAvLyBGb3IgdGhlIDJEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGFuIGVxdWlsYXRlcmFsIHRyaWFuZ2xlLlxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXG4gICAgICAgIHZhciBpMSwgajE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCAobWlkZGxlKSBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqKSBjb29yZHNcbiAgICAgICAgaWYgKHgwID4geTApIHtcbiAgICAgICAgICAgIGkxID0gMTtcbiAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgfSAvLyBsb3dlciB0cmlhbmdsZSwgWFkgb3JkZXI6ICgwLDApLT4oMSwwKS0+KDEsMSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICBqMSA9IDE7XG4gICAgICAgIH0gLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXG4gICAgICAgIC8vIEEgc3RlcCBvZiAoMSwwKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYykgaW4gKHgseSksIGFuZFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMSkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMpIGluICh4LHkpLCB3aGVyZVxuICAgICAgICAvLyBjID0gKDMtc3FydCgzKSkvNlxuICAgICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzI7IC8vIE9mZnNldHMgZm9yIG1pZGRsZSBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMjtcbiAgICAgICAgdmFyIHgyID0geDAgLSAxLjAgKyAyLjAgKiBHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIHZhciB5MiA9IHkwIC0gMS4wICsgMi4wICogRzI7XG4gICAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgdGhyZWUgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIHZhciBpaSA9IGkgJiAyNTU7XG4gICAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgdmFyIHQwID0gMC41IC0geDAgKiB4MCAtIHkwICogeTA7XG4gICAgICAgIGlmICh0MCA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgZ2kwID0gcGVybU1vZDEyW2lpICsgcGVybVtqal1dICogMztcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQzW2dpMF0gKiB4MCArIGdyYWQzW2dpMCArIDFdICogeTApOyAvLyAoeCx5KSBvZiBncmFkMyB1c2VkIGZvciAyRCBncmFkaWVudFxuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNSAtIHgxICogeDEgLSB5MSAqIHkxO1xuICAgICAgICBpZiAodDEgPj0gMCkge1xuICAgICAgICAgICAgdmFyIGdpMSA9IHBlcm1Nb2QxMltpaSArIGkxICsgcGVybVtqaiArIGoxXV0gKiAzO1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC41IC0geDIgKiB4MiAtIHkyICogeTI7XG4gICAgICAgIGlmICh0MiA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgZ2kyID0gcGVybU1vZDEyW2lpICsgMSArIHBlcm1bamogKyAxXV0gKiAzO1xuICAgICAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDNbZ2kyXSAqIHgyICsgZ3JhZDNbZ2kyICsgMV0gKiB5Mik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuICAgICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXG4gICAgICAgIHJldHVybiA3MC4wICogKG4wICsgbjEgKyBuMik7XG4gICAgfSxcbiAgICAvLyAzRCBzaW1wbGV4IG5vaXNlXG4gICAgbm9pc2UzRDogZnVuY3Rpb24gKHhpbiwgeWluLCB6aW4pIHtcbiAgICAgICAgdmFyIHBlcm1Nb2QxMiA9IHRoaXMucGVybU1vZDEyLFxuICAgICAgICAgICAgcGVybSA9IHRoaXMucGVybSxcbiAgICAgICAgICAgIGdyYWQzID0gdGhpcy5ncmFkMztcbiAgICAgICAgdmFyIG4wLCBuMSwgbjIsIG4zOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIGZvdXIgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXG4gICAgICAgIHZhciBzID0gKHhpbiArIHlpbiArIHppbikgKiBGMzsgLy8gVmVyeSBuaWNlIGFuZCBzaW1wbGUgc2tldyBmYWN0b3IgZm9yIDNEXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4aW4gKyBzKTtcbiAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xuICAgICAgICB2YXIgayA9IE1hdGguZmxvb3IoemluICsgcyk7XG4gICAgICAgIHZhciB0ID0gKGkgKyBqICsgaykgKiBHMztcbiAgICAgICAgdmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5LHopIHNwYWNlXG4gICAgICAgIHZhciBZMCA9IGogLSB0O1xuICAgICAgICB2YXIgWjAgPSBrIC0gdDtcbiAgICAgICAgdmFyIHgwID0geGluIC0gWDA7IC8vIFRoZSB4LHkseiBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgdmFyIHkwID0geWluIC0gWTA7XG4gICAgICAgIHZhciB6MCA9IHppbiAtIFowO1xuICAgICAgICAvLyBGb3IgdGhlIDNEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGEgc2xpZ2h0bHkgaXJyZWd1bGFyIHRldHJhaGVkcm9uLlxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXG4gICAgICAgIHZhciBpMSwgajEsIGsxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaixrKSBjb29yZHNcbiAgICAgICAgdmFyIGkyLCBqMiwgazI7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGosaykgY29vcmRzXG4gICAgICAgIGlmICh4MCA+PSB5MCkge1xuICAgICAgICAgICAgaWYgKHkwID49IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDA7XG4gICAgICAgICAgICB9IC8vIFggWSBaIG9yZGVyXG4gICAgICAgICAgICBlbHNlIGlmICh4MCA+PSB6MCkge1xuICAgICAgICAgICAgICAgIGkxID0gMTtcbiAgICAgICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgICAgICAgazEgPSAwO1xuICAgICAgICAgICAgICAgIGkyID0gMTtcbiAgICAgICAgICAgICAgICBqMiA9IDA7XG4gICAgICAgICAgICAgICAgazIgPSAxO1xuICAgICAgICAgICAgfSAvLyBYIFogWSBvcmRlclxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDE7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMDtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFogWCBZIG9yZGVyXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIHgwPHkwXG4gICAgICAgICAgICBpZiAoeTAgPCB6MCkge1xuICAgICAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgICAgICAgICAgazEgPSAxO1xuICAgICAgICAgICAgICAgIGkyID0gMDtcbiAgICAgICAgICAgICAgICBqMiA9IDE7XG4gICAgICAgICAgICAgICAgazIgPSAxO1xuICAgICAgICAgICAgfSAvLyBaIFkgWCBvcmRlclxuICAgICAgICAgICAgZWxzZSBpZiAoeDAgPCB6MCkge1xuICAgICAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgICAgICBqMSA9IDE7XG4gICAgICAgICAgICAgICAgazEgPSAwO1xuICAgICAgICAgICAgICAgIGkyID0gMDtcbiAgICAgICAgICAgICAgICBqMiA9IDE7XG4gICAgICAgICAgICAgICAgazIgPSAxO1xuICAgICAgICAgICAgfSAvLyBZIFogWCBvcmRlclxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDA7XG4gICAgICAgICAgICB9IC8vIFkgWCBaIG9yZGVyXG4gICAgICAgIH1cbiAgICAgICAgLy8gQSBzdGVwIG9mICgxLDAsMCkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYywtYykgaW4gKHgseSx6KSxcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDEsMCkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYywtYykgaW4gKHgseSx6KSwgYW5kXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwwLDEpIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgtYywtYywxLWMpIGluICh4LHkseiksIHdoZXJlXG4gICAgICAgIC8vIGMgPSAxLzYuXG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHMzsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xuICAgICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzM7XG4gICAgICAgIHZhciB6MSA9IHowIC0gazEgKyBHMztcbiAgICAgICAgdmFyIHgyID0geDAgLSBpMiArIDIuMCAqIEczOyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSBqMiArIDIuMCAqIEczO1xuICAgICAgICB2YXIgejIgPSB6MCAtIGsyICsgMi4wICogRzM7XG4gICAgICAgIHZhciB4MyA9IHgwIC0gMS4wICsgMy4wICogRzM7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkseikgY29vcmRzXG4gICAgICAgIHZhciB5MyA9IHkwIC0gMS4wICsgMy4wICogRzM7XG4gICAgICAgIHZhciB6MyA9IHowIC0gMS4wICsgMy4wICogRzM7XG4gICAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgZm91ciBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgICAgdmFyIGpqID0gaiAmIDI1NTtcbiAgICAgICAgdmFyIGtrID0gayAmIDI1NTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgZm91ciBjb3JuZXJzXG4gICAgICAgIHZhciB0MCA9IDAuNiAtIHgwICogeDAgLSB5MCAqIHkwIC0gejAgKiB6MDtcbiAgICAgICAgaWYgKHQwIDwgMCkgbjAgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMCA9IHBlcm1Nb2QxMltpaSArIHBlcm1bamogKyBwZXJtW2trXV1dICogMztcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQzW2dpMF0gKiB4MCArIGdyYWQzW2dpMCArIDFdICogeTAgKyBncmFkM1tnaTAgKyAyXSAqIHowKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDEgPSAwLjYgLSB4MSAqIHgxIC0geTEgKiB5MSAtIHoxICogejE7XG4gICAgICAgIGlmICh0MSA8IDApIG4xID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMV1dXSAqIDM7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkM1tnaTFdICogeDEgKyBncmFkM1tnaTEgKyAxXSAqIHkxICsgZ3JhZDNbZ2kxICsgMl0gKiB6MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC42IC0geDIgKiB4MiAtIHkyICogeTIgLSB6MiAqIHoyO1xuICAgICAgICBpZiAodDIgPCAwKSBuMiA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kyID0gcGVybU1vZDEyW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazJdXV0gKiAzO1xuICAgICAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDNbZ2kyXSAqIHgyICsgZ3JhZDNbZ2kyICsgMV0gKiB5MiArIGdyYWQzW2dpMiArIDJdICogejIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MyA9IDAuNiAtIHgzICogeDMgLSB5MyAqIHkzIC0gejMgKiB6MztcbiAgICAgICAgaWYgKHQzIDwgMCkgbjMgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMyA9IHBlcm1Nb2QxMltpaSArIDEgKyBwZXJtW2pqICsgMSArIHBlcm1ba2sgKyAxXV1dICogMztcbiAgICAgICAgICAgIHQzICo9IHQzO1xuICAgICAgICAgICAgbjMgPSB0MyAqIHQzICogKGdyYWQzW2dpM10gKiB4MyArIGdyYWQzW2dpMyArIDFdICogeTMgKyBncmFkM1tnaTMgKyAyXSAqIHozKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHN0YXkganVzdCBpbnNpZGUgWy0xLDFdXG4gICAgICAgIHJldHVybiAzMi4wICogKG4wICsgbjEgKyBuMiArIG4zKTtcbiAgICB9LFxuICAgIC8vIDREIHNpbXBsZXggbm9pc2UsIGJldHRlciBzaW1wbGV4IHJhbmsgb3JkZXJpbmcgbWV0aG9kIDIwMTItMDMtMDlcbiAgICBub2lzZTREOiBmdW5jdGlvbiAoeCwgeSwgeiwgdykge1xuICAgICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTIsXG4gICAgICAgICAgICBwZXJtID0gdGhpcy5wZXJtLFxuICAgICAgICAgICAgZ3JhZDQgPSB0aGlzLmdyYWQ0O1xuXG4gICAgICAgIHZhciBuMCwgbjEsIG4yLCBuMywgbjQ7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgZml2ZSBjb3JuZXJzXG4gICAgICAgIC8vIFNrZXcgdGhlICh4LHkseix3KSBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggY2VsbCBvZiAyNCBzaW1wbGljZXMgd2UncmUgaW5cbiAgICAgICAgdmFyIHMgPSAoeCArIHkgKyB6ICsgdykgKiBGNDsgLy8gRmFjdG9yIGZvciA0RCBza2V3aW5nXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4ICsgcyk7XG4gICAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5ICsgcyk7XG4gICAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6ICsgcyk7XG4gICAgICAgIHZhciBsID0gTWF0aC5mbG9vcih3ICsgcyk7XG4gICAgICAgIHZhciB0ID0gKGkgKyBqICsgayArIGwpICogRzQ7IC8vIEZhY3RvciBmb3IgNEQgdW5za2V3aW5nXG4gICAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSx6LHcpIHNwYWNlXG4gICAgICAgIHZhciBZMCA9IGogLSB0O1xuICAgICAgICB2YXIgWjAgPSBrIC0gdDtcbiAgICAgICAgdmFyIFcwID0gbCAtIHQ7XG4gICAgICAgIHZhciB4MCA9IHggLSBYMDsgLy8gVGhlIHgseSx6LHcgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXG4gICAgICAgIHZhciB5MCA9IHkgLSBZMDtcbiAgICAgICAgdmFyIHowID0geiAtIFowO1xuICAgICAgICB2YXIgdzAgPSB3IC0gVzA7XG4gICAgICAgIC8vIEZvciB0aGUgNEQgY2FzZSwgdGhlIHNpbXBsZXggaXMgYSA0RCBzaGFwZSBJIHdvbid0IGV2ZW4gdHJ5IHRvIGRlc2NyaWJlLlxuICAgICAgICAvLyBUbyBmaW5kIG91dCB3aGljaCBvZiB0aGUgMjQgcG9zc2libGUgc2ltcGxpY2VzIHdlJ3JlIGluLCB3ZSBuZWVkIHRvXG4gICAgICAgIC8vIGRldGVybWluZSB0aGUgbWFnbml0dWRlIG9yZGVyaW5nIG9mIHgwLCB5MCwgejAgYW5kIHcwLlxuICAgICAgICAvLyBTaXggcGFpci13aXNlIGNvbXBhcmlzb25zIGFyZSBwZXJmb3JtZWQgYmV0d2VlbiBlYWNoIHBvc3NpYmxlIHBhaXJcbiAgICAgICAgLy8gb2YgdGhlIGZvdXIgY29vcmRpbmF0ZXMsIGFuZCB0aGUgcmVzdWx0cyBhcmUgdXNlZCB0byByYW5rIHRoZSBudW1iZXJzLlxuICAgICAgICB2YXIgcmFua3ggPSAwO1xuICAgICAgICB2YXIgcmFua3kgPSAwO1xuICAgICAgICB2YXIgcmFua3ogPSAwO1xuICAgICAgICB2YXIgcmFua3cgPSAwO1xuICAgICAgICBpZiAoeDAgPiB5MCkgcmFua3grKztcbiAgICAgICAgZWxzZSByYW5reSsrO1xuICAgICAgICBpZiAoeDAgPiB6MCkgcmFua3grKztcbiAgICAgICAgZWxzZSByYW5reisrO1xuICAgICAgICBpZiAoeDAgPiB3MCkgcmFua3grKztcbiAgICAgICAgZWxzZSByYW5rdysrO1xuICAgICAgICBpZiAoeTAgPiB6MCkgcmFua3krKztcbiAgICAgICAgZWxzZSByYW5reisrO1xuICAgICAgICBpZiAoeTAgPiB3MCkgcmFua3krKztcbiAgICAgICAgZWxzZSByYW5rdysrO1xuICAgICAgICBpZiAoejAgPiB3MCkgcmFua3orKztcbiAgICAgICAgZWxzZSByYW5rdysrO1xuICAgICAgICB2YXIgaTEsIGoxLCBrMSwgbDE7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSBzZWNvbmQgc2ltcGxleCBjb3JuZXJcbiAgICAgICAgdmFyIGkyLCBqMiwgazIsIGwyOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgdGhpcmQgc2ltcGxleCBjb3JuZXJcbiAgICAgICAgdmFyIGkzLCBqMywgazMsIGwzOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgZm91cnRoIHNpbXBsZXggY29ybmVyXG4gICAgICAgIC8vIHNpbXBsZXhbY10gaXMgYSA0LXZlY3RvciB3aXRoIHRoZSBudW1iZXJzIDAsIDEsIDIgYW5kIDMgaW4gc29tZSBvcmRlci5cbiAgICAgICAgLy8gTWFueSB2YWx1ZXMgb2YgYyB3aWxsIG5ldmVyIG9jY3VyLCBzaW5jZSBlLmcuIHg+eT56PncgbWFrZXMgeDx6LCB5PHcgYW5kIHg8d1xuICAgICAgICAvLyBpbXBvc3NpYmxlLiBPbmx5IHRoZSAyNCBpbmRpY2VzIHdoaWNoIGhhdmUgbm9uLXplcm8gZW50cmllcyBtYWtlIGFueSBzZW5zZS5cbiAgICAgICAgLy8gV2UgdXNlIGEgdGhyZXNob2xkaW5nIHRvIHNldCB0aGUgY29vcmRpbmF0ZXMgaW4gdHVybiBmcm9tIHRoZSBsYXJnZXN0IG1hZ25pdHVkZS5cbiAgICAgICAgLy8gUmFuayAzIGRlbm90ZXMgdGhlIGxhcmdlc3QgY29vcmRpbmF0ZS5cbiAgICAgICAgaTEgPSByYW5reCA+PSAzID8gMSA6IDA7XG4gICAgICAgIGoxID0gcmFua3kgPj0gMyA/IDEgOiAwO1xuICAgICAgICBrMSA9IHJhbmt6ID49IDMgPyAxIDogMDtcbiAgICAgICAgbDEgPSByYW5rdyA+PSAzID8gMSA6IDA7XG4gICAgICAgIC8vIFJhbmsgMiBkZW5vdGVzIHRoZSBzZWNvbmQgbGFyZ2VzdCBjb29yZGluYXRlLlxuICAgICAgICBpMiA9IHJhbmt4ID49IDIgPyAxIDogMDtcbiAgICAgICAgajIgPSByYW5reSA+PSAyID8gMSA6IDA7XG4gICAgICAgIGsyID0gcmFua3ogPj0gMiA/IDEgOiAwO1xuICAgICAgICBsMiA9IHJhbmt3ID49IDIgPyAxIDogMDtcbiAgICAgICAgLy8gUmFuayAxIGRlbm90ZXMgdGhlIHNlY29uZCBzbWFsbGVzdCBjb29yZGluYXRlLlxuICAgICAgICBpMyA9IHJhbmt4ID49IDEgPyAxIDogMDtcbiAgICAgICAgajMgPSByYW5reSA+PSAxID8gMSA6IDA7XG4gICAgICAgIGszID0gcmFua3ogPj0gMSA/IDEgOiAwO1xuICAgICAgICBsMyA9IHJhbmt3ID49IDEgPyAxIDogMDtcbiAgICAgICAgLy8gVGhlIGZpZnRoIGNvcm5lciBoYXMgYWxsIGNvb3JkaW5hdGUgb2Zmc2V0cyA9IDEsIHNvIG5vIG5lZWQgdG8gY29tcHV0ZSB0aGF0LlxuICAgICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzQ7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzQ7XG4gICAgICAgIHZhciB6MSA9IHowIC0gazEgKyBHNDtcbiAgICAgICAgdmFyIHcxID0gdzAgLSBsMSArIEc0O1xuICAgICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzQ7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5MiA9IHkwIC0gajIgKyAyLjAgKiBHNDtcbiAgICAgICAgdmFyIHoyID0gejAgLSBrMiArIDIuMCAqIEc0O1xuICAgICAgICB2YXIgdzIgPSB3MCAtIGwyICsgMi4wICogRzQ7XG4gICAgICAgIHZhciB4MyA9IHgwIC0gaTMgKyAzLjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgZm91cnRoIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5MyA9IHkwIC0gajMgKyAzLjAgKiBHNDtcbiAgICAgICAgdmFyIHozID0gejAgLSBrMyArIDMuMCAqIEc0O1xuICAgICAgICB2YXIgdzMgPSB3MCAtIGwzICsgMy4wICogRzQ7XG4gICAgICAgIHZhciB4NCA9IHgwIC0gMS4wICsgNC4wICogRzQ7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHk0ID0geTAgLSAxLjAgKyA0LjAgKiBHNDtcbiAgICAgICAgdmFyIHo0ID0gejAgLSAxLjAgKyA0LjAgKiBHNDtcbiAgICAgICAgdmFyIHc0ID0gdzAgLSAxLjAgKyA0LjAgKiBHNDtcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmaXZlIHNpbXBsZXggY29ybmVyc1xuICAgICAgICB2YXIgaWkgPSBpICYgMjU1O1xuICAgICAgICB2YXIgamogPSBqICYgMjU1O1xuICAgICAgICB2YXIga2sgPSBrICYgMjU1O1xuICAgICAgICB2YXIgbGwgPSBsICYgMjU1O1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSBmaXZlIGNvcm5lcnNcbiAgICAgICAgdmFyIHQwID0gMC42IC0geDAgKiB4MCAtIHkwICogeTAgLSB6MCAqIHowIC0gdzAgKiB3MDtcbiAgICAgICAgaWYgKHQwIDwgMCkgbjAgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMCA9IChwZXJtW2lpICsgcGVybVtqaiArIHBlcm1ba2sgKyBwZXJtW2xsXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkNFtnaTBdICogeDAgKyBncmFkNFtnaTAgKyAxXSAqIHkwICsgZ3JhZDRbZ2kwICsgMl0gKiB6MCArIGdyYWQ0W2dpMCArIDNdICogdzApO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MSAtIHcxICogdzE7XG4gICAgICAgIGlmICh0MSA8IDApIG4xID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTEgPSAocGVybVtpaSArIGkxICsgcGVybVtqaiArIGoxICsgcGVybVtrayArIGsxICsgcGVybVtsbCArIGwxXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkNFtnaTFdICogeDEgKyBncmFkNFtnaTEgKyAxXSAqIHkxICsgZ3JhZDRbZ2kxICsgMl0gKiB6MSArIGdyYWQ0W2dpMSArIDNdICogdzEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MiA9IDAuNiAtIHgyICogeDIgLSB5MiAqIHkyIC0gejIgKiB6MiAtIHcyICogdzI7XG4gICAgICAgIGlmICh0MiA8IDApIG4yID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTIgPSAocGVybVtpaSArIGkyICsgcGVybVtqaiArIGoyICsgcGVybVtrayArIGsyICsgcGVybVtsbCArIGwyXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkNFtnaTJdICogeDIgKyBncmFkNFtnaTIgKyAxXSAqIHkyICsgZ3JhZDRbZ2kyICsgMl0gKiB6MiArIGdyYWQ0W2dpMiArIDNdICogdzIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MyA9IDAuNiAtIHgzICogeDMgLSB5MyAqIHkzIC0gejMgKiB6MyAtIHczICogdzM7XG4gICAgICAgIGlmICh0MyA8IDApIG4zID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTMgPSAocGVybVtpaSArIGkzICsgcGVybVtqaiArIGozICsgcGVybVtrayArIGszICsgcGVybVtsbCArIGwzXV1dXSAlIDMyKSAqIDQ7XG4gICAgICAgICAgICB0MyAqPSB0MztcbiAgICAgICAgICAgIG4zID0gdDMgKiB0MyAqIChncmFkNFtnaTNdICogeDMgKyBncmFkNFtnaTMgKyAxXSAqIHkzICsgZ3JhZDRbZ2kzICsgMl0gKiB6MyArIGdyYWQ0W2dpMyArIDNdICogdzMpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0NCA9IDAuNiAtIHg0ICogeDQgLSB5NCAqIHk0IC0gejQgKiB6NCAtIHc0ICogdzQ7XG4gICAgICAgIGlmICh0NCA8IDApIG40ID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTQgPSAocGVybVtpaSArIDEgKyBwZXJtW2pqICsgMSArIHBlcm1ba2sgKyAxICsgcGVybVtsbCArIDFdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQ0ICo9IHQ0O1xuICAgICAgICAgICAgbjQgPSB0NCAqIHQ0ICogKGdyYWQ0W2dpNF0gKiB4NCArIGdyYWQ0W2dpNCArIDFdICogeTQgKyBncmFkNFtnaTQgKyAyXSAqIHo0ICsgZ3JhZDRbZ2k0ICsgM10gKiB3NCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3VtIHVwIGFuZCBzY2FsZSB0aGUgcmVzdWx0IHRvIGNvdmVyIHRoZSByYW5nZSBbLTEsMV1cbiAgICAgICAgcmV0dXJuIDI3LjAgKiAobjAgKyBuMSArIG4yICsgbjMgKyBuNCk7XG4gICAgfVxuXG5cbn07XG5cbi8vIGFtZFxuaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIGRlZmluZS5hbWQpIGRlZmluZShmdW5jdGlvbigpe3JldHVybiBTaW1wbGV4Tm9pc2U7fSk7XG4vL2NvbW1vbiBqc1xuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykgZXhwb3J0cy5TaW1wbGV4Tm9pc2UgPSBTaW1wbGV4Tm9pc2U7XG4vLyBicm93c2VyXG5lbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgd2luZG93LlNpbXBsZXhOb2lzZSA9IFNpbXBsZXhOb2lzZTtcbi8vIG5vZGVqc1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTaW1wbGV4Tm9pc2U7XG59XG5cbn0pKCk7XG4iLCJ2YXIgVFJVTksgPSBbMjAsIDIwLCAyMCwgMjAsIDIwLCAyMF07XG52YXIgTEVBRiA9IFsyMSwgMjEsIDIxLCAyMSwgMjEsIDIxXTtcblxudmFyIGJvZHkwID0gW1xuICBbMiwgMSwgMSwgVFJVTktdLFxuICBbMiwgMiwgMSwgVFJVTktdLFxuICBbMiwgMywgMSwgVFJVTktdLFxuICBbMywgMywgMSwgVFJVTktdLFxuICBbNCwgMywgMSwgVFJVTktdLFxuICBbMiwgNCwgMSwgTEVBRl0sXG4gIFszLCA0LCAxLCBMRUFGXSxcbiAgWzQsIDQsIDEsIFRSVU5LXSxcbiAgWzIsIDUsIDEsIFRSVU5LXSxcbiAgWzMsIDUsIDEsIFRSVU5LXSxcbiAgWzQsIDUsIDEsIFRSVU5LXSxcblxuICBbMSwgMywgMSwgVFJVTktdLFxuICBbMCwgMywgMSwgVFJVTktdLFxuICBbMSwgNCwgMSwgTEVBRl0sXG4gIFswLCA0LCAxLCBUUlVOS10sXG4gIFsxLCA1LCAxLCBUUlVOS10sXG4gIFswLCA1LCAxLCBUUlVOS11cbl07XG5cbnZhciBmZWV0MCA9IFtcbiAgWzMsIDAsIDEsIFRSVU5LXSxcbiAgWzMsIDEsIDEsIFRSVU5LXSxcbiAgWzEsIDAsIDEsIFRSVU5LXSxcbiAgWzEsIDEsIDEsIFRSVU5LXVxuXTtcblxudmFyIGZlZXQxID0gW1xuICBbMywgMCwgMiwgVFJVTktdLFxuICBbMywgMSwgMiwgVFJVTktdLFxuICBbMSwgMCwgMCwgVFJVTktdLFxuICBbMSwgMSwgMCwgVFJVTktdXG5dO1xuXG52YXIgZmVldDIgPSBbXG4gIFszLCAwLCAwLCBUUlVOS10sXG4gIFszLCAxLCAwLCBUUlVOS10sXG4gIFsxLCAwLCAyLCBUUlVOS10sXG4gIFsxLCAxLCAyLCBUUlVOS11cbl07XG5cbnZhciBmcmFtZXMgPSBbXG4gIGJvZHkwLmNvbmNhdChmZWV0MCksXG4gIGJvZHkwLmNvbmNhdChmZWV0MSksXG4gIGJvZHkwLmNvbmNhdChmZWV0MCksXG4gIGJvZHkwLmNvbmNhdChmZWV0Milcbl07XG5cblxuZnVuY3Rpb24gY2FsY0JvdW5kcyhmcmFtZXMpIHtcbiAgdmFyIG1pbiA9IG5ldyBUSFJFRS5WZWN0b3IzKEluZmluaXR5LCBJbmZpbml0eSwgSW5maW5pdHkpO1xuICB2YXIgbWF4ID0gbmV3IFRIUkVFLlZlY3RvcjMoLUluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eSk7XG5cbiAgZnJhbWVzLmZvckVhY2goZnVuY3Rpb24oZnJhbWUpIHtcbiAgICBmcmFtZS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICAgIGlmICh2WzBdIDwgbWluLngpIHsgbWluLnggPSB2WzBdOyB9XG4gICAgICBpZiAodlsxXSA8IG1pbi55KSB7IG1pbi55ID0gdlsxXTsgfVxuICAgICAgaWYgKHZbMl0gPCBtaW4ueikgeyBtaW4ueiA9IHZbMl07IH1cbiAgICAgIGlmICh2WzBdID4gbWF4LngpIHsgbWF4LnggPSB2WzBdOyB9XG4gICAgICBpZiAodlsxXSA+IG1heC55KSB7IG1heC55ID0gdlsxXTsgfVxuICAgICAgaWYgKHZbMl0gPiBtYXgueikgeyBtYXgueiA9IHZbMl07IH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBtaW46IG1pbixcbiAgICBtYXg6IG1heFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZyYW1lczogZnJhbWVzLFxuICBib3VuZHM6IGNhbGNCb3VuZHMoZnJhbWVzKVxufTtcbiIsInZhciBEaXIgPSB7fTtcblxuRGlyLkxFRlQgPSAwO1xuRGlyLlJJR0hUID0gMTtcbkRpci5CT1RUT00gPSAyO1xuRGlyLlVQID0gMztcbkRpci5CQUNLID0gNDtcbkRpci5GUk9OVCA9IDU7XG5cbkRpci5nZXRVbml0VmVjdG9yID0gZnVuY3Rpb24oZGlyKSB7XG4gIHN3aXRjaCAoZGlyKSB7XG4gICAgY2FzZSBcIjBcIjpcbiAgICBjYXNlIERpci5MRUZUOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKC0xLCAwLCAwKVxuICAgIGNhc2UgXCIxXCI6XG4gICAgY2FzZSBEaXIuUklHSFQ6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMCwgMClcbiAgICBjYXNlIFwiMlwiOlxuICAgIGNhc2UgRGlyLkJPVFRPTTpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAtMSwgMClcbiAgICBjYXNlIFwiM1wiOlxuICAgIGNhc2UgRGlyLlVQOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApXG4gICAgY2FzZSBcIjRcIjpcbiAgICBjYXNlIERpci5CQUNLOlxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIC0xKVxuICAgIGNhc2UgXCI1XCI6XG4gICAgY2FzZSBEaXIuRlJPTlQ6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSlcbiAgfVxufTtcblxudmFyIGdldFF1YXRSZXN1bHQgPSB7fTtcbkRpci5nZXRRdWF0ID0gZnVuY3Rpb24oZGlyKSB7XG4gIGlmIChnZXRRdWF0UmVzdWx0W2Rpcl0gPT0gbnVsbCkge1xuICAgIGdldFF1YXRSZXN1bHRbZGlyXSA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbVVuaXRWZWN0b3JzKG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApLCBEaXIuZ2V0VW5pdFZlY3RvcihkaXIpKTtcbiAgfVxuICByZXR1cm4gZ2V0UXVhdFJlc3VsdFtkaXJdO1xufTtcblxuRGlyLmdldE9wcG9zaXRlID0gZnVuY3Rpb24oZGlyKSB7XG4gIHZhciBvcHBvc2l0ZXMgPSB7XG4gICAgMDogMSxcbiAgICAxOiAwLFxuICAgIDI6IDMsXG4gICAgMzogMixcbiAgICA0OiA1LFxuICAgIDU6IDRcbiAgfTtcblxuICByZXR1cm4gb3Bwb3NpdGVzW2Rpcl07XG59O1xuXG5EaXIuaXNPcHBvc2l0ZSA9IGZ1bmN0aW9uKGRpciwgZGlyMikge1xuICByZXR1cm4gRGlyLmdldE9wcG9zaXRlKGRpcikgPT09IGRpcjI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcjtcbiIsInZhciBTaW1wbGV4Tm9pc2UgPSByZXF1aXJlKCdzaW1wbGV4LW5vaXNlJyk7XG5cbnZhciBtZXNoZXIgPSByZXF1aXJlKCcuLi92b3hlbC9tZXNoZXInKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuLi9kaXInKTtcbnZhciBDaHVua3MgPSByZXF1aXJlKCcuLi92b3hlbC9jaHVua3MnKTtcbnZhciBtZXNoQ2h1bmtzID0gcmVxdWlyZSgnLi4vdm94ZWwvbWVzaGNodW5rcycpO1xuXG52YXIgQ0xPVUQgPSAxMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJlbnQsIG1hdGVyaWFsKSB7XG5cbiAgdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcbiAgdmFyIGRhdGFNYXAgPSB7fTtcbiAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBwYXJlbnQuYWRkKG9iamVjdCk7XG5cbiAgdmFyIG5vaXNlMSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGMSA9IDAuMTtcbiAgdmFyIG5vaXNlMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGMiA9IDAuMDU7XG4gIHZhciBub2lzZV9wcmVzc3VyZSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VfcHJlc3N1cmVGID0gMC4wMDI7XG4gIHZhciBjbG91ZEFtb3VudCA9IC0xLjA7XG4gIHZhciBjb3VudGVyID0gMDtcbiAgdmFyIGNvb2xkb3duID0gNC4yO1xuXG4gIHZhciBhbGxDb29yZHMgPSB7fTtcblxuICB2YXIgc2l6ZSA9IDQxO1xuICB2YXIgY2VudGVyTnVtID0gKHNpemUgLyAyKTtcbiAgdmFyIGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKC1zaXplIC8gMiwgLXNpemUgLyAyLCAtc2l6ZSAvIDIpO1xuXG4gIHZhciBjbG91ZFZveGVsID0gW1xuICAgIENMT1VELCBDTE9VRCwgQ0xPVUQsIENMT1VELCBDTE9VRCwgQ0xPVURcbiAgXTtcblxuICBpbml0RGF0YSgpO1xuXG4gIGZ1bmN0aW9uIGluaXREYXRhKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuXG4gICAgZm9yICh2YXIgZGlyID0gMDsgZGlyIDwgNjsgZGlyKyspIHtcbiAgICAgIHZhciBkID0gTWF0aC5mbG9vcihkaXIgLyAyKTtcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuICAgICAgdmFyIGNvb3JkRCA9IGRpciAlIDIgPyAwIDogc2l6ZSAtIDE7XG4gICAgICB2YXIgZmFsbERpciA9IGNvb3JkRCA9PT0gMCA/IDEgOiAtMTtcbiAgICAgIHZhciBmYWxsQ29vcmREID0gY29vcmREICsgZmFsbERpcjtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgICBjb29yZFtkXSA9IGNvb3JkRDtcbiAgICAgICAgICBjb29yZFt1XSA9IGk7XG4gICAgICAgICAgY29vcmRbdl0gPSBqO1xuXG4gICAgICAgICAgdmFyIHJlbCA9IFtcbiAgICAgICAgICAgIChjb29yZFswXSArIGNlbnRlci54KSxcbiAgICAgICAgICAgIChjb29yZFsxXSArIGNlbnRlci55KSxcbiAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlci56KVxuICAgICAgICAgIF07XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHByZXNzdXJlOiBub2lzZV9wcmVzc3VyZS5ub2lzZTNEKFxuICAgICAgICAgICAgICByZWxbMF0gKiBub2lzZV9wcmVzc3VyZUYsXG4gICAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlX3ByZXNzdXJlRixcbiAgICAgICAgICAgICAgcmVsWzJdICogbm9pc2VfcHJlc3N1cmVGXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgYW1vdW50OiAwLFxuICAgICAgICAgICAgZGVsdGE6IDAsXG4gICAgICAgICAgICBjb29yZDogW2Nvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl1dXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBoYXNoID0gY29vcmQuam9pbignLCcpO1xuICAgICAgICAgIGFsbENvb3Jkc1toYXNoXSA9IFtjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdXTtcbiAgICAgICAgICBkYXRhTWFwW2hhc2hdID0gZGF0YTtcblxuICAgICAgICAgIHZhciB2YWx1ZSA9IG5vaXNlMS5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMSxcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjEsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYxXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTIgPSBub2lzZTIubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUYyLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGMlxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB2YWx1ZSA9IE1hdGgucG93KHZhbHVlICsgdmFsdWUyLCAxKSArIGNsb3VkQW1vdW50O1xuXG4gICAgICAgICAgaWYgKHZhbHVlID4gMC4wKSB7XG4gICAgICAgICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGNsb3VkVm94ZWwpO1xuICAgICAgICAgICAgZGF0YS5hbW91bnQgKz0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXRhLm5laWdoYm91cnMgPSBbXTtcblxuXG4gICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpIC0gMSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpID09PSBzaXplIC0gMSkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGkgKyAxLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpLCBqIC0gMSwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChqID09PSBzaXplIC0gMSkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGksIGogKyAxLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRpciA9PT0gMCkge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMF07XG4gICAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09IDEpIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzFdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAyKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1szXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gMykge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMl07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZWxJID0gaSAtIGNlbnRlck51bTtcbiAgICAgICAgICAgIHZhciByZWxKID0gaiAtIGNlbnRlck51bTtcblxuICAgICAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihyZWxJLCByZWxKKTtcbiAgICAgICAgICAgIGFuZ2xlID0gbm9ybWFsaXplQW5nbGUoYW5nbGUpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBub3JtYWxpemVBbmdsZShhbmdsZSkge1xuICAgICAgICAgICAgICBhbmdsZSAlPSAoTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgICBpZiAoYW5nbGUgPCBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgKz0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgLT0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IE1hdGguUEkgLyA0O1xuICAgICAgICAgICAgdmFyIHN0ZXAgPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IC1NYXRoLlBJO1xuXG4gICAgICAgICAgICBpZiAoYW5nbGUgPj0gb2Zmc2V0ICYmIGFuZ2xlIDwgb2Zmc2V0ICsgc3RlcCkge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5nbGUgPj0gb2Zmc2V0ICsgc3RlcCAmJiBhbmdsZSA8IG9mZnNldCArIHN0ZXAgKiAyKSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbmdsZSA+PSBvZmZzZXQgLSBzdGVwICYmIGFuZ2xlIDwgb2Zmc2V0KSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzNdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdldENvb3JkKGksIGosIGssIGQsIHUsIHYpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICBjb29yZFtkXSA9IGk7XG4gICAgY29vcmRbdV0gPSBqO1xuICAgIGNvb3JkW3ZdID0gaztcbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cblxuICB1cGRhdGVNZXNoKCk7XG5cbiAgb2JqZWN0LnBvc2l0aW9uLmNvcHkoY2VudGVyKTtcblxuICBmdW5jdGlvbiB0aWNrKGR0KSB7XG4gICAgY291bnRlciArPSBkdDtcbiAgICBpZiAoY291bnRlciA+IGNvb2xkb3duKSB7XG4gICAgICBjb3VudGVyIC09IGNvb2xkb3duO1xuXG4gICAgICB2YXIgY2hhbmdlZCA9IHt9O1xuICAgICAgZm9yICh2YXIgaWQgaW4gYWxsQ29vcmRzKSB7XG4gICAgICAgIHZhciBjb29yZCA9IGFsbENvb3Jkc1tpZF07XG4gICAgICAgIHZhciBkYXRhID0gZGF0YU1hcFtpZF07XG4gICAgICAgIHZhciBuZXh0Q29vcmQgPSBkYXRhLm5leHRDb29yZDtcbiAgICAgICAgaWYgKG5leHRDb29yZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YS5hbW91bnQgPD0gMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5leHRIYXNoID0gbmV4dENvb3JkLmpvaW4oJywnKTtcbiAgICAgICAgdmFyIG5leHREYXRhID0gZGF0YU1hcFtuZXh0SGFzaF07XG4gICAgICAgIGNoYW5nZWRbbmV4dEhhc2hdID0gdHJ1ZTtcbiAgICAgICAgY2hhbmdlZFtpZF0gPSB0cnVlO1xuXG4gICAgICAgIG5leHREYXRhLmRlbHRhICs9IDEuMDtcbiAgICAgICAgZGF0YS5kZWx0YSArPSAtMS4wO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpZCBpbiBjaGFuZ2VkKSB7XG4gICAgICAgIHZhciBkYXRhID0gZGF0YU1hcFtpZF07XG4gICAgICAgIHZhciBjb29yZCA9IGRhdGEuY29vcmQ7XG4gICAgICAgIGRhdGEuYW1vdW50ICs9IGRhdGEuZGVsdGE7XG4gICAgICAgIGRhdGEuZGVsdGEgPSAwO1xuXG4gICAgICAgIGlmIChkYXRhLmFtb3VudCA+PSAxLjApIHtcbiAgICAgICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGNsb3VkVm94ZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNodW5rcy5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlTWVzaCgpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiB1cGRhdGVNZXNoKCkge1xuICAgIG1lc2hDaHVua3MoY2h1bmtzLCBvYmplY3QsIG1hdGVyaWFsKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHRpY2s6IHRpY2tcbiAgfTtcbn1cbiIsInZhciBWb3hlbCA9IHJlcXVpcmUoJy4uL3ZveGVsJyk7XG52YXIgQ2h1bmtzID0gVm94ZWwuQ2h1bmtzO1xudmFyIG1lc2hDaHVua3MgPSBWb3hlbC5tZXNoQ2h1bmtzO1xudmFyIGNvcHlDaHVua3MgPSBWb3hlbC5jb3B5Q2h1bmtzO1xudmFyIERpciA9IHJlcXVpcmUoJy4uL2RpcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBhcmVudCwgYmxvY2tNYXRlcmlhbCwgdGVycmlhbikge1xuICB2YXIgc2NhbGUgPSAxIC8gNS4wO1xuICB2YXIgaW52ZXJzZVNjYWxlID0gMSAvIHNjYWxlO1xuICAvLyB2YXIgcG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygxNSwgMzMsIDE1KTtcbiAgdmFyIHBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMTUsIDMzLCAxNSk7XG5cbiAgdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcblxuICB2YXIgZGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvY3JpdHRlcjAnKTtcbiAgdmFyIGZyYW1lcyA9IGRhdGEuZnJhbWVzO1xuICB2YXIgYm91bmRzID0gZGF0YS5ib3VuZHM7XG5cbiAgdmFyIG9mZnNldCA9IGJvdW5kcy5tYXguY2xvbmUoKS5zdWIoYm91bmRzLm1pbikubXVsdGlwbHlTY2FsYXIoLTAuNSk7XG4gIG9mZnNldC54ID0gTWF0aC5yb3VuZChvZmZzZXQueCk7XG4gIG9mZnNldC55ID0gMDtcbiAgb2Zmc2V0LnogPSBNYXRoLnJvdW5kKG9mZnNldC56KTtcblxuICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIHZhciBwaXZvdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBwaXZvdC5wb3NpdGlvbi5jb3B5KG9mZnNldCk7XG4gIHBhcmVudC5hZGQob2JqZWN0KTtcbiAgb2JqZWN0LmFkZChwaXZvdCk7XG5cbiAgb2JqZWN0LnNjYWxlLnNldChzY2FsZSwgc2NhbGUsIHNjYWxlKTtcbiAgbWVzaENodW5rcyhjaHVua3MsIHBpdm90LCBibG9ja01hdGVyaWFsKTtcblxuICB2YXIgZnJhbWVUaW1lID0gMC40O1xuICB2YXIgY291bnRlciA9IDA7XG4gIHZhciBjdXJyZW50RnJhbWUgPSAwO1xuICB2YXIgdG90YWxGcmFtZSA9IGZyYW1lcy5sZW5ndGg7XG5cbiAgdmFyIGN1cnJlbnRHcmF2aXR5ID0gMDtcbiAgdmFyIGZhbGxTcGVlZCA9IDAuMDE7XG4gIHZhciBjZW50ZXJPZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygwLjUsIDAsIDAuNSk7XG5cbiAgZHJhd0NodW5rKCk7XG5cbiAgZnVuY3Rpb24gdGljayhkdCkge1xuICAgIGNvdW50ZXIgKz0gZHQ7XG5cbiAgICB2YXIgY29vcmQgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgIE1hdGguZmxvb3IocG9zaXRpb24ueCksXG4gICAgICBNYXRoLmZsb29yKHBvc2l0aW9uLnkpLFxuICAgICAgTWF0aC5mbG9vcihwb3NpdGlvbi56KVxuICAgICk7XG5cbiAgICB2YXIgZGF0YSA9IHRlcnJpYW4uZ2V0RGF0YShjb29yZC54LCBjb29yZC55LCBjb29yZC56KTtcbiAgICB2YXIgZ3Jhdml0eSA9IGRhdGEuZ3Jhdml0eTtcblxuICAgIHZhciBoYXNTYW1lR3Jhdml0eSA9IGZhbHNlO1xuICAgIGZvciAodmFyIGlkIGluIGdyYXZpdHkpIHtcbiAgICAgIGlmIChjdXJyZW50R3Jhdml0eSA9PT0gaWQpIHtcbiAgICAgICAgaGFzU2FtZUdyYXZpdHkgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaGFzU2FtZUdyYXZpdHkpIHtcbiAgICAgIGN1cnJlbnRHcmF2aXR5ID0gT2JqZWN0LmtleXMoZ3Jhdml0eSlbMF07XG4gICAgICB2YXIgcXVhdCA9IERpci5nZXRRdWF0KERpci5nZXRPcHBvc2l0ZShjdXJyZW50R3Jhdml0eSkpO1xuICAgICAgb2JqZWN0LnF1YXRlcm5pb24uY29weShxdWF0KTtcbiAgICB9XG5cbiAgICB2YXIgZGlyVmVjdG9yID0gRGlyLmdldFVuaXRWZWN0b3IoY3VycmVudEdyYXZpdHkpO1xuICAgIHZhciBjb29yZEJlbG93ID0gY29vcmQuY2xvbmUoKS5hZGQoZGlyVmVjdG9yKTtcblxuICAgIHZhciB2QmVsb3cgPSB0ZXJyaWFuLmdyb3VuZC5nZXQoY29vcmRCZWxvdy54LCBjb29yZEJlbG93LnksIGNvb3JkQmVsb3cueik7XG5cbiAgICBpZiAoIXZCZWxvdykge1xuICAgICAgcG9zaXRpb24uYWRkKGRpclZlY3Rvci5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKDAuMSkpO1xuICAgIH1cblxuICAgIC8vIEFkdmFuY2UgZnJhbWVcbiAgICBpZiAoY291bnRlciA+IGZyYW1lVGltZSkge1xuICAgICAgY291bnRlciAtPSBmcmFtZVRpbWU7XG4gICAgICBjdXJyZW50RnJhbWUrKztcbiAgICAgIGN1cnJlbnRGcmFtZSAlPSB0b3RhbEZyYW1lO1xuXG4gICAgICBkcmF3Q2h1bmsoKTtcbiAgICB9XG5cbiAgICBvYmplY3QucG9zaXRpb25cbiAgICAgIC5jb3B5KHBvc2l0aW9uKVxuICAgICAgLmFkZChjZW50ZXJPZmZzZXQpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRyYXdDaHVuaygpIHtcbiAgICBjaHVua3MuY2xlYXIoKS5kZXNlcmlhbGl6ZShmcmFtZXNbY3VycmVudEZyYW1lXSk7XG4gICAgbWVzaENodW5rcyhjaHVua3MsIHBpdm90LCBibG9ja01hdGVyaWFsKTtcbiAgfTtcblxuICBmdW5jdGlvbiBzZXRDb29yZChjb29yZCkge1xuICAgIHBvc2l0aW9uLmNvcHkoY29vcmQpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdGljazogdGljayxcbiAgICBzZXRDb29yZDogc2V0Q29vcmRcbiAgfTtcbn07XG4iLCJ2YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBTaW1wbGV4Tm9pc2UgPSByZXF1aXJlKCdzaW1wbGV4LW5vaXNlJyk7XG5cbnZhciBWb3hlbCA9IHJlcXVpcmUoJy4uL3ZveGVsJyk7XG52YXIgRGlyID0gcmVxdWlyZSgnLi4vZGlyJyk7XG5cbnZhciBDaHVua3MgPSBWb3hlbC5DaHVua3M7XG52YXIgbWVzaENodW5rcyA9IFZveGVsLm1lc2hDaHVua3M7XG52YXIgcmVtb3ZlRmxvYXRpbmcgPSBWb3hlbC5yZW1vdmVGbG9hdGluZztcblxudmFyIEdSQVNTID0gMTtcbnZhciBTT0lMID0gMjtcbnZhciBTT0lMX0VER0UgPSAzO1xudmFyIFNUT05FID0gNDtcbnZhciBTRUEgPSA1O1xudmFyIFNBTkQgPSA2O1xuXG52YXIgTEVWRUxfU1VSRkFDRSA9IDE7XG52YXIgTEVWRUxfTUlERExFID0gMjtcbnZhciBMRVZFTF9DT1JFID0gMztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaXplLCBwYXJlbnQsIG1hdGVyaWFsKSB7XG4gIHZhciBub2lzZV9zdXJmYWNlID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfc3VyZmFjZSA9IDAuMTtcbiAgdmFyIG5vaXNlX3N1cmZhY2UyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfc3VyZmFjZTIgPSAwLjA0O1xuXG4gIHZhciBub2lzZV9iaW9tZXMgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlX2Jpb21lczIgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlX2Jpb21lczMgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcblxuICB2YXIgbm9pc2VfYmlvbWVzX3RyZWVzID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfYmlvbWVzX3RyZWVzID0gMC4xO1xuXG4gIHZhciBub2lzZV9iaW9tZXNfdHJlZXMyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfYmlvbWVzX3RyZWVzMiA9IDAuMDQ7XG5cbiAgdmFyIEJJT01FX1ZBTFVFX1NUT05FID0gLTAuODtcbiAgdmFyIEJJT01FX1ZBTFVFX1NPSUwgPSAwO1xuXG4gIHZhciBncm91bmQgPSBuZXcgQ2h1bmtzKCk7XG4gIHZhciB3YXRlciA9IG5ldyBDaHVua3MoKTtcbiAgdmFyIGJvdW5kcyA9IHtcbiAgICBtaW46IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApLFxuICAgIHNpemU6IG5ldyBUSFJFRS5WZWN0b3IzKHNpemUsIHNpemUsIHNpemUpXG4gIH07XG5cbiAgdmFyIGNlbnRlciA9IFstc2l6ZSAvIDIgKyAwLjUsIC1zaXplIC8gMiArIDAuNSwgLXNpemUgLyAyICsgMC41XTtcbiAgdmFyIGNlbnRlckNvb3JkID0gW1xuICAgIE1hdGguZmxvb3Ioc2l6ZSAvIDIpLFxuICAgIE1hdGguZmxvb3Ioc2l6ZSAvIDIpLFxuICAgIE1hdGguZmxvb3Ioc2l6ZSAvIDIpXG4gIF07XG5cbiAgLy8gaGFzaCAtPiBkYXRhXG4gIC8vIGdyYXZpdHk6IGdyYXZpdHkgKHMpXG4gIC8vIGJpb21lOiBiaW9tZSBkYXRhXG4gIC8vIGhlaWdodDogaGVpZ2h0IG9mIHN1cmZhY2VcbiAgdmFyIGRhdGFNYXAgPSB7fTtcbiAgdmFyIHN1cmZhY2VNYXAgPSB7fTtcblxuICB2YXIgc3VyZmFjZU51bSA9IDY7XG4gIHZhciBzZWFMZXZlbCA9IDI7XG5cbiAgaW5pdCgpO1xuICBnZW5lcmF0ZUdyYXZpdHlNYXAoKTtcbiAgZ2VuZXJhdGVCdW1wcygpO1xuICByZW1vdmVGbG9hdGluZyhncm91bmQsIGNlbnRlckNvb3JkKTtcbiAgZ2VuZXJhdGVTZWEoKTtcbiAgZ2VuZXJhdGVCaW9tZXMoKTtcbiAgZ2VuZXJhdGVUaWxlcygpO1xuICBnZW5lcmF0ZVN1cmZhY2UoKTtcblxuICB2YXIgcGl2b3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICB2YXIgZ3JvdW5kT2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIHBpdm90LmFkZChncm91bmRPYmplY3QpO1xuICBtZXNoQ2h1bmtzKGdyb3VuZCwgZ3JvdW5kT2JqZWN0LCBtYXRlcmlhbCk7XG4gIG1lc2hDaHVua3Mod2F0ZXIsIHBpdm90LCBtYXRlcmlhbCk7XG5cbiAgdmFyIHBvc2l0aW9uQ2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIC5zdWJWZWN0b3JzKGJvdW5kcy5taW4sIGJvdW5kcy5zaXplKVxuICAgIC5tdWx0aXBseVNjYWxhcigwLjUpO1xuICBwaXZvdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uQ2VudGVyKTtcbiAgcGFyZW50LmFkZChwaXZvdCk7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICBncm91bmQuc2V0KGksIGosIGssIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU2VhKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgZCsrKSB7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIFtzZWFMZXZlbCwgc2l6ZSAtIHNlYUxldmVsIC0gMV0uZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBzZWFMZXZlbDsgaSA8IHNpemUgLSBzZWFMZXZlbDsgaSsrKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IHNlYUxldmVsOyBqIDwgc2l6ZSAtIHNlYUxldmVsOyBqKyspIHtcbiAgICAgICAgICAgIGNvb3JkW2RdID0gYztcbiAgICAgICAgICAgIGNvb3JkW3VdID0gaTtcbiAgICAgICAgICAgIGNvb3JkW3ZdID0gajtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgdmFyIGdyYXZpdHkgPSBkYXRhLmdyYXZpdHk7XG5cbiAgICAgICAgICAgIHZhciBibG9jayA9IFtcbiAgICAgICAgICAgICAgMCwgMCwgMCwgMCwgMCwgMFxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgZyBpbiBncmF2aXR5KSB7XG4gICAgICAgICAgICAgIGJsb2NrW2ddID0gU0VBO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSkpIHtcbiAgICAgICAgICAgICAgd2F0ZXIuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJpb21lcygpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGdyb3VuZC5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgTWF0aC5hYnMoaSArIGNlbnRlclswXSksXG4gICAgICAgICAgICBNYXRoLmFicyhqICsgY2VudGVyWzFdKSxcbiAgICAgICAgICAgIE1hdGguYWJzKGsgKyBjZW50ZXJbMl0pKTtcblxuICAgICAgICAgIHZhciByZWxTZWFMZXZlbCA9IChzaXplIC8gMiAtIGQgLSBzZWFMZXZlbCAtIDAuNSk7XG5cbiAgICAgICAgICBkIC89IChzaXplIC8gMik7XG5cbiAgICAgICAgICB2YXIgbm9pc2VGID0gMC4wNTtcbiAgICAgICAgICB2YXIgbm9pc2VGMiA9IDAuMDI7XG4gICAgICAgICAgdmFyIG5vaXNlRjMgPSAwLjAyO1xuXG4gICAgICAgICAgdmFyIHJlbCA9IFtpICsgY2VudGVyWzBdLCBqICsgY2VudGVyWzFdLCBrICsgY2VudGVyWzJdXTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBub2lzZV9iaW9tZXMubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRixcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRik7XG5cbiAgICAgICAgICB2YXIgdmFsdWUyID0gbm9pc2VfYmlvbWVzMi5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYyKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTMgPSBub2lzZV9iaW9tZXMzLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYzLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGMyxcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRjNcbiAgICAgICAgICApICsgdmFsdWU7XG5cbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlICogMC41ICsgdmFsdWUyICogMi4wO1xuXG4gICAgICAgICAgdmFyIGJpb21lID0ge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsdWUyOiB2YWx1ZTMsXG4gICAgICAgICAgICByZWxTZWFMZXZlbDogcmVsU2VhTGV2ZWxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHZhbHVlVHJlZSA9IG5vaXNlX2Jpb21lc190cmVlcy5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGX2Jpb21lc190cmVlcyxcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUZfYmlvbWVzX3RyZWVzXG4gICAgICAgICAgKSArIG5vaXNlX2Jpb21lc190cmVlczIubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRl9iaW9tZXNfdHJlZXMyLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGX2Jpb21lc190cmVlczIsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUZfYmlvbWVzX3RyZWVzMlxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvLyBCSU9NRSBiaWFzIGZvciB0cmVlXG4gICAgICAgICAgaWYgKHZhbHVlIDwgQklPTUVfVkFMVUVfU1RPTkUpIHtcbiAgICAgICAgICAgIHZhbHVlVHJlZSAtPSAxLjA7XG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IEJJT01FX1ZBTFVFX1NPSUwpIHtcbiAgICAgICAgICAgIHZhbHVlVHJlZSAtPSAwLjU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmlvbWUudHJlZSA9IHZhbHVlVHJlZTtcblxuICAgICAgICAgIHZhciBsZXZlbDtcblxuICAgICAgICAgIGlmIChkID4gMC43KSB7XG4gICAgICAgICAgICAvLyBzdXJmYWNlXG4gICAgICAgICAgICBsZXZlbCA9IExFVkVMX1NVUkZBQ0U7XG4gICAgICAgICAgfSBlbHNlIGlmIChkID4gMC4zKSB7XG4gICAgICAgICAgICAvLyBtaWRkbGVcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfTUlERExFO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb3JlXG4gICAgICAgICAgICBsZXZlbCA9IExFVkVMX0NPUkU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmlvbWUubGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShpLCBqLCBrKTtcbiAgICAgICAgICBkYXRhLmJpb21lID0gYmlvbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVHcmF2aXR5TWFwKCkge1xuICAgIHZhciBwYWRkaW5nID0gMjtcbiAgICBmb3IgKHZhciBpID0gLXBhZGRpbmc7IGkgPCBzaXplICsgcGFkZGluZzsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gLXBhZGRpbmc7IGogPCBzaXplICsgcGFkZGluZzsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAtcGFkZGluZzsgayA8IHNpemUgKyBwYWRkaW5nOyBrKyspIHtcbiAgICAgICAgICB2YXIgbWFwID0ge307XG4gICAgICAgICAgdmFyIGdyYXZpdHkgPSBjYWxjR3Jhdml0eShpLCBqLCBrKTtcbiAgICAgICAgICBncmF2aXR5LmZvckVhY2goZnVuY3Rpb24oZykge1xuICAgICAgICAgICAgbWFwW2ddID0ge1xuICAgICAgICAgICAgICBkaXI6IGdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGksIGosIGspO1xuICAgICAgICAgIGRhdGEuZ3Jhdml0eSA9IG1hcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBjYWxjR3Jhdml0eShpLCBqLCBrKSB7XG4gICAgdmFyIGFycmF5ID0gW1xuICAgICAgaSArIGNlbnRlclswXSxcbiAgICAgIGogKyBjZW50ZXJbMV0sXG4gICAgICBrICsgY2VudGVyWzJdXG4gICAgXTtcbiAgICB2YXIgbWF4ID0gLUluZmluaXR5O1xuICAgIHZhciBpbmRleGVzID0gW107XG4gICAgdmFyIGY7XG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBhcnJheS5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIGEgPSBNYXRoLmFicyhhcnJheVtkXSk7XG4gICAgICBpZiAoYSA+IG1heCkge1xuICAgICAgICBtYXggPSBhO1xuICAgICAgICBmID0gZCAqIDIgKyAoYXJyYXlbZF0gPiAwID8gMCA6IDEpO1xuICAgICAgICBpbmRleGVzID0gW2ZdO1xuICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhhIC0gbWF4KSA8IDAuMDEpIHtcbiAgICAgICAgZiA9IGQgKiAyICsgKGFycmF5W2RdID4gMCA/IDAgOiAxKTtcbiAgICAgICAgaW5kZXhlcy5wdXNoKGYpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5kZXhlcztcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJ1bXBzKCkge1xuICAgIC8vIEdlbmVyYXRlIHN1cmZhY2VcblxuICAgIHZhciBjUmFuZ2UgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3VyZmFjZU51bTsgaSsrKSB7XG4gICAgICBjUmFuZ2UucHVzaCgwICsgaSwgc2l6ZSAtIDEgLSBpKTtcbiAgICB9XG5cbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IDM7IGQrKykge1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG4gICAgICBjUmFuZ2UuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcblxuICAgICAgICAgICAgdmFyIGRpcyA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICBNYXRoLmFicyhjb29yZFswXSArIGNlbnRlclswXSksXG4gICAgICAgICAgICAgIE1hdGguYWJzKGNvb3JkWzFdICsgY2VudGVyWzFdKSxcbiAgICAgICAgICAgICAgTWF0aC5hYnMoY29vcmRbMl0gKyBjZW50ZXJbMl0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgZGlzQmlhcyA9IDEgLSAoc2l6ZSAvIDIgKyAwLjUgLSBkaXMpIC8gc3VyZmFjZU51bTtcblxuICAgICAgICAgICAgY29vcmRbZF0gPSBjO1xuICAgICAgICAgICAgY29vcmRbdV0gPSBqO1xuICAgICAgICAgICAgY29vcmRbdl0gPSBrO1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gWzAsIDAsIDBdO1xuICAgICAgICAgICAgdmFyIG9mZnNldDIgPSBbMCwgMCwgMF07XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG5vaXNlX3N1cmZhY2Uubm9pc2UzRChcbiAgICAgICAgICAgICAgKGNvb3JkWzBdICsgY2VudGVyWzBdICsgb2Zmc2V0WzBdKSAqIG5vaXNlRl9zdXJmYWNlLFxuICAgICAgICAgICAgICAoY29vcmRbMV0gKyBjZW50ZXJbMV0gKyBvZmZzZXRbMV0pICogbm9pc2VGX3N1cmZhY2UsXG4gICAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlclsyXSArIG9mZnNldFsyXSkgKiBub2lzZUZfc3VyZmFjZSk7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZTIgPSBub2lzZV9zdXJmYWNlMi5ub2lzZTNEKFxuICAgICAgICAgICAgICAoY29vcmRbMF0gKyBjZW50ZXJbMF0gKyBvZmZzZXQyWzBdKSAqIG5vaXNlRl9zdXJmYWNlMixcbiAgICAgICAgICAgICAgKGNvb3JkWzFdICsgY2VudGVyWzFdICsgb2Zmc2V0MlsxXSkgKiBub2lzZUZfc3VyZmFjZTIsXG4gICAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlclsyXSArIG9mZnNldDJbMl0pICogbm9pc2VGX3N1cmZhY2UyKTtcblxuICAgICAgICAgICAgdmFsdWUgPVxuICAgICAgICAgICAgICAoTWF0aC5wb3codmFsdWUyIC8gMS41LCAxKSAqIGRpc0JpYXMpICtcbiAgICAgICAgICAgICAgKC1NYXRoLnBvdyhkaXNCaWFzLCAxLjApICogMS4wICsgMC42KTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMC4wKSB7XG4gICAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICAgICAgZGF0YS5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgZ3JvdW5kLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVN1cmZhY2UoKSB7XG4gICAgZ3JvdW5kLnZpc2l0KGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShpLCBqLCBrKTtcbiAgICAgIHZhciBzdXJmYWNlID0gZGF0YS5zdXJmYWNlIHx8IHt9O1xuICAgICAgdmFyIGdyYXZpdHkgPSBkYXRhLmdyYXZpdHk7XG5cbiAgICAgIGZvciAodmFyIGYgaW4gZ3Jhdml0eSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gaXNTdXJmYWNlKGksIGosIGssIGYpO1xuXG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICB2YXIgaGFzaCA9IFtpLCBqLCBrLCBmXS5qb2luKCcsJyk7XG4gICAgICAgICAgc3VyZmFjZU1hcFtoYXNoXSA9IFtpLCBqLCBrLCBmXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBncmF2aXR5ID0gZGF0YS5ncmF2aXR5O1xuICAgICAgICBpZiAoZ3Jhdml0eVtmXSkge1xuICAgICAgICAgIHN1cmZhY2VbZl0gPSByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBpc1N1cmZhY2UoaSwgaiwgaywgZikge1xuICAgIHZhciBkID0gTWF0aC5mbG9vcihmIC8gMik7IC8vIDAgMSAyIFxuICAgIHZhciBkZCA9IChmIC0gZCAqIDIpID8gLTEgOiAxOyAvLyAtMSBvciAxXG5cbiAgICB2YXIgY29vcmQgPSBbaSwgaiwga107XG4gICAgY29vcmRbZF0gKz0gZGQ7XG5cbiAgICByZXR1cm4gIWdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSkgJiYgIXdhdGVyLmdldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVRpbGVzKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIC8vIEdlbmVyYXRlIGdyYXNzZXNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGdyb3VuZC5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBncm91bmQuc2V0KGksIGosIGssIFtcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDApLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMSksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAyKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDMpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgNCksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCA1KVxuICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KHBvcywgZikge1xuICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKGYgLyAyKTsgLy8gMCAxIDJcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuXG4gICAgICB2YXIgZGQgPSAoZiAtIGQgKiAyKSA/IC0xIDogMTsgLy8gLTEgb3IgMVxuXG4gICAgICBjb29yZFtkXSA9IHBvc1tkXSArIGRkO1xuICAgICAgY29vcmRbdV0gPSBwb3NbdV07XG4gICAgICBjb29yZFt2XSA9IHBvc1t2XTtcblxuICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKHBvc1swXSwgcG9zWzFdLCBwb3NbMl0pO1xuICAgICAgdmFyIGJpb21lID0gZGF0YS5iaW9tZTtcblxuICAgICAgdmFyIGxldmVsID0gYmlvbWUubGV2ZWw7XG4gICAgICB2YXIgdmFsdWUgPSBiaW9tZS52YWx1ZTtcblxuICAgICAgaWYgKGxldmVsID09PSBMRVZFTF9TVVJGQUNFKSB7XG5cbiAgICAgICAgLy8gSWYgYXQgc2VhIGxldmVsLCBnZW5lcmF0ZSBzYW5kXG4gICAgICAgIGlmIChiaW9tZS5yZWxTZWFMZXZlbCA9PT0gMCkge1xuICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICB2YXIgaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICAgICAgaWYgKGJpb21lLnZhbHVlMiAqIGhlaWdodCA8IC0wLjEpIHtcbiAgICAgICAgICAgIHZhciBhYm92ZSA9IGdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gICAgICAgICAgICB2YXIgaXNTdXJmYWNlID0gIWFib3ZlO1xuICAgICAgICAgICAgaWYgKGlzU3VyZmFjZSkge1xuICAgICAgICAgICAgICByZXR1cm4gU0FORDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPCBCSU9NRV9WQUxVRV9TVE9ORSkge1xuICAgICAgICAgIHJldHVybiBTVE9ORTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IEJJT01FX1ZBTFVFX1NPSUwpIHtcbiAgICAgICAgICByZXR1cm4gU09JTDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdSQVNTXG5cbiAgICAgICAgLy8gbm8gZ3Jhc3MgYmVsb3dcbiAgICAgICAgLy8gaWYgKGJpb21lLnJlbFNlYUxldmVsID4gMCkge1xuICAgICAgICAvLyAgIHJldHVybiBTT0lMO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gT24gZWRnZVxuICAgICAgICBpZiAocG9zW2RdID09PSAwIHx8IHBvc1tkXSA9PT0gc2l6ZSAtIDEpIHtcbiAgICAgICAgICByZXR1cm4gR1JBU1M7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWJvdmUgPSBncm91bmQuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuXG4gICAgICAgIHZhciBpc1N1cmZhY2UgPSAhYWJvdmU7XG5cbiAgICAgICAgcmV0dXJuIGlzU3VyZmFjZSA/IEdSQVNTIDogU09JTDtcblxuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PT0gTEVWRUxfTUlERExFKSB7XG5cbiAgICAgIH0gZWxzZSBpZiAobGV2ZWwgPT09IExFVkVMX0NPUkUpIHtcblxuICAgICAgfVxuXG4gICAgICByZXR1cm4gU1RPTkU7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZXREYXRhKGksIGosIGspIHtcbiAgICB2YXIgaGFzaCA9IFtpLCBqLCBrXS5qb2luKCcsJyk7XG4gICAgaWYgKGRhdGFNYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgICAgZGF0YU1hcFtoYXNoXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gZGF0YU1hcFtoYXNoXTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGdyb3VuZDogZ3JvdW5kLFxuICAgIHdhdGVyOiB3YXRlcixcbiAgICBib3VuZHM6IGJvdW5kcyxcbiAgICBvYmplY3Q6IHBpdm90LFxuICAgIGNhbGNHcmF2aXR5OiBjYWxjR3Jhdml0eSxcbiAgICBzdXJmYWNlTWFwOiBzdXJmYWNlTWFwLFxuICAgIGdyb3VuZE9iamVjdDogZ3JvdW5kT2JqZWN0LFxuICAgIGdldERhdGE6IGdldERhdGFcbiAgfTtcbn07XG4iLCJ2YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBWb3hlbCA9IHJlcXVpcmUoJy4uL3ZveGVsJyk7XG52YXIgRGlyID0gcmVxdWlyZSgnLi4vZGlyJyk7XG5cbnZhciBDaHVua3MgPSBWb3hlbC5DaHVua3M7XG52YXIgdmlzaXRTaGFwZSA9IFZveGVsLnZpc2l0U2hhcGU7XG52YXIgbWVzaENodW5rcyA9IFZveGVsLm1lc2hDaHVua3M7XG52YXIgY29weUNodW5rcyA9IFZveGVsLmNvcHlDaHVua3M7XG52YXIgcmVtb3ZlRmxvYXRpbmcgPSBWb3hlbC5yZW1vdmVGbG9hdGluZztcblxudmFyIFRSVU5LID0gWzIwLCAyMCwgMjAsIDIwLCAyMCwgMjBdO1xudmFyIExFQUYgPSBbMjEsIDIxLCAyMSwgMjEsIDIxLCAyMV07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocGFyZW50LCBibG9ja01hdGVyaWFsLCB0ZXJyaWFuKSB7XG4gIHZhciBjaHVua3MgPSBuZXcgQ2h1bmtzKCk7XG5cbiAgdmFyIHNwYXJzZSA9IDAuMjtcblxuICBmdW5jdGlvbiBhZGQoY29vcmQsIGRpcikge1xuXG4gICAgdmFyIHNoYXBlUmF0aW8gPSAyO1xuICAgIHZhciBsZWFmSGVpZ2h0ID0gMjtcbiAgICB2YXIgZGVuc2l0eSA9IDAuODtcbiAgICB2YXIgc2l6ZTEgPSA0O1xuICAgIHZhciBzaXplMiA9IDM7XG4gICAgdmFyIHNoYXBlMSA9IE1hdGgucG93KE1hdGgucmFuZG9tKCksIDEuNSkgKiBzaXplMSArIHNpemUyO1xuICAgIHZhciBzaGFwZTIgPSBzaGFwZTEgKiBzaGFwZVJhdGlvO1xuICAgIHZhciB0cnVua0hlaWdodCA9IGxlYWZIZWlnaHQgKyBzaGFwZTIgLSA0O1xuXG4gICAgdmFyIHJhZGl1cyA9IHNoYXBlMSAqIE1hdGguc3FydCgyKSAvIDI7XG5cbiAgICBpZiAoZGlyID09IG51bGwpIHtcbiAgICAgIHZhciB0ZXJyaWFuQ29vcmQgPSBjb29yZC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNlbGYuc2NhbGUpO1xuICAgICAgdmFyIGdyYXZpdHkgPSB0ZXJyaWFuLmNhbGNHcmF2aXR5KHRlcnJpYW5Db29yZC54LCB0ZXJyaWFuQ29vcmQueSwgdGVycmlhbkNvb3JkLnopO1xuICAgICAgZGlyID0gRGlyLmdldE9wcG9zaXRlKGdyYXZpdHlbTWF0aC5mbG9vcihncmF2aXR5Lmxlbmd0aCAqIE1hdGgucmFuZG9tKCkpXSk7XG4gICAgfVxuXG4gICAgdmFyIHVwVmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCk7XG4gICAgdmFyIHVuaXRWZWN0b3IgPSBEaXIuZ2V0VW5pdFZlY3RvcihkaXIpO1xuICAgIHZhciBxdWF0ID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tVW5pdFZlY3RvcnModXBWZWN0b3IsIHVuaXRWZWN0b3IpO1xuICAgIHZhciBkID0gTWF0aC5mbG9vcihkaXIgLyAyKTtcbiAgICB2YXIgc2lkZSA9IGRpciAlIDIgPT09IDA7XG5cbiAgICB2YXIgbGVhZlNoYXBlID0gW3NoYXBlMSwgc2hhcGUyLCBzaGFwZTFdO1xuXG4gICAgdmFyIGxlYWZDZW50ZXIgPSBbXG4gICAgICBNYXRoLnJvdW5kKC1sZWFmU2hhcGVbMF0gLyAyKSxcbiAgICAgIE1hdGgucm91bmQoLWxlYWZTaGFwZVsxXSAvIDIpLFxuICAgICAgTWF0aC5yb3VuZCgtbGVhZlNoYXBlWzJdIC8gMilcbiAgICBdO1xuXG4gICAgdmFyIGNodW5rczIgPSBuZXcgQ2h1bmtzKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRydW5rSGVpZ2h0OyBpKyspIHtcbiAgICAgIHZhciBjID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgaSwgMCkuYXBwbHlRdWF0ZXJuaW9uKHF1YXQpO1xuICAgICAgaWYgKHNpZGUpIHtcbiAgICAgICAgYy5hZGQodW5pdFZlY3Rvcik7XG4gICAgICB9XG5cbiAgICAgIHJvdW5kVmVjdG9yKGMpO1xuICAgICAgY2h1bmtzMi5zZXQoYy54LCBjLnksIGMueiwgVFJVTkspO1xuICAgIH1cblxuICAgIHZpc2l0U2hhcGUobGVhZlNoYXBlLCBmdW5jdGlvbihpLCBqLCBrKSB7XG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IGRlbnNpdHkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGMgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgICAgbGVhZkNlbnRlclswXSArIGksXG4gICAgICAgIGxlYWZIZWlnaHQgKyBqLFxuICAgICAgICBsZWFmQ2VudGVyWzJdICsga1xuICAgICAgKTtcblxuICAgICAgdmFyIGRpcyA9IE1hdGguc3FydChjLnggKiBjLnggKyBjLnogKiBjLnopO1xuICAgICAgdmFyIG1heERpcyA9IChzaGFwZTIgLSBqKSAvIHNoYXBlMiAqIHJhZGl1cztcblxuICAgICAgdmFyIGRpZmYgPSBtYXhEaXMgLSBkaXM7XG4gICAgICBpZiAoZGlmZiA8IDAuMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChkaWZmIDwgMSkge1xuICAgICAgICBpZiAoTWF0aC5wb3coZGlmZiwgMC41KSA+IE1hdGgucmFuZG9tKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYy5hcHBseVF1YXRlcm5pb24ocXVhdCk7XG5cbiAgICAgIHJvdW5kVmVjdG9yKGMpO1xuXG4gICAgICBpZiAoc2lkZSkge1xuICAgICAgICBjLmFkZCh1bml0VmVjdG9yKTtcbiAgICAgIH1cblxuICAgICAgY2h1bmtzMi5zZXQoYy54LCBjLnksIGMueiwgTEVBRik7XG4gICAgfSk7XG5cbiAgICByZW1vdmVGbG9hdGluZyhjaHVua3MyLCBbMCwgMCwgMF0pO1xuXG4gICAgY29weUNodW5rcyhjaHVua3MyLCBjaHVua3MsIGNvb3JkKTtcbiAgICBtZXNoQ2h1bmtzKGNodW5rcywgb2JqZWN0LCBibG9ja01hdGVyaWFsKTtcbiAgfTtcblxuICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICBvYmplY3Quc2NhbGUuc2V0KHNlbGYuc2NhbGUsIHNlbGYuc2NhbGUsIHNlbGYuc2NhbGUpO1xuICAgIHBhcmVudC5hZGQob2JqZWN0KTtcblxuICAgIHZhciBjb3VudCA9IDA7XG4gICAgZm9yICh2YXIgaWQgaW4gdGVycmlhbi5zdXJmYWNlTWFwKSB7XG4gICAgICB2YXIgc3VyZmFjZSA9IHRlcnJpYW4uc3VyZmFjZU1hcFtpZF07XG5cbiAgICAgIHZhciBkYXRhID0gdGVycmlhbi5nZXREYXRhKHN1cmZhY2VbMF0sIHN1cmZhY2VbMV0sIHN1cmZhY2VbMl0pO1xuXG4gICAgICAvLyBObyB0cmVlcyB1bmRlciBzZWEgbGV2ZWxcbiAgICAgIGlmIChkYXRhLmJpb21lLnJlbFNlYUxldmVsID4gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSG93IHNwYXJzZSB0cmVlcyBzaG91bGQgYmVcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gc3BhcnNlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5iaW9tZS50cmVlIDwgMC41KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiAoY291bnQgPiAyMDApIHtcbiAgICAgIC8vICAgYnJlYWs7XG4gICAgICAvLyB9XG5cbiAgICAgIHZhciBmID0gRGlyLmdldE9wcG9zaXRlKHN1cmZhY2VbM10pO1xuXG4gICAgICAvLyBTdGFydCBmcm9tIGNlbnRlciBvZiBibG9jaywgZXh0ZW5kIGZvciBoYWxmIGEgYmxvY2tcbiAgICAgIHZhciBjb29yZCA9XG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN1cmZhY2VbMF0sIHN1cmZhY2VbMV0sIHN1cmZhY2VbMl0pXG4gICAgICAgIC5hZGQobmV3IFRIUkVFLlZlY3RvcjMoMC41LCAwLjUsIDAuNSkpXG4gICAgICAgIC5hZGQoRGlyLmdldFVuaXRWZWN0b3IoZikubXVsdGlwbHlTY2FsYXIoMC41KSk7XG5cbiAgICAgIC8vIHJhbmRvbWl6ZSB1diBjb29yZFxuICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKGYgLyAyKTtcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuXG4gICAgICB2YXIgdXYgPSBbMCwgMCwgMF07XG4gICAgICB1dlt1XSA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICB1dlt2XSA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG5cbiAgICAgIGNvb3JkLmFkZChuZXcgVEhSRUUuVmVjdG9yMygpLmZyb21BcnJheSh1dikpO1xuXG4gICAgICAvLyAxIHRyZWUgcGVyIHRlcnJpYW4gZ3JpZFxuICAgICAgY29vcmQubXVsdGlwbHlTY2FsYXIoMSAvIHNlbGYuc2NhbGUpO1xuXG4gICAgICBjb29yZC54ID0gTWF0aC5yb3VuZChjb29yZC54KTtcbiAgICAgIGNvb3JkLnkgPSBNYXRoLnJvdW5kKGNvb3JkLnkpO1xuICAgICAgY29vcmQueiA9IE1hdGgucm91bmQoY29vcmQueik7XG4gICAgICBhZGQoY29vcmQsIGYpO1xuXG4gICAgICBjb3VudCsrO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICB2YXIgc2VsZiA9IHtcbiAgICBhZGQ6IGFkZCxcbiAgICBvYmplY3Q6IG9iamVjdCxcbiAgICBzY2FsZTogKDEgLyAzLjApXG4gIH07XG5cbiAgc3RhcnQoKTtcblxuICByZXR1cm4gc2VsZjtcbn07XG5cbmZ1bmN0aW9uIHJvdW5kVmVjdG9yKHYpIHtcbiAgdi54ID0gTWF0aC5yb3VuZCh2LngpO1xuICB2LnkgPSBNYXRoLnJvdW5kKHYueSk7XG4gIHYueiA9IE1hdGgucm91bmQodi56KTtcbiAgcmV0dXJuIHY7XG59O1xuIiwidmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIga2V5Y29kZSA9IHJlcXVpcmUoJ2tleWNvZGUnKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuL2RpcicpO1xuXG52YXIgYXBwID0ge307XG5cbi8vIFBvc3QgcHJvY2Vzc2luZyBzZXR0aW5nXG52YXIgcG9zdHByb2Nlc3NpbmcgPSB7IGVuYWJsZWQ6IHRydWUsIHJlbmRlck1vZGU6IDAgfTtcblxuLy8gUmVuZGVyZXIsIHNjZW5lLCBjYW1lcmFcbnZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgYW50aWFsaWFzOiB0cnVlXG59KTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweEJCRDlGNyk7XG4vLyByZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MjIyMjIyKTtcbnZhciBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xudmFyIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg2MCwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gIDAuMSwgMTAwMCk7XG52YXIgY2FtZXJhVXAsIGNhbWVyYURpciwgY2FtZXJhUmlnaHQ7XG5cbi8vIFBvc3QgcHJvY2Vzc2luZ1xudmFyIGRlcHRoTWF0ZXJpYWw7XG52YXIgZGVwdGhSZW5kZXJUYXJnZXQ7XG52YXIgc3Nhb1Bhc3M7XG52YXIgZWZmZWN0Q29tcG9zZXI7XG5cbi8vIFNpemVcbnZhciBzaXplID0gMzI7XG52YXIgbW9kZWxTaXplID0gNTtcbnZhciBkaXNTY2FsZSA9IDEuMiAqIG1vZGVsU2l6ZTtcblxuLy8gT2JqZWN0c1xudmFyIG9iamVjdDtcbnZhciBub0FvTGF5ZXI7XG5cbnZhciBlbnRpdGllcyA9IFtdO1xuXG4vLyBNYXRlcmlhbHMsIFRleHR1cmVzXG52YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTXVsdGlNYXRlcmlhbCgpO1xubWF0ZXJpYWwubWF0ZXJpYWxzID0gW251bGxdO1xudmFyIHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xudmFyIGJsb2NrVGV4dHVyZXMgPSBbXTtcbnZhciB0ZXh0dXJlcyA9IHt9O1xuXG4vLyBJbnB1dCBzdGF0ZXNcbnZhciBrZXlob2xkcyA9IHt9O1xudmFyIG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbnZhciByYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKCk7XG52YXIgcmF5Y2FzdGVyRGlyO1xuXG4vLyBmcmFtZSB0aW1lXG52YXIgZHQgPSAxIC8gNjA7XG5cbmZ1bmN0aW9uIGluaXRQb3N0cHJvY2Vzc2luZygpIHtcblxuICAvLyBTZXR1cCByZW5kZXIgcGFzc1xuICB2YXIgcmVuZGVyUGFzcyA9IG5ldyBUSFJFRS5SZW5kZXJQYXNzKHNjZW5lLCBjYW1lcmEpO1xuXG4gIC8vIFNldHVwIGRlcHRoIHBhc3NcbiAgZGVwdGhNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoRGVwdGhNYXRlcmlhbCgpO1xuICBkZXB0aE1hdGVyaWFsLmRlcHRoUGFja2luZyA9IFRIUkVFLlJHQkFEZXB0aFBhY2tpbmc7XG4gIGRlcHRoTWF0ZXJpYWwuYmxlbmRpbmcgPSBUSFJFRS5Ob0JsZW5kaW5nO1xuXG4gIHZhciBwYXJzID0geyBtaW5GaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciwgbWFnRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIgfTtcbiAgZGVwdGhSZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwgcGFycyk7XG5cbiAgLy8gU2V0dXAgU1NBTyBwYXNzXG4gIHNzYW9QYXNzID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuU1NBT1NoYWRlcik7XG4gIHNzYW9QYXNzLnJlbmRlclRvU2NyZWVuID0gdHJ1ZTtcbiAgLy9zc2FvUGFzcy51bmlmb3Jtc1sgXCJ0RGlmZnVzZVwiIF0udmFsdWUgd2lsbCBiZSBzZXQgYnkgU2hhZGVyUGFzc1xuICBzc2FvUGFzcy51bmlmb3Jtc1tcInREZXB0aFwiXS52YWx1ZSA9IGRlcHRoUmVuZGVyVGFyZ2V0LnRleHR1cmU7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydzaXplJ10udmFsdWUuc2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snY2FtZXJhTmVhciddLnZhbHVlID0gY2FtZXJhLm5lYXI7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydjYW1lcmFGYXInXS52YWx1ZSA9IGNhbWVyYS5mYXI7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydvbmx5QU8nXS52YWx1ZSA9IChwb3N0cHJvY2Vzc2luZy5yZW5kZXJNb2RlID09IDEpO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snYW9DbGFtcCddLnZhbHVlID0gMTAwLjA7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydsdW1JbmZsdWVuY2UnXS52YWx1ZSA9IDAuNztcblxuICAvLyBBZGQgcGFzcyB0byBlZmZlY3QgY29tcG9zZXJcbiAgZWZmZWN0Q29tcG9zZXIgPSBuZXcgVEhSRUUuRWZmZWN0Q29tcG9zZXIocmVuZGVyZXIpO1xuICBlZmZlY3RDb21wb3Nlci5hZGRQYXNzKHJlbmRlclBhc3MpO1xuICBlZmZlY3RDb21wb3Nlci5hZGRQYXNzKHNzYW9QYXNzKTtcblxufTtcblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAvLyBSZXNpemUgcmVuZGVyVGFyZ2V0c1xuICBzc2FvUGFzcy51bmlmb3Jtc1snc2l6ZSddLnZhbHVlLnNldCh3aWR0aCwgaGVpZ2h0KTtcblxuICB2YXIgcGl4ZWxSYXRpbyA9IHJlbmRlcmVyLmdldFBpeGVsUmF0aW8oKTtcbiAgdmFyIG5ld1dpZHRoID0gTWF0aC5mbG9vcih3aWR0aCAvIHBpeGVsUmF0aW8pIHx8IDE7XG4gIHZhciBuZXdIZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCAvIHBpeGVsUmF0aW8pIHx8IDE7XG4gIGRlcHRoUmVuZGVyVGFyZ2V0LnNldFNpemUobmV3V2lkdGgsIG5ld0hlaWdodCk7XG4gIGVmZmVjdENvbXBvc2VyLnNldFNpemUobmV3V2lkdGgsIG5ld0hlaWdodCk7XG59O1xuXG5mdW5jdGlvbiBpbml0U2NlbmUoKSB7XG4gIHZhciBkaXMgPSBzaXplICogZGlzU2NhbGU7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gZGlzO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IGRpcztcbiAgY2FtZXJhLnBvc2l0aW9uLnogPSBkaXM7XG4gIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoKSk7XG5cbiAgY2FtZXJhVXAgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKTtcbiAgY2FtZXJhRGlyID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSkuYXBwbHlFdWxlcihjYW1lcmEucm90YXRpb24pO1xuICBjYW1lcmFSaWdodCA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY3Jvc3NWZWN0b3JzKGNhbWVyYVVwLCBjYW1lcmFEaXIpO1xuXG4gIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBvYmplY3Quc2NhbGUuc2V0KG1vZGVsU2l6ZSwgbW9kZWxTaXplLCBtb2RlbFNpemUpO1xuICBzY2VuZS5hZGQob2JqZWN0KTtcbiAgbm9Bb0xheWVyID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIG9iamVjdC5hZGQobm9Bb0xheWVyKTtcbiAgdmFyIGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg4ODg4ODgpO1xuICB2YXIgZGlyZWN0aW9uYWxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjYpO1xuICBkaXJlY3Rpb25hbExpZ2h0LnBvc2l0aW9uLnNldCgwLjMsIDEuMCwgMC41KTtcbiAgb2JqZWN0LmFkZChhbWJpZW50TGlnaHQpO1xuICBvYmplY3QuYWRkKGRpcmVjdGlvbmFsTGlnaHQpO1xufTtcblxuZnVuY3Rpb24gbG9hZFJlc291cmNlcygpIHtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2dyYXNzJywgMSk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzb2lsJywgMik7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzb2lsMicsIDMpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnc3RvbmUnLCA0KTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NlYScsIDUsIDAuOCk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzYW5kJywgNik7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCd3YWxsJywgNyk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCd0cnVuaycsIDIwKTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2xlYWYnLCAyMSk7XG5cbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3dpbmRvdycsIDgsIDAuOCk7XG5cbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2Nsb3VkJywgMTAsIDAuOCwgbnVsbCwgZnVuY3Rpb24obSkge1xuICAgIG0uZW1pc3NpdmUgPSBuZXcgVEhSRUUuQ29sb3IoMHg4ODg4ODgpO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGxvYWRCbG9ja01hdGVyaWFsKG5hbWUsIGluZGV4LCBhbHBoYSwgbWF0ZXJpYWxUeXBlLCB0cmFuc2Zvcm0pIHtcbiAgdmFyIHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ3RleHR1cmVzLycgKyBuYW1lICsgJy5wbmcnKTtcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XG4gIHRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgdGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICBibG9ja1RleHR1cmVzLnB1c2godGV4dHVyZSk7XG5cbiAgbWF0ZXJpYWxUeXBlID0gbWF0ZXJpYWxUeXBlIHx8IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWw7XG5cbiAgdmFyIG0gPSBuZXcgbWF0ZXJpYWxUeXBlKHtcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG5cbiAgaWYgKGFscGhhICE9IG51bGwpIHtcbiAgICBtLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICBtLm9wYWNpdHkgPSBhbHBoYTtcbiAgfVxuXG4gIGlmICh0cmFuc2Zvcm0gIT0gbnVsbCkge1xuICAgIHRyYW5zZm9ybShtKTtcbiAgfVxuXG4gIG1hdGVyaWFsLm1hdGVyaWFsc1tpbmRleF0gPSBtO1xufTtcblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICBpZiAocG9zdHByb2Nlc3NpbmcuZW5hYmxlZCkge1xuICAgIG5vQW9MYXllci52aXNpYmxlID0gZmFsc2U7XG4gICAgLy8gUmVuZGVyIGRlcHRoIGludG8gZGVwdGhSZW5kZXJUYXJnZXRcbiAgICBzY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gZGVwdGhNYXRlcmlhbDtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSwgZGVwdGhSZW5kZXJUYXJnZXQsIHRydWUpO1xuXG4gICAgbm9Bb0xheWVyLnZpc2libGUgPSB0cnVlO1xuICAgIC8vIFJlbmRlciByZW5kZXJQYXNzIGFuZCBTU0FPIHNoYWRlclBhc3NcbiAgICBzY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gbnVsbDtcbiAgICBlZmZlY3RDb21wb3Nlci5yZW5kZXIoKTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIH1cblxuICB2YXIgcm90YXRlWSA9IDA7XG4gIGlmIChrZXlob2xkc1sncmlnaHQnXSkge1xuICAgIHJvdGF0ZVkgLT0gMC4xO1xuICB9IGVsc2UgaWYgKGtleWhvbGRzWydsZWZ0J10pIHtcbiAgICByb3RhdGVZICs9IDAuMTtcbiAgfVxuXG4gIHZhciBxdWF0SW52ZXJzZSA9IG9iamVjdC5xdWF0ZXJuaW9uLmNsb25lKCkuaW52ZXJzZSgpO1xuICB2YXIgYXhpcyA9IGNhbWVyYVVwLmNsb25lKCkuYXBwbHlRdWF0ZXJuaW9uKHF1YXRJbnZlcnNlKS5ub3JtYWxpemUoKTtcbiAgb2JqZWN0LnF1YXRlcm5pb25cbiAgICAubXVsdGlwbHkobmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tQXhpc0FuZ2xlKGF4aXMsIHJvdGF0ZVkpKTtcblxuICB2YXIgcm90YXRlWCA9IDA7XG4gIGlmIChrZXlob2xkc1sndXAnXSkge1xuICAgIHJvdGF0ZVggLT0gMC4xO1xuICB9IGVsc2UgaWYgKGtleWhvbGRzWydkb3duJ10pIHtcbiAgICByb3RhdGVYICs9IDAuMTtcbiAgfVxuXG4gIGF4aXMgPSBjYW1lcmFSaWdodC5jbG9uZSgpLmFwcGx5UXVhdGVybmlvbihxdWF0SW52ZXJzZSkubm9ybWFsaXplKCk7XG4gIG9iamVjdC5xdWF0ZXJuaW9uXG4gICAgLm11bHRpcGx5KG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZShheGlzLCByb3RhdGVYKSk7XG59O1xuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBlbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIGVudGl0eS50aWNrKGR0KTtcbiAgfSk7XG4gIHJlbmRlcigpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59O1xuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZS54ID0gKGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMTtcbiAgbW91c2UueSA9IC0oZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMTtcblxuICAvLyB1cGRhdGUgdGhlIHBpY2tpbmcgcmF5IHdpdGggdGhlIGNhbWVyYSBhbmQgbW91c2UgcG9zaXRpb24gIFxuICByYXljYXN0ZXIuc2V0RnJvbUNhbWVyYShtb3VzZSwgY2FtZXJhKTtcbiAgcmF5Y2FzdGVyRGlyID0gcmF5Y2FzdGVyLnJheS5kaXJlY3Rpb24uY2xvbmUoKTtcbn07XG5cbmZ1bmN0aW9uIG9uTW91c2VEb3duKGV2ZW50KSB7XG4gIGlmICh0ZXJyaWFuID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBjYWxjdWxhdGUgb2JqZWN0cyBpbnRlcnNlY3RpbmcgdGhlIHBpY2tpbmcgcmF5XG4gIHZhciBpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdCh0ZXJyaWFuLm9iamVjdCwgdHJ1ZSk7XG4gIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBwb2ludCA9IGludGVyc2VjdHNbMF0ucG9pbnQuY2xvbmUoKVxuICAgIC5hZGQocmF5Y2FzdGVyRGlyLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoLTAuMDEpKTtcblxuICAvLyAvLyBBZGQgdHJlZSBhdCBjbGlja2VkIHBvaW50XG4gIC8vIHZhciBsb2NhbFBvaW50ID0gdHJlZS5vYmplY3Qud29ybGRUb0xvY2FsKHBvaW50KTtcbiAgLy8gdmFyIGNvb3JkID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gIC8vICAgTWF0aC5mbG9vcihsb2NhbFBvaW50LngpLFxuICAvLyAgIE1hdGguZmxvb3IobG9jYWxQb2ludC55KSxcbiAgLy8gICBNYXRoLmZsb29yKGxvY2FsUG9pbnQueilcbiAgLy8gKTsgIFxuICAvLyB0cmVlLmFkZChjb29yZCk7XG5cbiAgLy8gQ2hhbmdlIGNyaXR0ZXIgcG9zaXRpb25cbiAgdmFyIGxvY2FsUG9pbnQgPSB0ZXJyaWFuLm9iamVjdC53b3JsZFRvTG9jYWwocG9pbnQpO1xuICB2YXIgY29vcmQgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQueCksXG4gICAgTWF0aC5mbG9vcihsb2NhbFBvaW50LnkpLFxuICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC56KVxuICApO1xuICBjcml0dGVyLnNldENvb3JkKGNvb3JkKTtcbn07XG5cbmZ1bmN0aW9uIG9uTW91c2VVcChldmVudCkge1xuXG59O1xuXG5mdW5jdGlvbiBvbktleURvd24oZSkge1xuICB2YXIga2V5ID0ga2V5Y29kZShlKTtcbiAga2V5aG9sZHNba2V5XSA9IHRydWU7XG5cbiAgaWYgKGtleSA9PT0gJ2cnKSB7XG4gICAgdGVycmlhbi5ncm91bmRPYmplY3QudmlzaWJsZSA9ICF0ZXJyaWFuLmdyb3VuZE9iamVjdC52aXNpYmxlO1xuICB9XG59O1xuXG5mdW5jdGlvbiBvbktleVVwKGUpIHtcbiAgdmFyIGtleSA9IGtleWNvZGUoZSk7XG4gIGtleWhvbGRzW2tleV0gPSBmYWxzZTtcbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24sIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXAsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG5cbmxvYWRSZXNvdXJjZXMoKTtcbmluaXRQb3N0cHJvY2Vzc2luZygpO1xuaW5pdFNjZW5lKCk7XG5cbi8vIEluaXQgYXBwXG5cbnZhciBjbG91ZCA9IHJlcXVpcmUoJy4vZW50aXRpZXMvY2xvdWQnKShvYmplY3QsIG1hdGVyaWFsKTtcbmVudGl0aWVzLnB1c2goY2xvdWQpO1xuXG52YXIgdGVycmlhbiA9IHJlcXVpcmUoJy4vZW50aXRpZXMvdGVycmlhbicpKHNpemUsIG9iamVjdCwgbWF0ZXJpYWwpO1xuXG52YXIgdHJlZSA9IHJlcXVpcmUoJy4vZW50aXRpZXMvdHJlZScpKHRlcnJpYW4ub2JqZWN0LCBtYXRlcmlhbCwgdGVycmlhbik7XG5cbnZhciBjcml0dGVyID0gcmVxdWlyZSgnLi9lbnRpdGllcy9jcml0dGVyJykodGVycmlhbi5vYmplY3QsIG1hdGVyaWFsLCB0ZXJyaWFuKTtcbmVudGl0aWVzLnB1c2goY3JpdHRlcik7XG5cbi8vIHZhciBDaHVua3MgPSByZXF1aXJlKCcuL3ZveGVsL2NodW5rcycpO1xuLy8gdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcbi8vIHZhciBsZW4gPSAzMjtcblxuLy8gdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoKTtcbi8vIG1hdGVyaWFsLm1hdGVyaWFscy5wdXNoKG51bGwsIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4vLyAgIGNvbG9yOiAweGZmZmZmZixcbi8vICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4vLyAgIG9wYWNpdHk6IDAuNVxuLy8gfSkpO1xuXG4vLyBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4vLyAgIGZvciAodmFyIGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbi8vICAgICBmb3IgKHZhciBrID0gMDsgayA8IGxlbjsgaysrKSB7XG4vLyAgICAgICBjaHVua3Muc2V0KGksIGosIGssIFsxLCAxLCAxLCAxLCAxLCAxXSk7XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XG5cbi8vIHZhciBtZXNoQ2h1bmtzID0gcmVxdWlyZSgnLi92b3hlbC9tZXNoY2h1bmtzJyk7XG4vLyB2YXIgdGVzdE9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuLy8gdGVzdE9iamVjdC5zY2FsZS5zZXQoNSwgNSwgNSk7XG4vLyBzY2VuZS5hZGQodGVzdE9iamVjdCk7XG4vLyBtZXNoQ2h1bmtzKGNodW5rcywgdGVzdE9iamVjdCwgbWF0ZXJpYWwpO1xuXG5hbmltYXRlKCk7XG4iLCJ2YXIgQ2h1bmsgPSBmdW5jdGlvbihzaGFwZSkge1xuICB0aGlzLnZvbHVtZSA9IFtdO1xuICB0aGlzLnNoYXBlID0gc2hhcGUgfHwgWzE2LCAxNiwgMTZdO1xuICB0aGlzLmRpbVggPSB0aGlzLnNoYXBlWzBdO1xuICB0aGlzLmRpbVhZID0gdGhpcy5zaGFwZVswXSAqIHRoaXMuc2hhcGVbMV07XG59O1xuXG5DaHVuay5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaSwgaiwgaykge1xuICByZXR1cm4gdGhpcy52b2x1bWVbaSAqIHRoaXMuZGltWFkgKyBqICogdGhpcy5kaW1YICsga107XG59O1xuXG5DaHVuay5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICB0aGlzLnZvbHVtZVtpICogdGhpcy5kaW1YWSArIGogKiB0aGlzLmRpbVggKyBrXSA9IHY7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENodW5rO1xuIiwidmFyIENodW5rID0gcmVxdWlyZSgnLi9jaHVuaycpO1xuXG52YXIgQ2h1bmtzID0gZnVuY3Rpb24oY2h1bmtTaXplKSB7XG4gIHRoaXMubWFwID0ge307XG4gIHRoaXMuY2h1bmtTaXplID0gY2h1bmtTaXplIHx8IDE2O1xufTtcblxuQ2h1bmtzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gIHZhciBvcmlnaW4gPSB0aGlzLmdldE9yaWdpbihpLCBqLCBrKTtcbiAgdmFyIGhhc2ggPSBvcmlnaW4udG9BcnJheSgpLmpvaW4oJywnKTtcbiAgaWYgKHRoaXMubWFwW2hhc2hdID09IG51bGwpIHtcbiAgICB0aGlzLm1hcFtoYXNoXSA9IHtcbiAgICAgIGNodW5rOiBuZXcgQ2h1bmsoW3RoaXMuY2h1bmtTaXplLCB0aGlzLmNodW5rU2l6ZSwgdGhpcy5jaHVua1NpemVdKSxcbiAgICAgIG9yaWdpbjogb3JpZ2luXG4gICAgfVxuICB9XG5cbiAgdGhpcy5tYXBbaGFzaF0uZGlydHkgPSB0cnVlO1xuICB0aGlzLm1hcFtoYXNoXS5jaHVuay5zZXQoaSAtIG9yaWdpbi54LCBqIC0gb3JpZ2luLnksIGsgLSBvcmlnaW4ueiwgdik7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgdmFyIG9yaWdpbiA9IHRoaXMuZ2V0T3JpZ2luKGksIGosIGspO1xuICB2YXIgaGFzaCA9IG9yaWdpbi50b0FycmF5KCkuam9pbignLCcpO1xuICBpZiAodGhpcy5tYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBvcmlnaW4gPSB0aGlzLm1hcFtoYXNoXS5vcmlnaW47XG4gIHJldHVybiB0aGlzLm1hcFtoYXNoXS5jaHVuay5nZXQoaSAtIG9yaWdpbi54LCBqIC0gb3JpZ2luLnksIGsgLSBvcmlnaW4ueik7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLmdldE9yaWdpbiA9IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgIE1hdGguZmxvb3IoaSAvIHRoaXMuY2h1bmtTaXplKSxcbiAgICBNYXRoLmZsb29yKGogLyB0aGlzLmNodW5rU2l6ZSksXG4gICAgTWF0aC5mbG9vcihrIC8gdGhpcy5jaHVua1NpemUpXG4gICkubXVsdGlwbHlTY2FsYXIodGhpcy5jaHVua1NpemUpO1xufTtcblxuQ2h1bmtzLnByb3RvdHlwZS52aXNpdCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIGZvciAodmFyIGlkIGluIHRoaXMubWFwKSB7XG4gICAgdmFyIGNodW5rID0gdGhpcy5tYXBbaWRdLmNodW5rO1xuICAgIHZhciBvcmlnaW4gPSB0aGlzLm1hcFtpZF0ub3JpZ2luO1xuICAgIHZhciBzaGFwZSA9IGNodW5rLnNoYXBlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaGFwZVswXTsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNoYXBlWzBdOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaGFwZVswXTsgaysrKSB7XG4gICAgICAgICAgdmFyIHYgPSBjaHVuay5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soaSArIG9yaWdpbi54LCBqICsgb3JpZ2luLnksIGsgKyBvcmlnaW4ueiwgdik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkNodW5rcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaWQgaW4gdGhpcy5tYXApIHtcbiAgICB2YXIgY2h1bmsgPSB0aGlzLm1hcFtpZF07XG4gICAgaWYgKGNodW5rLm1lc2ggIT0gbnVsbCkge1xuICAgICAgY2h1bmsubWVzaC5wYXJlbnQucmVtb3ZlKGNodW5rLm1lc2gpO1xuICAgICAgY2h1bmsubWVzaC5nZW9tZXRyeS5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG4gIHRoaXMubWFwID0ge307XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLmRlc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSwgb2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8fCBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIHNlbGYuc2V0KHZbMF0gKyBvZmZzZXQueCwgdlsxXSArIG9mZnNldC55LCB2WzJdICsgb2Zmc2V0LnosIHZbM10pO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2h1bmtzO1xuIiwidmFyIEdyZWVkeU1lc2ggPSAoZnVuY3Rpb24oKSB7XG4gIC8vQ2FjaGUgYnVmZmVyIGludGVybmFsbHlcbiAgdmFyIG1hc2sgPSBuZXcgSW50MzJBcnJheSg0MDk2KTtcblxuICByZXR1cm4gZnVuY3Rpb24oZiwgZGltcykge1xuICAgIHZhciB2ZXJ0aWNlcyA9IFtdLFxuICAgICAgZmFjZXMgPSBbXSxcbiAgICAgIHV2cyA9IFtdLFxuICAgICAgZGltc1ggPSBkaW1zWzBdLFxuICAgICAgZGltc1kgPSBkaW1zWzFdLFxuICAgICAgZGltc1hZID0gZGltc1ggKiBkaW1zWTtcblxuICAgIC8vU3dlZXAgb3ZlciAzLWF4ZXNcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IDM7ICsrZCkge1xuICAgICAgdmFyIGksIGosIGssIGwsIHcsIFcsIGgsIG4sIGMsXG4gICAgICAgIHUgPSAoZCArIDEpICUgMyxcbiAgICAgICAgdiA9IChkICsgMikgJSAzLFxuICAgICAgICB4ID0gWzAsIDAsIDBdLFxuICAgICAgICBxID0gWzAsIDAsIDBdLFxuICAgICAgICBkdSA9IFswLCAwLCAwXSxcbiAgICAgICAgZHYgPSBbMCwgMCwgMF0sXG4gICAgICAgIGRpbXNEID0gZGltc1tkXSxcbiAgICAgICAgZGltc1UgPSBkaW1zW3VdLFxuICAgICAgICBkaW1zViA9IGRpbXNbdl0sXG4gICAgICAgIHFkaW1zWCwgcWRpbXNYWSwgeGQ7XG5cbiAgICAgIHZhciBmbGlwLCBpbmRleCwgdmFsdWU7XG5cbiAgICAgIGlmIChtYXNrLmxlbmd0aCA8IGRpbXNVICogZGltc1YpIHtcbiAgICAgICAgbWFzayA9IG5ldyBJbnQzMkFycmF5KGRpbXNVICogZGltc1YpO1xuICAgICAgfVxuXG4gICAgICBxW2RdID0gMTtcbiAgICAgIHhbZF0gPSAtMTtcblxuICAgICAgcWRpbXNYID0gZGltc1ggKiBxWzFdXG4gICAgICBxZGltc1hZID0gZGltc1hZICogcVsyXVxuXG4gICAgICAvLyBDb21wdXRlIG1hc2tcbiAgICAgIHdoaWxlICh4W2RdIDwgZGltc0QpIHtcbiAgICAgICAgeGQgPSB4W2RdXG4gICAgICAgIG4gPSAwO1xuXG4gICAgICAgIGZvciAoeFt2XSA9IDA7IHhbdl0gPCBkaW1zVjsgKyt4W3ZdKSB7XG4gICAgICAgICAgZm9yICh4W3VdID0gMDsgeFt1XSA8IGRpbXNVOyArK3hbdV0sICsrbikge1xuICAgICAgICAgICAgdmFyIGEgPSB4ZCA+PSAwICYmIGYoeFswXSwgeFsxXSwgeFsyXSksXG4gICAgICAgICAgICAgIGIgPSB4ZCA8IGRpbXNEIC0gMSAmJiBmKHhbMF0gKyBxWzBdLCB4WzFdICsgcVsxXSwgeFsyXSArIHFbMl0pXG4gICAgICAgICAgICBpZiAoYSA/IGIgOiAhYikge1xuICAgICAgICAgICAgICBtYXNrW25dID0gMDtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZsaXAgPSAhYTtcblxuICAgICAgICAgICAgaW5kZXggPSBkICogMjtcbiAgICAgICAgICAgIGlmIChmbGlwKSB7XG4gICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlID0gKGEgfHwgYilbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAoZmxpcCkge1xuICAgICAgICAgICAgICB2YWx1ZSAqPSAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFza1tuXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICsreFtkXTtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBtZXNoIGZvciBtYXNrIHVzaW5nIGxleGljb2dyYXBoaWMgb3JkZXJpbmdcbiAgICAgICAgbiA9IDA7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBkaW1zVjsgKytqKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRpbXNVOykge1xuICAgICAgICAgICAgYyA9IG1hc2tbbl07XG4gICAgICAgICAgICBpZiAoIWMpIHtcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICBuKys7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0NvbXB1dGUgd2lkdGhcbiAgICAgICAgICAgIHcgPSAxO1xuICAgICAgICAgICAgd2hpbGUgKGMgPT09IG1hc2tbbiArIHddICYmIGkgKyB3IDwgZGltc1UpIHcrKztcblxuICAgICAgICAgICAgLy9Db21wdXRlIGhlaWdodCAodGhpcyBpcyBzbGlnaHRseSBhd2t3YXJkKVxuICAgICAgICAgICAgZm9yIChoID0gMTsgaiArIGggPCBkaW1zVjsgKytoKSB7XG4gICAgICAgICAgICAgIGsgPSAwO1xuICAgICAgICAgICAgICB3aGlsZSAoayA8IHcgJiYgYyA9PT0gbWFza1tuICsgayArIGggKiBkaW1zVV0pIGsrK1xuICAgICAgICAgICAgICAgIGlmIChrIDwgdykgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBxdWFkXG4gICAgICAgICAgICAvLyBUaGUgZHUvZHYgYXJyYXlzIGFyZSByZXVzZWQvcmVzZXRcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIGl0ZXJhdGlvbi5cbiAgICAgICAgICAgIGR1W2RdID0gMDtcbiAgICAgICAgICAgIGR2W2RdID0gMDtcbiAgICAgICAgICAgIHhbdV0gPSBpO1xuICAgICAgICAgICAgeFt2XSA9IGo7XG5cbiAgICAgICAgICAgIGlmIChjID4gMCkge1xuICAgICAgICAgICAgICBkdlt2XSA9IGg7XG4gICAgICAgICAgICAgIGR2W3VdID0gMDtcbiAgICAgICAgICAgICAgZHVbdV0gPSB3O1xuICAgICAgICAgICAgICBkdVt2XSA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjID0gLWM7XG4gICAgICAgICAgICAgIGR1W3ZdID0gaDtcbiAgICAgICAgICAgICAgZHVbdV0gPSAwO1xuICAgICAgICAgICAgICBkdlt1XSA9IHc7XG4gICAgICAgICAgICAgIGR2W3ZdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhfY291bnQgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdLCB4WzFdLCB4WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHVbMF0sIHhbMV0gKyBkdVsxXSwgeFsyXSArIGR1WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHVbMF0gKyBkdlswXSwgeFsxXSArIGR1WzFdICsgZHZbMV0sIHhbMl0gKyBkdVsyXSArIGR2WzJdXSk7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFt4WzBdICsgZHZbMF0sIHhbMV0gKyBkdlsxXSwgeFsyXSArIGR2WzJdXSk7XG4gICAgICAgICAgICB1dnMucHVzaChcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFswLCAwXSxcbiAgICAgICAgICAgICAgICBbZHVbdV0sIGR1W3ZdXSxcbiAgICAgICAgICAgICAgICBbZHVbdV0gKyBkdlt1XSwgZHVbdl0gKyBkdlt2XV0sXG4gICAgICAgICAgICAgICAgW2R2W3VdLCBkdlt2XV1cbiAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGZhY2VzLnB1c2goW3ZlcnRleF9jb3VudCwgdmVydGV4X2NvdW50ICsgMSwgdmVydGV4X2NvdW50ICsgMiwgdmVydGV4X2NvdW50ICsgMywgY10pO1xuXG4gICAgICAgICAgICAvL1plcm8tb3V0IG1hc2tcbiAgICAgICAgICAgIFcgPSBuICsgdztcbiAgICAgICAgICAgIGZvciAobCA9IDA7IGwgPCBoOyArK2wpIHtcbiAgICAgICAgICAgICAgZm9yIChrID0gbjsgayA8IFc7ICsraykge1xuICAgICAgICAgICAgICAgIG1hc2tbayArIGwgKiBkaW1zVV0gPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vSW5jcmVtZW50IGNvdW50ZXJzIGFuZCBjb250aW51ZVxuICAgICAgICAgICAgaSArPSB3O1xuICAgICAgICAgICAgbiArPSB3O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB2ZXJ0aWNlczogdmVydGljZXMsIGZhY2VzOiBmYWNlcywgdXZzOiB1dnMgfTtcbiAgfVxufSkoKTtcblxuaWYgKGV4cG9ydHMpIHtcbiAgZXhwb3J0cy5tZXNoZXIgPSBHcmVlZHlNZXNoO1xufVxuIiwidmFyIFZveGVsID0ge1xuICBDaHVuazogcmVxdWlyZSgnLi9jaHVuaycpLFxuICBDaHVua3M6IHJlcXVpcmUoJy4vY2h1bmtzJyksXG4gIG1lc2hDaHVua3M6IHJlcXVpcmUoJy4vbWVzaGNodW5rcycpLFxuICBtZXNoZXI6IHJlcXVpcmUoJy4vbWVzaGVyJylcbn07XG5cbmZ1bmN0aW9uIHZpc2l0U2hhcGUoc2hhcGUsIGNhbGxiYWNrKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2hhcGVbMF07IGkrKykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2hhcGVbMV07IGorKykge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaGFwZVsyXTsgaysrKSB7XG4gICAgICAgIGNhbGxiYWNrKGksIGosIGspO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gY29weUNodW5rcyhmcm9tLCB0bywgb2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8fCBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICBmcm9tLnZpc2l0KGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgICB0by5zZXQoaSArIG9mZnNldC54LCBqICsgb2Zmc2V0LnksIGsgKyBvZmZzZXQueiwgdik7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gcmVtb3ZlRmxvYXRpbmcoY2h1bmtzLCBzdGFydENvb3JkKSB7XG4gIHZhciBtYXAgPSB7fTtcbiAgY2h1bmtzLnZpc2l0KGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgICB2YXIgaGFzaCA9IFtpLCBqLCBrXS5qb2luKCcsJyk7XG4gICAgbWFwW2hhc2hdID0ge1xuICAgICAgdmlzaXRlZDogZmFsc2UsXG4gICAgICBjb29yZDogW2ksIGosIGtdXG4gICAgfTtcbiAgfSk7XG5cbiAgdmFyIGxlYWRzID0gW3N0YXJ0Q29vcmRdO1xuXG4gIHdoaWxlIChsZWFkcy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHJlc3VsdCA9IHZpc2l0KFsxLCAwLCAwXSkgfHxcbiAgICAgIHZpc2l0KFswLCAxLCAwXSkgfHxcbiAgICAgIHZpc2l0KFswLCAwLCAxXSkgfHxcbiAgICAgIHZpc2l0KFstMSwgMCwgMF0pIHx8XG4gICAgICB2aXNpdChbMCwgLTEsIDBdKSB8fFxuICAgICAgdmlzaXQoWzAsIDAsIC0xXSk7XG5cbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgbGVhZHMucG9wKCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgZm9yICh2YXIgaWQgaW4gbWFwKSB7XG4gICAgaWYgKCFtYXBbaWRdLnZpc2l0ZWQpIHtcbiAgICAgIHZhciBjb29yZCA9IG1hcFtpZF0uY29vcmQ7XG4gICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHZpc2l0KGRpcykge1xuICAgIHZhciBjdXJyZW50ID0gbGVhZHNbbGVhZHMubGVuZ3RoIC0gMV07XG5cbiAgICB2YXIgbmV4dCA9IFtjdXJyZW50WzBdICsgZGlzWzBdLFxuICAgICAgY3VycmVudFsxXSArIGRpc1sxXSxcbiAgICAgIGN1cnJlbnRbMl0gKyBkaXNbMl1cbiAgICBdO1xuXG4gICAgdmFyIGhhc2ggPSBuZXh0LmpvaW4oJywnKTtcblxuICAgIGlmIChtYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChtYXBbaGFzaF0udmlzaXRlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB2ID0gY2h1bmtzLmdldChuZXh0WzBdLCBuZXh0WzFdLCBuZXh0WzJdKTtcbiAgICBpZiAoISF2KSB7XG4gICAgICBtYXBbaGFzaF0udmlzaXRlZCA9IHRydWU7XG4gICAgICBsZWFkcy5wdXNoKG5leHQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xufTtcblxuVm94ZWwudmlzaXRTaGFwZSA9IHZpc2l0U2hhcGU7XG5Wb3hlbC5jb3B5Q2h1bmtzID0gY29weUNodW5rcztcblZveGVsLnJlbW92ZUZsb2F0aW5nID0gcmVtb3ZlRmxvYXRpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gVm94ZWw7XG4iLCJ2YXIgbWVzaGVyID0gcmVxdWlyZSgnLi9tZXNoZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaHVua3MsIHBhcmVudCwgbWF0ZXJpYWwpIHtcbiAgZm9yICh2YXIgaWQgaW4gY2h1bmtzLm1hcCkge1xuICAgIHZhciBjaHVuayA9IGNodW5rcy5tYXBbaWRdO1xuICAgIHZhciBkYXRhID0gY2h1bmsuY2h1bms7XG4gICAgaWYgKGNodW5rLmRpcnR5KSB7XG5cbiAgICAgIGlmIChjaHVuay5tZXNoICE9IG51bGwpIHtcbiAgICAgICAgY2h1bmsubWVzaC5wYXJlbnQucmVtb3ZlKGNodW5rLm1lc2gpO1xuICAgICAgICBjaHVuay5tZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9yaWdpbiA9IGNodW5rLm9yaWdpbjtcblxuICAgICAgdmFyIGdlb21ldHJ5ID0gbWVzaGVyKGNodW5rLmNodW5rKTtcbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG1lc2gucG9zaXRpb24uY29weShjaHVuay5vcmlnaW4pO1xuICAgICAgcGFyZW50LmFkZChtZXNoKTtcblxuICAgICAgY2h1bmsuZGlydHkgPSBmYWxzZTtcbiAgICAgIGNodW5rLm1lc2ggPSBtZXNoO1xuICAgIH1cbiAgfVxufVxuIiwidmFyIGdyZWVkeU1lc2hlciA9IHJlcXVpcmUoJy4vZ3JlZWR5JykubWVzaGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNodW5rLCBmKSB7XG4gIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gIGYgPSBmIHx8IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgICByZXR1cm4gY2h1bmsuZ2V0KGksIGosIGspO1xuICB9O1xuICB2YXIgcmVzdWx0ID0gZ3JlZWR5TWVzaGVyKGYsIGNodW5rLnNoYXBlKTtcblxuICByZXN1bHQudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgdmFyIHZlcnRpY2UgPSBuZXcgVEhSRUUuVmVjdG9yMyh2WzBdLCB2WzFdLCB2WzJdKTtcbiAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKHZlcnRpY2UpO1xuICB9KTtcblxuICByZXN1bHQuZmFjZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgdmFyIGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMoZlswXSwgZlsxXSwgZlsyXSk7XG4gICAgZmFjZS5tYXRlcmlhbEluZGV4ID0gZls0XTtcbiAgICBnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xuXG4gICAgZmFjZSA9IG5ldyBUSFJFRS5GYWNlMyhmWzJdLCBmWzNdLCBmWzBdKTtcbiAgICBmYWNlLm1hdGVyaWFsSW5kZXggPSBmWzRdO1xuICAgIGdlb21ldHJ5LmZhY2VzLnB1c2goZmFjZSk7XG4gIH0pO1xuXG4gIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbMF0gPSBbXTtcbiAgcmVzdWx0LnV2cy5mb3JFYWNoKGZ1bmN0aW9uKHV2KSB7XG4gICAgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1swXS5wdXNoKFtcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzBdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzFdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzJdKVxuICAgIF0sIFtcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzJdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzNdKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKCkuZnJvbUFycmF5KHV2WzBdKVxuICAgIF0pO1xuICB9KTtcblxuICBnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcblxuICByZXR1cm4gZ2VvbWV0cnk7XG59O1xuIl19
