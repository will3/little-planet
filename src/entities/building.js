var Chunk = require('../voxel/chunk');
var mesher = require('../voxel/mesher');

var WALL = 7;
var WINDOW = 8;

module.exports = function(material, parent, camera) {

  var shape = [2, 8, 2];
  var chunk = new Chunk();

  var scale = 0.2;
  var position = new THREE.Vector3(0, 17, 0);

  for (var i = 0; i < shape[0]; i++) {
    for (var j = 0; j < shape[1]; j++) {
      for (var k = 0; k < shape[2]; k++) {
        chunk.set(i, j, k, [WALL, WALL, WALL, WALL, WALL, WALL]);
      }
    }
  }

  var geometry = mesher(chunk);

  var object = new THREE.Mesh(geometry, material);
  object.position.copy(position);
  parent.add(object);
  object.scale.set(scale, scale, scale);

  function tick(dt) {

  };

  return {
    tick: tick
  };
};
