module.exports = function() {
  
  var textureLoader = new THREE.TextureLoader();

  // Materials, Textures
  var blockMaterial = new THREE.MultiMaterial();
  blockMaterial.materials = [null];
  var blockTextures = [];

  function loadAll() {
    loadBlockMaterial('grass', 1);
    loadBlockMaterial('soil', 2);
    loadBlockMaterial('soil2', 3);
    loadBlockMaterial('stone', 4);
    loadBlockMaterial('sea', 5, 0.8);
    loadBlockMaterial('sand', 6);
    loadBlockMaterial('wall', 7);

    loadBlockMaterial('window', 8, 0.8);

    loadBlockMaterial('cloud', 10, 0.7);

    loadBlockMaterial('trunk', 20);
    loadBlockMaterial('leaf', 21);

    loadBlockMaterial('glow', 30, null);
  };

  function loadBlockMaterial(name, index, alpha) {
    var texture = textureLoader.load('textures/' + name + '.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    blockTextures.push(texture);

    var m = new THREE.MeshBasicMaterial({
      map: texture
    });

    if (alpha != null) {
      m.transparent = true;
      m.opacity = alpha;
    }

    blockMaterial.materials[index] = m;

    return m;
  };

  loadAll();

  return blockMaterial;
};
