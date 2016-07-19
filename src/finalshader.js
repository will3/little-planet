var finalshader = {
  uniforms: {
    "tDiffuse": { value: null }, // The base scene buffer
    "tGlow": { value: null } // The glow scene buffer
  },

  vertexShader: [
    "varying vec2 vUv;",

    "void main() {",

    "vUv = vec2( uv.x, uv.y );",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform sampler2D tGlow;",

    "varying vec2 vUv;",

    "void main() {",

    "vec4 texel = texture2D( tDiffuse, vUv );",
    "vec4 glow = texture2D( tGlow, vUv );",
    "gl_FragColor = texel + glow * 1.0;",

    "}"
  ].join("\n")
};

module.exports = finalshader;
