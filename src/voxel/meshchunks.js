var mesher = require('./mesher');

module.exports = function(chunks, parent, material) {
  for (var id in chunks.map) {
    var chunk = chunks.map[id];
    if (chunk.dirty) {

      if (chunk.mesh != null) {
        chunk.mesh.parent.remove(chunk.mesh);
        chunk.mesh.geometry.dispose();
      }

      var geometry = mesher(chunk.chunk);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(chunk.origin);
      parent.add(mesh);

      chunk.dirty = false;
    }
  }
}
