uniform sampler2D globeTexture;
varying vec2 vertexUV;
varying vec3 vertexNormal;

varying vec3 vPos;

// struct PointLight {
//     vec3 position;
//     vec3 color;
// };
// uniform PointLight pointLights[NUM_POINT_LIGHTS];

void main() {

    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.31, 0.48, 0.7) * pow(intensity, 1.85);
    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);

    // vec4 addedLights = vec4(0., 0., 0., 1.0);
    // for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
    //     vec3 adjustedLight = pointLights[l].position + cameraPosition;
    //     vec3 lightDirection = normalize(vPos - adjustedLight);
    //     addedLights.rgb += clamp(dot(-lightDirection, vertexNormal), 0.0, 1.6) * pointLights[l].color;
    // }
    // / gl_FragColor = mix(vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0), addedLights, 0.05);

}
