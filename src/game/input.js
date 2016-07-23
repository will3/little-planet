var keycode = require('keycode');
var Dir = require('../dir');

module.exports = function(game, camera, object) {

  var zoomSpeed = 1.1;
  // Input states
  var keyholds = {};
  var mouse = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  var raycasterDir;

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('mouseup', onMouseUp, false);
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);

  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position  
    raycaster.setFromCamera(mouse, camera);
    raycasterDir = raycaster.ray.direction.clone();
  };

  function onMouseDown(event) {
    var terrian = game.terrian;
    if (terrian == null) {
      return;
    }

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObject(terrian.object, true);
    if (intersects.length === 0) {
      return;
    }

    var point = intersects[0].point.clone()
      .add(raycasterDir.clone().multiplyScalar(-0.01));

    var localPoint = terrian.object.worldToLocal(point);
    var coord = new THREE.Vector3(
      Math.floor(localPoint.x),
      Math.floor(localPoint.y),
      Math.floor(localPoint.z)
    );

    var point2 = intersects[0].point.clone()
      .add(raycasterDir.clone().multiplyScalar(0.01));
    var localPoint2 = terrian.object.worldToLocal(point2);
    var coord2 = new THREE.Vector3(
      Math.floor(localPoint2.x),
      Math.floor(localPoint2.y),
      Math.floor(localPoint2.z)
    );

    var unitVector = coord2.clone().sub(coord);
    var f = Dir.unitVectorToDir(unitVector);
    if (f != null) {
      onClickedSurface(event, coord2, f);
    }
  };

  function onClickedSurface(event, coord, f) {

  };

  function onMouseUp(event) {

  };

  function onKeyDown(e) {
    var key = keycode(e);
    keyholds[key] = true;

    if (key === '=') {
      game.zoom(1 / zoomSpeed);
    }

    if (key === '-') {
      game.zoom(zoomSpeed);
    }
  };

  function onKeyUp(e) {
    var key = keycode(e);
    keyholds[key] = false;
  };

  function tick(dt) {
    var cameraUp = new THREE.Vector3(0, 1, 0);
    var cameraDir = new THREE.Vector3(0, 0, 1).applyEuler(camera.rotation);
    var cameraRight = new THREE.Vector3().crossVectors(cameraUp, cameraDir);
    
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

  return {
    tick: tick
  };
};
