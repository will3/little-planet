module.exports = function(size, env) {
  
  if (env === 'dev') {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  // Objects
  var object = new THREE.Object3D();

  var modelSize = 5;
  var disScale = 1.2 * modelSize;

  // Post processing setting
  var postprocessing = { enabled: true, renderMode: 0 };

  // Renderer, scene, camera
  var renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xBBD9F7);

  var scene = new THREE.Scene();
  var fov = 60;
  var camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight,
    0.1, 1000);

  // Post processing
  var depthMaterial;
  var depthRenderTarget;
  var ssaoPass;
  var effectComposer;
  var finalComposer;

  var textures = {};

  function initPostprocessing() {
    var width = window.innerWidth;
    var height = window.innerHeight;

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

    //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
    ssaoPass.uniforms["tDepth"].value = depthRenderTarget.texture;
    ssaoPass.uniforms['size'].value.set(window.innerWidth, window.innerHeight);
    ssaoPass.uniforms['cameraNear'].value = camera.near;
    ssaoPass.uniforms['cameraFar'].value = camera.far;
    ssaoPass.uniforms['onlyAO'].value = (postprocessing.renderMode == 1);
    ssaoPass.uniforms['aoClamp'].value = 100.0;
    ssaoPass.uniforms['lumInfluence'].value = 0.7;
    ssaoPass.renderToScreen = true;

    // Add pass to effect composer
    effectComposer = new THREE.EffectComposer(renderer);
    effectComposer.addPass(renderPass);
    effectComposer.addPass(ssaoPass);
  };


  window.addEventListener('resize', onWindowResize);

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

    object.scale.set(modelSize, modelSize, modelSize);
    scene.add(object);
    var ambientLight = new THREE.AmbientLight(0x888888);
    object.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0.3, 1.0, 0.5);
    object.add(directionalLight);

    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight2.position.set(-0.3, -1.0, -0.5);
    object.add(directionalLight2);
  };

  function render() {
    if (env === 'dev') {
      stats.begin();
    }

    if (postprocessing.enabled) {
      // Render depth into depthRenderTarget
      scene.overrideMaterial = depthMaterial;
      renderer.render(scene, camera, depthRenderTarget, true);
      scene.overrideMaterial = null;

      effectComposer.render();
    } else {
      renderer.render(scene, camera);
    }

    if (env === 'dev') {
      stats.end();
    }
  };

  function start() {
    initPostprocessing();
    initScene();
  };

  return {
    start: start,
    render: render,
    camera: camera,
    object: object
  }
};
