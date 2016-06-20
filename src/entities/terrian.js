var THREE = require('three');
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
