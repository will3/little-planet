var THREE = require('three');
var keycode = require('keycode');

var renderer = new THREE.WebGLRenderer({
  antialias: true
});

document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xBBD9F7);

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
var meshChunks = require('./voxel/meshchunks');

var size = 32;
var dis = size * 1.2;
camera.position.x = dis;
camera.position.y = dis;
camera.position.z = dis;
camera.lookAt(new THREE.Vector3());

var material = new THREE.MultiMaterial();
var textureLoader = new THREE.TextureLoader();

var textures = [];

material.materials = [null];

function loadTexture(name, index, alpha, materialType, transform) {
  var texture = textureLoader.load('textures/' + name + '.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textures.push(texture);

  materialType = materialType || THREE.MeshLambertMaterial;

  var m = new materialType({
    map: texture
  });

  if (alpha !== undefined) {
    m.transparent = true;
    m.opacity = alpha;
  }

  if (transform !== undefined) {
    transform(m);
  }

  material.materials[index] = m;
}

loadTexture('grass', 1);
loadTexture('soil', 2);
loadTexture('soil2', 3);
loadTexture('stone', 4);
loadTexture('sea', 5, 0.95);
loadTexture('sand', 6);
loadTexture('cloud', 10, 0.9, null, function(m) {
  m.emissive = new THREE.Color(0x888888);
  m.reflectivity = 0.8;
});

var object = new THREE.Object3D();

// var cloudMesh = new THREE.Mesh();
// var cloud = require('./cloud')([8, 1, 14]);
// var cloudGeometry = mesher(cloud.chunk);
// cloudMesh.geometry = cloudGeometry;
// cloudMesh.material = material;
// object.add(cloudMesh);
// cloudMesh.position.set(0, 21, 0);

var terrian = require('./terrian')(size);

var pivot = new THREE.Object3D();

meshChunks(terrian.chunk, pivot, material);
meshChunks(terrian.water, pivot, material);

var center = new THREE.Vector3()
  .subVectors(terrian.bounds.min, terrian.bounds.size)
  .multiplyScalar(0.5);
pivot.position.copy(center);
object.add(pivot);
scene.add(object);

var ambientLight = new THREE.AmbientLight(0x666666);
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0.3, 1.0, 0.5);
object.add(ambientLight);
object.add(directionalLight);

function render() {
  renderer.render(scene, camera);
  if (keyholds['right']) {
    object.rotation.y -= 0.05;
  } else if (keyholds['left']) {
    object.rotation.y += 0.05;
  }

  if (keyholds['up']) {
    object.rotation.x -= 0.05;
  } else if (keyholds['down']) {
    object.rotation.x += 0.05;
  }
};

function animate() {
  render();
  requestAnimationFrame(animate);
};

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and mouse position  
  raycaster.setFromCamera(mouse, camera);

  if (isDrag) {
    // calculate objects intersecting the picking ray
    // var intersects = raycaster.intersectObjects(object.children);

    // if (intersects.length === 0) {
    //   return;
    // }

    // var point = intersects[0].point;
    // point.add(raycaster.ray.direction.clone().normalize().multiplyScalar(0.01));
    // point = mesh.worldToLocal(point);

    // var coord = [
    //   Math.floor(point.x),
    //   Math.floor(point.y),
    //   Math.floor(point.z)
    // ];
    // terrian.chunk.set(coord[0], coord[1], coord[2], null);

    // mesh.parent.remove(mesh);
    // geometry.dispose();
    // geometry = mesher(terrian.chunk);

    // mesh = new THREE.Mesh(geometry, material);
    // object.add(mesh);
    // mesh.position.copy(center);
  }
};

var isDrag = false;

function onMouseDown(event) {
  isDrag = true;
};

function onMouseUp(event) {
  isDrag = false;
};

var keyholds = {};

function onKeyDown(e) {
  var key = keycode(e);
  keyholds[key] = true;
};

function onKeyUp(e) {
  var key = keycode(e);
  keyholds[key] = false;
};

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

animate();
