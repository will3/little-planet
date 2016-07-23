var THREE = require('three');
var keycode = require('keycode');
var config = require('../config');
var app = {};
var env = config.env || 'production';

module.exports = function() {

  var self = {};

  // Size
  var size = 32;

  var scene = require('./scene')(size, env);
  var camera = scene.camera;
  var object = scene.object;

  var blockMaterial = require('./blockMaterial')();

  var entities = [];

  // frame time
  var dt = 1 / 60;

  var input = require('./input')(self, camera, object);

  var cloud = require('../entities/cloud')(size + 11, object, blockMaterial);
  entities.push(cloud);
  var terrian = require('../entities/terrian')(size, object, blockMaterial);
  var tree = require('../entities/tree')(terrian.object, blockMaterial, terrian);

  function animate() {
    input.tick(dt);
    entities.forEach(function(entity) {
      entity.tick(dt);
    });
    scene.render();
    requestAnimationFrame(animate);
  };

  function start() {
    scene.start();
    animate();
  };

  function zoom(ratio) {
    camera.fov *= ratio;
    camera.updateProjectionMatrix();
  };

  self.start = start;
  self.zoom = zoom;
  self.terrian = terrian;

  return self;
};
