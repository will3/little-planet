var THREE = require('three');
var keycode = require('keycode');

var app = {};

// Post processing setting
var postprocessing = { enabled: true, renderMode: 0 };

// Renderer, scene, camera
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xBBD9F7);
// renderer.setClearColor(0x222222);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,
  0.1, 1000);
var cameraUp, cameraDir, cameraRight;

// Post processing
var depthMaterial;
var depthRenderTarget;
var ssaoPass;
var effectComposer;

// Size
var size = 32;
var disScale = 12;

// Objects
var object;
var noAoLayer;

var entities = [];

// Materials, Textures
var material = new THREE.MultiMaterial();
material.materials = [null];
var textureLoader = new THREE.TextureLoader();
var blockTextures = [];
var textures = {};

// Input states
var keyholds = {};
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var raycasterDir;

// frame time
var dt = 1 / 60;

function initPostprocessing() {

  // Setup render pass
  var renderPass = new THREE.RenderPass(scene, camera);

  // Setup depth pass
  depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.depthPacking = THREE.RGBADepthPacking;
  depthMaterial.blending = THREE.NoBlending;

  var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);

  // Setup SSAO pass
  ssaoPass = new THREE.ShaderPass(THREE.SSAOShader);
  ssaoPass.renderToScreen = true;
  //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
  ssaoPass.uniforms["tDepth"].value = depthRenderTarget.texture;
  ssaoPass.uniforms['size'].value.set(window.innerWidth, window.innerHeight);
  ssaoPass.uniforms['cameraNear'].value = camera.near;
  ssaoPass.uniforms['cameraFar'].value = camera.far;
  ssaoPass.uniforms['onlyAO'].value = (postprocessing.renderMode == 1);
  ssaoPass.uniforms['aoClamp'].value = 0.3;
  ssaoPass.uniforms['lumInfluence'].value = 0.5;

  // Add pass to effect composer
  effectComposer = new THREE.EffectComposer(renderer);
  effectComposer.addPass(renderPass);
  effectComposer.addPass(ssaoPass);

};

function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Resize renderTargets
  ssaoPass.uniforms['size'].value.set(width, height);

  var pixelRatio = renderer.getPixelRatio();
  var newWidth = Math.floor(width / pixelRatio) || 1;
  var newHeight = Math.floor(height / pixelRatio) || 1;
  depthRenderTarget.setSize(newWidth, newHeight);
  effectComposer.setSize(newWidth, newHeight);
};

function initScene() {
  var dis = size * disScale;
  camera.position.x = dis;
  camera.position.y = dis;
  camera.position.z = dis;
  camera.lookAt(new THREE.Vector3());

  cameraUp = new THREE.Vector3(0, 1, 0);
  cameraDir = new THREE.Vector3(0, 0, 1).applyEuler(camera.rotation);
  cameraRight = new THREE.Vector3().crossVectors(cameraUp, cameraDir);

  object = new THREE.Object3D();
  object.scale.set(10, 10, 10);
  scene.add(object);
  noAoLayer = new THREE.Object3D();
  object.add(noAoLayer);
  var ambientLight = new THREE.AmbientLight(0x888888);
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(0.3, 1.0, 0.5);
  object.add(ambientLight);
  object.add(directionalLight);
};

function loadResources() {
  loadBlockMaterial('grass', 1);
  loadBlockMaterial('soil', 2);
  loadBlockMaterial('soil2', 3);
  loadBlockMaterial('stone', 4);
  loadBlockMaterial('sea', 5, 0.8);
  loadBlockMaterial('sand', 6);
  loadBlockMaterial('wall', 7);
  loadBlockMaterial('window', 8);

  loadBlockMaterial('cloud', 10, 0.8, null, function(m) {
    m.emissive = new THREE.Color(0x888888);
  });
};

function loadBlockMaterial(name, index, alpha, materialType, transform) {
  var texture = textureLoader.load('textures/' + name + '.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  blockTextures.push(texture);

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
};

function render() {
  if (postprocessing.enabled) {
    noAoLayer.visible = false;
    // Render depth into depthRenderTarget
    scene.overrideMaterial = depthMaterial;
    renderer.render(scene, camera, depthRenderTarget, true);

    noAoLayer.visible = true;
    // Render renderPass and SSAO shaderPass
    scene.overrideMaterial = null;
    effectComposer.render();
  } else {
    renderer.render(scene, camera);
  }

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

function animate() {
  entities.forEach(function(entity) {
    entity.tick(dt);
  });
  render();
  requestAnimationFrame(animate);
};

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and mouse position  
  raycaster.setFromCamera(mouse, camera);
  raycasterDir = raycaster.ray.direction.clone();
};

function onMouseDown(event) {
  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObject(terrian.object, true);
  if (intersects.length === 0) {
    return;
  }

  var point = intersects[0].point.clone()
    .add(raycasterDir.clone().multiplyScalar(0.01));

  var localPoint = terrian.object.worldToLocal(point);
  var coord = new THREE.Vector3(
    Math.floor(localPoint.x),
    Math.floor(localPoint.y),
    Math.floor(localPoint.z)
  );

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
};

function onMouseUp(event) {

};

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
window.addEventListener('resize', onWindowResize);

loadResources();
initPostprocessing();
initScene();

// Init app
// var building = require('./entities/building')(material, noAoLayer, camera);
// entities.push(building);

var cloud = require('./entities/cloud')(object, material);
entities.push(cloud);

var terrian = require('./entities/terrian')(size, object, material);

// var Chunks = require('./voxel/chunks');
// var chunks = new Chunks();
// var len = 32;

// var material = new THREE.MultiMaterial();
// material.materials.push(null, new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   transparent: true,
//   opacity: 0.5
// }));

// for (var i = 0; i < len; i++) {
//   for (var j = 0; j < len; j++) {
//     for (var k = 0; k < len; k++) {
//       chunks.set(i, j, k, [1, 1, 1, 1, 1, 1]);
//     }
//   }
// }

// var meshChunks = require('./voxel/meshchunks');
// var testObject = new THREE.Object3D();
// testObject.scale.set(5, 5, 5);
// scene.add(testObject);
// meshChunks(chunks, testObject, material);

animate();
