var Voxel = require('voxel');
var Dir = require('../../Dir');
var Chunks = Voxel.Chunks;
var Graph = require('node-dijkstra');

var SurfaceMap = function() {
  this.chunks = new Chunks();
  this.graphMap = {};
  this.graph = new Graph();
  this.lookup = {};
};

SurfaceMap.prototype.update = function(terrian) {
  var upVector = new THREE.Vector3(0, 1, 0);
  var centerOffset = new THREE.Vector3(0.5, 0.5, 0.5);
  var ground = terrian.ground;

  var self = this;
  ground.visit(function(i, j, k, v) {
    var data = terrian.getData(i, j, k);
    var surface = data.surface || {};
    var gravity = data.gravity;

    for (var f in gravity) {
      var result = terrian.isSurface(i, j, k, f);

      if (result) {
        var surfaces = self.chunks.get(i, j, k);
        if (surfaces == null) {
          surfaces = {};
          self.chunks.set(i, j, k, surfaces);
        }

        var unitVector = Dir.getUnitVector(f).multiplyScalar(-1);
        var positionAbove = new THREE.Vector3(i, j, k).add(unitVector).add(centerOffset);
        var quat = new THREE.Quaternion().setFromUnitVectors(upVector, unitVector);
        var inverseQuat = new THREE.Quaternion().setFromUnitVectors(unitVector, upVector);

        var hash = [i, j, k, f].join(',');
        surfaces[f] = {
          coord: [i, j, k],
          hash: hash,
          face: f,
          positionAbove: positionAbove,
          quat: quat,
          inverseQuat: inverseQuat,
          connections: {}
        }

        self.lookup[hash] = surfaces[f];
      }
    }
  });

  var self = this;
  this.visit(function(surface) {
    self.updateConnections(surface);
  });

  this.graph = new Graph(this.graphMap);
};

SurfaceMap.prototype.updateConnections = function(surface) {
  var coord = surface.coord;
  var f = surface.face;
  var d = Math.floor(surface.face / 2);
  var u = (d + 1) % 3;
  var v = (d + 2) % 3;

  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      for (var k = -1; k <= 1; k++) {
        var coord2 = [coord[0], coord[1], coord[2]];
        coord2[d] += i;
        coord2[u] += j;
        coord2[v] += k;
        var surfaces = this.getAt(coord2[0], coord2[1], coord2[2]);
        var forwardVector = new THREE.Vector3(0, 0, 1);

        for (var f2 in surfaces) {
          var surface2 = surfaces[f2];

          if (surface === surface2) {
            continue;
          }

          var disVector = surface2.positionAbove.clone().sub(surface.positionAbove);
          var dis = disVector.length();
          var quatVector = disVector.clone().normalize();
          var quatVectorArray = quatVector.toArray();
          quatVectorArray[d] = 0;
          quatVector
            .fromArray(quatVectorArray)
            .normalize()
            .applyQuaternion(surface.inverseQuat);

          if (dis < 2) {
            var quat = new THREE.Quaternion().setFromUnitVectors(
              forwardVector,
              quatVector);
            surface.connections[surface2.hash] = {
              surface: surface2,
              dis: dis,
              quat: quat
            };

            if (this.graphMap[surface.hash] == null) {
              this.graphMap[surface.hash] = {};
            }
            this.graphMap[surface.hash][surface2.hash] = dis;
          }
        }
      }
    }
  }
};

SurfaceMap.prototype.findShortest = function(surface, surface2, options) {
  var self = this;
  options = options || {
    getDistance: function(a, b) {
      var disDiffRatio = 10.0
      var surfaceA = self.getWithHash(a);
      var surfaceB = self.getWithHash(b);
      if (surfaceA.blocked || surfaceB.blocked) {
        return Infinity;
      }
      var dest = surface2;

      var dis = self.graphMap[a][b];

      var disDiff = (surfaceB.positionAbove.clone().distanceTo(dest.positionAbove)) -
        (surfaceA.positionAbove.clone().distanceTo(dest.positionAbove));

      return dis + disDiff * disDiffRatio;
    }
  }
  return this.graph.shortestPath(surface.hash, surface2.hash, options);
};

SurfaceMap.prototype.getAt = function(i, j, k) {
  return this.chunks.get(i, j, k) || {};
};

SurfaceMap.prototype.get = function(i, j, k, f) {
  return this.getAt(i, j, k)[f];
};

SurfaceMap.prototype.getWithHash = function(hash) {
  return this.lookup[hash];
};

SurfaceMap.prototype.visit = function(callback) {
  this.chunks.visit(function(i, j, k, v) {
    for (var f in v) {
      callback(v[f]);
    }
  });
};

module.exports = SurfaceMap;
