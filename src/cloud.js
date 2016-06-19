var ndarray = require('ndarray');
var SimplexNoise = require('simplex-noise');

var CLOUD = 10;

module.exports = function(shape) {
  var chunk = ndarray([], shape);

  var noise_shape = new SimplexNoise(Math.random);

  var center = [-shape[0] / 2 + 0.5, -shape[1] / 2 + 0.5, -shape[2] / 2 + 0.5];

  for (var i = 0; i < shape[0]; i++) {
    for (var j = 0; j < shape[1]; j++) {
      for (var k = 0; k < shape[2]; k++) {
        chunk.set(i, j, k, [CLOUD, CLOUD, CLOUD, CLOUD, CLOUD, CLOUD]);
      }
    }
  }

  var totalDis = shape[0] + shape[1] + shape[2];
  var halfTotalDis = totalDis / 2;

  for (var i = 0; i < shape[0]; i++) {
    for (var j = 0; j < shape[1]; j++) {
      for (var k = 0; k < shape[2]; k++) {

        var noiseF = 0.1;

        var dis =
          Math.abs(i + center[0]) +
          Math.abs(j + center[1]) +
          Math.abs(k + center[2]);
        var disBias = dis / totalDis;

        var value = noise_shape.noise3D(
          (i + center[0]) * noiseF,
          (j + center[1]) * noiseF,
          (k + center[2]) * noiseF
        );

        value = (value - 1) * 0.1 + -disBias + 0.4;

        if (value < 0) {
          chunk.set(i, j, k, null);
        }
      }

    }
  }

  return {
    chunk: chunk
  };
}
