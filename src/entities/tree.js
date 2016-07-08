var THREE = require('three');
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
