var Voxel = require('../../voxel');
var Dir = require('../../dir');

var Chunks = Voxel.Chunks;
var meshChunks = Voxel.meshChunks;
var copyChunks = Voxel.copyChunks;

var centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);

module.exports = function(parent, blockMaterial, terrian) {
  // Data of critter
  var data = require('../../data/critter0');
  // Frames of data
  var frames = data.frames;
  // Bounds of data
  var bounds = data.bounds;
  // Offset that should be applied to internal mesh
  var offset = data.bounds.max.clone().sub(data.bounds.min).add(new THREE.Vector3(1, 1, 1)).multiplyScalar(-0.5);
  // Scale of critter, comparing to terrian mesh
  var scale = 1 / 5.0;
  // Inverse scale
  var inverseScale = 1 / scale;
  // Current surface that the critter is on
  var currentSurface = null;
  // Current target surface that the critter is going to
  var targetSurface = null;
  // Dir arrow objects currently shown, for debug purposes
  var dirArrows = [];
  // If true, show debug arrows
  var debugArrows = false;
  // If true, log path finding
  var debugPath = false;
  // Current frame of critter
  var currentFrame = 0;

  // Root object of critter
  var object = new THREE.Object3D();
  // Object 2, to center blocks
  var object2 = new THREE.Object3D();
  // Object to apply rotation to
  var objectRotation = new THREE.Object3D();
  // Position of critter
  var position = new THREE.Vector3();
  // Current path
  var path = [];

  // Chunks of this critter
  var chunks = new Chunks();

  // Cache of geometry by frame
  var geometryCache = data.geometryCache;

  // Next surface this critter is going to
  var nextSurface = null;
  // Next surface connection this critter is travelling
  var nextSurfaceConnection = null;

  // Movement speed
  var movementSpeed = 0.1;
  // Step size, changing this changes frame interval
  var stepSize = 0.006;
  // Frame interval
  var frameInterval = stepSize / movementSpeed;
  // Counter for frame
  var frameCounter = 0;
  // Total frames
  var totalFrames = frames.length;
  // If the critter is walking
  var walking = false;
  // Progress between currentSurface and nextSurface
  var lastProgress = 0;

  object.scale.set(scale, scale, scale);
  object2.position.copy(offset);
  updateCurrentFrame();
  parent.add(object);
  object.add(objectRotation);
  objectRotation.add(object2);

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
    var result = terrian.surfaceMap.findShortest(
      path[0] == null ? currentSurface : terrian.surfaceMap.getWithHash(path[0]),
      targetSurface);

    if (result != null) {
      result.shift();
      path = path.concat(result);
    }

    var endDate = new Date().getTime();

    if (debugPath) {
      console.log(endDate - startDate);
    }
  };

  function idle() {
    
  };

  return {
    tick: tick,
    setCoord: setCoord
  };
};