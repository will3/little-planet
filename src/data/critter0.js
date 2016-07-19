var TRUNK = [20, 20, 20, 20, 20, 20];
var LEAF = [21, 21, 21, 21, 21, 21];
var GLOW = [30, 30, 30, 30, 30, 30];

var body0 = [
  [2, 1, 1, TRUNK],
  [2, 2, 1, TRUNK],
  [2, 3, 1, TRUNK],
  [3, 3, 1, TRUNK],
  [4, 3, 1, TRUNK],
  [4, 4, 1, TRUNK],
  [2, 5, 1, TRUNK],
  [3, 5, 1, TRUNK],
  [4, 5, 1, TRUNK],

  [1, 3, 1, TRUNK],
  [0, 3, 1, TRUNK],

  [0, 4, 1, TRUNK],
  [1, 5, 1, TRUNK],
  [0, 5, 1, TRUNK],

  [1, 4, 1, GLOW],
  [2, 4, 1, GLOW],
  [3, 4, 1, GLOW]
];

var feet0 = [
  [3, 0, 1, TRUNK],
  [3, 1, 1, TRUNK],
  [1, 0, 1, TRUNK],
  [1, 1, 1, TRUNK]
];

var feet1 = [
  [3, 0, 2, TRUNK],
  [3, 1, 2, TRUNK],
  [1, 0, 0, TRUNK],
  [1, 1, 0, TRUNK]
];

var feet2 = [
  [3, 0, 0, TRUNK],
  [3, 1, 0, TRUNK],
  [1, 0, 2, TRUNK],
  [1, 1, 2, TRUNK]
];

var frames = [
  body0.concat(feet0),
  body0.concat(feet1),
  body0.concat(feet0),
  body0.concat(feet2)
];

module.exports = {
  frames: frames,
  bounds: calcBounds(frames),
  geometryCache: []
};

function calcBounds(frames) {
  var min = new THREE.Vector3(Infinity, Infinity, Infinity);
  var max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

  frames.forEach(function(frame) {
    frame.forEach(function(v) {
      if (v[0] < min.x) { min.x = v[0]; }
      if (v[1] < min.y) { min.y = v[1]; }
      if (v[2] < min.z) { min.z = v[2]; }
      if (v[0] > max.x) { max.x = v[0]; }
      if (v[1] > max.y) { max.y = v[1]; }
      if (v[2] > max.z) { max.z = v[2]; }
    });
  });

  return {
    min: min,
    max: max
  };
};
