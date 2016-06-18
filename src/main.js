var THREE = require('three');

var renderer = new THREE.WebGLRenderer({
  antialias: true
});

document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,
  0.1, 1000);

window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

var ndarray = require('ndarray');
var mesher = require('./voxel/mesher');

var dis = 20;
camera.position.x = dis;
camera.position.y = dis;
camera.position.z = dis;
camera.lookAt(new THREE.Vector3());


var material = new THREE.MultiMaterial();
var textureLoader = new THREE.TextureLoader();

var textures = [];

function loadTexture(name) {
  var texture = textureLoader.load('textures/' + name + '.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textures.push(texture);
}

material.materials = [null];

loadTexture('grass');
loadTexture('soil');
textures.forEach(function(texture) {
  material.materials.push(new THREE.MeshBasicMaterial({
    map: texture
  }));
});

var mesh = new THREE.Mesh();
mesh.material = material;

var num = 16;
var ground = ndarray([], [num, num, num]);

for (var i = 0; i < num; i++) {
  for (var j = 0; j < num; j++) {
    for (var k = 0; k < num; k++) {
      ground.set(i, j, k, Math.random() < 0.5 ? 0 : 1);
    }
  }
}

var voxelFaces = [null, [2, 2, 1, 2, 2, 2]];
var geometry = mesher(ground, voxelFaces);
mesh.geometry = geometry;

var object = new THREE.Object3D();
object.add(mesh);
mesh.position.set(-num / 2, -num / 2, -num / 2);
scene.add(object);

function render() {
  renderer.render(scene, camera);
};

function animate() {
  render();
  requestAnimationFrame(animate);
};

animate();
