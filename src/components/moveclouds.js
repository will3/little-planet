module.exports = function(app, dt) {
  var clouds = app.clouds;

  clouds.forEach(function(cloud) {
    moveCloud(cloud, dt);
  })
};

function moveCloud(cloud) {
	
};
