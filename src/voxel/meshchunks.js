var mesher = require('./mesher');

module.exports = function(chunks, parent, material, f) {
  for (var id in chunks.map) {
    var chunk = chunks.map[id];
    if (chunk.dirty) {

      if (chunk.mesh != null) {
        chunk.mesh.parent.remove(chunk.mesh);
        chunk.mesh.geometry.dispose();
      }

      var origin = chunk.origin;

      var chunkF = f == null ? null : function(i, j, k) {
        return f(i + origin.x, j + origin.y, k + origin.z);
      };

      var geometry = mesher(chunk.chunk, chunkF);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(chunk.origin);
      parent.add(mesh);

      chunk.dirty = false;
      chunk.mesh = mesh;
    }
  }
}
