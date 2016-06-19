module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      js: {
        src: ['node_modules/three/build/three.js'],
        dest: 'js',
        flatten: true,
        expand: true
      },

      js_shaders: {
        src: [
          'node_modules/three/examples/js/shaders/*'
        ],
        dest: 'js/shaders',
        flatten: true,
        expand: true
      },

      js_postprocessing: {
        src: [
          'node_modules/three/examples/js/postprocessing/*'
        ],
        dest: 'js/postprocessing',
        flatten: true,
        expand: true
      }
    },
    shell: {
      open: {
        command: 'open http://localhost:3000/index.html'
      },
      build: {
        command: 'npm run build'
      }
    },
    connect: {
      server: {
        port: 3000,
        keepalive: true
      }
    },
    concurrent: {
      dev: ['shell:build', 'connect']
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['copy', 'shell:open', 'concurrent:dev']);
};
