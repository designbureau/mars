varying vec2 vertexUV;
varying vec3 vertexNormal;
// varying vec3 vPos;

void main() {
    vertexUV = uv;
    // vPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
