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
