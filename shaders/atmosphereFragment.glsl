varying vec3 vertexNormal;

void main() {

    float intensity = pow(0.2 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 1.8);

    gl_FragColor = vec4(0.31, 0.48, 0.7, 1) * intensity;
}
