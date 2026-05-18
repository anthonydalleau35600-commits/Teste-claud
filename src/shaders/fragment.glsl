uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uOpacity;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

void main() {
  // Blend colors based on elevation
  float t = (vElevation + 0.6) * 0.8;
  t = clamp(t, 0.0, 1.0);

  vec3 color;
  if (t < 0.5) {
    color = mix(uColorA, uColorB, t * 2.0);
  } else {
    color = mix(uColorB, uColorC, (t - 0.5) * 2.0);
  }

  // Fresnel-like rim lighting
  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
  float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
  color += fresnel * 0.3 * uColorC;

  // Pulsing glow based on time
  float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
  color += pulse * 0.05 * uColorC;

  // UV-based pattern overlay
  vec2 uvOffset = vUv - 0.5;
  float ring = smoothstep(0.48, 0.5, length(uvOffset)) - smoothstep(0.5, 0.52, length(uvOffset));
  color += ring * uColorC * 0.4;

  gl_FragColor = vec4(color, uOpacity);
}
