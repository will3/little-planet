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

  function add(coord) {

    var shapeRatio = 2;
    var leafHeight = 3;
    var density = 0.8;
    var shape1 = Math.random() * 4 + 4;
    var shape2 = shape1 * shapeRatio;
    var trunkHeight = leafHeight + shape2 - 4;

    var radius = shape1 * Math.sqrt(2) / 2;

    var terrianCoord = coord.clone().multiplyScalar(self.scale);
    var gravity = terrian.calcGravity(terrianCoord.x, terrianCoord.y, terrianCoord.z);
    var dir = Dir.getOpposite(gravity[Math.floor(gravity.length * Math.random())]);

    var upVector = new THREE.Vector3(0, 1, 0);
    var unitVector = Dir.getUnitVector(dir);
    var quat = new THREE.Quaternion().setFromUnitVectors(upVector, unitVector);
    var d = Math.floor(dir / 2);

    var leafShape = [shape1, shape2, shape1];

    var leafCenter = [
      Math.round(-leafShape[0] / 2),
      Math.round(-leafShape[1] / 2),
      Math.round(-leafShape[2] / 2)
    ];

    var chunks2 = new Chunks();

    for (var i = 0; i < trunkHeight; i++) {
      var c = new THREE.Vector3(0, i, 0).applyQuaternion(quat);

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
      if (diff < 0) {
        return;
      }

      if (diff < 1) {
        if (diff > Math.random()) {
          return;
        }
      }

      c.applyQuaternion(quat);

      roundVector(c);

      chunks2.set(c.x, c.y, c.z, LEAF);
    });

    removeFloating(chunks2, [0, 0, 0]);

    copyChunks(chunks2, chunks, coord);
    meshChunks(chunks, object, blockMaterial);
  };

  function start() {
    object.scale.set(self.scale, self.scale, self.scale);
    parent.add(object);
  };

  var object = new THREE.Object3D();
  var self = {
    add: add,
    object: object,
    scale: 0.2
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
