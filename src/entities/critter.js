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
