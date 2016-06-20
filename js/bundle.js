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
module.exports = function(texture, parent, camera) {
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  var position = new THREE.Vector3(0, 17, 0);

  var geometry = new THREE.PlaneGeometry(4, 4);
  var object = new THREE.Mesh(geometry, material);

  object.position.copy(position);
  parent.add(object);

  function tick(dt) {
    // billboard

    var up = new THREE.Vector3(0, 1, 0);
    var cameraPosition = parent.worldToLocal(camera.position.clone());
    var cameraDir = new THREE.Vector3().subVectors(object.position, cameraPosition);
    var right = new THREE.Vector3().crossVectors(cameraDir, up);
    var realUp = new THREE.Vector3().crossVectors(right, cameraDir);
    object.up = realUp;
    object.lookAt(cameraPosition);
  };

  return {
    tick: tick
  };
};

},{}],5:[function(require,module,exports){
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
  var cooldown = 1.2;

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
            // if (absI > absJ) {
            //   if (relI >= 0) {

            //   } else {
            //     data.nextCoord = data.neighbours[3];
            //   }
            // } else {
            //   if (relJ > 0) {
            //     data.nextCoord = data.neighbours[1];
            //   } else {
            //     data.nextCoord = data.neighbours[0];
            //   }
            // }
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

},{"../dir":3,"../voxel/chunks":9,"../voxel/meshchunks":11,"../voxel/mesher":12,"simplex-noise":2}],6:[function(require,module,exports){
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
  var noise_surface2 = new SimplexNoise(Math.random);
  var noise_biomes = new SimplexNoise(Math.random);
  var noise_biomes2 = new SimplexNoise(Math.random);
  var noise_biomes3 = new SimplexNoise(Math.random);
  var noiseF_surface = 0.1;
  var noiseF_surface2 = 0.04;
  var noiseF_surface3 = 0.05;

  var num = size;
  var ground = new Chunks();
  var water = new Chunks();
  var bounds = {
    min: new THREE.Vector3(0, 0, 0),
    size: new THREE.Vector3(num, num, num)
  };

  var center = [-num / 2 + 0.5, -num / 2 + 0.5, -num / 2 + 0.5];
  var centerCoord = [
    Math.floor(num / 2),
    Math.floor(num / 2),
    Math.floor(num / 2)
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
    for (var i = 0; i < num; i++) {
      for (var j = 0; j < num; j++) {
        for (var k = 0; k < num; k++) {
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
      [seaLevel, num - seaLevel - 1].forEach(function(c) {
        for (var i = seaLevel; i < num - seaLevel; i++) {
          for (var j = seaLevel; j < num - seaLevel; j++) {
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
    for (var i = 0; i < num; i++) {
      for (var j = 0; j < num; j++) {
        for (var k = 0; k < num; k++) {
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
    for (var i = 0; i < num; i++) {
      for (var j = 0; j < num; j++) {
        for (var k = 0; k < num; k++) {
          var v = ground.get(i, j, k);
          if (!v) {
            continue;
          }

          var d = Math.max(
            Math.abs(i + center[0]),
            Math.abs(j + center[1]),
            Math.abs(k + center[2]));

          var isSeaLevel = false;
          if ((num / 2 - d - seaLevel - 0.5) === 0) {
            isSeaLevel = true;
          }

          d /= (num / 2);

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
            isSeaLevel: isSeaLevel
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
    for (var i = 0; i < num; i++) {
      for (var j = 0; j < num; j++) {
        for (var k = 0; k < num; k++) {
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
      cRange.push(0 + i, num - 1 - i);
    }

    var coord = [];
    for (var d = 0; d < 3; d++) {
      var u = (d + 1) % 3;
      var v = (d + 2) % 3;
      cRange.forEach(function(c) {
        for (var j = 0; j < num; j++) {
          for (var k = 0; k < num; k++) {

            var dis = Math.max(
              Math.abs(coord[0] + center[0]),
              Math.abs(coord[1] + center[1]),
              Math.abs(coord[2] + center[2])
            );

            var disBias = 1 - (num / 2 + 0.5 - dis) / surfaceNum;

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
    for (var i = 0; i < num; i++) {
      for (var j = 0; j < num; j++) {
        for (var k = 0; k < num; k++) {
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
        if (biome.isSeaLevel) {
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

        // On edge
        if (pos[d] === 0 || pos[d] === num - 1) {
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

},{"../voxel/chunks":9,"../voxel/meshchunks":11,"simplex-noise":2}],7:[function(require,module,exports){
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
  textures['building'] = textureLoader.load('textures/building.png');

  loadBlockMaterial('grass', 1);
  loadBlockMaterial('soil', 2);
  loadBlockMaterial('soil2', 3);
  loadBlockMaterial('stone', 4);
  loadBlockMaterial('sea', 5, 0.8);
  loadBlockMaterial('sand', 6);
  loadBlockMaterial('cloud', 10, 0.7, null, function(m) {
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

  console.log(terrian.ground.getAt(coord));


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
var building = require('./entities/building')(textures['building'], noAoLayer, camera);
entities.push(building);

var cloud = require('./entities/cloud')(noAoLayer, material);
entities.push(cloud);

var terrian = require('./entities/terrian')(size, object, material);

animate();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./entities/building":4,"./entities/cloud":5,"./entities/terrian":6,"keycode":1}],8:[function(require,module,exports){
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

Chunks.prototype.setAt = function(coord, v) {
  this.set(coord.x, coord.y, coord.z, v);
};

Chunks.prototype.setDirty = function(i, j, k) {
  var origin = this.getOrigin(i, j, k);
  var hash = origin.toArray().join(',');
  if (this.map[hash] == null) {
    return;
  }
  this.map[hash].dirty = true;
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

Chunks.prototype.getAt = function(coord) {
  return this.get(coord.x, coord.y, coord.z);
};

Chunks.prototype.getOrigin = function(i, j, k) {
  return new THREE.Vector3(
    Math.floor(i / this.chunkSize),
    Math.floor(j / this.chunkSize),
    Math.floor(k / this.chunkSize)
  ).multiplyScalar(this.chunkSize);
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

      var geometry = mesher(chunk.chunk, function(i, j, k) {
          return data.get(i, j, k);
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(chunk.origin);
      parent.add(mesh);

      chunk.dirty = false;
      chunk.mesh = mesh;
    }
  }
}

},{"./mesher":12}],12:[function(require,module,exports){
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
      uv[0],
      uv[1],
      uv[2]
    ], [
      uv[2],
      uv[3],
      uv[0]
    ]);
  });

  geometry.computeFaceNormals();

  return geometry;
};

},{"./greedy":10}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva2V5Y29kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGV4LW5vaXNlL3NpbXBsZXgtbm9pc2UuanMiLCJzcmMvZGlyLmpzIiwic3JjL2VudGl0aWVzL2J1aWxkaW5nLmpzIiwic3JjL2VudGl0aWVzL2Nsb3VkLmpzIiwic3JjL2VudGl0aWVzL3RlcnJpYW4uanMiLCJzcmMvbWFpbi5qcyIsInNyYy92b3hlbC9jaHVuay5qcyIsInNyYy92b3hlbC9jaHVua3MuanMiLCJzcmMvdm94ZWwvZ3JlZWR5LmpzIiwic3JjL3ZveGVsL21lc2hjaHVua3MuanMiLCJzcmMvdm94ZWwvbWVzaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3hiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBTb3VyY2U6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvdld4OFYvXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MDMxOTUvZnVsbC1saXN0LW9mLWphdmFzY3JpcHQta2V5Y29kZXNcblxuLyoqXG4gKiBDb25lbmllbmNlIG1ldGhvZCByZXR1cm5zIGNvcnJlc3BvbmRpbmcgdmFsdWUgZm9yIGdpdmVuIGtleU5hbWUgb3Iga2V5Q29kZS5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBrZXlDb2RlIHtOdW1iZXJ9IG9yIGtleU5hbWUge1N0cmluZ31cbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWFyY2hJbnB1dCkge1xuICAvLyBLZXlib2FyZCBFdmVudHNcbiAgaWYgKHNlYXJjaElucHV0ICYmICdvYmplY3QnID09PSB0eXBlb2Ygc2VhcmNoSW5wdXQpIHtcbiAgICB2YXIgaGFzS2V5Q29kZSA9IHNlYXJjaElucHV0LndoaWNoIHx8IHNlYXJjaElucHV0LmtleUNvZGUgfHwgc2VhcmNoSW5wdXQuY2hhckNvZGVcbiAgICBpZiAoaGFzS2V5Q29kZSkgc2VhcmNoSW5wdXQgPSBoYXNLZXlDb2RlXG4gIH1cblxuICAvLyBOdW1iZXJzXG4gIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHNlYXJjaElucHV0KSByZXR1cm4gbmFtZXNbc2VhcmNoSW5wdXRdXG5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIChjYXN0IHRvIHN0cmluZylcbiAgdmFyIHNlYXJjaCA9IFN0cmluZyhzZWFyY2hJbnB1dClcblxuICAvLyBjaGVjayBjb2Rlc1xuICB2YXIgZm91bmROYW1lZEtleSA9IGNvZGVzW3NlYXJjaC50b0xvd2VyQ2FzZSgpXVxuICBpZiAoZm91bmROYW1lZEtleSkgcmV0dXJuIGZvdW5kTmFtZWRLZXlcblxuICAvLyBjaGVjayBhbGlhc2VzXG4gIHZhciBmb3VuZE5hbWVkS2V5ID0gYWxpYXNlc1tzZWFyY2gudG9Mb3dlckNhc2UoKV1cbiAgaWYgKGZvdW5kTmFtZWRLZXkpIHJldHVybiBmb3VuZE5hbWVkS2V5XG5cbiAgLy8gd2VpcmQgY2hhcmFjdGVyP1xuICBpZiAoc2VhcmNoLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHNlYXJjaC5jaGFyQ29kZUF0KDApXG5cbiAgcmV0dXJuIHVuZGVmaW5lZFxufVxuXG4vKipcbiAqIEdldCBieSBuYW1lXG4gKlxuICogICBleHBvcnRzLmNvZGVbJ2VudGVyJ10gLy8gPT4gMTNcbiAqL1xuXG52YXIgY29kZXMgPSBleHBvcnRzLmNvZGUgPSBleHBvcnRzLmNvZGVzID0ge1xuICAnYmFja3NwYWNlJzogOCxcbiAgJ3RhYic6IDksXG4gICdlbnRlcic6IDEzLFxuICAnc2hpZnQnOiAxNixcbiAgJ2N0cmwnOiAxNyxcbiAgJ2FsdCc6IDE4LFxuICAncGF1c2UvYnJlYWsnOiAxOSxcbiAgJ2NhcHMgbG9jayc6IDIwLFxuICAnZXNjJzogMjcsXG4gICdzcGFjZSc6IDMyLFxuICAncGFnZSB1cCc6IDMzLFxuICAncGFnZSBkb3duJzogMzQsXG4gICdlbmQnOiAzNSxcbiAgJ2hvbWUnOiAzNixcbiAgJ2xlZnQnOiAzNyxcbiAgJ3VwJzogMzgsXG4gICdyaWdodCc6IDM5LFxuICAnZG93bic6IDQwLFxuICAnaW5zZXJ0JzogNDUsXG4gICdkZWxldGUnOiA0NixcbiAgJ2NvbW1hbmQnOiA5MSxcbiAgJ2xlZnQgY29tbWFuZCc6IDkxLFxuICAncmlnaHQgY29tbWFuZCc6IDkzLFxuICAnbnVtcGFkIConOiAxMDYsXG4gICdudW1wYWQgKyc6IDEwNyxcbiAgJ251bXBhZCAtJzogMTA5LFxuICAnbnVtcGFkIC4nOiAxMTAsXG4gICdudW1wYWQgLyc6IDExMSxcbiAgJ251bSBsb2NrJzogMTQ0LFxuICAnc2Nyb2xsIGxvY2snOiAxNDUsXG4gICdteSBjb21wdXRlcic6IDE4MixcbiAgJ215IGNhbGN1bGF0b3InOiAxODMsXG4gICc7JzogMTg2LFxuICAnPSc6IDE4NyxcbiAgJywnOiAxODgsXG4gICctJzogMTg5LFxuICAnLic6IDE5MCxcbiAgJy8nOiAxOTEsXG4gICdgJzogMTkyLFxuICAnWyc6IDIxOSxcbiAgJ1xcXFwnOiAyMjAsXG4gICddJzogMjIxLFxuICBcIidcIjogMjIyXG59XG5cbi8vIEhlbHBlciBhbGlhc2VzXG5cbnZhciBhbGlhc2VzID0gZXhwb3J0cy5hbGlhc2VzID0ge1xuICAnd2luZG93cyc6IDkxLFxuICAn4oenJzogMTYsXG4gICfijKUnOiAxOCxcbiAgJ+KMgyc6IDE3LFxuICAn4oyYJzogOTEsXG4gICdjdGwnOiAxNyxcbiAgJ2NvbnRyb2wnOiAxNyxcbiAgJ29wdGlvbic6IDE4LFxuICAncGF1c2UnOiAxOSxcbiAgJ2JyZWFrJzogMTksXG4gICdjYXBzJzogMjAsXG4gICdyZXR1cm4nOiAxMyxcbiAgJ2VzY2FwZSc6IDI3LFxuICAnc3BjJzogMzIsXG4gICdwZ3VwJzogMzMsXG4gICdwZ2RuJzogMzQsXG4gICdpbnMnOiA0NSxcbiAgJ2RlbCc6IDQ2LFxuICAnY21kJzogOTFcbn1cblxuXG4vKiFcbiAqIFByb2dyYW1hdGljYWxseSBhZGQgdGhlIGZvbGxvd2luZ1xuICovXG5cbi8vIGxvd2VyIGNhc2UgY2hhcnNcbmZvciAoaSA9IDk3OyBpIDwgMTIzOyBpKyspIGNvZGVzW1N0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaSAtIDMyXG5cbi8vIG51bWJlcnNcbmZvciAodmFyIGkgPSA0ODsgaSA8IDU4OyBpKyspIGNvZGVzW2kgLSA0OF0gPSBpXG5cbi8vIGZ1bmN0aW9uIGtleXNcbmZvciAoaSA9IDE7IGkgPCAxMzsgaSsrKSBjb2Rlc1snZicraV0gPSBpICsgMTExXG5cbi8vIG51bXBhZCBrZXlzXG5mb3IgKGkgPSAwOyBpIDwgMTA7IGkrKykgY29kZXNbJ251bXBhZCAnK2ldID0gaSArIDk2XG5cbi8qKlxuICogR2V0IGJ5IGNvZGVcbiAqXG4gKiAgIGV4cG9ydHMubmFtZVsxM10gLy8gPT4gJ0VudGVyJ1xuICovXG5cbnZhciBuYW1lcyA9IGV4cG9ydHMubmFtZXMgPSBleHBvcnRzLnRpdGxlID0ge30gLy8gdGl0bGUgZm9yIGJhY2t3YXJkIGNvbXBhdFxuXG4vLyBDcmVhdGUgcmV2ZXJzZSBtYXBwaW5nXG5mb3IgKGkgaW4gY29kZXMpIG5hbWVzW2NvZGVzW2ldXSA9IGlcblxuLy8gQWRkIGFsaWFzZXNcbmZvciAodmFyIGFsaWFzIGluIGFsaWFzZXMpIHtcbiAgY29kZXNbYWxpYXNdID0gYWxpYXNlc1thbGlhc11cbn1cbiIsIi8qXG4gKiBBIGZhc3QgamF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBzaW1wbGV4IG5vaXNlIGJ5IEpvbmFzIFdhZ25lclxuICpcbiAqIEJhc2VkIG9uIGEgc3BlZWQtaW1wcm92ZWQgc2ltcGxleCBub2lzZSBhbGdvcml0aG0gZm9yIDJELCAzRCBhbmQgNEQgaW4gSmF2YS5cbiAqIFdoaWNoIGlzIGJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cbiAqIFdpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXG4gKiBCZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxuICpcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgSm9uYXMgV2FnbmVyXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG4gKiBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbiAqIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuICogZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuICogV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG4oZnVuY3Rpb24gKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGMiA9IDAuNSAqIChNYXRoLnNxcnQoMy4wKSAtIDEuMCksXG4gICAgRzIgPSAoMy4wIC0gTWF0aC5zcXJ0KDMuMCkpIC8gNi4wLFxuICAgIEYzID0gMS4wIC8gMy4wLFxuICAgIEczID0gMS4wIC8gNi4wLFxuICAgIEY0ID0gKE1hdGguc3FydCg1LjApIC0gMS4wKSAvIDQuMCxcbiAgICBHNCA9ICg1LjAgLSBNYXRoLnNxcnQoNS4wKSkgLyAyMC4wO1xuXG5cbmZ1bmN0aW9uIFNpbXBsZXhOb2lzZShyYW5kb20pIHtcbiAgICBpZiAoIXJhbmRvbSkgcmFuZG9tID0gTWF0aC5yYW5kb207XG4gICAgdGhpcy5wID0gbmV3IFVpbnQ4QXJyYXkoMjU2KTtcbiAgICB0aGlzLnBlcm0gPSBuZXcgVWludDhBcnJheSg1MTIpO1xuICAgIHRoaXMucGVybU1vZDEyID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAgIHRoaXMucFtpXSA9IHJhbmRvbSgpICogMjU2O1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICAgICAgdGhpcy5wZXJtW2ldID0gdGhpcy5wW2kgJiAyNTVdO1xuICAgICAgICB0aGlzLnBlcm1Nb2QxMltpXSA9IHRoaXMucGVybVtpXSAlIDEyO1xuICAgIH1cblxufVxuU2ltcGxleE5vaXNlLnByb3RvdHlwZSA9IHtcbiAgICBncmFkMzogbmV3IEZsb2F0MzJBcnJheShbMSwgMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgLSAxLCAwLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAtIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMCwgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDAsIDEsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgMSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIC0gMSwgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgLSAxLCAtIDFdKSxcbiAgICBncmFkNDogbmV3IEZsb2F0MzJBcnJheShbMCwgMSwgMSwgMSwgMCwgMSwgMSwgLSAxLCAwLCAxLCAtIDEsIDEsIDAsIDEsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIC0gMSwgMSwgMSwgMCwgLSAxLCAxLCAtIDEsIDAsIC0gMSwgLSAxLCAxLCAwLCAtIDEsIC0gMSwgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIDAsIDEsIDEsIDEsIDAsIDEsIC0gMSwgMSwgMCwgLSAxLCAxLCAxLCAwLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIDEsIDAsIDEsIDEsIC0gMSwgMCwgMSwgLSAxLCAtIDEsIDAsIC0gMSwgMSwgLSAxLCAwLCAtIDEsIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLCAxLCAwLCAxLCAxLCAxLCAwLCAtIDEsIDEsIC0gMSwgMCwgMSwgMSwgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAxLCAxLCAwLCAxLCAtIDEsIDEsIDAsIC0gMSwgLSAxLCAtIDEsIDAsIDEsIC0gMSwgLSAxLCAwLCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgMSwgMSwgMCwgMSwgMSwgLSAxLCAwLCAxLCAtIDEsIDEsIDAsIDEsIC0gMSwgLSAxLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gMSwgMSwgMSwgMCwgLSAxLCAxLCAtIDEsIDAsIC0gMSwgLSAxLCAxLCAwLCAtIDEsIC0gMSwgLSAxLCAwXSksXG4gICAgbm9pc2UyRDogZnVuY3Rpb24gKHhpbiwgeWluKSB7XG4gICAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMixcbiAgICAgICAgICAgIHBlcm0gPSB0aGlzLnBlcm0sXG4gICAgICAgICAgICBncmFkMyA9IHRoaXMuZ3JhZDM7XG4gICAgICAgIHZhciBuMD0wLCBuMT0wLCBuMj0wOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4aW4gKyB5aW4pICogRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XG4gICAgICAgIHZhciB0ID0gKGkgKyBqKSAqIEcyO1xuICAgICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkpIHNwYWNlXG4gICAgICAgIHZhciBZMCA9IGogLSB0O1xuICAgICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgdmFyIHkwID0geWluIC0gWTA7XG4gICAgICAgIC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgdmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuICAgICAgICBpZiAoeDAgPiB5MCkge1xuICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICB9IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgfSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcbiAgICAgICAgLy8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXG4gICAgICAgIC8vIGMgPSAoMy1zcXJ0KDMpKS82XG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkxID0geTAgLSBqMSArIEcyO1xuICAgICAgICB2YXIgeDIgPSB4MCAtIDEuMCArIDIuMCAqIEcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSAxLjAgKyAyLjAgKiBHMjtcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgdmFyIGlpID0gaSAmIDI1NTtcbiAgICAgICAgdmFyIGpqID0gaiAmIDI1NTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjUgLSB4MCAqIHgwIC0geTAgKiB5MDtcbiAgICAgICAgaWYgKHQwID49IDApIHtcbiAgICAgICAgICAgIHZhciBnaTAgPSBwZXJtTW9kMTJbaWkgKyBwZXJtW2pqXV0gKiAzO1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCk7IC8vICh4LHkpIG9mIGdyYWQzIHVzZWQgZm9yIDJEIGdyYWRpZW50XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC41IC0geDEgKiB4MSAtIHkxICogeTE7XG4gICAgICAgIGlmICh0MSA+PSAwKSB7XG4gICAgICAgICAgICB2YXIgZ2kxID0gcGVybU1vZDEyW2lpICsgaTEgKyBwZXJtW2pqICsgajFdXSAqIDM7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkM1tnaTFdICogeDEgKyBncmFkM1tnaTEgKyAxXSAqIHkxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjUgLSB4MiAqIHgyIC0geTIgKiB5MjtcbiAgICAgICAgaWYgKHQyID49IDApIHtcbiAgICAgICAgICAgIHZhciBnaTIgPSBwZXJtTW9kMTJbaWkgKyAxICsgcGVybVtqaiArIDFdXSAqIDM7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHJldHVybiB2YWx1ZXMgaW4gdGhlIGludGVydmFsIFstMSwxXS5cbiAgICAgICAgcmV0dXJuIDcwLjAgKiAobjAgKyBuMSArIG4yKTtcbiAgICB9LFxuICAgIC8vIDNEIHNpbXBsZXggbm9pc2VcbiAgICBub2lzZTNEOiBmdW5jdGlvbiAoeGluLCB5aW4sIHppbikge1xuICAgICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTIsXG4gICAgICAgICAgICBwZXJtID0gdGhpcy5wZXJtLFxuICAgICAgICAgICAgZ3JhZDMgPSB0aGlzLmdyYWQzO1xuICAgICAgICB2YXIgbjAsIG4xLCBuMiwgbjM7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgZm91ciBjb3JuZXJzXG4gICAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cbiAgICAgICAgdmFyIHMgPSAoeGluICsgeWluICsgemluKSAqIEYzOyAvLyBWZXJ5IG5pY2UgYW5kIHNpbXBsZSBza2V3IGZhY3RvciBmb3IgM0RcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XG4gICAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6aW4gKyBzKTtcbiAgICAgICAgdmFyIHQgPSAoaSArIGogKyBrKSAqIEczO1xuICAgICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseikgc3BhY2VcbiAgICAgICAgdmFyIFkwID0gaiAtIHQ7XG4gICAgICAgIHZhciBaMCA9IGsgLSB0O1xuICAgICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSx6IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgICB2YXIgeTAgPSB5aW4gLSBZMDtcbiAgICAgICAgdmFyIHowID0gemluIC0gWjA7XG4gICAgICAgIC8vIEZvciB0aGUgM0QgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYSBzbGlnaHRseSBpcnJlZ3VsYXIgdGV0cmFoZWRyb24uXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgdmFyIGkxLCBqMSwgazE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqLGspIGNvb3Jkc1xuICAgICAgICB2YXIgaTIsIGoyLCBrMjsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaixrKSBjb29yZHNcbiAgICAgICAgaWYgKHgwID49IHkwKSB7XG4gICAgICAgICAgICBpZiAoeTAgPj0gejApIHtcbiAgICAgICAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMDtcbiAgICAgICAgICAgIH0gLy8gWCBZIFogb3JkZXJcbiAgICAgICAgICAgIGVsc2UgaWYgKHgwID49IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAxO1xuICAgICAgICAgICAgICAgIGoyID0gMDtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFggWiBZIG9yZGVyXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICAgICAgICAgIGsxID0gMTtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAwO1xuICAgICAgICAgICAgICAgIGsyID0gMTtcbiAgICAgICAgICAgIH0gLy8gWiBYIFkgb3JkZXJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8geDA8eTBcbiAgICAgICAgICAgIGlmICh5MCA8IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMDtcbiAgICAgICAgICAgICAgICBrMSA9IDE7XG4gICAgICAgICAgICAgICAgaTIgPSAwO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFogWSBYIG9yZGVyXG4gICAgICAgICAgICBlbHNlIGlmICh4MCA8IHowKSB7XG4gICAgICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgICAgICAgICBrMSA9IDA7XG4gICAgICAgICAgICAgICAgaTIgPSAwO1xuICAgICAgICAgICAgICAgIGoyID0gMTtcbiAgICAgICAgICAgICAgICBrMiA9IDE7XG4gICAgICAgICAgICB9IC8vIFkgWiBYIG9yZGVyXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpMSA9IDA7XG4gICAgICAgICAgICAgICAgajEgPSAxO1xuICAgICAgICAgICAgICAgIGsxID0gMDtcbiAgICAgICAgICAgICAgICBpMiA9IDE7XG4gICAgICAgICAgICAgICAgajIgPSAxO1xuICAgICAgICAgICAgICAgIGsyID0gMDtcbiAgICAgICAgICAgIH0gLy8gWSBYIFogb3JkZXJcbiAgICAgICAgfVxuICAgICAgICAvLyBBIHN0ZXAgb2YgKDEsMCwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jLC1jKSBpbiAoeCx5LHopLFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMSwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jLC1jKSBpbiAoeCx5LHopLCBhbmRcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDAsMSkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKC1jLC1jLDEtYykgaW4gKHgseSx6KSwgd2hlcmVcbiAgICAgICAgLy8gYyA9IDEvNi5cbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEczOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMztcbiAgICAgICAgdmFyIHoxID0gejAgLSBrMSArIEczO1xuICAgICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzM7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xuICAgICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzM7XG4gICAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHMztcbiAgICAgICAgdmFyIHgzID0geDAgLSAxLjAgKyAzLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcbiAgICAgICAgdmFyIHkzID0geTAgLSAxLjAgKyAzLjAgKiBHMztcbiAgICAgICAgdmFyIHozID0gejAgLSAxLjAgKyAzLjAgKiBHMztcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmb3VyIHNpbXBsZXggY29ybmVyc1xuICAgICAgICB2YXIgaWkgPSBpICYgMjU1O1xuICAgICAgICB2YXIgamogPSBqICYgMjU1O1xuICAgICAgICB2YXIga2sgPSBrICYgMjU1O1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcbiAgICAgICAgdmFyIHQwID0gMC42IC0geDAgKiB4MCAtIHkwICogeTAgLSB6MCAqIHowO1xuICAgICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kwID0gcGVybU1vZDEyW2lpICsgcGVybVtqaiArIHBlcm1ba2tdXV0gKiAzO1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCArIGdyYWQzW2dpMCArIDJdICogejApO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MTtcbiAgICAgICAgaWYgKHQxIDwgMCkgbjEgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMSA9IHBlcm1Nb2QxMltpaSArIGkxICsgcGVybVtqaiArIGoxICsgcGVybVtrayArIGsxXV1dICogMztcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQzW2dpMV0gKiB4MSArIGdyYWQzW2dpMSArIDFdICogeTEgKyBncmFkM1tnaTEgKyAyXSAqIHoxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejI7XG4gICAgICAgIGlmICh0MiA8IDApIG4yID0gMC4wO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBnaTIgPSBwZXJtTW9kMTJbaWkgKyBpMiArIHBlcm1bamogKyBqMiArIHBlcm1ba2sgKyBrMl1dXSAqIDM7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyICsgZ3JhZDNbZ2kyICsgMl0gKiB6Mik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozO1xuICAgICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kzID0gcGVybU1vZDEyW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDFdXV0gKiAzO1xuICAgICAgICAgICAgdDMgKj0gdDM7XG4gICAgICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDNbZ2kzXSAqIHgzICsgZ3JhZDNbZ2kzICsgMV0gKiB5MyArIGdyYWQzW2dpMyArIDJdICogejMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cbiAgICAgICAgLy8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gc3RheSBqdXN0IGluc2lkZSBbLTEsMV1cbiAgICAgICAgcmV0dXJuIDMyLjAgKiAobjAgKyBuMSArIG4yICsgbjMpO1xuICAgIH0sXG4gICAgLy8gNEQgc2ltcGxleCBub2lzZSwgYmV0dGVyIHNpbXBsZXggcmFuayBvcmRlcmluZyBtZXRob2QgMjAxMi0wMy0wOVxuICAgIG5vaXNlNEQ6IGZ1bmN0aW9uICh4LCB5LCB6LCB3KSB7XG4gICAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMixcbiAgICAgICAgICAgIHBlcm0gPSB0aGlzLnBlcm0sXG4gICAgICAgICAgICBncmFkNCA9IHRoaXMuZ3JhZDQ7XG5cbiAgICAgICAgdmFyIG4wLCBuMSwgbjIsIG4zLCBuNDsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSBmaXZlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgKHgseSx6LHcpIHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBjZWxsIG9mIDI0IHNpbXBsaWNlcyB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4ICsgeSArIHogKyB3KSAqIEY0OyAvLyBGYWN0b3IgZm9yIDREIHNrZXdpbmdcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHggKyBzKTtcbiAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHkgKyBzKTtcbiAgICAgICAgdmFyIGsgPSBNYXRoLmZsb29yKHogKyBzKTtcbiAgICAgICAgdmFyIGwgPSBNYXRoLmZsb29yKHcgKyBzKTtcbiAgICAgICAgdmFyIHQgPSAoaSArIGogKyBrICsgbCkgKiBHNDsgLy8gRmFjdG9yIGZvciA0RCB1bnNrZXdpbmdcbiAgICAgICAgdmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5LHosdykgc3BhY2VcbiAgICAgICAgdmFyIFkwID0gaiAtIHQ7XG4gICAgICAgIHZhciBaMCA9IGsgLSB0O1xuICAgICAgICB2YXIgVzAgPSBsIC0gdDtcbiAgICAgICAgdmFyIHgwID0geCAtIFgwOyAvLyBUaGUgeCx5LHosdyBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgdmFyIHkwID0geSAtIFkwO1xuICAgICAgICB2YXIgejAgPSB6IC0gWjA7XG4gICAgICAgIHZhciB3MCA9IHcgLSBXMDtcbiAgICAgICAgLy8gRm9yIHRoZSA0RCBjYXNlLCB0aGUgc2ltcGxleCBpcyBhIDREIHNoYXBlIEkgd29uJ3QgZXZlbiB0cnkgdG8gZGVzY3JpYmUuXG4gICAgICAgIC8vIFRvIGZpbmQgb3V0IHdoaWNoIG9mIHRoZSAyNCBwb3NzaWJsZSBzaW1wbGljZXMgd2UncmUgaW4sIHdlIG5lZWQgdG9cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBtYWduaXR1ZGUgb3JkZXJpbmcgb2YgeDAsIHkwLCB6MCBhbmQgdzAuXG4gICAgICAgIC8vIFNpeCBwYWlyLXdpc2UgY29tcGFyaXNvbnMgYXJlIHBlcmZvcm1lZCBiZXR3ZWVuIGVhY2ggcG9zc2libGUgcGFpclxuICAgICAgICAvLyBvZiB0aGUgZm91ciBjb29yZGluYXRlcywgYW5kIHRoZSByZXN1bHRzIGFyZSB1c2VkIHRvIHJhbmsgdGhlIG51bWJlcnMuXG4gICAgICAgIHZhciByYW5reCA9IDA7XG4gICAgICAgIHZhciByYW5reSA9IDA7XG4gICAgICAgIHZhciByYW5reiA9IDA7XG4gICAgICAgIHZhciByYW5rdyA9IDA7XG4gICAgICAgIGlmICh4MCA+IHkwKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt5Kys7XG4gICAgICAgIGlmICh4MCA+IHowKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt6Kys7XG4gICAgICAgIGlmICh4MCA+IHcwKSByYW5reCsrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIGlmICh5MCA+IHowKSByYW5reSsrO1xuICAgICAgICBlbHNlIHJhbmt6Kys7XG4gICAgICAgIGlmICh5MCA+IHcwKSByYW5reSsrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIGlmICh6MCA+IHcwKSByYW5reisrO1xuICAgICAgICBlbHNlIHJhbmt3Kys7XG4gICAgICAgIHZhciBpMSwgajEsIGsxLCBsMTsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIHNlY29uZCBzaW1wbGV4IGNvcm5lclxuICAgICAgICB2YXIgaTIsIGoyLCBrMiwgbDI7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSB0aGlyZCBzaW1wbGV4IGNvcm5lclxuICAgICAgICB2YXIgaTMsIGozLCBrMywgbDM7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSBmb3VydGggc2ltcGxleCBjb3JuZXJcbiAgICAgICAgLy8gc2ltcGxleFtjXSBpcyBhIDQtdmVjdG9yIHdpdGggdGhlIG51bWJlcnMgMCwgMSwgMiBhbmQgMyBpbiBzb21lIG9yZGVyLlxuICAgICAgICAvLyBNYW55IHZhbHVlcyBvZiBjIHdpbGwgbmV2ZXIgb2NjdXIsIHNpbmNlIGUuZy4geD55Pno+dyBtYWtlcyB4PHosIHk8dyBhbmQgeDx3XG4gICAgICAgIC8vIGltcG9zc2libGUuIE9ubHkgdGhlIDI0IGluZGljZXMgd2hpY2ggaGF2ZSBub24temVybyBlbnRyaWVzIG1ha2UgYW55IHNlbnNlLlxuICAgICAgICAvLyBXZSB1c2UgYSB0aHJlc2hvbGRpbmcgdG8gc2V0IHRoZSBjb29yZGluYXRlcyBpbiB0dXJuIGZyb20gdGhlIGxhcmdlc3QgbWFnbml0dWRlLlxuICAgICAgICAvLyBSYW5rIDMgZGVub3RlcyB0aGUgbGFyZ2VzdCBjb29yZGluYXRlLlxuICAgICAgICBpMSA9IHJhbmt4ID49IDMgPyAxIDogMDtcbiAgICAgICAgajEgPSByYW5reSA+PSAzID8gMSA6IDA7XG4gICAgICAgIGsxID0gcmFua3ogPj0gMyA/IDEgOiAwO1xuICAgICAgICBsMSA9IHJhbmt3ID49IDMgPyAxIDogMDtcbiAgICAgICAgLy8gUmFuayAyIGRlbm90ZXMgdGhlIHNlY29uZCBsYXJnZXN0IGNvb3JkaW5hdGUuXG4gICAgICAgIGkyID0gcmFua3ggPj0gMiA/IDEgOiAwO1xuICAgICAgICBqMiA9IHJhbmt5ID49IDIgPyAxIDogMDtcbiAgICAgICAgazIgPSByYW5reiA+PSAyID8gMSA6IDA7XG4gICAgICAgIGwyID0gcmFua3cgPj0gMiA/IDEgOiAwO1xuICAgICAgICAvLyBSYW5rIDEgZGVub3RlcyB0aGUgc2Vjb25kIHNtYWxsZXN0IGNvb3JkaW5hdGUuXG4gICAgICAgIGkzID0gcmFua3ggPj0gMSA/IDEgOiAwO1xuICAgICAgICBqMyA9IHJhbmt5ID49IDEgPyAxIDogMDtcbiAgICAgICAgazMgPSByYW5reiA+PSAxID8gMSA6IDA7XG4gICAgICAgIGwzID0gcmFua3cgPj0gMSA/IDEgOiAwO1xuICAgICAgICAvLyBUaGUgZmlmdGggY29ybmVyIGhhcyBhbGwgY29vcmRpbmF0ZSBvZmZzZXRzID0gMSwgc28gbm8gbmVlZCB0byBjb21wdXRlIHRoYXQuXG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHNDsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHNDtcbiAgICAgICAgdmFyIHoxID0gejAgLSBrMSArIEc0O1xuICAgICAgICB2YXIgdzEgPSB3MCAtIGwxICsgRzQ7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gaTIgKyAyLjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSBqMiArIDIuMCAqIEc0O1xuICAgICAgICB2YXIgejIgPSB6MCAtIGsyICsgMi4wICogRzQ7XG4gICAgICAgIHZhciB3MiA9IHcwIC0gbDIgKyAyLjAgKiBHNDtcbiAgICAgICAgdmFyIHgzID0geDAgLSBpMyArIDMuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciBmb3VydGggY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcbiAgICAgICAgdmFyIHkzID0geTAgLSBqMyArIDMuMCAqIEc0O1xuICAgICAgICB2YXIgejMgPSB6MCAtIGszICsgMy4wICogRzQ7XG4gICAgICAgIHZhciB3MyA9IHcwIC0gbDMgKyAzLjAgKiBHNDtcbiAgICAgICAgdmFyIHg0ID0geDAgLSAxLjAgKyA0LjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xuICAgICAgICB2YXIgeTQgPSB5MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICB2YXIgejQgPSB6MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICB2YXIgdzQgPSB3MCAtIDEuMCArIDQuMCAqIEc0O1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIGZpdmUgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIHZhciBpaSA9IGkgJiAyNTU7XG4gICAgICAgIHZhciBqaiA9IGogJiAyNTU7XG4gICAgICAgIHZhciBrayA9IGsgJiAyNTU7XG4gICAgICAgIHZhciBsbCA9IGwgJiAyNTU7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIGZpdmUgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjYgLSB4MCAqIHgwIC0geTAgKiB5MCAtIHowICogejAgLSB3MCAqIHcwO1xuICAgICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ2kwID0gKHBlcm1baWkgKyBwZXJtW2pqICsgcGVybVtrayArIHBlcm1bbGxdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQ0W2dpMF0gKiB4MCArIGdyYWQ0W2dpMCArIDFdICogeTAgKyBncmFkNFtnaTAgKyAyXSAqIHowICsgZ3JhZDRbZ2kwICsgM10gKiB3MCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC42IC0geDEgKiB4MSAtIHkxICogeTEgLSB6MSAqIHoxIC0gdzEgKiB3MTtcbiAgICAgICAgaWYgKHQxIDwgMCkgbjEgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMSA9IChwZXJtW2lpICsgaTEgKyBwZXJtW2pqICsgajEgKyBwZXJtW2trICsgazEgKyBwZXJtW2xsICsgbDFdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQ0W2dpMV0gKiB4MSArIGdyYWQ0W2dpMSArIDFdICogeTEgKyBncmFkNFtnaTEgKyAyXSAqIHoxICsgZ3JhZDRbZ2kxICsgM10gKiB3MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC42IC0geDIgKiB4MiAtIHkyICogeTIgLSB6MiAqIHoyIC0gdzIgKiB3MjtcbiAgICAgICAgaWYgKHQyIDwgMCkgbjIgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMiA9IChwZXJtW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazIgKyBwZXJtW2xsICsgbDJdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWQ0W2dpMl0gKiB4MiArIGdyYWQ0W2dpMiArIDFdICogeTIgKyBncmFkNFtnaTIgKyAyXSAqIHoyICsgZ3JhZDRbZ2kyICsgM10gKiB3Mik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozIC0gdzMgKiB3MztcbiAgICAgICAgaWYgKHQzIDwgMCkgbjMgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpMyA9IChwZXJtW2lpICsgaTMgKyBwZXJtW2pqICsgajMgKyBwZXJtW2trICsgazMgKyBwZXJtW2xsICsgbDNdXV1dICUgMzIpICogNDtcbiAgICAgICAgICAgIHQzICo9IHQzO1xuICAgICAgICAgICAgbjMgPSB0MyAqIHQzICogKGdyYWQ0W2dpM10gKiB4MyArIGdyYWQ0W2dpMyArIDFdICogeTMgKyBncmFkNFtnaTMgKyAyXSAqIHozICsgZ3JhZDRbZ2kzICsgM10gKiB3Myk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQ0ID0gMC42IC0geDQgKiB4NCAtIHk0ICogeTQgLSB6NCAqIHo0IC0gdzQgKiB3NDtcbiAgICAgICAgaWYgKHQ0IDwgMCkgbjQgPSAwLjA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdpNCA9IChwZXJtW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDEgKyBwZXJtW2xsICsgMV1dXV0gJSAzMikgKiA0O1xuICAgICAgICAgICAgdDQgKj0gdDQ7XG4gICAgICAgICAgICBuNCA9IHQ0ICogdDQgKiAoZ3JhZDRbZ2k0XSAqIHg0ICsgZ3JhZDRbZ2k0ICsgMV0gKiB5NCArIGdyYWQ0W2dpNCArIDJdICogejQgKyBncmFkNFtnaTQgKyAzXSAqIHc0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdW0gdXAgYW5kIHNjYWxlIHRoZSByZXN1bHQgdG8gY292ZXIgdGhlIHJhbmdlIFstMSwxXVxuICAgICAgICByZXR1cm4gMjcuMCAqIChuMCArIG4xICsgbjIgKyBuMyArIG40KTtcbiAgICB9XG5cblxufTtcblxuLy8gYW1kXG5pZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIFNpbXBsZXhOb2lzZTt9KTtcbi8vY29tbW9uIGpzXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSBleHBvcnRzLlNpbXBsZXhOb2lzZSA9IFNpbXBsZXhOb2lzZTtcbi8vIGJyb3dzZXJcbmVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB3aW5kb3cuU2ltcGxleE5vaXNlID0gU2ltcGxleE5vaXNlO1xuLy8gbm9kZWpzXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNpbXBsZXhOb2lzZTtcbn1cblxufSkoKTtcbiIsInZhciBEaXIgPSB7fTtcblxuRGlyLkxFRlQgPSAwO1xuRGlyLlJJR0hUID0gMTtcbkRpci5CT1RUT00gPSAyO1xuRGlyLlVQID0gMztcbkRpci5CQUNLID0gNDtcbkRpci5GUk9OVCA9IDU7XG5cbkRpci5nZXRVbml0VmVjdG9yID0gZnVuY3Rpb24oZGlyKSB7XG4gIHN3aXRjaCAoZGlyKSB7XG4gICAgY2FzZSBEaXIuTEVGVDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygtMSwgMCwgMClcbiAgICBjYXNlIERpci5SSUdIVDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKVxuICAgIGNhc2UgRGlyLkJPVFRPTTpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAtMSwgMClcbiAgICBjYXNlIERpci5VUDpcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKVxuICAgIGNhc2UgRGlyLkJBQ0s6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpXG4gICAgY2FzZSBEaXIuRlJPTlQ6XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSlcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHR1cmUsIHBhcmVudCwgY2FtZXJhKSB7XG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuXG4gIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgbWFwOiB0ZXh0dXJlLFxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcbiAgfSk7XG5cbiAgdmFyIHBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMTcsIDApO1xuXG4gIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDQsIDQpO1xuICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gIHBhcmVudC5hZGQob2JqZWN0KTtcblxuICBmdW5jdGlvbiB0aWNrKGR0KSB7XG4gICAgLy8gYmlsbGJvYXJkXG5cbiAgICB2YXIgdXAgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKTtcbiAgICB2YXIgY2FtZXJhUG9zaXRpb24gPSBwYXJlbnQud29ybGRUb0xvY2FsKGNhbWVyYS5wb3NpdGlvbi5jbG9uZSgpKTtcbiAgICB2YXIgY2FtZXJhRGlyID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zdWJWZWN0b3JzKG9iamVjdC5wb3NpdGlvbiwgY2FtZXJhUG9zaXRpb24pO1xuICAgIHZhciByaWdodCA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY3Jvc3NWZWN0b3JzKGNhbWVyYURpciwgdXApO1xuICAgIHZhciByZWFsVXAgPSBuZXcgVEhSRUUuVmVjdG9yMygpLmNyb3NzVmVjdG9ycyhyaWdodCwgY2FtZXJhRGlyKTtcbiAgICBvYmplY3QudXAgPSByZWFsVXA7XG4gICAgb2JqZWN0Lmxvb2tBdChjYW1lcmFQb3NpdGlvbik7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0aWNrOiB0aWNrXG4gIH07XG59O1xuIiwidmFyIFNpbXBsZXhOb2lzZSA9IHJlcXVpcmUoJ3NpbXBsZXgtbm9pc2UnKTtcbnZhciBTaW1wbGV4Tm9pc2UgPSByZXF1aXJlKCdzaW1wbGV4LW5vaXNlJyk7XG5cbnZhciBtZXNoZXIgPSByZXF1aXJlKCcuLi92b3hlbC9tZXNoZXInKTtcbnZhciBEaXIgPSByZXF1aXJlKCcuLi9kaXInKTtcbnZhciBDaHVua3MgPSByZXF1aXJlKCcuLi92b3hlbC9jaHVua3MnKTtcbnZhciBtZXNoQ2h1bmtzID0gcmVxdWlyZSgnLi4vdm94ZWwvbWVzaGNodW5rcycpO1xuXG52YXIgQ0xPVUQgPSAxMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJlbnQsIG1hdGVyaWFsKSB7XG5cbiAgdmFyIGNodW5rcyA9IG5ldyBDaHVua3MoKTtcbiAgdmFyIGRhdGFNYXAgPSB7fTtcbiAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICBwYXJlbnQuYWRkKG9iamVjdCk7XG5cbiAgdmFyIG5vaXNlMSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGMSA9IDAuMTtcbiAgdmFyIG5vaXNlMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGMiA9IDAuMDI7XG4gIHZhciBub2lzZV9wcmVzc3VyZSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VfcHJlc3N1cmVGID0gMC4wMDI7XG4gIHZhciBjbG91ZEFtb3VudCA9IC0wLjk7XG4gIHZhciBjb3VudGVyID0gMDtcbiAgdmFyIGNvb2xkb3duID0gMS4yO1xuXG4gIHZhciBhbGxDb29yZHMgPSB7fTtcblxuICB2YXIgc2l6ZSA9IDM5O1xuICB2YXIgY2VudGVyTnVtID0gKHNpemUgLyAyKTtcbiAgdmFyIGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKC1zaXplIC8gMiwgLXNpemUgLyAyLCAtc2l6ZSAvIDIpO1xuXG4gIHZhciBjbG91ZFZveGVsID0gW1xuICAgIENMT1VELCBDTE9VRCwgQ0xPVUQsIENMT1VELCBDTE9VRCwgQ0xPVURcbiAgXTtcblxuICBpbml0RGF0YSgpO1xuXG4gIGZ1bmN0aW9uIGluaXREYXRhKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuXG4gICAgZm9yICh2YXIgZGlyID0gMDsgZGlyIDwgNjsgZGlyKyspIHtcbiAgICAgIHZhciBkID0gTWF0aC5mbG9vcihkaXIgLyAyKTtcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuICAgICAgdmFyIGNvb3JkRCA9IGRpciAlIDIgPyAwIDogc2l6ZSAtIDE7XG4gICAgICB2YXIgZmFsbERpciA9IGNvb3JkRCA9PT0gMCA/IDEgOiAtMTtcbiAgICAgIHZhciBmYWxsQ29vcmREID0gY29vcmREICsgZmFsbERpcjtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgICBjb29yZFtkXSA9IGNvb3JkRDtcbiAgICAgICAgICBjb29yZFt1XSA9IGk7XG4gICAgICAgICAgY29vcmRbdl0gPSBqO1xuXG4gICAgICAgICAgdmFyIHJlbCA9IFtcbiAgICAgICAgICAgIChjb29yZFswXSArIGNlbnRlci54KSxcbiAgICAgICAgICAgIChjb29yZFsxXSArIGNlbnRlci55KSxcbiAgICAgICAgICAgIChjb29yZFsyXSArIGNlbnRlci56KVxuICAgICAgICAgIF07XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHByZXNzdXJlOiBub2lzZV9wcmVzc3VyZS5ub2lzZTNEKFxuICAgICAgICAgICAgICByZWxbMF0gKiBub2lzZV9wcmVzc3VyZUYsXG4gICAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlX3ByZXNzdXJlRixcbiAgICAgICAgICAgICAgcmVsWzJdICogbm9pc2VfcHJlc3N1cmVGXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgYW1vdW50OiAwLFxuICAgICAgICAgICAgZGVsdGE6IDAsXG4gICAgICAgICAgICBjb29yZDogW2Nvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl1dXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBoYXNoID0gY29vcmQuam9pbignLCcpO1xuICAgICAgICAgIGFsbENvb3Jkc1toYXNoXSA9IFtjb29yZFswXSwgY29vcmRbMV0sIGNvb3JkWzJdXTtcbiAgICAgICAgICBkYXRhTWFwW2hhc2hdID0gZGF0YTtcblxuICAgICAgICAgIHZhciB2YWx1ZSA9IG5vaXNlMS5ub2lzZTNEKFxuICAgICAgICAgICAgcmVsWzBdICogbm9pc2VGMSxcbiAgICAgICAgICAgIHJlbFsxXSAqIG5vaXNlRjEsXG4gICAgICAgICAgICByZWxbMl0gKiBub2lzZUYxXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTIgPSBub2lzZTIubm9pc2UzRChcbiAgICAgICAgICAgIHJlbFswXSAqIG5vaXNlRjIsXG4gICAgICAgICAgICByZWxbMV0gKiBub2lzZUYyLFxuICAgICAgICAgICAgcmVsWzJdICogbm9pc2VGMlxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB2YWx1ZSA9IE1hdGgucG93KHZhbHVlICsgdmFsdWUyLCAxKSArIGNsb3VkQW1vdW50O1xuXG4gICAgICAgICAgaWYgKHZhbHVlID4gMC4wKSB7XG4gICAgICAgICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGNsb3VkVm94ZWwpO1xuICAgICAgICAgICAgZGF0YS5hbW91bnQgKz0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXRhLm5laWdoYm91cnMgPSBbXTtcblxuXG4gICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpIC0gMSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpID09PSBzaXplIC0gMSkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGkgKyAxLCBqLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgIGRhdGEubmVpZ2hib3Vycy5wdXNoKGdldENvb3JkKGZhbGxDb29yZEQsIGksIGosIGQsIHUsIHYpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoY29vcmRELCBpLCBqIC0gMSwgZCwgdSwgdikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChqID09PSBzaXplIC0gMSkge1xuICAgICAgICAgICAgZGF0YS5uZWlnaGJvdXJzLnB1c2goZ2V0Q29vcmQoZmFsbENvb3JkRCwgaSwgaiwgZCwgdSwgdikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLm5laWdoYm91cnMucHVzaChnZXRDb29yZChjb29yZEQsIGksIGogKyAxLCBkLCB1LCB2KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRpciA9PT0gMCkge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMF07XG4gICAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09IDEpIHtcbiAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzFdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAyKSB7XG4gICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1szXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gMykge1xuICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMl07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZWxJID0gaSAtIGNlbnRlck51bTtcbiAgICAgICAgICAgIHZhciByZWxKID0gaiAtIGNlbnRlck51bTtcblxuICAgICAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihyZWxJLCByZWxKKTtcbiAgICAgICAgICAgIGFuZ2xlID0gbm9ybWFsaXplQW5nbGUoYW5nbGUpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBub3JtYWxpemVBbmdsZShhbmdsZSkge1xuICAgICAgICAgICAgICBhbmdsZSAlPSAoTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgICBpZiAoYW5nbGUgPCBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgKz0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgLT0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IE1hdGguUEkgLyA0O1xuICAgICAgICAgICAgdmFyIHN0ZXAgPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IC1NYXRoLlBJO1xuXG4gICAgICAgICAgICBpZiAoYW5nbGUgPj0gb2Zmc2V0ICYmIGFuZ2xlIDwgb2Zmc2V0ICsgc3RlcCkge1xuICAgICAgICAgICAgICBkYXRhLm5leHRDb29yZCA9IGRhdGEubmVpZ2hib3Vyc1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5nbGUgPj0gb2Zmc2V0ICsgc3RlcCAmJiBhbmdsZSA8IG9mZnNldCArIHN0ZXAgKiAyKSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbmdsZSA+PSBvZmZzZXQgLSBzdGVwICYmIGFuZ2xlIDwgb2Zmc2V0KSB7XG4gICAgICAgICAgICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzNdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAoYWJzSSA+IGFic0opIHtcbiAgICAgICAgICAgIC8vICAgaWYgKHJlbEkgPj0gMCkge1xuXG4gICAgICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgZGF0YS5uZXh0Q29vcmQgPSBkYXRhLm5laWdoYm91cnNbM107XG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgIGlmIChyZWxKID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzFdO1xuICAgICAgICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgIGRhdGEubmV4dENvb3JkID0gZGF0YS5uZWlnaGJvdXJzWzBdO1xuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdldENvb3JkKGksIGosIGssIGQsIHUsIHYpIHtcbiAgICB2YXIgY29vcmQgPSBbXTtcbiAgICBjb29yZFtkXSA9IGk7XG4gICAgY29vcmRbdV0gPSBqO1xuICAgIGNvb3JkW3ZdID0gaztcbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cblxuICB1cGRhdGVNZXNoKCk7XG5cbiAgb2JqZWN0LnBvc2l0aW9uLmNvcHkoY2VudGVyKTtcblxuICBmdW5jdGlvbiB0aWNrKGR0KSB7XG4gICAgY291bnRlciArPSBkdDtcbiAgICBpZiAoY291bnRlciA+IGNvb2xkb3duKSB7XG4gICAgICBjb3VudGVyIC09IGNvb2xkb3duO1xuXG4gICAgICB2YXIgY2hhbmdlZCA9IHt9O1xuICAgICAgZm9yICh2YXIgaWQgaW4gYWxsQ29vcmRzKSB7XG4gICAgICAgIHZhciBjb29yZCA9IGFsbENvb3Jkc1tpZF07XG4gICAgICAgIHZhciBkYXRhID0gZGF0YU1hcFtpZF07XG4gICAgICAgIHZhciBuZXh0Q29vcmQgPSBkYXRhLm5leHRDb29yZDtcbiAgICAgICAgaWYgKG5leHRDb29yZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YS5hbW91bnQgPD0gMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5leHRIYXNoID0gbmV4dENvb3JkLmpvaW4oJywnKTtcbiAgICAgICAgdmFyIG5leHREYXRhID0gZGF0YU1hcFtuZXh0SGFzaF07XG4gICAgICAgIGNoYW5nZWRbbmV4dEhhc2hdID0gdHJ1ZTtcbiAgICAgICAgY2hhbmdlZFtpZF0gPSB0cnVlO1xuXG4gICAgICAgIG5leHREYXRhLmRlbHRhICs9IDEuMDtcbiAgICAgICAgZGF0YS5kZWx0YSArPSAtMS4wO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpZCBpbiBjaGFuZ2VkKSB7XG4gICAgICAgIHZhciBkYXRhID0gZGF0YU1hcFtpZF07XG4gICAgICAgIHZhciBjb29yZCA9IGRhdGEuY29vcmQ7XG4gICAgICAgIGRhdGEuYW1vdW50ICs9IGRhdGEuZGVsdGE7XG4gICAgICAgIGRhdGEuZGVsdGEgPSAwO1xuXG4gICAgICAgIGlmIChkYXRhLmFtb3VudCA+PSAxLjApIHtcbiAgICAgICAgICBjaHVua3Muc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGNsb3VkVm94ZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNodW5rcy5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlTWVzaCgpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiB1cGRhdGVNZXNoKCkge1xuICAgIG1lc2hDaHVua3MoY2h1bmtzLCBvYmplY3QsIG1hdGVyaWFsKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHRpY2s6IHRpY2tcbiAgfTtcbn1cbiIsInZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFNpbXBsZXhOb2lzZSA9IHJlcXVpcmUoJ3NpbXBsZXgtbm9pc2UnKTtcblxudmFyIENodW5rcyA9IHJlcXVpcmUoJy4uL3ZveGVsL2NodW5rcycpO1xudmFyIG1lc2hDaHVua3MgPSByZXF1aXJlKCcuLi92b3hlbC9tZXNoY2h1bmtzJyk7XG5cbnZhciBHUkFTUyA9IDE7XG52YXIgU09JTCA9IDI7XG52YXIgU09JTF9FREdFID0gMztcbnZhciBTVE9ORSA9IDQ7XG52YXIgU0VBID0gNTtcbnZhciBTQU5EID0gNjtcblxudmFyIExFVkVMX1NVUkZBQ0UgPSAxO1xudmFyIExFVkVMX01JRERMRSA9IDI7XG52YXIgTEVWRUxfQ09SRSA9IDM7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2l6ZSwgcGFyZW50LCBtYXRlcmlhbCkge1xuICB2YXIgbm9pc2Vfc3VyZmFjZSA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2Vfc3VyZmFjZTIgPSBuZXcgU2ltcGxleE5vaXNlKE1hdGgucmFuZG9tKTtcbiAgdmFyIG5vaXNlX2Jpb21lcyA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VfYmlvbWVzMiA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VfYmlvbWVzMyA9IG5ldyBTaW1wbGV4Tm9pc2UoTWF0aC5yYW5kb20pO1xuICB2YXIgbm9pc2VGX3N1cmZhY2UgPSAwLjE7XG4gIHZhciBub2lzZUZfc3VyZmFjZTIgPSAwLjA0O1xuICB2YXIgbm9pc2VGX3N1cmZhY2UzID0gMC4wNTtcblxuICB2YXIgbnVtID0gc2l6ZTtcbiAgdmFyIGdyb3VuZCA9IG5ldyBDaHVua3MoKTtcbiAgdmFyIHdhdGVyID0gbmV3IENodW5rcygpO1xuICB2YXIgYm91bmRzID0ge1xuICAgIG1pbjogbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCksXG4gICAgc2l6ZTogbmV3IFRIUkVFLlZlY3RvcjMobnVtLCBudW0sIG51bSlcbiAgfTtcblxuICB2YXIgY2VudGVyID0gWy1udW0gLyAyICsgMC41LCAtbnVtIC8gMiArIDAuNSwgLW51bSAvIDIgKyAwLjVdO1xuICB2YXIgY2VudGVyQ29vcmQgPSBbXG4gICAgTWF0aC5mbG9vcihudW0gLyAyKSxcbiAgICBNYXRoLmZsb29yKG51bSAvIDIpLFxuICAgIE1hdGguZmxvb3IobnVtIC8gMilcbiAgXTtcblxuICAvLyBoYXNoIC0+IGRhdGFcbiAgLy8gZ3Jhdml0eTogZ3Jhdml0eSAocylcbiAgLy8gYmlvbWU6IGJpb21lIGRhdGFcbiAgLy8gaGVpZ2h0OiBoZWlnaHQgb2Ygc3VyZmFjZVxuICB2YXIgZGF0YU1hcCA9IHt9O1xuXG4gIHZhciBzdXJmYWNlTnVtID0gNjtcbiAgdmFyIHNlYUxldmVsID0gMjtcblxuICBpbml0KCk7XG4gIGdlbmVyYXRlR3Jhdml0eU1hcCgpO1xuICBnZW5lcmF0ZVN1cmZhY2UoKTtcbiAgcmVtb3ZlRmxvYXRpbmcoKTtcbiAgZ2VuZXJhdGVTZWEoKTtcbiAgZ2VuZXJhdGVCaW9tZXMoKTtcbiAgZ2VuZXJhdGVUaWxlcygpO1xuXG4gIHZhciBwaXZvdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIG1lc2hDaHVua3MoZ3JvdW5kLCBwaXZvdCwgbWF0ZXJpYWwpO1xuICBtZXNoQ2h1bmtzKHdhdGVyLCBwaXZvdCwgbWF0ZXJpYWwpO1xuXG4gIHZhciBjZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgLnN1YlZlY3RvcnMoYm91bmRzLm1pbiwgYm91bmRzLnNpemUpXG4gICAgLm11bHRpcGx5U2NhbGFyKDAuNSk7XG4gIHBpdm90LnBvc2l0aW9uLmNvcHkoY2VudGVyKTtcbiAgcGFyZW50LmFkZChwaXZvdCk7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbnVtOyBrKyspIHtcbiAgICAgICAgICBncm91bmQuc2V0KGksIGosIGssIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU2VhKCkge1xuICAgIHZhciBjb29yZCA9IFtdO1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgZCsrKSB7XG4gICAgICB2YXIgdSA9IChkICsgMSkgJSAzO1xuICAgICAgdmFyIHYgPSAoZCArIDIpICUgMztcbiAgICAgIFtzZWFMZXZlbCwgbnVtIC0gc2VhTGV2ZWwgLSAxXS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IHNlYUxldmVsOyBpIDwgbnVtIC0gc2VhTGV2ZWw7IGkrKykge1xuICAgICAgICAgIGZvciAodmFyIGogPSBzZWFMZXZlbDsgaiA8IG51bSAtIHNlYUxldmVsOyBqKyspIHtcbiAgICAgICAgICAgIGNvb3JkW2RdID0gYztcbiAgICAgICAgICAgIGNvb3JkW3VdID0gaTtcbiAgICAgICAgICAgIGNvb3JkW3ZdID0gajtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgdmFyIGdyYXZpdHkgPSBkYXRhLmdyYXZpdHk7XG5cbiAgICAgICAgICAgIHZhciBibG9jayA9IFtcbiAgICAgICAgICAgICAgMCwgMCwgMCwgMCwgMCwgMFxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgZyBpbiBncmF2aXR5KSB7XG4gICAgICAgICAgICAgIGJsb2NrW2ddID0gU0VBO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSkpIHtcbiAgICAgICAgICAgICAgd2F0ZXIuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiByZW1vdmVGbG9hdGluZygpIHtcbiAgICB2YXIgbWFwID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBudW07IGorKykge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IG51bTsgaysrKSB7XG4gICAgICAgICAgdmFyIGhhc2ggPSBbaSwgaiwga10uam9pbignLCcpO1xuICAgICAgICAgIG1hcFtoYXNoXSA9IHtcbiAgICAgICAgICAgIHZpc2l0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgY29vcmQ6IFtpLCBqLCBrXVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGVhZHMgPSBbY2VudGVyQ29vcmRdO1xuXG4gICAgd2hpbGUgKGxlYWRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciByZXN1bHQgPSB2aXNpdChbMSwgMCwgMF0pIHx8XG4gICAgICAgIHZpc2l0KFswLCAxLCAwXSkgfHxcbiAgICAgICAgdmlzaXQoWzAsIDAsIDFdKSB8fFxuICAgICAgICB2aXNpdChbLTEsIDAsIDBdKSB8fFxuICAgICAgICB2aXNpdChbMCwgLTEsIDBdKSB8fFxuICAgICAgICB2aXNpdChbMCwgMCwgLTFdKTtcblxuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgbGVhZHMucG9wKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICBmb3IgKHZhciBpZCBpbiBtYXApIHtcbiAgICAgIGlmICghbWFwW2lkXS52aXNpdGVkKSB7XG4gICAgICAgIHZhciBjb29yZCA9IG1hcFtpZF0uY29vcmQ7XG4gICAgICAgIGdyb3VuZC5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgbnVsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmlzaXQoZGlzKSB7XG4gICAgICB2YXIgY3VycmVudCA9IGxlYWRzW2xlYWRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICB2YXIgbmV4dCA9IFtjdXJyZW50WzBdICsgZGlzWzBdLFxuICAgICAgICBjdXJyZW50WzFdICsgZGlzWzFdLFxuICAgICAgICBjdXJyZW50WzJdICsgZGlzWzJdXG4gICAgICBdO1xuXG4gICAgICB2YXIgaGFzaCA9IG5leHQuam9pbignLCcpO1xuXG4gICAgICBpZiAobWFwW2hhc2hdID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAobWFwW2hhc2hdLnZpc2l0ZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdiA9IGdyb3VuZC5nZXQobmV4dFswXSwgbmV4dFsxXSwgbmV4dFsyXSk7XG4gICAgICBpZiAoISF2KSB7XG4gICAgICAgIG1hcFtoYXNoXS52aXNpdGVkID0gdHJ1ZTtcbiAgICAgICAgbGVhZHMucHVzaChuZXh0KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJpb21lcygpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bTsgaisrKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbnVtOyBrKyspIHtcbiAgICAgICAgICB2YXIgdiA9IGdyb3VuZC5nZXQoaSwgaiwgayk7XG4gICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgTWF0aC5hYnMoaSArIGNlbnRlclswXSksXG4gICAgICAgICAgICBNYXRoLmFicyhqICsgY2VudGVyWzFdKSxcbiAgICAgICAgICAgIE1hdGguYWJzKGsgKyBjZW50ZXJbMl0pKTtcblxuICAgICAgICAgIHZhciBpc1NlYUxldmVsID0gZmFsc2U7XG4gICAgICAgICAgaWYgKChudW0gLyAyIC0gZCAtIHNlYUxldmVsIC0gMC41KSA9PT0gMCkge1xuICAgICAgICAgICAgaXNTZWFMZXZlbCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZCAvPSAobnVtIC8gMik7XG5cbiAgICAgICAgICB2YXIgbm9pc2VGID0gMC4wNTtcbiAgICAgICAgICB2YXIgbm9pc2VGMiA9IDAuMDI7XG4gICAgICAgICAgdmFyIG5vaXNlRjMgPSAwLjAyO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG5vaXNlX2Jpb21lcy5ub2lzZTNEKFxuICAgICAgICAgICAgKGkgKyBjZW50ZXJbMF0pICogbm9pc2VGLFxuICAgICAgICAgICAgKGogKyBjZW50ZXJbMV0pICogbm9pc2VGLFxuICAgICAgICAgICAgKGsgKyBjZW50ZXJbMl0pICogbm9pc2VGKTtcblxuICAgICAgICAgIHZhciB2YWx1ZTIgPSBub2lzZV9iaW9tZXMyLm5vaXNlM0QoXG4gICAgICAgICAgICAoaSArIGNlbnRlclswXSkgKiBub2lzZUYyLFxuICAgICAgICAgICAgKGogKyBjZW50ZXJbMV0pICogbm9pc2VGMixcbiAgICAgICAgICAgIChrICsgY2VudGVyWzJdKSAqIG5vaXNlRjIpO1xuXG4gICAgICAgICAgdmFyIHZhbHVlMyA9IG5vaXNlX2Jpb21lczMubm9pc2UzRChcbiAgICAgICAgICAgIChpICsgY2VudGVyWzBdKSAqIG5vaXNlRjMsXG4gICAgICAgICAgICAoaiArIGNlbnRlclsxXSkgKiBub2lzZUYzLFxuICAgICAgICAgICAgKGsgKyBjZW50ZXJbMl0pICogbm9pc2VGM1xuICAgICAgICAgICkgKyB2YWx1ZTtcblxuICAgICAgICAgIHZhbHVlID0gdmFsdWUgKiAwLjUgKyB2YWx1ZTIgKiAyLjA7XG5cbiAgICAgICAgICB2YXIgYmlvbWUgPSB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICB2YWx1ZTI6IHZhbHVlMyxcbiAgICAgICAgICAgIGlzU2VhTGV2ZWw6IGlzU2VhTGV2ZWxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIGxldmVsO1xuXG4gICAgICAgICAgaWYgKGQgPiAwLjcpIHtcbiAgICAgICAgICAgIC8vIHN1cmZhY2VcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfU1VSRkFDRTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGQgPiAwLjMpIHtcbiAgICAgICAgICAgIC8vIG1pZGRsZVxuICAgICAgICAgICAgbGV2ZWwgPSBMRVZFTF9NSURETEU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvcmVcbiAgICAgICAgICAgIGxldmVsID0gTEVWRUxfQ09SRTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBiaW9tZS5sZXZlbCA9IGxldmVsO1xuXG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGksIGosIGspO1xuICAgICAgICAgIGRhdGEuYmlvbWUgPSBiaW9tZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUdyYXZpdHlNYXAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBudW07IGorKykge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IG51bTsgaysrKSB7XG4gICAgICAgICAgdmFyIG1hcCA9IHt9O1xuICAgICAgICAgIHZhciBncmF2aXR5ID0gZ2V0R3Jhdml0eShpLCBqLCBrKTtcbiAgICAgICAgICBncmF2aXR5LmZvckVhY2goZnVuY3Rpb24oZykge1xuICAgICAgICAgICAgbWFwW2ddID0gdHJ1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoaSwgaiwgayk7XG4gICAgICAgICAgZGF0YS5ncmF2aXR5ID0gbWFwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3Jhdml0eShpLCBqLCBrKSB7XG4gICAgICB2YXIgYXJyYXkgPSBbXG4gICAgICAgIGkgKyBjZW50ZXJbMF0sXG4gICAgICAgIGogKyBjZW50ZXJbMV0sXG4gICAgICAgIGsgKyBjZW50ZXJbMl1cbiAgICAgIF07XG4gICAgICB2YXIgbWF4ID0gLUluZmluaXR5O1xuICAgICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICAgIHZhciBmO1xuICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBhcnJheS5sZW5ndGg7IGQrKykge1xuICAgICAgICB2YXIgYSA9IE1hdGguYWJzKGFycmF5W2RdKTtcbiAgICAgICAgaWYgKGEgPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSBhO1xuICAgICAgICAgIGYgPSBkICogMiArIChhcnJheVtkXSA+IDAgPyAwIDogMSk7XG4gICAgICAgICAgaW5kZXhlcyA9IFtmXTtcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhhIC0gbWF4KSA8IDAuMDEpIHtcbiAgICAgICAgICBmID0gZCAqIDIgKyAoYXJyYXlbZF0gPiAwID8gMCA6IDEpO1xuICAgICAgICAgIGluZGV4ZXMucHVzaChmKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZVN1cmZhY2UoKSB7XG4gICAgLy8gR2VuZXJhdGUgc3VyZmFjZVxuXG4gICAgdmFyIGNSYW5nZSA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdXJmYWNlTnVtOyBpKyspIHtcbiAgICAgIGNSYW5nZS5wdXNoKDAgKyBpLCBudW0gLSAxIC0gaSk7XG4gICAgfVxuXG4gICAgdmFyIGNvb3JkID0gW107XG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCAzOyBkKyspIHtcbiAgICAgIHZhciB1ID0gKGQgKyAxKSAlIDM7XG4gICAgICB2YXIgdiA9IChkICsgMikgJSAzO1xuICAgICAgY1JhbmdlLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bTsgaisrKSB7XG4gICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBudW07IGsrKykge1xuXG4gICAgICAgICAgICB2YXIgZGlzID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgIE1hdGguYWJzKGNvb3JkWzBdICsgY2VudGVyWzBdKSxcbiAgICAgICAgICAgICAgTWF0aC5hYnMoY29vcmRbMV0gKyBjZW50ZXJbMV0pLFxuICAgICAgICAgICAgICBNYXRoLmFicyhjb29yZFsyXSArIGNlbnRlclsyXSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHZhciBkaXNCaWFzID0gMSAtIChudW0gLyAyICsgMC41IC0gZGlzKSAvIHN1cmZhY2VOdW07XG5cbiAgICAgICAgICAgIGNvb3JkW2RdID0gYztcbiAgICAgICAgICAgIGNvb3JkW3VdID0gajtcbiAgICAgICAgICAgIGNvb3JkW3ZdID0gaztcblxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IFswLCAwLCAwXTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQyID0gWzAsIDAsIDBdO1xuXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBub2lzZV9zdXJmYWNlLm5vaXNlM0QoXG4gICAgICAgICAgICAgIChjb29yZFswXSArIGNlbnRlclswXSArIG9mZnNldFswXSkgKiBub2lzZUZfc3VyZmFjZSxcbiAgICAgICAgICAgICAgKGNvb3JkWzFdICsgY2VudGVyWzFdICsgb2Zmc2V0WzFdKSAqIG5vaXNlRl9zdXJmYWNlLFxuICAgICAgICAgICAgICAoY29vcmRbMl0gKyBjZW50ZXJbMl0gKyBvZmZzZXRbMl0pICogbm9pc2VGX3N1cmZhY2UpO1xuXG4gICAgICAgICAgICB2YXIgdmFsdWUyID0gbm9pc2Vfc3VyZmFjZTIubm9pc2UzRChcbiAgICAgICAgICAgICAgKGNvb3JkWzBdICsgY2VudGVyWzBdICsgb2Zmc2V0MlswXSkgKiBub2lzZUZfc3VyZmFjZTIsXG4gICAgICAgICAgICAgIChjb29yZFsxXSArIGNlbnRlclsxXSArIG9mZnNldDJbMV0pICogbm9pc2VGX3N1cmZhY2UyLFxuICAgICAgICAgICAgICAoY29vcmRbMl0gKyBjZW50ZXJbMl0gKyBvZmZzZXQyWzJdKSAqIG5vaXNlRl9zdXJmYWNlMik7XG5cbiAgICAgICAgICAgIHZhbHVlID1cbiAgICAgICAgICAgICAgKE1hdGgucG93KHZhbHVlIC8gMS41LCAxKSAqIGRpc0JpYXMgKiAwKSArXG4gICAgICAgICAgICAgIChNYXRoLnBvdyh2YWx1ZTIgLyAxLjUsIDEpICogZGlzQmlhcykgK1xuICAgICAgICAgICAgICAoLU1hdGgucG93KGRpc0JpYXMsIDEuMCkgKiAxLjAgKyAwLjYpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAwLjApIHtcbiAgICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXREYXRhKGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgICBkYXRhLmhlaWdodCA9IHZhbHVlO1xuICAgICAgICAgICAgICBncm91bmQuc2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlVGlsZXMoKSB7XG4gICAgdmFyIGNvb3JkID0gW107XG4gICAgLy8gR2VuZXJhdGUgZ3Jhc3Nlc1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnVtOyBqKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBudW07IGsrKykge1xuICAgICAgICAgIHZhciB2ID0gZ3JvdW5kLmdldChpLCBqLCBrKTtcbiAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGdyb3VuZC5zZXQoaSwgaiwgaywgW1xuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMCksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCAxKSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDIpLFxuICAgICAgICAgICAgZ2V0KFtpLCBqLCBrXSwgMyksXG4gICAgICAgICAgICBnZXQoW2ksIGosIGtdLCA0KSxcbiAgICAgICAgICAgIGdldChbaSwgaiwga10sIDUpXG4gICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQocG9zLCBmKSB7XG4gICAgICB2YXIgZCA9IE1hdGguZmxvb3IoZiAvIDIpOyAvLyAwIDEgMlxuICAgICAgdmFyIHUgPSAoZCArIDEpICUgMztcbiAgICAgIHZhciB2ID0gKGQgKyAyKSAlIDM7XG5cbiAgICAgIHZhciBkZCA9IChmIC0gZCAqIDIpID8gLTEgOiAxOyAvLyAtMSBvciAxXG5cbiAgICAgIGNvb3JkW2RdID0gcG9zW2RdICsgZGQ7XG4gICAgICBjb29yZFt1XSA9IHBvc1t1XTtcbiAgICAgIGNvb3JkW3ZdID0gcG9zW3ZdO1xuXG4gICAgICB2YXIgZGF0YSA9IGdldERhdGEocG9zWzBdLCBwb3NbMV0sIHBvc1syXSk7XG4gICAgICB2YXIgYmlvbWUgPSBkYXRhLmJpb21lO1xuXG4gICAgICB2YXIgbGV2ZWwgPSBiaW9tZS5sZXZlbDtcbiAgICAgIHZhciB2YWx1ZSA9IGJpb21lLnZhbHVlO1xuXG4gICAgICBpZiAobGV2ZWwgPT09IExFVkVMX1NVUkZBQ0UpIHtcbiAgICAgICAgaWYgKGJpb21lLmlzU2VhTGV2ZWwpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IGdldERhdGEoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG4gICAgICAgICAgdmFyIGhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgICAgIGlmIChiaW9tZS52YWx1ZTIgKiBoZWlnaHQgPCAtMC4xKSB7XG4gICAgICAgICAgICB2YXIgYWJvdmUgPSBncm91bmQuZ2V0KGNvb3JkWzBdLCBjb29yZFsxXSwgY29vcmRbMl0pO1xuICAgICAgICAgICAgdmFyIGlzU3VyZmFjZSA9ICFhYm92ZTtcbiAgICAgICAgICAgIGlmIChpc1N1cmZhY2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFNBTkQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlIDwgLTAuOCkge1xuICAgICAgICAgIHJldHVybiBTVE9ORTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgICAgICByZXR1cm4gU09JTDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdSQVNTXG5cbiAgICAgICAgLy8gT24gZWRnZVxuICAgICAgICBpZiAocG9zW2RdID09PSAwIHx8IHBvc1tkXSA9PT0gbnVtIC0gMSkge1xuICAgICAgICAgIHJldHVybiBHUkFTUztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhYm92ZSA9IGdyb3VuZC5nZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSk7XG5cbiAgICAgICAgdmFyIGlzU3VyZmFjZSA9ICFhYm92ZTtcblxuICAgICAgICByZXR1cm4gaXNTdXJmYWNlID8gR1JBU1MgOiBTT0lMO1xuXG4gICAgICB9IGVsc2UgaWYgKGxldmVsID09PSBMRVZFTF9NSURETEUpIHtcblxuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PT0gTEVWRUxfQ09SRSkge1xuXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBTVE9ORTtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldERhdGEoaSwgaiwgaykge1xuICAgIHZhciBoYXNoID0gW2ksIGosIGtdLmpvaW4oJywnKTtcbiAgICBpZiAoZGF0YU1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgICBkYXRhTWFwW2hhc2hdID0ge307XG4gICAgfVxuICAgIHJldHVybiBkYXRhTWFwW2hhc2hdO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ3JvdW5kOiBncm91bmQsXG4gICAgd2F0ZXI6IHdhdGVyLFxuICAgIGJvdW5kczogYm91bmRzLFxuICAgIG9iamVjdDogcGl2b3RcbiAgfTtcbn07XG4iLCJ2YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBrZXljb2RlID0gcmVxdWlyZSgna2V5Y29kZScpO1xuXG52YXIgYXBwID0ge307XG5cbi8vIFBvc3QgcHJvY2Vzc2luZyBzZXR0aW5nXG52YXIgcG9zdHByb2Nlc3NpbmcgPSB7IGVuYWJsZWQ6IHRydWUsIHJlbmRlck1vZGU6IDAgfTtcblxuLy8gUmVuZGVyZXIsIHNjZW5lLCBjYW1lcmFcbnZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgYW50aWFsaWFzOiB0cnVlXG59KTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweEJCRDlGNyk7XG52YXIgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbnZhciBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNjAsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAwLjEsIDEwMDApO1xudmFyIGNhbWVyYVVwLCBjYW1lcmFEaXIsIGNhbWVyYVJpZ2h0O1xuXG4vLyBQb3N0IHByb2Nlc3NpbmdcbnZhciBkZXB0aE1hdGVyaWFsO1xudmFyIGRlcHRoUmVuZGVyVGFyZ2V0O1xudmFyIHNzYW9QYXNzO1xudmFyIGVmZmVjdENvbXBvc2VyO1xuXG4vLyBTaXplXG52YXIgc2l6ZSA9IDMyO1xudmFyIGRpc1NjYWxlID0gMTI7XG5cbi8vIE9iamVjdHNcbnZhciBvYmplY3Q7XG52YXIgbm9Bb0xheWVyO1xuXG52YXIgZW50aXRpZXMgPSBbXTtcblxuLy8gTWF0ZXJpYWxzLCBUZXh0dXJlc1xudmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoKTtcbm1hdGVyaWFsLm1hdGVyaWFscyA9IFtudWxsXTtcbnZhciB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbnZhciBibG9ja1RleHR1cmVzID0gW107XG52YXIgdGV4dHVyZXMgPSB7fTtcblxuLy8gSW5wdXQgc3RhdGVzXG52YXIga2V5aG9sZHMgPSB7fTtcbnZhciBtb3VzZSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG52YXIgcmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcigpO1xudmFyIHJheWNhc3RlckRpcjtcblxuLy8gZnJhbWUgdGltZVxudmFyIGR0ID0gMSAvIDYwO1xuXG5mdW5jdGlvbiBpbml0UG9zdHByb2Nlc3NpbmcoKSB7XG5cbiAgLy8gU2V0dXAgcmVuZGVyIHBhc3NcbiAgdmFyIHJlbmRlclBhc3MgPSBuZXcgVEhSRUUuUmVuZGVyUGFzcyhzY2VuZSwgY2FtZXJhKTtcblxuICAvLyBTZXR1cCBkZXB0aCBwYXNzXG4gIGRlcHRoTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaERlcHRoTWF0ZXJpYWwoKTtcbiAgZGVwdGhNYXRlcmlhbC5kZXB0aFBhY2tpbmcgPSBUSFJFRS5SR0JBRGVwdGhQYWNraW5nO1xuICBkZXB0aE1hdGVyaWFsLmJsZW5kaW5nID0gVEhSRUUuTm9CbGVuZGluZztcblxuICB2YXIgcGFycyA9IHsgbWluRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIsIG1hZ0ZpbHRlcjogVEhSRUUuTGluZWFyRmlsdGVyIH07XG4gIGRlcHRoUmVuZGVyVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHBhcnMpO1xuXG4gIC8vIFNldHVwIFNTQU8gcGFzc1xuICBzc2FvUGFzcyA9IG5ldyBUSFJFRS5TaGFkZXJQYXNzKFRIUkVFLlNTQU9TaGFkZXIpO1xuICBzc2FvUGFzcy5yZW5kZXJUb1NjcmVlbiA9IHRydWU7XG4gIC8vc3Nhb1Bhc3MudW5pZm9ybXNbIFwidERpZmZ1c2VcIiBdLnZhbHVlIHdpbGwgYmUgc2V0IGJ5IFNoYWRlclBhc3NcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbXCJ0RGVwdGhcIl0udmFsdWUgPSBkZXB0aFJlbmRlclRhcmdldC50ZXh0dXJlO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snc2l6ZSddLnZhbHVlLnNldCh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ2NhbWVyYU5lYXInXS52YWx1ZSA9IGNhbWVyYS5uZWFyO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snY2FtZXJhRmFyJ10udmFsdWUgPSBjYW1lcmEuZmFyO1xuICBzc2FvUGFzcy51bmlmb3Jtc1snb25seUFPJ10udmFsdWUgPSAocG9zdHByb2Nlc3NpbmcucmVuZGVyTW9kZSA9PSAxKTtcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ2FvQ2xhbXAnXS52YWx1ZSA9IDAuMztcbiAgc3Nhb1Bhc3MudW5pZm9ybXNbJ2x1bUluZmx1ZW5jZSddLnZhbHVlID0gMC41O1xuXG4gIC8vIEFkZCBwYXNzIHRvIGVmZmVjdCBjb21wb3NlclxuICBlZmZlY3RDb21wb3NlciA9IG5ldyBUSFJFRS5FZmZlY3RDb21wb3NlcihyZW5kZXJlcik7XG4gIGVmZmVjdENvbXBvc2VyLmFkZFBhc3MocmVuZGVyUGFzcyk7XG4gIGVmZmVjdENvbXBvc2VyLmFkZFBhc3Moc3Nhb1Bhc3MpO1xuXG59O1xuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIC8vIFJlc2l6ZSByZW5kZXJUYXJnZXRzXG4gIHNzYW9QYXNzLnVuaWZvcm1zWydzaXplJ10udmFsdWUuc2V0KHdpZHRoLCBoZWlnaHQpO1xuXG4gIHZhciBwaXhlbFJhdGlvID0gcmVuZGVyZXIuZ2V0UGl4ZWxSYXRpbygpO1xuICB2YXIgbmV3V2lkdGggPSBNYXRoLmZsb29yKHdpZHRoIC8gcGl4ZWxSYXRpbykgfHwgMTtcbiAgdmFyIG5ld0hlaWdodCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gcGl4ZWxSYXRpbykgfHwgMTtcbiAgZGVwdGhSZW5kZXJUYXJnZXQuc2V0U2l6ZShuZXdXaWR0aCwgbmV3SGVpZ2h0KTtcbiAgZWZmZWN0Q29tcG9zZXIuc2V0U2l6ZShuZXdXaWR0aCwgbmV3SGVpZ2h0KTtcbn07XG5cbmZ1bmN0aW9uIGluaXRTY2VuZSgpIHtcbiAgdmFyIGRpcyA9IHNpemUgKiBkaXNTY2FsZTtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSBkaXM7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gZGlzO1xuICBjYW1lcmEucG9zaXRpb24ueiA9IGRpcztcbiAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygpKTtcblxuICBjYW1lcmFVcCA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApO1xuICBjYW1lcmFEaXIgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKS5hcHBseUV1bGVyKGNhbWVyYS5yb3RhdGlvbik7XG4gIGNhbWVyYVJpZ2h0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5jcm9zc1ZlY3RvcnMoY2FtZXJhVXAsIGNhbWVyYURpcik7XG5cbiAgb2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gIG9iamVjdC5zY2FsZS5zZXQoMTAsIDEwLCAxMCk7XG4gIHNjZW5lLmFkZChvYmplY3QpO1xuICBub0FvTGF5ZXIgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgb2JqZWN0LmFkZChub0FvTGF5ZXIpO1xuICB2YXIgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDg4ODg4OCk7XG4gIHZhciBkaXJlY3Rpb25hbExpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuNyk7XG4gIGRpcmVjdGlvbmFsTGlnaHQucG9zaXRpb24uc2V0KDAuMywgMS4wLCAwLjUpO1xuICBvYmplY3QuYWRkKGFtYmllbnRMaWdodCk7XG4gIG9iamVjdC5hZGQoZGlyZWN0aW9uYWxMaWdodCk7XG59O1xuXG5mdW5jdGlvbiBsb2FkUmVzb3VyY2VzKCkge1xuICB0ZXh0dXJlc1snYnVpbGRpbmcnXSA9IHRleHR1cmVMb2FkZXIubG9hZCgndGV4dHVyZXMvYnVpbGRpbmcucG5nJyk7XG5cbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ2dyYXNzJywgMSk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzb2lsJywgMik7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzb2lsMicsIDMpO1xuICBsb2FkQmxvY2tNYXRlcmlhbCgnc3RvbmUnLCA0KTtcbiAgbG9hZEJsb2NrTWF0ZXJpYWwoJ3NlYScsIDUsIDAuOCk7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdzYW5kJywgNik7XG4gIGxvYWRCbG9ja01hdGVyaWFsKCdjbG91ZCcsIDEwLCAwLjcsIG51bGwsIGZ1bmN0aW9uKG0pIHtcbiAgICBtLmVtaXNzaXZlID0gbmV3IFRIUkVFLkNvbG9yKDB4ODg4ODg4KTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBsb2FkQmxvY2tNYXRlcmlhbChuYW1lLCBpbmRleCwgYWxwaGEsIG1hdGVyaWFsVHlwZSwgdHJhbnNmb3JtKSB7XG4gIHZhciB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKCd0ZXh0dXJlcy8nICsgbmFtZSArICcucG5nJyk7XG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICB0ZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gIHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgYmxvY2tUZXh0dXJlcy5wdXNoKHRleHR1cmUpO1xuXG4gIG1hdGVyaWFsVHlwZSA9IG1hdGVyaWFsVHlwZSB8fCBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsO1xuXG4gIHZhciBtID0gbmV3IG1hdGVyaWFsVHlwZSh7XG4gICAgbWFwOiB0ZXh0dXJlXG4gIH0pO1xuXG4gIGlmIChhbHBoYSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbS50cmFuc3BhcmVudCA9IHRydWU7XG4gICAgbS5vcGFjaXR5ID0gYWxwaGE7XG4gIH1cblxuICBpZiAodHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcbiAgICB0cmFuc2Zvcm0obSk7XG4gIH1cblxuICBtYXRlcmlhbC5tYXRlcmlhbHNbaW5kZXhdID0gbTtcbn07XG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgaWYgKHBvc3Rwcm9jZXNzaW5nLmVuYWJsZWQpIHtcbiAgICBub0FvTGF5ZXIudmlzaWJsZSA9IGZhbHNlO1xuICAgIC8vIFJlbmRlciBkZXB0aCBpbnRvIGRlcHRoUmVuZGVyVGFyZ2V0XG4gICAgc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IGRlcHRoTWF0ZXJpYWw7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEsIGRlcHRoUmVuZGVyVGFyZ2V0LCB0cnVlKTtcblxuICAgIG5vQW9MYXllci52aXNpYmxlID0gdHJ1ZTtcbiAgICAvLyBSZW5kZXIgcmVuZGVyUGFzcyBhbmQgU1NBTyBzaGFkZXJQYXNzXG4gICAgc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IG51bGw7XG4gICAgZWZmZWN0Q29tcG9zZXIucmVuZGVyKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICB9XG5cbiAgdmFyIHJvdGF0ZVkgPSAwO1xuICBpZiAoa2V5aG9sZHNbJ3JpZ2h0J10pIHtcbiAgICByb3RhdGVZIC09IDAuMTtcbiAgfSBlbHNlIGlmIChrZXlob2xkc1snbGVmdCddKSB7XG4gICAgcm90YXRlWSArPSAwLjE7XG4gIH1cblxuICB2YXIgcXVhdEludmVyc2UgPSBvYmplY3QucXVhdGVybmlvbi5jbG9uZSgpLmludmVyc2UoKTtcbiAgdmFyIGF4aXMgPSBjYW1lcmFVcC5jbG9uZSgpLmFwcGx5UXVhdGVybmlvbihxdWF0SW52ZXJzZSkubm9ybWFsaXplKCk7XG4gIG9iamVjdC5xdWF0ZXJuaW9uXG4gICAgLm11bHRpcGx5KG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZShheGlzLCByb3RhdGVZKSk7XG5cbiAgdmFyIHJvdGF0ZVggPSAwO1xuICBpZiAoa2V5aG9sZHNbJ3VwJ10pIHtcbiAgICByb3RhdGVYIC09IDAuMTtcbiAgfSBlbHNlIGlmIChrZXlob2xkc1snZG93biddKSB7XG4gICAgcm90YXRlWCArPSAwLjE7XG4gIH1cblxuICBheGlzID0gY2FtZXJhUmlnaHQuY2xvbmUoKS5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpLm5vcm1hbGl6ZSgpO1xuICBvYmplY3QucXVhdGVybmlvblxuICAgIC5tdWx0aXBseShuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUoYXhpcywgcm90YXRlWCkpO1xufTtcblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbihlbnRpdHkpIHtcbiAgICBlbnRpdHkudGljayhkdCk7XG4gIH0pO1xuICByZW5kZXIoKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufTtcblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2UueCA9IChldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogMiAtIDE7XG4gIG1vdXNlLnkgPSAtKGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogMiArIDE7XG5cbiAgLy8gdXBkYXRlIHRoZSBwaWNraW5nIHJheSB3aXRoIHRoZSBjYW1lcmEgYW5kIG1vdXNlIHBvc2l0aW9uICBcbiAgcmF5Y2FzdGVyLnNldEZyb21DYW1lcmEobW91c2UsIGNhbWVyYSk7XG4gIHJheWNhc3RlckRpciA9IHJheWNhc3Rlci5yYXkuZGlyZWN0aW9uLmNsb25lKCk7XG59O1xuXG5mdW5jdGlvbiBvbk1vdXNlRG93bihldmVudCkge1xuICAvLyBjYWxjdWxhdGUgb2JqZWN0cyBpbnRlcnNlY3RpbmcgdGhlIHBpY2tpbmcgcmF5XG4gIHZhciBpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdCh0ZXJyaWFuLm9iamVjdCwgdHJ1ZSk7XG4gIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBwb2ludCA9IGludGVyc2VjdHNbMF0ucG9pbnQuY2xvbmUoKVxuICAgIC5hZGQocmF5Y2FzdGVyRGlyLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoMC4wMSkpO1xuXG4gIHZhciBsb2NhbFBvaW50ID0gdGVycmlhbi5vYmplY3Qud29ybGRUb0xvY2FsKHBvaW50KTtcbiAgdmFyIGNvb3JkID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgTWF0aC5mbG9vcihsb2NhbFBvaW50LngpLFxuICAgIE1hdGguZmxvb3IobG9jYWxQb2ludC55KSxcbiAgICBNYXRoLmZsb29yKGxvY2FsUG9pbnQueilcbiAgKTtcblxuICBjb25zb2xlLmxvZyh0ZXJyaWFuLmdyb3VuZC5nZXRBdChjb29yZCkpO1xuXG5cbiAgLy8gaWYgKGludGVyc2VjdHMubGVuZ3RoID09PSAwKSB7XG4gIC8vICAgcmV0dXJuO1xuICAvLyB9XG5cbiAgLy8gdmFyIHBvaW50ID0gaW50ZXJzZWN0c1swXS5wb2ludDtcbiAgLy8gcG9pbnQuYWRkKHJheWNhc3Rlci5yYXkuZGlyZWN0aW9uLmNsb25lKCkubm9ybWFsaXplKCkubXVsdGlwbHlTY2FsYXIoMC4wMSkpO1xuICAvLyBwb2ludCA9IG1lc2gud29ybGRUb0xvY2FsKHBvaW50KTtcblxuICAvLyB2YXIgY29vcmQgPSBbXG4gIC8vICAgTWF0aC5mbG9vcihwb2ludC54KSxcbiAgLy8gICBNYXRoLmZsb29yKHBvaW50LnkpLFxuICAvLyAgIE1hdGguZmxvb3IocG9pbnQueilcbiAgLy8gXTtcbiAgLy8gdGVycmlhbi5jaHVuay5zZXQoY29vcmRbMF0sIGNvb3JkWzFdLCBjb29yZFsyXSwgbnVsbCk7XG5cbiAgLy8gbWVzaC5wYXJlbnQucmVtb3ZlKG1lc2gpO1xuICAvLyBnZW9tZXRyeS5kaXNwb3NlKCk7XG4gIC8vIGdlb21ldHJ5ID0gbWVzaGVyKHRlcnJpYW4uY2h1bmspO1xuXG4gIC8vIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAvLyBvYmplY3QuYWRkKG1lc2gpO1xuICAvLyBtZXNoLnBvc2l0aW9uLmNvcHkoY2VudGVyKTtcbn07XG5cbmZ1bmN0aW9uIG9uTW91c2VVcChldmVudCkge1xuXG59O1xuXG5mdW5jdGlvbiBvbktleURvd24oZSkge1xuICB2YXIga2V5ID0ga2V5Y29kZShlKTtcbiAga2V5aG9sZHNba2V5XSA9IHRydWU7XG59O1xuXG5mdW5jdGlvbiBvbktleVVwKGUpIHtcbiAgdmFyIGtleSA9IGtleWNvZGUoZSk7XG4gIGtleWhvbGRzW2tleV0gPSBmYWxzZTtcbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24sIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXAsIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XG5cbmxvYWRSZXNvdXJjZXMoKTtcbmluaXRQb3N0cHJvY2Vzc2luZygpO1xuaW5pdFNjZW5lKCk7XG5cbi8vIEluaXQgYXBwXG52YXIgYnVpbGRpbmcgPSByZXF1aXJlKCcuL2VudGl0aWVzL2J1aWxkaW5nJykodGV4dHVyZXNbJ2J1aWxkaW5nJ10sIG5vQW9MYXllciwgY2FtZXJhKTtcbmVudGl0aWVzLnB1c2goYnVpbGRpbmcpO1xuXG52YXIgY2xvdWQgPSByZXF1aXJlKCcuL2VudGl0aWVzL2Nsb3VkJykobm9Bb0xheWVyLCBtYXRlcmlhbCk7XG5lbnRpdGllcy5wdXNoKGNsb3VkKTtcblxudmFyIHRlcnJpYW4gPSByZXF1aXJlKCcuL2VudGl0aWVzL3RlcnJpYW4nKShzaXplLCBvYmplY3QsIG1hdGVyaWFsKTtcblxuYW5pbWF0ZSgpO1xuIiwidmFyIENodW5rID0gZnVuY3Rpb24oc2hhcGUpIHtcbiAgdGhpcy52b2x1bWUgPSBbXTtcbiAgdGhpcy5zaGFwZSA9IHNoYXBlIHx8IFsxNiwgMTYsIDE2XTtcbiAgdGhpcy5kaW1YID0gdGhpcy5zaGFwZVswXTtcbiAgdGhpcy5kaW1YWSA9IHRoaXMuc2hhcGVbMF0gKiB0aGlzLnNoYXBlWzFdO1xufTtcblxuQ2h1bmsucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgcmV0dXJuIHRoaXMudm9sdW1lW2kgKiB0aGlzLmRpbVhZICsgaiAqIHRoaXMuZGltWCArIGtdO1xufTtcblxuQ2h1bmsucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGksIGosIGssIHYpIHtcbiAgdGhpcy52b2x1bWVbaSAqIHRoaXMuZGltWFkgKyBqICogdGhpcy5kaW1YICsga10gPSB2O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaHVuaztcbiIsInZhciBDaHVuayA9IHJlcXVpcmUoJy4vY2h1bmsnKTtcblxudmFyIENodW5rcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1hcCA9IHt9O1xuICB0aGlzLmNodW5rU2l6ZSA9IDE2O1xufTtcblxuQ2h1bmtzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihpLCBqLCBrLCB2KSB7XG4gIHZhciBvcmlnaW4gPSB0aGlzLmdldE9yaWdpbihpLCBqLCBrKTtcbiAgdmFyIGhhc2ggPSBvcmlnaW4udG9BcnJheSgpLmpvaW4oJywnKTtcbiAgaWYgKHRoaXMubWFwW2hhc2hdID09IG51bGwpIHtcbiAgICB0aGlzLm1hcFtoYXNoXSA9IHtcbiAgICAgIGNodW5rOiBuZXcgQ2h1bmsoKSxcbiAgICAgIG9yaWdpbjogb3JpZ2luXG4gICAgfVxuICB9XG5cbiAgdGhpcy5tYXBbaGFzaF0uZGlydHkgPSB0cnVlO1xuICB0aGlzLm1hcFtoYXNoXS5jaHVuay5zZXQoaSAtIG9yaWdpbi54LCBqIC0gb3JpZ2luLnksIGsgLSBvcmlnaW4ueiwgdik7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLnNldEF0ID0gZnVuY3Rpb24oY29vcmQsIHYpIHtcbiAgdGhpcy5zZXQoY29vcmQueCwgY29vcmQueSwgY29vcmQueiwgdik7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLnNldERpcnR5ID0gZnVuY3Rpb24oaSwgaiwgaykge1xuICB2YXIgb3JpZ2luID0gdGhpcy5nZXRPcmlnaW4oaSwgaiwgayk7XG4gIHZhciBoYXNoID0gb3JpZ2luLnRvQXJyYXkoKS5qb2luKCcsJyk7XG4gIGlmICh0aGlzLm1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMubWFwW2hhc2hdLmRpcnR5ID0gdHJ1ZTtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaSwgaiwgaywgdikge1xuICB2YXIgb3JpZ2luID0gdGhpcy5nZXRPcmlnaW4oaSwgaiwgayk7XG4gIHZhciBoYXNoID0gb3JpZ2luLnRvQXJyYXkoKS5qb2luKCcsJyk7XG4gIGlmICh0aGlzLm1hcFtoYXNoXSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIG9yaWdpbiA9IHRoaXMubWFwW2hhc2hdLm9yaWdpbjtcbiAgcmV0dXJuIHRoaXMubWFwW2hhc2hdLmNodW5rLmdldChpIC0gb3JpZ2luLngsIGogLSBvcmlnaW4ueSwgayAtIG9yaWdpbi56KTtcbn07XG5cbkNodW5rcy5wcm90b3R5cGUuZ2V0QXQgPSBmdW5jdGlvbihjb29yZCkge1xuICByZXR1cm4gdGhpcy5nZXQoY29vcmQueCwgY29vcmQueSwgY29vcmQueik7XG59O1xuXG5DaHVua3MucHJvdG90eXBlLmdldE9yaWdpbiA9IGZ1bmN0aW9uKGksIGosIGspIHtcbiAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgIE1hdGguZmxvb3IoaSAvIHRoaXMuY2h1bmtTaXplKSxcbiAgICBNYXRoLmZsb29yKGogLyB0aGlzLmNodW5rU2l6ZSksXG4gICAgTWF0aC5mbG9vcihrIC8gdGhpcy5jaHVua1NpemUpXG4gICkubXVsdGlwbHlTY2FsYXIodGhpcy5jaHVua1NpemUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaHVua3M7XG4iLCJ2YXIgR3JlZWR5TWVzaCA9IChmdW5jdGlvbigpIHtcbiAgLy9DYWNoZSBidWZmZXIgaW50ZXJuYWxseVxuICB2YXIgbWFzayA9IG5ldyBJbnQzMkFycmF5KDQwOTYpO1xuXG4gIHJldHVybiBmdW5jdGlvbihmLCBkaW1zKSB7XG4gICAgdmFyIHZlcnRpY2VzID0gW10sXG4gICAgICBmYWNlcyA9IFtdLFxuICAgICAgdXZzID0gW10sXG4gICAgICBkaW1zWCA9IGRpbXNbMF0sXG4gICAgICBkaW1zWSA9IGRpbXNbMV0sXG4gICAgICBkaW1zWFkgPSBkaW1zWCAqIGRpbXNZO1xuXG4gICAgLy9Td2VlcCBvdmVyIDMtYXhlc1xuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgMzsgKytkKSB7XG4gICAgICB2YXIgaSwgaiwgaywgbCwgdywgVywgaCwgbiwgYyxcbiAgICAgICAgdSA9IChkICsgMSkgJSAzLFxuICAgICAgICB2ID0gKGQgKyAyKSAlIDMsXG4gICAgICAgIHggPSBbMCwgMCwgMF0sXG4gICAgICAgIHEgPSBbMCwgMCwgMF0sXG4gICAgICAgIGR1ID0gWzAsIDAsIDBdLFxuICAgICAgICBkdiA9IFswLCAwLCAwXSxcbiAgICAgICAgZGltc0QgPSBkaW1zW2RdLFxuICAgICAgICBkaW1zVSA9IGRpbXNbdV0sXG4gICAgICAgIGRpbXNWID0gZGltc1t2XSxcbiAgICAgICAgcWRpbXNYLCBxZGltc1hZLCB4ZDtcblxuICAgICAgdmFyIGZsaXAsIGluZGV4LCB2YWx1ZTtcblxuICAgICAgaWYgKG1hc2subGVuZ3RoIDwgZGltc1UgKiBkaW1zVikge1xuICAgICAgICBtYXNrID0gbmV3IEludDMyQXJyYXkoZGltc1UgKiBkaW1zVik7XG4gICAgICB9XG5cbiAgICAgIHFbZF0gPSAxO1xuICAgICAgeFtkXSA9IC0xO1xuXG4gICAgICBxZGltc1ggPSBkaW1zWCAqIHFbMV1cbiAgICAgIHFkaW1zWFkgPSBkaW1zWFkgKiBxWzJdXG5cbiAgICAgIC8vIENvbXB1dGUgbWFza1xuICAgICAgd2hpbGUgKHhbZF0gPCBkaW1zRCkge1xuICAgICAgICB4ZCA9IHhbZF1cbiAgICAgICAgbiA9IDA7XG5cbiAgICAgICAgZm9yICh4W3ZdID0gMDsgeFt2XSA8IGRpbXNWOyArK3hbdl0pIHtcbiAgICAgICAgICBmb3IgKHhbdV0gPSAwOyB4W3VdIDwgZGltc1U7ICsreFt1XSwgKytuKSB7XG4gICAgICAgICAgICB2YXIgYSA9IHhkID49IDAgJiYgZih4WzBdLCB4WzFdLCB4WzJdKSxcbiAgICAgICAgICAgICAgYiA9IHhkIDwgZGltc0QgLSAxICYmIGYoeFswXSArIHFbMF0sIHhbMV0gKyBxWzFdLCB4WzJdICsgcVsyXSlcbiAgICAgICAgICAgIGlmIChhID8gYiA6ICFiKSB7XG4gICAgICAgICAgICAgIG1hc2tbbl0gPSAwO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmxpcCA9ICFhO1xuXG4gICAgICAgICAgICBpbmRleCA9IGQgKiAyO1xuICAgICAgICAgICAgaWYgKGZsaXApIHtcbiAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsdWUgPSAoYSB8fCBiKVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmIChmbGlwKSB7XG4gICAgICAgICAgICAgIHZhbHVlICo9IC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXNrW25dID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgKyt4W2RdO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIG1lc2ggZm9yIG1hc2sgdXNpbmcgbGV4aWNvZ3JhcGhpYyBvcmRlcmluZ1xuICAgICAgICBuID0gMDtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGRpbXNWOyArK2opIHtcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGltc1U7KSB7XG4gICAgICAgICAgICBjID0gbWFza1tuXTtcbiAgICAgICAgICAgIGlmICghYykge1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgIG4rKztcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQ29tcHV0ZSB3aWR0aFxuICAgICAgICAgICAgdyA9IDE7XG4gICAgICAgICAgICB3aGlsZSAoYyA9PT0gbWFza1tuICsgd10gJiYgaSArIHcgPCBkaW1zVSkgdysrO1xuXG4gICAgICAgICAgICAvL0NvbXB1dGUgaGVpZ2h0ICh0aGlzIGlzIHNsaWdodGx5IGF3a3dhcmQpXG4gICAgICAgICAgICBmb3IgKGggPSAxOyBqICsgaCA8IGRpbXNWOyArK2gpIHtcbiAgICAgICAgICAgICAgayA9IDA7XG4gICAgICAgICAgICAgIHdoaWxlIChrIDwgdyAmJiBjID09PSBtYXNrW24gKyBrICsgaCAqIGRpbXNVXSkgaysrXG4gICAgICAgICAgICAgICAgaWYgKGsgPCB3KSBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIHF1YWRcbiAgICAgICAgICAgIC8vIFRoZSBkdS9kdiBhcnJheXMgYXJlIHJldXNlZC9yZXNldFxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggaXRlcmF0aW9uLlxuICAgICAgICAgICAgZHVbZF0gPSAwO1xuICAgICAgICAgICAgZHZbZF0gPSAwO1xuICAgICAgICAgICAgeFt1XSA9IGk7XG4gICAgICAgICAgICB4W3ZdID0gajtcblxuICAgICAgICAgICAgaWYgKGMgPiAwKSB7XG4gICAgICAgICAgICAgIGR2W3ZdID0gaDtcbiAgICAgICAgICAgICAgZHZbdV0gPSAwO1xuICAgICAgICAgICAgICBkdVt1XSA9IHc7XG4gICAgICAgICAgICAgIGR1W3ZdID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGMgPSAtYztcbiAgICAgICAgICAgICAgZHVbdl0gPSBoO1xuICAgICAgICAgICAgICBkdVt1XSA9IDA7XG4gICAgICAgICAgICAgIGR2W3VdID0gdztcbiAgICAgICAgICAgICAgZHZbdl0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZlcnRleF9jb3VudCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goW3hbMF0sIHhbMV0sIHhbMl1dKTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goW3hbMF0gKyBkdVswXSwgeFsxXSArIGR1WzFdLCB4WzJdICsgZHVbMl1dKTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goW3hbMF0gKyBkdVswXSArIGR2WzBdLCB4WzFdICsgZHVbMV0gKyBkdlsxXSwgeFsyXSArIGR1WzJdICsgZHZbMl1dKTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goW3hbMF0gKyBkdlswXSwgeFsxXSArIGR2WzFdLCB4WzJdICsgZHZbMl1dKTtcbiAgICAgICAgICAgIHV2cy5wdXNoKFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgWzAsIDBdLFxuICAgICAgICAgICAgICAgIFtkdVt1XSwgZHVbdl1dLFxuICAgICAgICAgICAgICAgIFtkdVt1XSArIGR2W3VdLCBkdVt2XSArIGR2W3ZdXSxcbiAgICAgICAgICAgICAgICBbZHZbdV0sIGR2W3ZdXVxuICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgZmFjZXMucHVzaChbdmVydGV4X2NvdW50LCB2ZXJ0ZXhfY291bnQgKyAxLCB2ZXJ0ZXhfY291bnQgKyAyLCB2ZXJ0ZXhfY291bnQgKyAzLCBjXSk7XG5cbiAgICAgICAgICAgIC8vWmVyby1vdXQgbWFza1xuICAgICAgICAgICAgVyA9IG4gKyB3O1xuICAgICAgICAgICAgZm9yIChsID0gMDsgbCA8IGg7ICsrbCkge1xuICAgICAgICAgICAgICBmb3IgKGsgPSBuOyBrIDwgVzsgKytrKSB7XG4gICAgICAgICAgICAgICAgbWFza1trICsgbCAqIGRpbXNVXSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9JbmNyZW1lbnQgY291bnRlcnMgYW5kIGNvbnRpbnVlXG4gICAgICAgICAgICBpICs9IHc7XG4gICAgICAgICAgICBuICs9IHc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHZlcnRpY2VzOiB2ZXJ0aWNlcywgZmFjZXM6IGZhY2VzLCB1dnM6IHV2cyB9O1xuICB9XG59KSgpO1xuXG5pZiAoZXhwb3J0cykge1xuICBleHBvcnRzLm1lc2hlciA9IEdyZWVkeU1lc2g7XG59XG4iLCJ2YXIgbWVzaGVyID0gcmVxdWlyZSgnLi9tZXNoZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaHVua3MsIHBhcmVudCwgbWF0ZXJpYWwpIHtcbiAgZm9yICh2YXIgaWQgaW4gY2h1bmtzLm1hcCkge1xuICAgIHZhciBjaHVuayA9IGNodW5rcy5tYXBbaWRdO1xuICAgIHZhciBkYXRhID0gY2h1bmsuY2h1bms7XG4gICAgaWYgKGNodW5rLmRpcnR5KSB7XG5cbiAgICAgIGlmIChjaHVuay5tZXNoICE9IG51bGwpIHtcbiAgICAgICAgY2h1bmsubWVzaC5wYXJlbnQucmVtb3ZlKGNodW5rLm1lc2gpO1xuICAgICAgICBjaHVuay5tZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9yaWdpbiA9IGNodW5rLm9yaWdpbjtcblxuICAgICAgdmFyIGdlb21ldHJ5ID0gbWVzaGVyKGNodW5rLmNodW5rLCBmdW5jdGlvbihpLCBqLCBrKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEuZ2V0KGksIGosIGspO1xuICAgICAgfSk7XG4gICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBtZXNoLnBvc2l0aW9uLmNvcHkoY2h1bmsub3JpZ2luKTtcbiAgICAgIHBhcmVudC5hZGQobWVzaCk7XG5cbiAgICAgIGNodW5rLmRpcnR5ID0gZmFsc2U7XG4gICAgICBjaHVuay5tZXNoID0gbWVzaDtcbiAgICB9XG4gIH1cbn1cbiIsInZhciBncmVlZHlNZXNoZXIgPSByZXF1aXJlKCcuL2dyZWVkeScpLm1lc2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaHVuaywgZikge1xuICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblxuICBmID0gZiB8fCBmdW5jdGlvbihpLCBqLCBrKSB7XG4gICAgcmV0dXJuIGNodW5rLmdldChpLCBqLCBrKTtcbiAgfTtcbiAgdmFyIHJlc3VsdCA9IGdyZWVkeU1lc2hlcihmLCBjaHVuay5zaGFwZSk7XG5cbiAgcmVzdWx0LnZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIHZhciB2ZXJ0aWNlID0gbmV3IFRIUkVFLlZlY3RvcjModlswXSwgdlsxXSwgdlsyXSk7XG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaCh2ZXJ0aWNlKTtcbiAgfSk7XG5cbiAgcmVzdWx0LmZhY2VzLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgIHZhciBmYWNlID0gbmV3IFRIUkVFLkZhY2UzKGZbMF0sIGZbMV0sIGZbMl0pO1xuICAgIGZhY2UubWF0ZXJpYWxJbmRleCA9IGZbNF07XG4gICAgZ2VvbWV0cnkuZmFjZXMucHVzaChmYWNlKTtcblxuICAgIGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMoZlsyXSwgZlszXSwgZlswXSk7XG4gICAgZmFjZS5tYXRlcmlhbEluZGV4ID0gZls0XTtcbiAgICBnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xuICB9KTtcblxuICBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWzBdID0gW107XG4gIHJlc3VsdC51dnMuZm9yRWFjaChmdW5jdGlvbih1dikge1xuICAgIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbMF0ucHVzaChbXG4gICAgICB1dlswXSxcbiAgICAgIHV2WzFdLFxuICAgICAgdXZbMl1cbiAgICBdLCBbXG4gICAgICB1dlsyXSxcbiAgICAgIHV2WzNdLFxuICAgICAgdXZbMF1cbiAgICBdKTtcbiAgfSk7XG5cbiAgZ2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XG5cbiAgcmV0dXJuIGdlb21ldHJ5O1xufTtcbiJdfQ==
