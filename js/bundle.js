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

module.exports = Dir;

},{}],4:[function(require,module,exports){
var SimplexNoise = require('simplex-noise');
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
  var noiseF2 = 0.02;
  var noise_pressure = new SimplexNoise(Math.random);
  var noise_pressureF = 0.002;
  var cloudAmount = -0.9;
  var counter = 0;
  var cooldown = 4.2;

  var allCoords = {};

  var size = 39;
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

},{"../dir":3,"../voxel/chunks":8,"../voxel/meshchunks":10,"../voxel/mesher":11,"simplex-noise":2}],5:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var SimplexNoise = require('simplex-noise');

var Chunks = require('../voxel/chunks');
var meshChunks = require('../voxel/meshchunks');

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

  init();
  generateGravityMap();
  generateSurface();
  removeFloating();
  generateSea();
  generateBiomes();
  generateTiles();

  var pivot = new THREE.Object3D();

  meshChunks(ground, pivot, material);
  meshChunks(water, pivot, material);

  var center = new THREE.Vector3()
    .subVectors(bounds.min, bounds.size)
    .multiplyScalar(0.5);
  pivot.position.copy(center);
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

  function removeFloating() {
    var map = {};
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        for (var k = 0; k < size; k++) {
          var hash = [i, j, k].join(',');
          map[hash] = {
            visited: false,
            coord: [i, j, k]
          };
        }
      }
    }

    var leads = [centerCoord];

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
        ground.set(coord[0], coord[1], coord[2], null);
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

      var v = ground.get(next[0], next[1], next[2]);
      if (!!v) {
        map[hash].visited = true;
        leads.push(next);
        return true;
      }
    };
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
          var value = noise_biomes.noise3D(
            (i + center[0]) * noiseF,
            (j + center[1]) * noiseF,
            (k + center[2]) * noiseF);

          var value2 = noise_biomes2.noise3D(
            (i + center[0]) * noiseF2,
            (j + center[1]) * noiseF2,
            (k + center[2]) * noiseF2);

          var value3 = noise_biomes3.noise3D(
            (i + center[0]) * noiseF3,
            (j + center[1]) * noiseF3,
            (k + center[2]) * noiseF3
          ) + value;

          value = value * 0.5 + value2 * 2.0;

          var biome = {
            value: value,
            value2: value3,
            relSeaLevel: relSeaLevel
          };

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
          var gravity = getGravity(i, j, k);
          gravity.forEach(function(g) {
            map[g] = true;
          });
          var data = getData(i, j, k);
          data.gravity = map;
        }
      }
    }

    function getGravity(i, j, k) {
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
  };

  function generateSurface() {
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
              (Math.pow(value / 1.5, 1) * disBias * 0) +
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

        if (value < -0.8) {
          return STONE;
        } else if (value < 0) {
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
    object: pivot
  };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../voxel/chunks":8,"../voxel/meshchunks":10,"simplex-noise":2}],6:[function(require,module,exports){
(function (global){
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var keycode = require('keycode');

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
var disScale = 12;

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
  ssaoPass.uniforms['aoClamp'].value = 0.3;
  ssaoPass.uniforms['lumInfluence'].value = 0.5;

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
  object.scale.set(10, 10, 10);
  scene.add(object);
  noAoLayer = new THREE.Object3D();
  object.add(noAoLayer);
  var ambientLight = new THREE.AmbientLight(0x888888);
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
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
  loadBlockMaterial('window', 8);

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

  if (alpha !== undefined) {
    m.transparent = true;
    m.opacity = alpha;
  }

  if (transform !== undefined) {
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
  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObject(terrian.object, true);
  if (intersects.length === 0) {
    return;
  }

  var point = intersects[0].point.clone()
    .add(raycasterDir.clone().multiplyScalar(0.01));

  var localPoint = terrian.object.worldToLocal(point);
  var coord = new THREE.Vector3(
    Math.floor(localPoint.x),
    Math.floor(localPoint.y),
    Math.floor(localPoint.z)
  );

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
// var building = require('./entities/building')(material, noAoLayer, camera);
// entities.push(building);

var cloud = require('./entities/cloud')(object, material);
entities.push(cloud);

var terrian = require('./entities/terrian')(size, object, material);

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

},{"./entities/cloud":4,"./entities/terrian":5,"keycode":1}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var Chunk = require('./chunk');

var Chunks = function() {
  this.map = {};
  this.chunkSize = 16;
};

Chunks.prototype.set = function(i, j, k, v) {
  var origin = this.getOrigin(i, j, k);
  var hash = origin.toArray().join(',');
  if (this.map[hash] == null) {
    this.map[hash] = {
      chunk: new Chunk(),
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

module.exports = Chunks;

},{"./chunk":7}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./mesher":11}],11:[function(require,module,exports){
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

},{"./greedy":9}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva2V5Y29kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGV4LW5vaXNlL3NpbXBsZXgtbm9pc2UuanMiLCJzcmMvZGlyLmpzIiwic3JjL2VudGl0aWVzL2Nsb3VkLmpzIiwic3JjL2VudGl0aWVzL3RlcnJpYW4uanMiLCJzcmMvbWFpbi5qcyIsInNyYy92b3hlbC9jaHVuay5qcyIsInNyYy92b3hlbC9jaHVua3MuanMiLCJzcmMvdm94ZWwvZ3JlZWR5LmpzIiwic3JjL3ZveGVsL21lc2hjaHVua3MuanMiLCJzcmMvdm94ZWwvbWVzaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDMWJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBTb3VyY2U6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvdld4OFYvXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MDMxOTUvZnVsbC1saXN0LW9mLWphdmFzY3JpcHQta2V5Y29kZXNcblxuLyoqXG4gKiBDb25lbmllbmNlIG1ldGhvZCByZXR1cm5zIGNvcnJlc3BvbmRpbmcgdmFsdWUgZm9yIGdpdmVuIGtleU5hbWUgb3Iga2V5Q29kZS5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBrZXlDb2RlIHtOdW1iZXJ9IG9yIGtleU5hbWUge1N0cmluZ31cbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWFyY2hJbnB1dCkge1xuICAvLyBLZXlib2FyZCBFdmVudHNcbiAgaWYgKHNlYXJjaElucHV0ICYmICdvYmplY3QnID09PSB0eXBlb2Ygc2VhcmNoSW5wdXQpIHtcbiAgICB2YXIgaGFzS2V5Q29kZSA9IHNlYXJjaElucHV0LndoaWNoIHx8IHNlYXJjaElucHV0LmtleUNvZGUgfHwgc2VhcmNoSW5wdXQuY2hhckNvZGVcbiAgICBpZiAoaGFzS2V5Q29kZSkgc2VhcmNoSW5wdXQgPSBoYXNLZXlDb2RlXG4gIH1cblxuICAvLyBOdW1iZXJzXG4gIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHNlYXJjaElucHV0KSByZXR1cm4gbmFtZXNbc2VhcmNoSW5wdXRdXG5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIChjYXN0IHRvIHN0cmluZylcbiAgdmFyIHNlYXJjaCA9IFN0cmluZyhzZWFyY2hJbnB1dClcblxuICAvLyBjaGVjayBjb2Rlc1xuICB2YXIgZm91bmROYW1lZEtleSA9IGNvZGVzW3NlYXJjaC50b0xvd2VyQ2FzZSgpXVxuICBpZiAoZm91bmROYW1lZEtleSkgcmV0dXJuIGZvdW5kTmFtZWRLZXlcblxuICAvLyBjaGVjayBhbGlhc2VzXG4gIHZhciBmb3VuZE5hbWVkS2V5ID0gYWxpYXNlc1tzZWFyY2gudG9Mb3dlckNhc2UoKV1cbiAgaWYgKGZvdW5kTmFtZWRLZXkpIHJldHVybiBmb3VuZE5hbWVkS2V5XG5cbiAgLy8gd2VpcmQgY2hhcmFjdGVyP1xuICBpZiAoc2VhcmNoLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHNlYXJjaC5jaGFyQ29kZUF0KDApXG5cbiAgcmV0dXJuIHVuZGVmaW5lZFxufVxuXG4vKipcbiAqIEdldCBieSBuYW1lXG4gKlxuICogICBleHBvcnRzLmNvZGVbJ2VudGVyJ10gLy8gPT4gMTNcbiAqL1xuXG52YXIgY29kZXMgPSBleHBvcnRzLmNvZGUgPSBleHBvcnRzLmNvZGVzID0ge1xuICAnYmFja3NwYWNlJzogOCxcbiAgJ3RhYic6IDksXG4gICdlbnRlcic6IDEzLFxuICAnc2hpZnQnOiAxNixcbiAgJ2N0cmwnOiAxNyxcbiAgJ2FsdCc6IDE4LFxuICAncGF1c2UvYnJlYWsnOiAxOSxcbiAgJ2NhcHMgbG9jayc6IDIwLFxuICAnZXNjJzogMjcsXG4gICdzcGFjZSc6IDMyLFxuICAncGFnZSB1cCc6IDMzLFxuICAncGFnZSBkb3duJzogMzQsXG4gICdlbmQnOiAzNSxcbiAgJ2hvbWUnOiAzNixcbiAgJ2xlZnQnOiAzNyxcbiAgJ3VwJzogMzgsXG4gICdyaWdodCc6IDM5LFxuICAnZG93bic6IDQwLFxuICAnaW5zZXJ0JzogNDUsXG4gICdkZWxldGUnOiA0NixcbiAgJ2NvbW1hbmQnOiA5MSxcbiAgJ2xlZnQgY29tbWFuZCc6IDkxLFxuICAncmlnaHQgY29tbWFuZCc6IDkzLFxuICAnbnVtcGFkIConOiAxMDYsXG4gICdudW1wYWQgKyc6IDEwNyxcbiAgJ251bXBhZCAtJzogMTA5LFxuICAnbnVtcGFkIC4nOiAxMTAsXG4gICdudW1wYWQgLyc6IDExMSxcbiAgJ251bSBsb2NrJzogMTQ0LFxuICAnc2Nyb2xsIGxvY2snOiAxNDUsXG4gICdteSBjb21wdXRlcic6IDE4MixcbiAgJ215IGNhbGN1bGF0b3InOiAxODMsXG4gICc7JzogMTg2LFxuICAnPSc6IDE4NyxcbiAgJywnOiAxODgsXG4gICctJzogMTg5LFxuICAnLic6IDE5MCxcbiAgJy8nOiAxOTEsXG4gICdgJzogMTkyLFxuICAnWyc6IDIxOSxcbiAgJ1xcXFwnOiAyMjAsXG4gICddJzogMjIxLFxuICBcIidcIjogMjIyXG59XG5cbi8vIEhlbHBlciBhbGlhc2VzXG5cbnZhciBhbGlhc2VzID0gZXhwb3J0cy5hbGlhc2VzID0ge1xuICAnd2luZG93cyc6IDkxLFxuICAn4oenJzogMTYsXG4gICfijKUnOiAxOCxcbiAgJ+KMgyc6IDE3LFxuICAn4oyYJzogOTEsXG4gICdjdGwnOiAxNyxcbiAgJ2NvbnRyb2wnOiAxNyxcbiAgJ29wdGlvbic6IDE4LFxuICAncGF1c2UnOiAxOSxcbiAgJ2JyZWFrJzogMTksXG4gICdjYXBzJzogMjAsXG4gICdyZXR1cm4nOiAxMyxcbiAgJ2VzY2FwZSc6IDI3LFxuICAnc3BjJzogMzIsXG4gICdwZ3VwJzogMzMsXG4gICdwZ2RuJzogMzQsXG4gICdpbnMnOiA0NSxcbiAgJ2RlbCc6IDQ2LFxuICAnY21kJzogOTFcbn1cblxuXG4vKiFcbiAqIFByb2dyYW1hdGljYWxseSBhZGQgdGhlIGZvbGxvd2luZ1xuICovXG5cbi8vIGxvd2VyIGNhc2UgY2hhcnNcbmZvciAoaSA9IDk3OyBpIDwgMTIzOyBpKyspIGNvZGVzW1N0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaSAtIDMyXG5cbi8vIG51bWJlcnNcbmZvciAodmFyIGkgPSA0ODsgaSA8IDU4OyBpKyspIGNvZGVzW2kgLSA0OF0gPSBpXG5cbi8vIGZ1bmN0aW9uIGtleXNcbmZvciAoaSA9IDE7IGkgPCAxMzsgaSsrKSBjb2Rlc1snZicraV0gPSBpICsgMTExXG5cbi8vIG51bXBhZCBrZXlzXG5mb3IgKGkgPSAwOyBpIDwgMTA7IGkrKykgY29kZXNbJ251bXBhZCAnK2ldID0gaSArIDk2XG5cbi8qKlxuICogR2V0IGJ5IGNvZGVcbiAqXG4gKiAgIGV4cG9ydHMubmFtZVsxM10gLy8gPT4gJ0VudGVyJ1xuICovXG5cbnZhciBuYW1lcyA9IGV4cG9ydHMubmFtZXMgPSBleHBvcnRzLnRpdGxlID0ge30gLy8gdGl0bGUgZm9yIGJhY2t3YXJkIGNvbXBhdFxuXG4vLyBDcmVhdGUgcmV2ZXJzZSBtYXBwaW5nXG5mb3IgKGkgaW4gY29kZXMpIG5hbWVzW2NvZGVzW2ldXSA9IGlcblxuLy8gQWRkIGFsaWFzZXNcbmZvciAodmFyIGFsaWFzIGluIGFsaWFzZXMpIHtcbiAgY29kZXNbYWxpYXNdID0gYWxpYXNlc1thbGlhc11cbn1cbiIsIi8qXG4gKiBBIGZhc3QgamF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBzaW1wbGV4IG5vaXNlIGJ5IEpvbmFzIFdhZ25lclxuICpcbiAqIEJhc2VkIG9uIGEgc3BlZWQtaW1wcm92ZWQgc2ltcGxleCBub2lzZSBhbGdvcml0aG0gZm9yIDJELCAzRCBhbmQgNEQgaW4gSmF2YS5cbiAqIFdoaWNoIGlzIGJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cbiAqIFdpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXG4gKiBCZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxuICpcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgSm9uYXMgV2FnbmVyXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG4gKiBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbiAqIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuICogZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuICogV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG4oZnVuY3Rpb24gKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGMiA9IDAuNSAqIChNYXRoLnNxcnQoMy4wKSAtIDEuMCksXG4gICAgRzIgPSAoMy4wIC0gTWF0aC5zcXJ0KDMuMCkpIC8gNi4wLFxuICAgIEYzID0gMS4wIC8gMy4wLFxuICAgIEczID0gMS4wIC8gNi4wLFxuICAgIEY0ID0gKE1hdGguc3FydCg1LjApIC0gMS4wKSAvIDQuMCxcbiAgICBHNCA9ICg1LjAgLSBNYXRoLnNxcnQoNS4wKSkgLyAyMC4wO1xuXG5cbmZ1bmN0aW9uIFNpbXBsZXhOb2lzZShyYW5kb20pIHtcbiAgICBpZiAoIXJhbmRvbSkgcmFuZG9tID0gTWF0aC5yYW5kb207XG4gICAgdGhpcy5wID0gbmV3IFVpbnQ4QXJyYXkoMjU2KTtcbiAgICB0aGlzLnBlcm0gPSBuZXcgVWludDhBcnJheSg1MTIpO1xuICAgIHRoaXMucGVybU1vZDEyID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAgIHRoaXMucFtpXSA9IHJhbmRvbSgpICogMjU2O1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICAgICAgdGhpcy5wZXJtW2ldID0gdGhpcy5wW2kgJiAyNTVdO1xuICAgICAgICB0aGlzLnBlcm1Nb2QxMltpXSA9IHRoaXMucGVybVtpXSAlIDEyO1xuICAgIH1cblxufVxuU2ltcGxleE5vaXNlLnByb3RvdHlwZSA9IHtcbiAgICBncmFkMzogbmV3IEZsb2F0MzJBcnJheShbMSwgMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgLSAxLCAwLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAtIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMCwgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDAsIDEsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgMSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIC0gMSwgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgLSAxLCAtIDFdKSxcbiAgICBncmFkNDogbmV3IEZsb2F0MzJBcnJheShbMCwgMSwgMSwgMSwgMCwgMSwgMSwgLSAxLCAwLCAxLCAtIDEsIDEsIDAsIDEsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIC0gMSwgMSwgMSwgMCwgLSAxLCAxLCAtIDEsIDAsIC0gMSwgLSAxLCAxLCAwLCAtIDEsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDAsIDEsIDEsIDEsIDAsIDEsIC0gMSwgMSwgMCwgLSAxLCAxLCAxLCAwLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDAsIDEsIDEsIC0gMSwgMCwgMSwgLSAxLCAtIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAxLCAwLCAxLCAxLCAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgMSwgMSwgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAxLCAwLCAxLCAtIDEsIDEsIDAsIC0gMSwgLSAxLCAtIDEsIDAsIDEsIC0gMSwgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMSwgMSwgMCwgMSwgMSwgLSAxLCAwLCAxLCAtIDEsIDEsIDAsIDEsIC0gMSwgLSAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMSwgMSwgMCwgLSAxLCAxLCAtIDEsIDAsIC0gMSwgLSAxLCAxLCAwLCAtIDEsIC0gMSwgLSAxLCAwXSksXG4gICAgbm9pc2UyRDogZnVuY3Rpb24gKHhpbiwgeWluKSB7XG4gICAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMixcbiAgICAgICAgICAgIHBlcm0gPSB0aGlzLnBlcm0sXG4gICAgICAgICAgICBncmFkMyA9IHRoaXMuZ3JhZDM7XG4gICAgICAgIHZhciBuMD0wLCBuMT0wLCBuMj0wOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4aW4gKyB5aW4pICogRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XG4gICAgICAgIHZhciB0ID0gKGkgKyBqKSAqIEcyO1xuICAgICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkpIHNwYWNlXG4gICAgICAgIHZhciBZMCA9IGogLSB0O1xuICAgICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgdmFyIHkwID0geWluIC0gWTA7XG4gICAgICAgIC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgdmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuICAgICAgICBpZiAoeDAgPiB5MCkge1xuICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICB9IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgfSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcbiAgICAgICAgLy8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXG4gICAgICAgIC8vIGMgPSAoMy1zcXJ0KDMpKS82XG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkxID0geTAgLSBqMSArIEcyO1xuICAgICAgICB2YXIgeDIgPSB4MCAtIDEuMCArIDIuMCAqIEcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSAxLjAgKyAyLjAgKiBHMjtcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgICAgdmFyIGpqID0gaiAmIDI1NTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjUgLSB4MCAqIHgwIC0geTAgKiB5MDtcbiAgICAgICAgaWYgKHQwID49IDApIHtcbiAgICAgICAgICAgIHZhciBnaTAgPSBwZXJtTW9kMTJbaWkgKyBwZXJtW2pqXV0gKiAzO1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCk7IC8vICh4LHkpIG9mIGdyYWQzIHVzZWQgZm9yIDJEIGdyYWRpZW50XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC41IC0geDEgKiB4MSAtIHkxICogeTE7XG4gICAgICAgIGlmICh0MSA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgZ2kxID0gcGVybU1vZDEyW2lpICsgaTEgKyBwZXJtW2pqICsgajFdXSAqIDM7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkM1tnaTFdICogeDEgKyBncmFkM1tnaTEgKyAxXSAqIHkxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjUgLSB4MiAqIHgyIC0geTIgKiB5MjtcbiAgICAgICAgaWYgKHQyID49IDApIHtcbiAgICAgICAgICAgIHZhciBnaTIgPSBwZXJtTW9kMTJbaWkgKyAxICsgcGVybVtqaiArIDFdXSAqIDM7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHJldHVybiB2YWx1ZXMgaW4gdGhlIGludGVydmFsIFstMSwxXS5cbiAgICAgICAgcmV0dXJuIDcwLjAgKiAobjAgKyBuMSArIG4yKTtcbiAgICB9LFxuICAgIC8vIDNEIHNpbXBsZXggbm9pc2VcbiAgICBub2lzZTNEOiBmdW5jdGlvbiAoeGluLCB5aW4sIHppbikge1xuICAgICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTIsXG4gICAgICAgICAgICBwZXJtID0gdGhpcy5wZXJtLFxuICAgICAgICAgICAgZ3JhZDMgPSB0aGlzLmdyYWQzO1xuICAgICAgICB2YXIgbjAsIG4xLCBuMiwgbjM7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgZm91ciBjb3JuZXJzXG4gICAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cbiAgICAgICAgdmFyIHMgPSAoeGluICsgeWluICsgemluKSAqIEYzOyAvLyBWZXJ5IG5pY2UgYW5kIHNpbXBsZSBza2V3IGZhY3RvciBmb3IgM0RcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XG4gICAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6aW4gKyBzKTtcbiAgICAgICAgdmFyIHQgPSAoaSArIGogKyBrKSAqIEczO1xuICAgICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseikgc3BhY2VcbiAgICAgICAgdmFyIFkwID0gaiAtIHQ7XG4gICAgICAgIHZhciBaMCA9IGsgLSB0O1xuICAgICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSx6IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgICB2YXIgeTAgPSB5aW4gLSBZMDtcbiAgICAgICAgdmFyIHowID0gemluIC0gWjA7XG4gICAgICAgIC8vIEZvciB0aGUgM0QgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYSBzbGlnaHRseSBpcnJlZ3VsYXIgdGV0cmFoZWRyb24uXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgdmFyIGkxLCBqMSwgazE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqLGspIGNvb3Jkc1xuICAgICAgICB2YXIgaTIsIGoyLCBrMjsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaixrKSBjb29yZHNcbiAgICAgICAgaWYgKHgwID49IHkwKSB7XG4gICAgICAgICAgICBpZiAoeTAgPj0gejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMDtcbiAgICAgICAgICAgIH0gLy8gWCBZIFogb3JkZXJcbiAgICAgICAgICAgIGVsc2UgaWYgKHgwID49IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMDtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFggWiBZIG9yZGVyXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMTtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAwO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWiBYIFkgb3JkZXJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8geDA8eTBcbiAgICAgICAgICAgIGlmICh5MCA8IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDE7XG4gICAgICAgICAgICAgICAgaTIgPSAwO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFogWSBYIG9yZGVyXG4gICAgICAgICAgICBlbHNlIGlmICh4MCA8IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAwO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFkgWiBYIG9yZGVyXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAxO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMDtcbiAgICAgICAgICAgIH0gLy8gWSBYIFogb3JkZXJcbiAgICAgICAgfVxuICAgICAgICAvLyBBIHN0ZXAgb2YgKDEsMCwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jLC1jKSBpbiAoeCx5LHopLFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMSwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jLC1jKSBpbiAoeCx5LHopLCBhbmRcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDAsMSkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKC1jLC1jLDEtYykgaW4gKHgseSx6KSwgd2hlcmVcbiAgICAgICAgLy8gYyA9IDEvNi5cbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEczOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMztcbiAgICAgICAgdmFyIHoxID0gejAgLSBrMSArIEczO1xuICAgICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzM7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xuICAgICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzM7XG4gICAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHMztcbiAgICAgICAgdmFyIHgzID0geDAgLSAxLjAgKyAzLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcbiAgICAgICAgdmFyIHkzID0geTAgLSAxLjAgKyAzLjAgKiBHMztcbiAgICAgICAgdmFyIHozID0gejAgLSAxLjAgKyAzLjAgKiBHMztcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmb3VyIHNpbXBsZXggY29ybmVyc1xuICAgICAgICB2YXIgaWkgPSBpICYgMjU1O1xuICAgICAgICB2YXIgamogPSBqICYgMjU1O1xuICAgICAgICB2YXIga2sgPSBrICYgMjU1O1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcbiAgICAgICAgdmFyIHQwID0gMC42IC0geDAgKiB4MCAtIHkwICogeTAgLSB6MCAqIHowO1xuICAgICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kwID0gcGVybU1vZDEyW2lpICsgcGVybVtqaiArIHBlcm1ba2tdXV0gKiAzO1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCArIGdyYWQzW2dpMCArIDJdICogejApO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MTtcbiAgICAgICAgaWYgKHQxIDwgMCkgbjEgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMSA9IHBlcm1Nb2QxMltpaSArIGkxICsgcGVybVtqaiArIGoxICsgcGVybVtrayArIGsxXV1dICogMztcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQzW2dpMV0gKiB4MSArIGdyYWQzW2dpMSArIDFdICogeTEgKyBncmFkM1tnaTEgKyAyXSAqIHoxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejI7XG4gICAgICAgIGlmICh0MiA8IDApIG4yID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTIgPSBwZXJtTW9kMTJbaWkgKyBpMiArIHBlcm1bamogKyBqMiArIHBlcm1ba2sgKyBrMl1dXSAqIDM7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyICsgZ3JhZDNbZ2kyICsgMl0gKiB6Mik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozO1xuICAgICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kzID0gcGVybU1vZDEyW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDFdXV0gKiAzO1xuICAgICAgICAgICAgdDMgKj0gdDM7XG4gICAgICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDNbZ2kzXSAqIHgzICsgZ3JhZDNbZ2kzICsgMV0gKiB5MyArIGdyYWQzW2dpMyArIDJdICogejMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cbiAgICAgICAgLy8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gc3RheSBqdXN0IGluc2lkZSBbLTEsMV1cbiAgICAgICAgcmV0dXJuIDMyLjAgKiAobjAgKyBuMSArIG4yICsgbjMpO1xuICAgIH0sXG4gICAgLy8gNEQgc2ltcGxleCBub2lzZSwgYmV0dGVyIHNpbXBsZXggcmFuayBvcmRlcmluZyBtZXRob2QgMjAxMi0wMy0wOVxuICAgIG5vaXNlNEQ6IGZ1bmN0aW9uICh4LCB5LCB6LCB3KSB7XG4gICAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMixcbiAgICAgICAgICAgIHBlcm0gPSB0aGlzLnBlcm0sXG4gICAgICAgICAgICBncmFkNCA9IHRoaXMuZ3JhZDQ7XG5cbiAgICAgICAgdmFyIG4wLCBuMSwgbjIsIG4zLCBuNDsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSBmaXZlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgKHgseSx6LHcpIHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBjZWxsIG9mIDI0IHNpbXBsaWNlcyB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4ICsgeSArIHogKyB3KSAqIEY0OyAvLyBGYWN0b3IgZm9yIDREIHNrZXdpbmdcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHggKyBzKTtcbiAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHkgKyBzKTtcbiAgICAgICAgdmFyIGsgPSBNYXRoLmZsb29yKHogKyBzKTtcbiAgICAgICAgdmFyIGwgPSBNYXRoLmZsb29yKHcgKyBzKTtcbiAgICAgICAgdmFyIHQgPSAoaSArIGogKyBrICsgbCkgKiBHNDsgLy8gRmFjdG9yIGZvciA0RCB1bnNrZXdpbmdcbiAgICAgICAgdmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5LHosdykgc3BhY2VcbiAgICAgICAgdmFyIFkwID0gaiAtIHQ7XG4gICAgICAgIHZhciBaMCA9IGsgLSB0O1xuICAgICAgICB2YXIgVzAgPSBsIC0gdDtcbiAgICAgICAgdmFyIHgwID0geCAtIFgwOyAvLyBUaGUgeCx5LHosdyBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgdmFyIHkwID0geSAtIFkwO1xuICAgICAgICB2YXIgejAgPSB6IC0gWjA7XG4gICAgICAgIHZhciB3MCA9IHcgLSBXMDtcbiAgICAgICAgLy8gRm9yIHRoZSA0RCBjYXNlLCB0aGUgc2ltcGxleCBpcyBhIDREIHNoYXBlIEkgd29uJ3QgZXZlbiB0cnkgdG8gZGVzY3JpYmUuXG4gICAgICAgIC8vIFRvIGZpbmQgb3V0IHdoaWNoIG9mIHRoZSAyNCBwb3NzaWJsZSBzaW1wbGljZXMgd2UncmUgaW4sIHdlIG5lZWQgdG9cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBtYWduaXR1ZGUgb3JkZXJpbmcgb2YgeDAsIHkwLCB6MCBhbmQgdzAuXG4gICAgICAgIC8vIFNpeCBwYWlyLXdpc2UgY29tcGFyaXNvbnMgYXJlIHBlcmZvcm1lZCBiZXR3ZWVuIGVhY2ggcG9zc2libGUgcGFpclxuICAgICAgICAvLyBvZiB0aGUgZm91ciBjb29yZGluYXRlcywgYW5kIHRoZSByZXN1bHRzIGFyZSB1c2VkIHRvIHJhbmsgdGhlIG51bWJlcnMuXG4gICAgICAgIHZhciByYW5reCA9IDA7XG4gICAgICAgIHZhciByYW5reSA9IDA7XG4gICAgICAgIHZhciByYW5reiA9IDA7XG4gICAgICAgIHZhciByYW5rdyA9IDA7XG4gICAgICAgIGlmICh4MCA+IHkwKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt5Kys7XG4gICAgICAgIGlmICh4MCA+IHowKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt6Kys7XG4gICAgICAgIGlmICh4MCA+IHcwKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIGlmICh5MCA+IHowKSByYW5reSsrO1xuICAgICAgICBlbHNlIHJhbmt6Kys7XG4gICAgICAgIGlmICh5MCA+IHcwKSByYW5reSsrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIGlmICh6MCA+IHcwKSByYW5reisrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIHZhciBpMSwgajEsIGsxLCBsMTsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIHNlY29uZCBzaW1wbGV4IGNvcm5lclxuICAgICAgICB2YXIgaTIsIGoyLCBrMiwgbDI7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSB0aGlyZCBzaW1wbGV4IGNvcm5lclxuICAgICAgICB2YXIgaTMsIGozLCBrMywgbDM7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSBmb3VydGggc2ltcGxleCBjb3JuZXJcbiAgICAgICAgLy8gc2ltcGxleFtjXSBpcyBhIDQtdmVjdG9yIHdpdGggdGhlIG51bWJlcnMgMCwgMSwgMiBhbmQgMyBpbiBzb21lIG9yZGVyLlxuICAgICAgICAvLyBNYW55IHZhbHVlcyBvZiBjIHdpbGwgbmV2ZXIgb2NjdXIsIHNpbmNlIGUuZy4geD55Pno+dyBtYWtlcyB4PHosIHk8dyBhbmQgeDx3XG4gICAgICAgIC8vIGltcG9zc2libGUuIE9ubHkgdGhlIDI0IGluZGljZXMgd2hpY2ggaGF2ZSBub24temVybyBlbnRyaWVzIG1ha2UgYW55IHNlbnNlLlxuICAgICAgICAvLyBXZSB1c2UgYSB0aHJlc2hvbGRpbmcgdG8gc2V0IHRoZSBjb29yZGluYXRlcyBpbiB0dXJuIGZyb20gdGhlIGxhcmdlc3QgbWFnbml0dWRlLlxuICAgICAgICAvLyBSYW5rIDMgZGVub3RlcyB0aGUgbGFyZ2VzdCBjb29yZGluYXRlLlxuICAgICAgICBpMSA9IHJhbmt4ID49IDMgPyAxIDogMDtcbiAgICAgICAgajEgPSByYW5reSA+PSAzID8gMSA6IDA7XG4gICAgICAgIGsxID0gcmFua3ogPj0gMyA/IDEgOiAwO1xuICAgICAgICBsMSA9IHJhbmt3ID49IDMgPyAxIDogMDtcbiAgICAgICAgLy8gUmFuayAyIGRlbm90ZXMgdGhlIHNlY29uZCBsYXJnZXN0IGNvb3JkaW5hdGUuXG4gICAgICAgIGkyID0gcmFua3ggPj0gMiA/IDEgOiAwO1xuICAgICAgICBqMiA9IHJhbmt5ID49IDIgPyAxIDogMDtcbiAgICAgICAgazIgPSByYW5reiA+PSAyID8gMSA6IDA7XG4gICAgICAgIGwyID0gcmFua3cgPj0gMiA/IDEgOiAwO1xuICAgICAgICAvLyBSYW5rIDEgZGVub3RlcyB0aGUgc2Vjb25kIHNtYWxsZXN0IGNvb3JkaW5hdGUuXG4gICAgICAgIGkzID0gcmFua3ggPj0gMSA/IDEgOiAwO1xuICAgICAgICBqMyA9IHJhbmt5ID49IDEgPyAxIDogMDtcbiAgICAgICAgazMgPSByYW5reiA+PSAxID8gMSA6IDA7XG4gICAgICAgIGwzID0gcmFua3cgPj0gMSA/IDEgOiAwO1xuICAgICAgICAvLyBUaGUgZmlmdGggY29ybmVyIGhhcyBhbGwgY29vcmRpbmF0ZSBvZmZzZXRzID0gMSwgc28gbm8gbmVlZCB0byBjb21wdXRlIHRoYXQuXG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHNDsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHNDtcbiAgICAgICAgdmFyIHoxID0gejAgLSBrMSArIEc0O1xuICAgICAgICB2YXIgdzEgPSB3MCAtIGwxICsgRzQ7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gaTIgKyAyLjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSBqMiArIDIuMCAqIEc0O1xuICAgICAgICB2YXIgejIgPSB6MCAtIGsyICsgMi4wICogRzQ7XG4gICAgICAgIHZhciB3MiA9IHcwIC0gbDIgKyAyLjAgKiBHNDtcbiAgICAgICAgdmFyIHgzID0geDAgLSBpMyArIDMuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciBmb3VydGggY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHkzID0geTAgLSBqMyArIDMuMCAqIEc0O1xuICAgICAgICB2YXIgejMgPSB6MCAtIGszICsgMy4wICogRzQ7XG4gICAgICAgIHZhciB3MyA9IHcwIC0gbDMgKyAzLjAgKiBHNDtcbiAgICAgICAgdmFyIHg0ID0geDAgLSAxLjAgKyA0LjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTQgPSB5MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICB2YXIgejQgPSB6MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICB2YXIgdzQgPSB3MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIGZpdmUgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIHZhciBpaSA9IGkgJiAyNTU7XG4gICAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICAgIHZhciBrayA9IGsgJiAyNTU7XG4gICAgICAgIHZhciBsbCA9IGwgJiAyNTU7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIGZpdmUgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjYgLSB4MCAqIHgwIC0geTAgKiB5MCAtIHowICogejAgLSB3MCAqIHcwO1xuICAgICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kwID0gKHBlcm1baWkgKyBwZXJtW2pqICsgcGVybVtrayArIHBlcm1bbGxdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQ0W2dpMF0gKiB4MCArIGdyYWQ0W2dpMCArIDFdICogeTAgKyBncmFkNFtnaTAgKyAyXSAqIHowICsgZ3JhZDRbZ2kwICsgM10gKiB3MCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC42IC0geDEgKiB4MSAtIHkxICogeTEgLSB6MSAqIHoxIC0gdzEgKiB3MTtcbiAgICAgICAgaWYgKHQxIDwgMCkgbjEgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMSA9IChwZXJtW2lpICsgaTEgKyBwZXJtW2pqICsgajEgKyBwZXJtW2trICsgazEgKyBwZXJtW2xsICsgbDFdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQ0W2dpMV0gKiB4MSArIGdyYWQ0W2dpMSArIDFdICogeTEgKyBncmFkNFtnaTEgKyAyXSAqIHoxICsgZ3JhZDRbZ2kxICsgM10gKiB3MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC42IC0geDIgKiB4MiAtIHkyICogeTIgLSB6MiAqIHoyIC0gdzIgKiB3MjtcbiAgICAgICAgaWYgKHQyIDwgMCkgbjIgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMiA9IChwZXJtW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazIgKyBwZXJtW2xsICsgbDJdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWQ0W2dpMl0gKiB4MiArIGdyYWQ0W2dpMiArIDFdICogeTIgKyBncmFkNFtnaTIgKyAyXSAqIHoyICsgZ3JhZDRbZ2kyICsgM10gKiB3Mik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozIC0gdzMgKiB3MztcbiAgICAgICAgaWYgKHQzIDwgMCkgbjMgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMyA9IChwZXJtW2lpICsgaTMgKyBwZXJtW2pqICsgajMgKyBwZXJtW2trICsgazMgKyBwZXJtW2xsICsgbDNdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQzICo9IHQzO1xuICAgICAgICAgICAgbjMgPSB0MyAqIHQzICogKGdyYWQ0W2dpM10gKiB4MyArIGdyYWQ0W2dpMyArIDFdICogeTMgKyBncmFkNFtnaTMgKyAyXSAqIHozICsgZ3JhZDRbZ2kzICsgM10gKiB3Myk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQ0ID0gMC42IC0geDQgKiB4NCAtIHk0ICogeTQgLSB6NCAqIHo0IC0gdzQgKiB3NDtcbiAgICAgICAgaWYgKHQ0IDwgMCkgbjQgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpNCA9IChwZXJtW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDEgKyBwZXJtW2xsICsgMV1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDQgKj0gdDQ7XG4gICAgICAgICAgICBuNCA9IHQ0ICogdDQgKiAoZ3JhZDRbZ2k0XSAqIHg0ICsgZ3JhZDRbZ2k0ICsgMV0gKiB5NCArIGdyYWQ0W2dpNCArIDJdICogejQgKyBncmFkNFtnaTQgKyAzXSAqIHc0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdW0gdXAgYW5kIHNjYWxlIHRoZSByZXN1bHQgdG8gY292ZXIgdGhlIHJhbmdlIFstMSwxXVxuICAgICAgICByZXR1cm4gMjcuMCAqIChuMCArIG4xICsgbjIgKyBuMyArIG40KTtcbiAgICB9XG5cblxufTtcblxuLy8gYW1kXG5pZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIFNpbXBsZXhOb2lzZTt9KTtcbi8vY29tbW9uIGpzXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSBleHBvcnRzLlNpbXBsZXhOb2lzZSA9IFNpbXBsZXhOb2lzZTtcbi8vIGJyb3dzZXJcbmVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB3aW5kb3cuU2ltcGxleE5vaXNlID0gU2ltcGxleE5vaXNlO1xuLy8gbm9kZWpzXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNpbXBsZXhOb2lzZTtcbn1cblxufSkoKTtcbiIsInZhciBEaXIgPSB7fTtcblxuRGlyLkxFRlQgPSAwO1xuRGlyLlJJR0hUID0gMTtcbkRpci5CT1RUT00gPSAyO1xuRGlyLlVQID0gMztcbkRpci5CQUNLID0gNDtcbkRpci5GUk9OVCA9IDU7XG5cbkRpci5nZXRVbml0VmVjdG9yID0gZnVuY3Rpb24oZGlyKSB7XG4gIHN3aXRjaCAoZGlyKSB7XG4gICAgY2FzZSBEaXIuTEVGVDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygtMSwgMCwgMClcbiAgICBjYXNlIERpci5SSUdIVDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKVxuICAgIGNhc2UgRGlyLkJPVFRPTTpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAtMSwgMClcbiAgICBjYXNlIERpci5VUDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKVxuICAgIGNhc2UgRGlyLkJBQ0s6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpXG4gICAgY2FzZSBEaXIuRlJPTlQ6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSlcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXI7XG4iLCJ2YXIgU2ltcGxleE5vaXNlID0gcmVxdWlyZSgnc2ltcGxleC1ub2lzZScpO1xudmFyIFNpbXBsZXhOb2lzZSA9IHJlcXVpcmUoJ3NpbXBsZXgtbm9pc2UnKTtcblxudmFyIG1lc2hlciA9IHJlcXVpcmUoJy4uL3ZveGVsL21lc2hlcicpO1xudmFyIERpciA9IHJlcXVpcmUoJy4uL2RpcicpO1xudmFyIENodW5rcyA9IHJlcXVpcmUoJy4uL3ZveGVsL2NodW5rcycpO1xudmFyIG1lc2hDaHVua3MgPSByZXF1aXJlKCcuLi92b3hlbC9tZXNoY2h1bmtzJyk7XG5cbnZhciBDTE9VRCA9IDEwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBhcmVudCwgbWF0ZXJpYWwpIHtcblxuICB2YXIgY2h1bmtzID0gbmV3IENodW5rcygpO1xuICB2YXIgZGF0YU1hcCA9IHt9O1xuICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIHBhcmVudC5hZGQob2JqZWN0KTtcblxuICB2YXIgbm9pc2UxID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUYxID0gMC4xO1xuICB2YXIgbm9pc2UyID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUYyID0gMC4wMjtcbiAgdmFyIG5vaXNlX3ByZXNzdXJlID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZV9wcmVzc3VyZUYgPSAwLjAwMjtcbiAgdmFyIGNsb3VkQW1vdW50ID0gLTAuOTtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICB2YXIgY29vbGRvd24gPSA0LjI7XG5cbiAgdmFyIGFsbENvb3JkcyA9IHt9O1xuXG4gIHZhciBzaXplID0gMzk7XG4gIHZhciBjZW50ZXJOdW0gPSAoc2l6ZSAvIDIpO1xuICB2YXIgY2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoLXNpemUgLyAyLCAtc2l6ZSAvIDIsIC1zaXplIC8gMik7XG5cbiAgdmFyIGNsb3VkVm94ZWwgPSBbXG4gICAgQ0xPVUQsIENMT1VELCBDTE9VRCwgQ0xPVUQsIENMT1VELCBDTE9VRFxuICBdO1xuXG4gIGluaXREYXRhKCk7XG5cbiAgZnVuY3Rpb24gaW5pdERhdGEoKSB7XG4gICAgdmFyIGNvb3JkID0gW107XG5cbiAgICBmb3IgKHZhciBkaXIgPSAwOyBkaXIgPCA2OyBkaXIrKykge1xuICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKGRpciAvIDIpO1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG4gICAgICB2YXIgY29vcmREID0gZGlyICUgMiA/IDAgOiBzaXplIC0gMTtcbiAgICAgIHZhciBmYWxsRGlyID0gY29vcmREID09PSAwID8gMSA6IC0xO1xuICAgICAgdmFyIGZhbGxDb29yZEQgPSBjb29yZEQgKyBmYWxsRGlyO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICAgIGNvb3JkW2RdID0gY29vcmREO1xuICAgICAgICAgIGNvb3JkW3VdID0gaTtcbiAgICAgICAgICBjb29yZFt2XSA9IGo7XG5cbiAgICAgICAgICB2YXIgcmVsID0gW1xuICAgICAgICAgICAgKGNvb3JkWzBdICsgY2VudGVyLngpLFxuICAgICAgICAgICAgKGNvb3JkWzFdICsgY2VudGVyLnkpLFxuICAgICAgICAgICAgKGNvb3JkWzJdICsgY2VudGVyLnopXG4gICAgICAgICAgXTtcblxuICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgcHJlc3N1cmU6IG5vaXNlX3ByZXNzdXJlLm5vaXNlM0QoXG4gICAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlX3ByZXNzdXJlRixcbiAgICAgICAgICAgICAgcmVsWzFdICogbm9pc2VfcHJlc3N1cmVGLFxuICAgICAgICAgICAgICByZWxbMl0gKiBub2lzZV9wcmVzc3VyZUZcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBhbW91bnQ6IDAsXG4gICAgICAgICAgICBkZWx0YTogMCxcbiAgICAgICAgICAgIGNvb3JkOiBbY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXV1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIGhhc2ggPSBjb29yZC5qb2luKCcsJyk7XG4gICAgICAgICAgYWxsQ29vcmRzW2hhc2hdID0gW2Nvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl1dO1xuICAgICAgICAgIGRhdGFNYXBbaGFzaF0gPSBkYXRhO1xuXG4gICAgICAgICAgdmFyIHZhbHVlID0gbm9pc2UxLm5vaXNlM0QoXG4gICAgICAgICAgICByZWxbMF0gKiBub2lzZUYxLFxuICAgICAgICAgICAgcmVsWzFdICogbm9pc2VGMSxcbiAgICAgICAgICAgIHJlbFsyXSAqIG5vaXNlRjFcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdmFyIHZhbHVlMiA9IG5vaXNlMi5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMixcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYyXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHZhbHVlID0gTWF0aC5wb3codmFsdWUgKyB2YWx1ZTIsIDEpICsgY2xvdWRBbW91bnQ7XG5cbiAgICAgICAgICBpZiAodmFsdWUgPiAwLjApIHtcbiAgICAgICAgICAgIGNodW5rcy5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgY2xvdWRWb3hlbCk7XG4gICAgICAgICAgICBkYXRhLmFtb3VudCArPSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRhdGEubmVpZ2hib3VycyA9IFtdO1xuXG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGkgLSAxLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGkgPT09IHNpemUgLSAxKSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChmYWxsQ29vcmRELCBpLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGNvb3JkRCwgaSArIDEsIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGksIGogLSAxLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGogPT09IHNpemUgLSAxKSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChmYWxsQ29vcmRELCBpLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGNvb3JkRCwgaSwgaiArIDEsIGQsIHUsIHYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZGlyID09PSAwKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1swXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gMSkge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMV07XG4gICAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09IDIpIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAzKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1syXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlbEkgPSBpIC0gY2VudGVyTnVtO1xuICAgICAgICAgICAgdmFyIHJlbEogPSBqIC0gY2VudGVyTnVtO1xuXG4gICAgICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKHJlbEksIHJlbEopO1xuICAgICAgICAgICAgYW5nbGUgPSBub3JtYWxpemVBbmdsZShhbmdsZSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZUFuZ2xlKGFuZ2xlKSB7XG4gICAgICAgICAgICAgIGFuZ2xlICU9IChNYXRoLlBJICogMik7XG4gICAgICAgICAgICAgIGlmIChhbmdsZSA8IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICBhbmdsZSArPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmdsZSA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICBhbmdsZSAtPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gYW5nbGU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gTWF0aC5QSSAvIDQ7XG4gICAgICAgICAgICB2YXIgc3RlcCA9IE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gLU1hdGguUEk7XG5cbiAgICAgICAgICAgIGlmIChhbmdsZSA+PSBvZmZzZXQgJiYgYW5nbGUgPCBvZmZzZXQgKyBzdGVwKSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbmdsZSA+PSBvZmZzZXQgKyBzdGVwICYmIGFuZ2xlIDwgb2Zmc2V0ICsgc3RlcCAqIDIpIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMl07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ2xlID49IG9mZnNldCAtIHN0ZXAgJiYgYW5nbGUgPCBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbM107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0Q29vcmQoaSwgaiwgaywgZCwgdSwgdikge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGNvb3JkW2RdID0gaTtcbiAgICBjb29yZFt1XSA9IGo7XG4gICAgY29vcmRbdl0gPSBrO1xuICAgIHJldHVybiBjb29yZDtcbiAgfVxuXG4gIHVwZGF0ZU1lc2goKTtcblxuICBvYmplY3QucG9zaXRpb24uY29weShjZW50ZXIpO1xuXG4gIGZ1bmN0aW9uIHRpY2soZHQpIHtcbiAgICBjb3VudGVyICs9IGR0O1xuICAgIGlmIChjb3VudGVyID4gY29vbGRvd24pIHtcbiAgICAgIGNvdW50ZXIgLT0gY29vbGRvd247XG5cbiAgICAgIHZhciBjaGFuZ2VkID0ge307XG4gICAgICBmb3IgKHZhciBpZCBpbiBhbGxDb29yZHMpIHtcbiAgICAgICAgdmFyIGNvb3JkID0gYWxsQ29vcmRzW2lkXTtcbiAgICAgICAgdmFyIGRhdGEgPSBkYXRhTWFwW2lkXTtcbiAgICAgICAgdmFyIG5leHRDb29yZCA9IGRhdGEubmV4dENvb3JkO1xuICAgICAgICBpZiAobmV4dENvb3JkID09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLmFtb3VudCA8PSAwKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV4dEhhc2ggPSBuZXh0Q29vcmQuam9pbignLCcpO1xuICAgICAgICB2YXIgbmV4dERhdGEgPSBkYXRhTWFwW25leHRIYXNoXTtcbiAgICAgICAgY2hhbmdlZFtuZXh0SGFzaF0gPSB0cnVlO1xuICAgICAgICBjaGFuZ2VkW2lkXSA9IHRydWU7XG5cbiAgICAgICAgbmV4dERhdGEuZGVsdGEgKz0gMS4wO1xuICAgICAgICBkYXRhLmRlbHRhICs9IC0xLjA7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGlkIGluIGNoYW5nZWQpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBkYXRhTWFwW2lkXTtcbiAgICAgICAgdmFyIGNvb3JkID0gZGF0YS5jb29yZDtcbiAgICAgICAgZGF0YS5hbW91bnQgKz0gZGF0YS5kZWx0YTtcbiAgICAgICAgZGF0YS5kZWx0YSA9IDA7XG5cbiAgICAgICAgaWYgKGRhdGEuYW1vdW50ID49IDEuMCkge1xuICAgICAgICAgIGNodW5rcy5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgY2xvdWRWb3hlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2h1bmtzLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cGRhdGVNZXNoKCk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZU1lc2goKSB7XG4gICAgbWVzaENodW5rcyhjaHVua3MsIG9iamVjdCwgbWF0ZXJpYWwpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdGljazogdGlja1xuICB9O1xufVxuIiwidmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIgU2ltcGxleE5vaXNlID0gcmVxdWlyZSgnc2ltcGxleC1ub2lzZScpO1xuXG52YXIgQ2h1bmtzID0gcmVxdWlyZSgnLi4vdm94ZWwvY2h1bmtzJyk7XG52YXIgbWVzaENodW5rcyA9IHJlcXVpcmUoJy4uL3ZveGVsL21lc2hjaHVua3MnKTtcblxudmFyIEdSQVNTID0gMTtcbnZhciBTT0lMID0gMjtcbnZhciBTT0lMX0VER0UgPSAzO1xudmFyIFNUT05FID0gNDtcbnZhciBTRUEgPSA1O1xudmFyIFNBTkQgPSA2O1xuXG52YXIgTEVWRUxfU1VSRkFDRSA9IDE7XG52YXIgTEVWRUxfTUlERExFID0gMjtcbnZhciBMRVZFTF9DT1JFID0gMztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaXplLCBwYXJlbnQsIG1hdGVyaWFsKSB7XG4gIHZhciBub2lzZV9zdXJmYWNlID0gbmV3IFNpbXBsZXhOb2lzZShNYXRoLnJhbmRvbSk7XG4gIHZhciBub2lzZUZfc3VyZmFjZSA9IDAuMTtcblxuICB2YXIgbm9pc2Vfc3VyZmFjZTIgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlRl9zdXJmYWNlMiA9IDAuMDQ7XG5cbiAgdmFyIG5vaXNlX2Jpb21lcyA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VfYmlvbWVzMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VfYmlvbWVzMyA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuXG4gIHZhciBncm91bmQgPSBuZXcgQ2h1bmtzKCk7XG4gIHZhciB3YXRlciA9IG5ldyBDaHVua3MoKTtcbiAgdmFyIGJvdW5kcyA9IHtcbiAgICBtaW46IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApLFxuICAgIHNpemU6IG5ldyBUSFJFRS5WZWN0b3IzKHNpemUsIHNpemUsIHNpemUpXG4gIH07XG5cbiAgdmFyIGNlbnRlciA9IFstc2l6ZSAvIDIgKyAwLjUsIC1zaXplIC8gMiArIDAuNSwgLXNpemUgLyAyICsgMC41XTtcbiAgdmFyIGNlbnRlckNvb3JkID0gW1xuICAgIE1hdGguZmxvb3Ioc2l6ZSAvIDIpLFxuICAgIE1hdGguZmxvb3Ioc2l6ZSAvIDIpLFxuICAgIE1hdGguZmxvb3Ioc2l6ZSAvIDIpXG4gIF07XG5cbiAgLy8gaGFzaCAtPiBkYXRhXG4gIC8vIGdyYXZpdHk6IGdyYXZpdHkgKHMpXG4gIC8vIGJpb21lOiBiaW9tZSBkYXRhXG4gIC8vIGhlaWdodDogaGVpZ2h0IG9mIHN1cmZhY2VcbiAgdmFyIGRhdGFNYXAgPSB7fTtcblxuICB2YXIgc3VyZmFjZU51bSA9IDY7XG4gIHZhciBzZWFMZXZlbCA9IDI7XG5cbiAgaW5pdCgpO1xuICBnZW5lcmF0ZUdyYXZpdHlNYXAoKTtcbiAgZ2VuZXJhdGVTdXJmYWNlKCk7XG4gIHJlbW92ZUZsb2F0aW5nKCk7XG4gIGdlbmVyYXRlU2VhKCk7XG4gIGdlbmVyYXRlQmlvbWVzKCk7XG4gIGdlbmVyYXRlVGlsZXMoKTtcblxuICB2YXIgcGl2b3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICBtZXNoQ2h1bmtzKGdyb3VuZCwgcGl2b3QsIG1hdGVyaWFsKTtcbiAgbWVzaENodW5rcyh3YXRlciwgcGl2b3QsIG1hdGVyaWFsKTtcblxuICB2YXIgY2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIC5zdWJWZWN0b3JzKGJvdW5kcy5taW4sIGJvdW5kcy5zaXplKVxuICAgIC5tdWx0aXBseVNjYWxhcigwLjUpO1xuICBwaXZvdC5wb3NpdGlvbi5jb3B5KGNlbnRlcik7XG4gIHBhcmVudC5hZGQocGl2b3QpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XG4gICAgICAgICAgZ3JvdW5kLnNldChpLCBqLCBrLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVNlYSgpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IDM7IGQrKykge1xuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG4gICAgICBbc2VhTGV2ZWwsIHNpemUgLSBzZWFMZXZlbCAtIDFdLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgICAgICBmb3IgKHZhciBpID0gc2VhTGV2ZWw7IGkgPCBzaXplIC0gc2VhTGV2ZWw7IGkrKykge1xuICAgICAgICAgIGZvciAodmFyIGogPSBzZWFMZXZlbDsgaiA8IHNpemUgLSBzZWFMZXZlbDsgaisrKSB7XG4gICAgICAgICAgICBjb29yZFtkXSA9IGM7XG4gICAgICAgICAgICBjb29yZFt1XSA9IGk7XG4gICAgICAgICAgICBjb29yZFt2XSA9IGo7XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICAgIHZhciBncmF2aXR5ID0gZGF0YS5ncmF2aXR5O1xuXG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBbXG4gICAgICAgICAgICAgIDAsIDAsIDAsIDAsIDAsIDBcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGcgaW4gZ3Jhdml0eSkge1xuICAgICAgICAgICAgICBibG9ja1tnXSA9IFNFQTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFncm91bmQuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pKSB7XG4gICAgICAgICAgICAgIHdhdGVyLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCBibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRmxvYXRpbmcoKSB7XG4gICAgdmFyIG1hcCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNpemU7IGsrKykge1xuICAgICAgICAgIHZhciBoYXNoID0gW2ksIGosIGtdLmpvaW4oJywnKTtcbiAgICAgICAgICBtYXBbaGFzaF0gPSB7XG4gICAgICAgICAgICB2aXNpdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGNvb3JkOiBbaSwgaiwga11cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxlYWRzID0gW2NlbnRlckNvb3JkXTtcblxuICAgIHdoaWxlIChsZWFkcy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdmlzaXQoWzEsIDAsIDBdKSB8fFxuICAgICAgICB2aXNpdChbMCwgMSwgMF0pIHx8XG4gICAgICAgIHZpc2l0KFswLCAwLCAxXSkgfHxcbiAgICAgICAgdmlzaXQoWy0xLCAwLCAwXSkgfHxcbiAgICAgICAgdmlzaXQoWzAsIC0xLCAwXSkgfHxcbiAgICAgICAgdmlzaXQoWzAsIDAsIC0xXSk7XG5cbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIGxlYWRzLnBvcCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjb3VudCA9IDA7XG4gICAgZm9yICh2YXIgaWQgaW4gbWFwKSB7XG4gICAgICBpZiAoIW1hcFtpZF0udmlzaXRlZCkge1xuICAgICAgICB2YXIgY29vcmQgPSBtYXBbaWRdLmNvb3JkO1xuICAgICAgICBncm91bmQuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZpc2l0KGRpcykge1xuICAgICAgdmFyIGN1cnJlbnQgPSBsZWFkc1tsZWFkcy5sZW5ndGggLSAxXTtcblxuICAgICAgdmFyIG5leHQgPSBbY3VycmVudFswXSArIGRpc1swXSxcbiAgICAgICAgY3VycmVudFsxXSArIGRpc1sxXSxcbiAgICAgICAgY3VycmVudFsyXSArIGRpc1syXVxuICAgICAgXTtcblxuICAgICAgdmFyIGhhc2ggPSBuZXh0LmpvaW4oJywnKTtcblxuICAgICAgaWYgKG1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1hcFtoYXNoXS52aXNpdGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHYgPSBncm91bmQuZ2V0KG5leHRbMF0sIG5leHRbMV0sIG5leHRbMl0pO1xuICAgICAgaWYgKCEhdikge1xuICAgICAgICBtYXBbaGFzaF0udmlzaXRlZCA9IHRydWU7XG4gICAgICAgIGxlYWRzLnB1c2gobmV4dCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVCaW9tZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XG4gICAgICAgICAgdmFyIHYgPSBncm91bmQuZ2V0KGksIGosIGspO1xuICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGQgPSBNYXRoLm1heChcbiAgICAgICAgICAgIE1hdGguYWJzKGkgKyBjZW50ZXJbMF0pLFxuICAgICAgICAgICAgTWF0aC5hYnMoaiArIGNlbnRlclsxXSksXG4gICAgICAgICAgICBNYXRoLmFicyhrICsgY2VudGVyWzJdKSk7XG5cbiAgICAgICAgICB2YXIgcmVsU2VhTGV2ZWwgPSAoc2l6ZSAvIDIgLSBkIC0gc2VhTGV2ZWwgLSAwLjUpO1xuXG4gICAgICAgICAgZCAvPSAoc2l6ZSAvIDIpO1xuXG4gICAgICAgICAgdmFyIG5vaXNlRiA9IDAuMDU7XG4gICAgICAgICAgdmFyIG5vaXNlRjIgPSAwLjAyO1xuICAgICAgICAgIHZhciBub2lzZUYzID0gMC4wMjtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBub2lzZV9iaW9tZXMubm9pc2UzRChcbiAgICAgICAgICAgIChpICsgY2VudGVyWzBdKSAqIG5vaXNlRixcbiAgICAgICAgICAgIChqICsgY2VudGVyWzFdKSAqIG5vaXNlRixcbiAgICAgICAgICAgIChrICsgY2VudGVyWzJdKSAqIG5vaXNlRik7XG5cbiAgICAgICAgICB2YXIgdmFsdWUyID0gbm9pc2VfYmlvbWVzMi5ub2lzZTNEKFxuICAgICAgICAgICAgKGkgKyBjZW50ZXJbMF0pICogbm9pc2VGMixcbiAgICAgICAgICAgIChqICsgY2VudGVyWzFdKSAqIG5vaXNlRjIsXG4gICAgICAgICAgICAoayArIGNlbnRlclsyXSkgKiBub2lzZUYyKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTMgPSBub2lzZV9iaW9tZXMzLm5vaXNlM0QoXG4gICAgICAgICAgICAoaSArIGNlbnRlclswXSkgKiBub2lzZUYzLFxuICAgICAgICAgICAgKGogKyBjZW50ZXJbMV0pICogbm9pc2VGMyxcbiAgICAgICAgICAgIChrICsgY2VudGVyWzJdKSAqIG5vaXNlRjNcbiAgICAgICAgICApICsgdmFsdWU7XG5cbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlICogMC41ICsgdmFsdWUyICogMi4wO1xuXG4gICAgICAgICAgdmFyIGJpb21lID0ge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsdWUyOiB2YWx1ZTMsXG4gICAgICAgICAgICByZWxTZWFMZXZlbDogcmVsU2VhTGV2ZWxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIGxldmVsO1xuXG4gICAgICAgICAgaWYgKGQgPiAwLjcpIHtcbiAgICAgICAgICAgIC8vIHN1cmZhY2VcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfU1VSRkFDRTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGQgPiAwLjMpIHtcbiAgICAgICAgICAgIC8vIG1pZGRsZVxuICAgICAgICAgICAgbGV2ZWwgPSBMRVZFTF9NSURETEU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvcmVcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfQ09SRTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBiaW9tZS5sZXZlbCA9IGxldmVsO1xuXG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGksIGosIGspO1xuICAgICAgICAgIGRhdGEuYmlvbWUgPSBiaW9tZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUdyYXZpdHlNYXAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XG4gICAgICAgICAgdmFyIG1hcCA9IHt9O1xuICAgICAgICAgIHZhciBncmF2aXR5ID0gZ2V0R3Jhdml0eShpLCBqLCBrKTtcbiAgICAgICAgICBncmF2aXR5LmZvckVhY2goZnVuY3Rpb24oZykge1xuICAgICAgICAgICAgbWFwW2ddID0gdHJ1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoaSwgaiwgayk7XG4gICAgICAgICAgZGF0YS5ncmF2aXR5ID0gbWFwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3Jhdml0eShpLCBqLCBrKSB7XG4gICAgICB2YXIgYXJyYXkgPSBbXG4gICAgICAgIGkgKyBjZW50ZXJbMF0sXG4gICAgICAgIGogKyBjZW50ZXJbMV0sXG4gICAgICAgIGsgKyBjZW50ZXJbMl1cbiAgICAgIF07XG4gICAgICB2YXIgbWF4ID0gLUluZmluaXR5O1xuICAgICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICAgIHZhciBmO1xuICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBhcnJheS5sZW5ndGg7IGQrKykge1xuICAgICAgICB2YXIgYSA9IE1hdGguYWJzKGFycmF5W2RdKTtcbiAgICAgICAgaWYgKGEgPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSBhO1xuICAgICAgICAgIGYgPSBkICogMiArIChhcnJheVtkXSA+IDAgPyAwIDogMSk7XG4gICAgICAgICAgaW5kZXhlcyA9IFtmXTtcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhhIC0gbWF4KSA8IDAuMDEpIHtcbiAgICAgICAgICBmID0gZCAqIDIgKyAoYXJyYXlbZF0gPiAwID8gMCA6IDEpO1xuICAgICAgICAgIGluZGV4ZXMucHVzaChmKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVN1cmZhY2UoKSB7XG4gICAgLy8gR2VuZXJhdGUgc3VyZmFjZVxuXG4gICAgdmFyIGNSYW5nZSA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdXJmYWNlTnVtOyBpKyspIHtcbiAgICAgIGNSYW5nZS5wdXNoKDAgKyBpLCBzaXplIC0gMSAtIGkpO1xuICAgIH1cblxuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgZCsrKSB7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIGNSYW5nZS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHNpemU7IGsrKykge1xuXG4gICAgICAgICAgICB2YXIgZGlzID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgIE1hdGguYWJzKGNvb3JkWzBdICsgY2VudGVyWzBdKSxcbiAgICAgICAgICAgICAgTWF0aC5hYnMoY29vcmRbMV0gKyBjZW50ZXJbMV0pLFxuICAgICAgICAgICAgICBNYXRoLmFicyhjb29yZFsyXSArIGNlbnRlclsyXSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHZhciBkaXNCaWFzID0gMSAtIChzaXplIC8gMiArIDAuNSAtIGRpcykgLyBzdXJmYWNlTnVtO1xuXG4gICAgICAgICAgICBjb29yZFtkXSA9IGM7XG4gICAgICAgICAgICBjb29yZFt1XSA9IGo7XG4gICAgICAgICAgICBjb29yZFt2XSA9IGs7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBbMCwgMCwgMF07XG4gICAgICAgICAgICB2YXIgb2Zmc2V0MiA9IFswLCAwLCAwXTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlID0gbm9pc2Vfc3VyZmFjZS5ub2lzZTNEKFxuICAgICAgICAgICAgICAoY29vcmRbMF0gKyBjZW50ZXJbMF0gKyBvZmZzZXRbMF0pICogbm9pc2VGX3N1cmZhY2UsXG4gICAgICAgICAgICAgIChjb29yZFsxXSArIGNlbnRlclsxXSArIG9mZnNldFsxXSkgKiBub2lzZUZfc3VyZmFjZSxcbiAgICAgICAgICAgICAgKGNvb3JkWzJdICsgY2VudGVyWzJdICsgb2Zmc2V0WzJdKSAqIG5vaXNlRl9zdXJmYWNlKTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlMiA9IG5vaXNlX3N1cmZhY2UyLm5vaXNlM0QoXG4gICAgICAgICAgICAgIChjb29yZFswXSArIGNlbnRlclswXSArIG9mZnNldDJbMF0pICogbm9pc2VGX3N1cmZhY2UyLFxuICAgICAgICAgICAgICAoY29vcmRbMV0gKyBjZW50ZXJbMV0gKyBvZmZzZXQyWzFdKSAqIG5vaXNlRl9zdXJmYWNlMixcbiAgICAgICAgICAgICAgKGNvb3JkWzJdICsgY2VudGVyWzJdICsgb2Zmc2V0MlsyXSkgKiBub2lzZUZfc3VyZmFjZTIpO1xuXG4gICAgICAgICAgICB2YWx1ZSA9XG4gICAgICAgICAgICAgIChNYXRoLnBvdyh2YWx1ZSAvIDEuNSwgMSkgKiBkaXNCaWFzICogMCkgK1xuICAgICAgICAgICAgICAoTWF0aC5wb3codmFsdWUyIC8gMS41LCAxKSAqIGRpc0JpYXMpICtcbiAgICAgICAgICAgICAgKC1NYXRoLnBvdyhkaXNCaWFzLCAxLjApICogMS4wICsgMC42KTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMC4wKSB7XG4gICAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICAgICAgZGF0YS5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgZ3JvdW5kLnNldChjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVRpbGVzKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIC8vIEdlbmVyYXRlIGdyYXNzZXNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzaXplOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGdyb3VuZC5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBncm91bmQuc2V0KGksIGosIGssIFtcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDApLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMSksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAyKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDMpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgNCksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCA1KVxuICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KHBvcywgZikge1xuICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKGYgLyAyKTsgLy8gMCAxIDJcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuXG4gICAgICB2YXIgZGQgPSAoZiAtIGQgKiAyKSA/IC0xIDogMTsgLy8gLTEgb3IgMVxuXG4gICAgICBjb29yZFtkXSA9IHBvc1tkXSArIGRkO1xuICAgICAgY29vcmRbdV0gPSBwb3NbdV07XG4gICAgICBjb29yZFt2XSA9IHBvc1t2XTtcblxuICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKHBvc1swXSwgcG9zWzFdLCBwb3NbMl0pO1xuICAgICAgdmFyIGJpb21lID0gZGF0YS5iaW9tZTtcblxuICAgICAgdmFyIGxldmVsID0gYmlvbWUubGV2ZWw7XG4gICAgICB2YXIgdmFsdWUgPSBiaW9tZS52YWx1ZTtcblxuICAgICAgaWYgKGxldmVsID09PSBMRVZFTF9TVVJGQUNFKSB7XG4gICAgICAgIGlmIChiaW9tZS5yZWxTZWFMZXZlbCA9PT0gMCkge1xuICAgICAgICAgIHZhciBkYXRhID0gZ2V0RGF0YShjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdKTtcbiAgICAgICAgICB2YXIgaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICAgICAgaWYgKGJpb21lLnZhbHVlMiAqIGhlaWdodCA8IC0wLjEpIHtcbiAgICAgICAgICAgIHZhciBhYm92ZSA9IGdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gICAgICAgICAgICB2YXIgaXNTdXJmYWNlID0gIWFib3ZlO1xuICAgICAgICAgICAgaWYgKGlzU3VyZmFjZSkge1xuICAgICAgICAgICAgICByZXR1cm4gU0FORDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPCAtMC44KSB7XG4gICAgICAgICAgcmV0dXJuIFNUT05FO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgICAgIHJldHVybiBTT0lMO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR1JBU1NcblxuICAgICAgICAvLyBubyBncmFzcyBiZWxvd1xuICAgICAgICAvLyBpZiAoYmlvbWUucmVsU2VhTGV2ZWwgPiAwKSB7XG4gICAgICAgIC8vICAgcmV0dXJuIFNPSUw7XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyBPbiBlZGdlXG4gICAgICAgIGlmIChwb3NbZF0gPT09IDAgfHwgcG9zW2RdID09PSBzaXplIC0gMSkge1xuICAgICAgICAgIHJldHVybiBHUkFTUztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhYm92ZSA9IGdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG5cbiAgICAgICAgdmFyIGlzU3VyZmFjZSA9ICFhYm92ZTtcblxuICAgICAgICByZXR1cm4gaXNTdXJmYWNlID8gR1JBU1MgOiBTT0lMO1xuXG4gICAgICB9IGVsc2UgaWYgKGxldmVsID09PSBMRVZFTF9NSURETEUpIHtcblxuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PT0gTEVWRUxfQ09SRSkge1xuXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBTVE9ORTtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldERhdGEoaSwgaiwgaykge1xuICAgIHZhciBoYXNoID0gW2ksIGosIGtdLmpvaW4oJywnKTtcbiAgICBpZiAoZGF0YU1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgICBkYXRhTWFwW2hhc2hdID0ge307XG4gICAgfVxuICAgIHJldHVybiBkYXRhTWFwW2hhc2hdO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ3JvdW5kOiBncm91bmQsXG4gICAgd2F0ZXI6IHdhdGVyLFxuICAgIGJvdW5kczogYm91bmRzLFxuICAgIG9iamVjdDogcGl2b3RcbiAgfTtcbn07XG4iLCJ2YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBrZXljb2RlID0gcmVxdWlyZSgna2V5Y29kZScpO1xuXG52YXIgYXBwID0ge307XG5cbi8vIFBvc3QgcHJvY2Vzc2luZyBzZXR0aW5nXG52YXIgcG9zdHByb2Nlc3NpbmcgPSB7IGVuYWJsZWQ6IHRydWUsIHJlbmRlck1vZGU6IDAgfTtcblxuLy8gUmVuZGVyZXIsIHNjZW5lLCBjYW1lcmFcbnZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgYW50aWFsaWFzOiB0cnVlXG59KTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweEJCRDlGNyk7XG4vLyByZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MjIyMjIyKTtcbnZhciBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xudmFyIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg2MCwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gIDAuMSwgMTAwMCk7XG52YXIgY2FtZXJhVXAsIGNhbWVyYURpciwgY2FtZXJhUmlnaHQ7XG5cbi8vIFBvc3QgcHJvY2Vzc2luZ1xudmFyIGRlcHRoTWF0ZXJpYWw7XG52YXIgZGVwdGhSZW5kZXJUYXJnZXQ7XG52YXIgc3Nhb1Bhc3M7XG52YXIgZWZmZWN0Q29tcG9zZXI7XG5cbi8vIFNpemVcbnZhciBzaXplID0gMzI7XG52YXIgZGlzU2NhbGUgPSAxMjtcblxuLy8gT2JqZWN0c1xudmFyIG9iamVjdDtcbnZhciBub0FvTGF5ZXI7XG5cbnZhciBlbnRpdGllcyA9IFtdO1xuXG4vLyBNYXRlcmlhbHMsIFRleHR1cmVzXG52YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTXVsdGlNYXRlcmlhbCgpO1xubWF0ZXJpYWwubWF0ZXJpYWxzID0gW251bGxdO1xudmFyIHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xudmFyIGJsb2NrVGV4dHVyZXMgPSBbXTtcbnZhciB0ZXh0dXJlcyA9IHt9O1xuXG4vLyBJbnB1dCBzdGF0ZXNcbnZhciBrZXlob2xkcyA9IHt9O1xudmFyIG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbnZhciByYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKCk7XG52YXIgcmF5Y2FzdGVyRGlyO1xuXG4vLyBmcmFtZSB0aW1lXG52YXIgZHQgPSAxIC8gNjA7XG5cbmZ1bmN0aW9uIGluaXRQb3N0cHJvY2Vzc2luZygpIHtcblxuICAvLyBTZXR1cCByZW5kZXIgcGFzc1xuICB2YXIgcmVuZGVyUGFzcyA9IG5ldyBUSFJFRS5SZW5kZXJQYXNzKHNjZW5lLCBjYW1lcmEpO1xuXG4gIC8vIFNldHVwIGRlcHRoIHBhc3NcbiAgZGVwdGhNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoRGVwdGhNYXRlcmlhbCgpO1xuICBkZXB0aE1hdGVyaWFsLmRlcHRoUGFja2luZyA9IFRIUkVFLlJHQkFEZXB0aFBhY2tpbmc7XG4gIGRlcHRoTWF0ZXJpYWwuYmxlbmRpbmcgPSBUSFJFRS5Ob0JsZW5kaW5nO1xuXG4gIHZhciBwYXJzID0geyBtaW5GaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciwgbWFnRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIgfTtcbiAgZGVwdGhSZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwgcGFycyk7XG5cbiAgLy8gU2V0dXAgU1NBTyBwYXNzXG4gIHNzYW9QYXNzID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuU1NBT1NoYWRlcik7XG4gIHNzYW9QYXNzLnJlbmRlclRvU2NyZWVuID0gdHJ1ZTtcbiAgLy9zc2FvUGFzcy51bmlmb3Jtc1sgXCJ0RGlmZnVzZVwiIF0udmFsdWUgd2lsbCBiZSBzZXQgYnkgU2hhZGVyUGFzc1xuICBzc2FvUGFzcy51bmlmb3Jtc1tcInREZXB0aFwiXS52YWx1ZSA9IGRlcHRoUmVuZGVyVGFyZ2V0LnRleHR1cmU7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydzaXplJ10udmFsdWUuc2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snY2FtZXJhTmVhciddLnZhbHVlID0gY2FtZXJhLm5lYXI7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydjYW1lcmFGYXInXS52YWx1ZSA9IGNhbWVyYS5mYXI7XG4gIHNzYW9QYXNzLnVuaWZvcm1zWydvbmx5QU8nXS52YWx1ZSA9IChwb3N0cHJvY2Vzc2luZy5yZW5kZXJNb2RlID09IDEpO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snYW9DbGFtcCddLnZhbHVlID0gMC4zO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snbHVtSW5mbHVlbmNlJ10udmFsdWUgPSAwLjU7XG5cbiAgLy8gQWRkIHBhc3MgdG8gZWZmZWN0IGNvbXBvc2VyXG4gIGVmZmVjdENvbXBvc2VyID0gbmV3IFRIUkVFLkVmZmVjdENvbXBvc2VyKHJlbmRlcmVyKTtcbiAgZWZmZWN0Q29tcG9zZXIuYWRkUGFzcyhyZW5kZXJQYXNzKTtcbiAgZWZmZWN0Q29tcG9zZXIuYWRkUGFzcyhzc2FvUGFzcyk7XG5cbn07XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgdmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgLy8gUmVzaXplIHJlbmRlclRhcmdldHNcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ3NpemUnXS52YWx1ZS5zZXQod2lkdGgsIGhlaWdodCk7XG5cbiAgdmFyIHBpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG4gIHZhciBuZXdXaWR0aCA9IE1hdGguZmxvb3Iod2lkdGggLyBwaXhlbFJhdGlvKSB8fCAxO1xuICB2YXIgbmV3SGVpZ2h0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyBwaXhlbFJhdGlvKSB8fCAxO1xuICBkZXB0aFJlbmRlclRhcmdldC5zZXRTaXplKG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xuICBlZmZlY3RDb21wb3Nlci5zZXRTaXplKG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xufTtcblxuZnVuY3Rpb24gaW5pdFNjZW5lKCkge1xuICB2YXIgZGlzID0gc2l6ZSAqIGRpc1NjYWxlO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IGRpcztcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSBkaXM7XG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gZGlzO1xuICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKCkpO1xuXG4gIGNhbWVyYVVwID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCk7XG4gIGNhbWVyYURpciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpLmFwcGx5RXVsZXIoY2FtZXJhLnJvdGF0aW9uKTtcbiAgY2FtZXJhUmlnaHQgPSBuZXcgVEhSRUUuVmVjdG9yMygpLmNyb3NzVmVjdG9ycyhjYW1lcmFVcCwgY2FtZXJhRGlyKTtcblxuICBvYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgb2JqZWN0LnNjYWxlLnNldCgxMCwgMTAsIDEwKTtcbiAgc2NlbmUuYWRkKG9iamVjdCk7XG4gIG5vQW9MYXllciA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBvYmplY3QuYWRkKG5vQW9MYXllcik7XG4gIHZhciBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ODg4ODg4KTtcbiAgdmFyIGRpcmVjdGlvbmFsTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC43KTtcbiAgZGlyZWN0aW9uYWxMaWdodC5wb3NpdGlvbi5zZXQoMC4zLCAxLjAsIDAuNSk7XG4gIG9iamVjdC5hZGQoYW1iaWVudExpZ2h0KTtcbiAgb2JqZWN0LmFkZChkaXJlY3Rpb25hbExpZ2h0KTtcbn07XG5cbmZ1bmN0aW9uIGxvYWRSZXNvdXJjZXMoKSB7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdncmFzcycsIDEpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnc29pbCcsIDIpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnc29pbDInLCAzKTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3N0b25lJywgNCk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzZWEnLCA1LCAwLjgpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnc2FuZCcsIDYpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnd2FsbCcsIDcpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnd2luZG93JywgOCk7XG5cbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2Nsb3VkJywgMTAsIDAuOCwgbnVsbCwgZnVuY3Rpb24obSkge1xuICAgIG0uZW1pc3NpdmUgPSBuZXcgVEhSRUUuQ29sb3IoMHg4ODg4ODgpO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGxvYWRCbG9ja01hdGVyaWFsKG5hbWUsIGluZGV4LCBhbHBoYSwgbWF0ZXJpYWxUeXBlLCB0cmFuc2Zvcm0pIHtcbiAgdmFyIHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ3RleHR1cmVzLycgKyBuYW1lICsgJy5wbmcnKTtcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XG4gIHRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgdGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICBibG9ja1RleHR1cmVzLnB1c2godGV4dHVyZSk7XG5cbiAgbWF0ZXJpYWxUeXBlID0gbWF0ZXJpYWxUeXBlIHx8IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWw7XG5cbiAgdmFyIG0gPSBuZXcgbWF0ZXJpYWxUeXBlKHtcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG5cbiAgaWYgKGFscGhhICE9PSB1bmRlZmluZWQpIHtcbiAgICBtLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICBtLm9wYWNpdHkgPSBhbHBoYTtcbiAgfVxuXG4gIGlmICh0cmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xuICAgIHRyYW5zZm9ybShtKTtcbiAgfVxuXG4gIG1hdGVyaWFsLm1hdGVyaWFsc1tpbmRleF0gPSBtO1xufTtcblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICBpZiAocG9zdHByb2Nlc3NpbmcuZW5hYmxlZCkge1xuICAgIG5vQW9MYXllci52aXNpYmxlID0gZmFsc2U7XG4gICAgLy8gUmVuZGVyIGRlcHRoIGludG8gZGVwdGhSZW5kZXJUYXJnZXRcbiAgICBzY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gZGVwdGhNYXRlcmlhbDtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSwgZGVwdGhSZW5kZXJUYXJnZXQsIHRydWUpO1xuXG4gICAgbm9Bb0xheWVyLnZpc2libGUgPSB0cnVlO1xuICAgIC8vIFJlbmRlciByZW5kZXJQYXNzIGFuZCBTU0FPIHNoYWRlclBhc3NcbiAgICBzY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gbnVsbDtcbiAgICBlZmZlY3RDb21wb3Nlci5yZW5kZXIoKTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIH1cblxuICB2YXIgcm90YXRlWSA9IDA7XG4gIGlmIChrZXlob2xkc1sncmlnaHQnXSkge1xuICAgIHJvdGF0ZVkgLT0gMC4xO1xuICB9IGVsc2UgaWYgKGtleWhvbGRzWydsZWZ0J10pIHtcbiAgICByb3RhdGVZICs9IDAuMTtcbiAgfVxuXG4gIHZhciBxdWF0SW52ZXJzZSA9IG9iamVjdC5xdWF0ZXJuaW9uLmNsb25lKCkuaW52ZXJzZSgpO1xuICB2YXIgYXhpcyA9IGNhbWVyYVVwLmNsb25lKCkuYXBwbHlRdWF0ZXJuaW9uKHF1YXRJbnZlcnNlKS5ub3JtYWxpemUoKTtcbiAgb2JqZWN0LnF1YXRlcm5pb25cbiAgICAubXVsdGlwbHkobmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tQXhpc0FuZ2xlKGF4aXMsIHJvdGF0ZVkpKTtcblxuICB2YXIgcm90YXRlWCA9IDA7XG4gIGlmIChrZXlob2xkc1sndXAnXSkge1xuICAgIHJvdGF0ZVggLT0gMC4xO1xuICB9IGVsc2UgaWYgKGtleWhvbGRzWydkb3duJ10pIHtcbiAgICByb3RhdGVYICs9IDAuMTtcbiAgfVxuXG4gIGF4aXMgPSBjYW1lcmFSaWdodC5jbG9uZSgpLmFwcGx5UXVhdGVybmlvbihxdWF0SW52ZXJzZSkubm9ybWFsaXplKCk7XG4gIG9iamVjdC5xdWF0ZXJuaW9uXG4gICAgLm11bHRpcGx5KG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZShheGlzLCByb3RhdGVYKSk7XG59O1xuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBlbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIGVudGl0eS50aWNrKGR0KTtcbiAgfSk7XG4gIHJlbmRlcigpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59O1xuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZS54ID0gKGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMTtcbiAgbW91c2UueSA9IC0oZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMTtcblxuICAvLyB1cGRhdGUgdGhlIHBpY2tpbmcgcmF5IHdpdGggdGhlIGNhbWVyYSBhbmQgbW91c2UgcG9zaXRpb24gIFxuICByYXljYXN0ZXIuc2V0RnJvbUNhbWVyYShtb3VzZSwgY2FtZXJhKTtcbiAgcmF5Y2FzdGVyRGlyID0gcmF5Y2FzdGVyLnJheS5kaXJlY3Rpb24uY2xvbmUoKTtcbn07XG5cbmZ1bmN0aW9uIG9uTW91c2VEb3duKGV2ZW50KSB7XG4gIC8vIGNhbGN1bGF0ZSBvYmplY3RzIGludGVyc2VjdGluZyB0aGUgcGlja2luZyByYXlcbiAgdmFyIGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0KHRlcnJpYW4ub2JqZWN0LCB0cnVlKTtcbiAgaWYgKGludGVyc2VjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHBvaW50ID0gaW50ZXJzZWN0c1swXS5wb2ludC5jbG9uZSgpXG4gICAgLmFkZChyYXljYXN0ZXJEaXIuY2xvbmUoKS5tdWx0aXBseVNjYWxhcigwLjAxKSk7XG5cbiAgdmFyIGxvY2FsUG9pbnQgPSB0ZXJyaWFuLm9iamVjdC53b3JsZFRvTG9jYWwocG9pbnQpO1xuICB2YXIgY29vcmQgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQueCksXG4gICAgTWF0aC5mbG9vcihsb2NhbFBvaW50LnkpLFxuICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC56KVxuICApO1xuXG4gIC8vIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA9PT0gMCkge1xuICAvLyAgIHJldHVybjtcbiAgLy8gfVxuXG4gIC8vIHZhciBwb2ludCA9IGludGVyc2VjdHNbMF0ucG9pbnQ7XG4gIC8vIHBvaW50LmFkZChyYXljYXN0ZXIucmF5LmRpcmVjdGlvbi5jbG9uZSgpLm5vcm1hbGl6ZSgpLm11bHRpcGx5U2NhbGFyKDAuMDEpKTtcbiAgLy8gcG9pbnQgPSBtZXNoLndvcmxkVG9Mb2NhbChwb2ludCk7XG5cbiAgLy8gdmFyIGNvb3JkID0gW1xuICAvLyAgIE1hdGguZmxvb3IocG9pbnQueCksXG4gIC8vICAgTWF0aC5mbG9vcihwb2ludC55KSxcbiAgLy8gICBNYXRoLmZsb29yKHBvaW50LnopXG4gIC8vIF07XG4gIC8vIHRlcnJpYW4uY2h1bmsuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIG51bGwpO1xuXG4gIC8vIG1lc2gucGFyZW50LnJlbW92ZShtZXNoKTtcbiAgLy8gZ2VvbWV0cnkuZGlzcG9zZSgpO1xuICAvLyBnZW9tZXRyeSA9IG1lc2hlcih0ZXJyaWFuLmNodW5rKTtcblxuICAvLyBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgLy8gb2JqZWN0LmFkZChtZXNoKTtcbiAgLy8gbWVzaC5wb3NpdGlvbi5jb3B5KGNlbnRlcik7XG59O1xuXG5mdW5jdGlvbiBvbk1vdXNlVXAoZXZlbnQpIHtcblxufTtcblxuZnVuY3Rpb24gb25LZXlEb3duKGUpIHtcbiAgdmFyIGtleSA9IGtleWNvZGUoZSk7XG4gIGtleWhvbGRzW2tleV0gPSB0cnVlO1xufTtcblxuZnVuY3Rpb24gb25LZXlVcChlKSB7XG4gIHZhciBrZXkgPSBrZXljb2RlKGUpO1xuICBrZXlob2xkc1trZXldID0gZmFsc2U7XG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xuXG5sb2FkUmVzb3VyY2VzKCk7XG5pbml0UG9zdHByb2Nlc3NpbmcoKTtcbmluaXRTY2VuZSgpO1xuXG4vLyBJbml0IGFwcFxuLy8gdmFyIGJ1aWxkaW5nID0gcmVxdWlyZSgnLi9lbnRpdGllcy9idWlsZGluZycpKG1hdGVyaWFsLCBub0FvTGF5ZXIsIGNhbWVyYSk7XG4vLyBlbnRpdGllcy5wdXNoKGJ1aWxkaW5nKTtcblxudmFyIGNsb3VkID0gcmVxdWlyZSgnLi9lbnRpdGllcy9jbG91ZCcpKG9iamVjdCwgbWF0ZXJpYWwpO1xuZW50aXRpZXMucHVzaChjbG91ZCk7XG5cbnZhciB0ZXJyaWFuID0gcmVxdWlyZSgnLi9lbnRpdGllcy90ZXJyaWFuJykoc2l6ZSwgb2JqZWN0LCBtYXRlcmlhbCk7XG5cbi8vIHZhciBDaHVua3MgPSByZXF1aXJlKCcuL3ZveGVsL2NodW5rcycpO1xuLy8gdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcbi8vIHZhciBsZW4gPSAzMjtcblxuLy8gdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoKTtcbi8vIG1hdGVyaWFsLm1hdGVyaWFscy5wdXNoKG51bGwsIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4vLyAgIGNvbG9yOiAweGZmZmZmZixcbi8vICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4vLyAgIG9wYWNpdHk6IDAuNVxuLy8gfSkpO1xuXG4vLyBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4vLyAgIGZvciAodmFyIGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbi8vICAgICBmb3IgKHZhciBrID0gMDsgayA8IGxlbjsgaysrKSB7XG4vLyAgICAgICBjaHVua3Muc2V0KGksIGosIGssIFsxLCAxLCAxLCAxLCAxLCAxXSk7XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XG5cbi8vIHZhciBtZXNoQ2h1bmtzID0gcmVxdWlyZSgnLi92b3hlbC9tZXNoY2h1bmtzJyk7XG4vLyB2YXIgdGVzdE9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuLy8gdGVzdE9iamVjdC5zY2FsZS5zZXQoNSwgNSwgNSk7XG4vLyBzY2VuZS5hZGQodGVzdE9iamVjdCk7XG4vLyBtZXNoQ2h1bmtzKGNodW5rcywgdGVzdE9iamVjdCwgbWF0ZXJpYWwpO1xuXG5hbmltYXRlKCk7XG4iLCJ2YXIgQ2h1bmsgPSBmdW5jdGlvbihzaGFwZSkge1xuICB0aGlzLnZvbHVtZSA9IFtdO1xuICB0aGlzLnNoYXBlID0gc2hhcGUgfHwgWzE2LCAxNiwgMTZdO1xuICB0aGlzLmRpbVggPSB0aGlzLnNoYXBlWzBdO1xuICB0aGlzLmRpbVhZID0gdGhpcy5zaGFwZVswXSAqIHRoaXMuc2hhcGVbMV07XG59O1xuXG5DaHVuay5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaSwgaiwgaykge1xuICByZXR1cm4gdGhpcy52b2x1bWVbaSAqIHRoaXMuZGltWFkgKyBqICogdGhpcy5kaW1YICsga107XG59O1xuXG5DaHVuay5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICB0aGlzLnZvbHVtZVtpICogdGhpcy5kaW1YWSArIGogKiB0aGlzLmRpbVggKyBrXSA9IHY7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENodW5rO1xuIiwidmFyIENodW5rID0gcmVxdWlyZSgnLi9jaHVuaycpO1xuXG52YXIgQ2h1bmtzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubWFwID0ge307XG4gIHRoaXMuY2h1bmtTaXplID0gMTY7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgdmFyIG9yaWdpbiA9IHRoaXMuZ2V0T3JpZ2luKGksIGosIGspO1xuICB2YXIgaGFzaCA9IG9yaWdpbi50b0FycmF5KCkuam9pbignLCcpO1xuICBpZiAodGhpcy5tYXBbaGFzaF0gPT0gbnVsbCkge1xuICAgIHRoaXMubWFwW2hhc2hdID0ge1xuICAgICAgY2h1bms6IG5ldyBDaHVuaygpLFxuICAgICAgb3JpZ2luOiBvcmlnaW5cbiAgICB9XG4gIH1cblxuICB0aGlzLm1hcFtoYXNoXS5kaXJ0eSA9IHRydWU7XG4gIHRoaXMubWFwW2hhc2hdLmNodW5rLnNldChpIC0gb3JpZ2luLngsIGogLSBvcmlnaW4ueSwgayAtIG9yaWdpbi56LCB2KTtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICB2YXIgb3JpZ2luID0gdGhpcy5nZXRPcmlnaW4oaSwgaiwgayk7XG4gIHZhciBoYXNoID0gb3JpZ2luLnRvQXJyYXkoKS5qb2luKCcsJyk7XG4gIGlmICh0aGlzLm1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIG9yaWdpbiA9IHRoaXMubWFwW2hhc2hdLm9yaWdpbjtcbiAgcmV0dXJuIHRoaXMubWFwW2hhc2hdLmNodW5rLmdldChpIC0gb3JpZ2luLngsIGogLSBvcmlnaW4ueSwgayAtIG9yaWdpbi56KTtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuZ2V0T3JpZ2luID0gZnVuY3Rpb24oaSwgaiwgaykge1xuICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgTWF0aC5mbG9vcihpIC8gdGhpcy5jaHVua1NpemUpLFxuICAgIE1hdGguZmxvb3IoaiAvIHRoaXMuY2h1bmtTaXplKSxcbiAgICBNYXRoLmZsb29yKGsgLyB0aGlzLmNodW5rU2l6ZSlcbiAgKS5tdWx0aXBseVNjYWxhcih0aGlzLmNodW5rU2l6ZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENodW5rcztcbiIsInZhciBHcmVlZHlNZXNoID0gKGZ1bmN0aW9uKCkge1xuICAvL0NhY2hlIGJ1ZmZlciBpbnRlcm5hbGx5XG4gIHZhciBtYXNrID0gbmV3IEludDMyQXJyYXkoNDA5Nik7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGYsIGRpbXMpIHtcbiAgICB2YXIgdmVydGljZXMgPSBbXSxcbiAgICAgIGZhY2VzID0gW10sXG4gICAgICB1dnMgPSBbXSxcbiAgICAgIGRpbXNYID0gZGltc1swXSxcbiAgICAgIGRpbXNZID0gZGltc1sxXSxcbiAgICAgIGRpbXNYWSA9IGRpbXNYICogZGltc1k7XG5cbiAgICAvL1N3ZWVwIG92ZXIgMy1heGVzXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCAzOyArK2QpIHtcbiAgICAgIHZhciBpLCBqLCBrLCBsLCB3LCBXLCBoLCBuLCBjLFxuICAgICAgICB1ID0gKGQgKyAxKSAlIDMsXG4gICAgICAgIHYgPSAoZCArIDIpICUgMyxcbiAgICAgICAgeCA9IFswLCAwLCAwXSxcbiAgICAgICAgcSA9IFswLCAwLCAwXSxcbiAgICAgICAgZHUgPSBbMCwgMCwgMF0sXG4gICAgICAgIGR2ID0gWzAsIDAsIDBdLFxuICAgICAgICBkaW1zRCA9IGRpbXNbZF0sXG4gICAgICAgIGRpbXNVID0gZGltc1t1XSxcbiAgICAgICAgZGltc1YgPSBkaW1zW3ZdLFxuICAgICAgICBxZGltc1gsIHFkaW1zWFksIHhkO1xuXG4gICAgICB2YXIgZmxpcCwgaW5kZXgsIHZhbHVlO1xuXG4gICAgICBpZiAobWFzay5sZW5ndGggPCBkaW1zVSAqIGRpbXNWKSB7XG4gICAgICAgIG1hc2sgPSBuZXcgSW50MzJBcnJheShkaW1zVSAqIGRpbXNWKTtcbiAgICAgIH1cblxuICAgICAgcVtkXSA9IDE7XG4gICAgICB4W2RdID0gLTE7XG5cbiAgICAgIHFkaW1zWCA9IGRpbXNYICogcVsxXVxuICAgICAgcWRpbXNYWSA9IGRpbXNYWSAqIHFbMl1cblxuICAgICAgLy8gQ29tcHV0ZSBtYXNrXG4gICAgICB3aGlsZSAoeFtkXSA8IGRpbXNEKSB7XG4gICAgICAgIHhkID0geFtkXVxuICAgICAgICBuID0gMDtcblxuICAgICAgICBmb3IgKHhbdl0gPSAwOyB4W3ZdIDwgZGltc1Y7ICsreFt2XSkge1xuICAgICAgICAgIGZvciAoeFt1XSA9IDA7IHhbdV0gPCBkaW1zVTsgKyt4W3VdLCArK24pIHtcbiAgICAgICAgICAgIHZhciBhID0geGQgPj0gMCAmJiBmKHhbMF0sIHhbMV0sIHhbMl0pLFxuICAgICAgICAgICAgICBiID0geGQgPCBkaW1zRCAtIDEgJiYgZih4WzBdICsgcVswXSwgeFsxXSArIHFbMV0sIHhbMl0gKyBxWzJdKVxuICAgICAgICAgICAgaWYgKGEgPyBiIDogIWIpIHtcbiAgICAgICAgICAgICAgbWFza1tuXSA9IDA7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmbGlwID0gIWE7XG5cbiAgICAgICAgICAgIGluZGV4ID0gZCAqIDI7XG4gICAgICAgICAgICBpZiAoZmxpcCkge1xuICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZSA9IChhIHx8IGIpW2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKGZsaXApIHtcbiAgICAgICAgICAgICAgdmFsdWUgKj0gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hc2tbbl0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICArK3hbZF07XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgbWVzaCBmb3IgbWFzayB1c2luZyBsZXhpY29ncmFwaGljIG9yZGVyaW5nXG4gICAgICAgIG4gPSAwO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgZGltc1Y7ICsraikge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBkaW1zVTspIHtcbiAgICAgICAgICAgIGMgPSBtYXNrW25dO1xuICAgICAgICAgICAgaWYgKCFjKSB7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Db21wdXRlIHdpZHRoXG4gICAgICAgICAgICB3ID0gMTtcbiAgICAgICAgICAgIHdoaWxlIChjID09PSBtYXNrW24gKyB3XSAmJiBpICsgdyA8IGRpbXNVKSB3Kys7XG5cbiAgICAgICAgICAgIC8vQ29tcHV0ZSBoZWlnaHQgKHRoaXMgaXMgc2xpZ2h0bHkgYXdrd2FyZClcbiAgICAgICAgICAgIGZvciAoaCA9IDE7IGogKyBoIDwgZGltc1Y7ICsraCkge1xuICAgICAgICAgICAgICBrID0gMDtcbiAgICAgICAgICAgICAgd2hpbGUgKGsgPCB3ICYmIGMgPT09IG1hc2tbbiArIGsgKyBoICogZGltc1VdKSBrKytcbiAgICAgICAgICAgICAgICBpZiAoayA8IHcpIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgcXVhZFxuICAgICAgICAgICAgLy8gVGhlIGR1L2R2IGFycmF5cyBhcmUgcmV1c2VkL3Jlc2V0XG4gICAgICAgICAgICAvLyBmb3IgZWFjaCBpdGVyYXRpb24uXG4gICAgICAgICAgICBkdVtkXSA9IDA7XG4gICAgICAgICAgICBkdltkXSA9IDA7XG4gICAgICAgICAgICB4W3VdID0gaTtcbiAgICAgICAgICAgIHhbdl0gPSBqO1xuXG4gICAgICAgICAgICBpZiAoYyA+IDApIHtcbiAgICAgICAgICAgICAgZHZbdl0gPSBoO1xuICAgICAgICAgICAgICBkdlt1XSA9IDA7XG4gICAgICAgICAgICAgIGR1W3VdID0gdztcbiAgICAgICAgICAgICAgZHVbdl0gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYyA9IC1jO1xuICAgICAgICAgICAgICBkdVt2XSA9IGg7XG4gICAgICAgICAgICAgIGR1W3VdID0gMDtcbiAgICAgICAgICAgICAgZHZbdV0gPSB3O1xuICAgICAgICAgICAgICBkdlt2XSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmVydGV4X2NvdW50ID0gdmVydGljZXMubGVuZ3RoO1xuICAgICAgICAgICAgdmVydGljZXMucHVzaChbeFswXSwgeFsxXSwgeFsyXV0pO1xuICAgICAgICAgICAgdmVydGljZXMucHVzaChbeFswXSArIGR1WzBdLCB4WzFdICsgZHVbMV0sIHhbMl0gKyBkdVsyXV0pO1xuICAgICAgICAgICAgdmVydGljZXMucHVzaChbeFswXSArIGR1WzBdICsgZHZbMF0sIHhbMV0gKyBkdVsxXSArIGR2WzFdLCB4WzJdICsgZHVbMl0gKyBkdlsyXV0pO1xuICAgICAgICAgICAgdmVydGljZXMucHVzaChbeFswXSArIGR2WzBdLCB4WzFdICsgZHZbMV0sIHhbMl0gKyBkdlsyXV0pO1xuICAgICAgICAgICAgdXZzLnB1c2goXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBbMCwgMF0sXG4gICAgICAgICAgICAgICAgW2R1W3VdLCBkdVt2XV0sXG4gICAgICAgICAgICAgICAgW2R1W3VdICsgZHZbdV0sIGR1W3ZdICsgZHZbdl1dLFxuICAgICAgICAgICAgICAgIFtkdlt1XSwgZHZbdl1dXG4gICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBmYWNlcy5wdXNoKFt2ZXJ0ZXhfY291bnQsIHZlcnRleF9jb3VudCArIDEsIHZlcnRleF9jb3VudCArIDIsIHZlcnRleF9jb3VudCArIDMsIGNdKTtcblxuICAgICAgICAgICAgLy9aZXJvLW91dCBtYXNrXG4gICAgICAgICAgICBXID0gbiArIHc7XG4gICAgICAgICAgICBmb3IgKGwgPSAwOyBsIDwgaDsgKytsKSB7XG4gICAgICAgICAgICAgIGZvciAoayA9IG47IGsgPCBXOyArK2spIHtcbiAgICAgICAgICAgICAgICBtYXNrW2sgKyBsICogZGltc1VdID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0luY3JlbWVudCBjb3VudGVycyBhbmQgY29udGludWVcbiAgICAgICAgICAgIGkgKz0gdztcbiAgICAgICAgICAgIG4gKz0gdztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgdmVydGljZXM6IHZlcnRpY2VzLCBmYWNlczogZmFjZXMsIHV2czogdXZzIH07XG4gIH1cbn0pKCk7XG5cbmlmIChleHBvcnRzKSB7XG4gIGV4cG9ydHMubWVzaGVyID0gR3JlZWR5TWVzaDtcbn1cbiIsInZhciBtZXNoZXIgPSByZXF1aXJlKCcuL21lc2hlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNodW5rcywgcGFyZW50LCBtYXRlcmlhbCkge1xuICBmb3IgKHZhciBpZCBpbiBjaHVua3MubWFwKSB7XG4gICAgdmFyIGNodW5rID0gY2h1bmtzLm1hcFtpZF07XG4gICAgdmFyIGRhdGEgPSBjaHVuay5jaHVuaztcbiAgICBpZiAoY2h1bmsuZGlydHkpIHtcblxuICAgICAgaWYgKGNodW5rLm1lc2ggIT0gbnVsbCkge1xuICAgICAgICBjaHVuay5tZXNoLnBhcmVudC5yZW1vdmUoY2h1bmsubWVzaCk7XG4gICAgICAgIGNodW5rLm1lc2guZ2VvbWV0cnkuZGlzcG9zZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3JpZ2luID0gY2h1bmsub3JpZ2luO1xuXG4gICAgICB2YXIgZ2VvbWV0cnkgPSBtZXNoZXIoY2h1bmsuY2h1bmspO1xuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgbWVzaC5wb3NpdGlvbi5jb3B5KGNodW5rLm9yaWdpbik7XG4gICAgICBwYXJlbnQuYWRkKG1lc2gpO1xuXG4gICAgICBjaHVuay5kaXJ0eSA9IGZhbHNlO1xuICAgICAgY2h1bmsubWVzaCA9IG1lc2g7XG4gICAgfVxuICB9XG59XG4iLCJ2YXIgZ3JlZWR5TWVzaGVyID0gcmVxdWlyZSgnLi9ncmVlZHknKS5tZXNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2h1bmssIGYpIHtcbiAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cbiAgZiA9IGYgfHwgZnVuY3Rpb24oaSwgaiwgaykge1xuICAgIHJldHVybiBjaHVuay5nZXQoaSwgaiwgayk7XG4gIH07XG4gIHZhciByZXN1bHQgPSBncmVlZHlNZXNoZXIoZiwgY2h1bmsuc2hhcGUpO1xuXG4gIHJlc3VsdC52ZXJ0aWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgdmVydGljZSA9IG5ldyBUSFJFRS5WZWN0b3IzKHZbMF0sIHZbMV0sIHZbMl0pO1xuICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2godmVydGljZSk7XG4gIH0pO1xuXG4gIHJlc3VsdC5mYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgZmFjZSA9IG5ldyBUSFJFRS5GYWNlMyhmWzBdLCBmWzFdLCBmWzJdKTtcbiAgICBmYWNlLm1hdGVyaWFsSW5kZXggPSBmWzRdO1xuICAgIGdlb21ldHJ5LmZhY2VzLnB1c2goZmFjZSk7XG5cbiAgICBmYWNlID0gbmV3IFRIUkVFLkZhY2UzKGZbMl0sIGZbM10sIGZbMF0pO1xuICAgIGZhY2UubWF0ZXJpYWxJbmRleCA9IGZbNF07XG4gICAgZ2VvbWV0cnkuZmFjZXMucHVzaChmYWNlKTtcbiAgfSk7XG5cbiAgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1swXSA9IFtdO1xuICByZXN1bHQudXZzLmZvckVhY2goZnVuY3Rpb24odXYpIHtcbiAgICBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWzBdLnB1c2goW1xuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMF0pLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMV0pLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMl0pXG4gICAgXSwgW1xuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMl0pLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbM10pLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjIoKS5mcm9tQXJyYXkodXZbMF0pXG4gICAgXSk7XG4gIH0pO1xuXG4gIGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xuXG4gIHJldHVybiBnZW9tZXRyeTtcbn07XG4iXX0=
