var Voxel = require('../voxel');
var Chunks = Voxel.Chunks;
var meshChunks = Voxel.meshChunks;
var copyChunks = Voxel.copyChunks;
var Dir = require('../dir');

module.exports = function(parent, blockMaterial, terrian) {
  var centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
  var data = require('../data/critter0');
  var frames = data.frames;
  var bounds = data.bounds;
  var offset = data.bounds.max.clone().sub(data.bounds.min).add(new THREE.Vector3(1, 1, 1)).multiplyScalar(-0.5);
  var scale = 1 / 5.0;
  var inverseScale = 1 / scale;
  var currentSurface = null;
  var targetSurface = null;
  var dirArrows = [];
  var debugArrows = false;
  var debugPath = false;
  var currentFrame = 0;

  var object = new THREE.Object3D();
  object.scale.set(scale, scale, scale);
  var object2 = new THREE.Object3D();
  object2.position.copy(offset);
  var objectRotation = new THREE.Object3D();
  var position = new THREE.Vector3();
  var path = [];

  var chunks = new Chunks();

  var geometryCache = data.geometryCache;
  updateCurrentFrame();

  parent.add(object);
  object.add(objectRotation);
  objectRotation.add(object2);

  var nextSurface = null;
  var nextSurfaceConnection = null;

  var movementSpeed = 0.1;
  var stepSize = 0.006;
  var frameInterval = stepSize / movementSpeed;
  var frameCounter = 0;
  var totalFrames = frames.length;
  var walking = false;
  var lastProgress = 0;

  function updateCurrentFrame() {
    var cache = geometryCache[currentFrame];
    if (cache == null) {
      cache = geometryCache[currentFrame] = {};
    }

    chunks.clear().deserialize(frames[currentFrame]);
    meshChunks(chunks, object2, blockMaterial, cache);
  };

  function tick(dt) {
    walking = false;
    if (nextSurface == null) {
      if (path.length > 0) {
        var nextSurfaceHash = path[0];
        path.shift();
        nextSurface = terrian.surfaceMap.getWithHash(nextSurfaceHash);
        var connection = currentSurface.connections[nextSurfaceHash];
        objectRotation.quaternion.copy(connection.quat);
        nextSurfaceConnection = connection;
      }
    }

    if (nextSurface != null) {
      var dis = nextSurface.positionAbove.clone()
        .sub(position);
      var disLength = dis.length();

      if (disLength <= movementSpeed) {
        currentSurface = nextSurface;
        nextSurface = null;
        updatePosition();
      } else {
        var velocity = dis.normalize().multiplyScalar(movementSpeed);
        position.add(velocity);
        object.position.copy(position);
      }

      // oriented to next surface when progressed half way
      var progress = disLength / nextSurfaceConnection.dis;

      if (lastProgress >= 0.5 && progress < 0.5) {
        object.quaternion.copy(nextSurface.quat);
      }

      lastProgress = progress;

      walking = true;
    }

    if (walking) {
      frameCounter += dt;
      if (frameCounter > frameInterval) {
        currentFrame++;
        currentFrame %= totalFrames;
        frameCounter -= frameInterval;
        updateCurrentFrame();
      }
    } else {
      frameCounter = 0;
      if (currentFrame !== 0) {
        currentFrame = 0;
        updateCurrentFrame();
      }
    }

  };

  function updatePosition() {
    position.copy(currentSurface.positionAbove);
    object.position.copy(position);
    object.quaternion.copy(currentSurface.quat);

    if (debugArrows) {
      showDebugArrows();
    }
  };

  function showDebugArrows() {
    dirArrows.forEach(function(arrow) {
      arrow.parent.remove(arrow);
    });
    dirArrows = [];

    currentSurface.connections.forEach(function(connection) {
      var dir = connection.surface.positionAbove.clone().sub(currentSurface.positionAbove).normalize();
      var arrow = new THREE.ArrowHelper(
        dir,
        currentSurface.positionAbove.clone(),
        connection.dis
      );
      parent.add(arrow);
      dirArrows.push(arrow);
    });
  };

  function setCoord(coord, f) {
    var surfaceMap = terrian.surfaceMap;
    var surfaceSelected = surfaceMap.get(coord.x, coord.y, coord.z, f);

    if (surfaceSelected == null) {
      return;
    }

    if (currentSurface == null) {
      currentSurface = surfaceSelected;
      updatePosition();
      // random facing
      objectRotation.rotation.y = Math.floor(Math.random() * 8) * Math.PI / 4;
    } else {
      targetSurface = surfaceSelected;
      updatePath();
    }
  };

  function updatePath() {
    var startDate = new Date().getTime();

    if (path.length > 1) {
      path.length = 1;
    }

    var surfaceMap = terrian.surfaceMap;
    var disDiffRatio = 10.0;
    var result = terrian.surfaceMap.findShortest(
      path[0] == null ? currentSurface : terrian.surfaceMap.getWithHash(path[0]),
      targetSurface, {
        getDistance: function(a, b) {
          var surface1 = surfaceMap.getWithHash(a);
          var surface2 = surfaceMap.getWithHash(b);
          if (surface1.blocked || surface2.blocked) {
            return Infinity;
          }
          var dest = targetSurface;

          var dis = surfaceMap.graphMap[a][b];

          var disDiff = (surface2.positionAbove.clone().distanceTo(dest.positionAbove)) -
            (surface1.positionAbove.clone().distanceTo(dest.positionAbove));

          return dis + disDiff * disDiffRatio;
        }
      });
    if (result != null) {
      result.shift();
      path = path.concat(result);
    }

    var endDate = new Date().getTime();

    if (debugPath) {
      console.log(endDate - startDate);
    }
  };

  return {
    tick: tick,
    setCoord: setCoord
  };
};
