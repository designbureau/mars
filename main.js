import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";

const textureLoader = new THREE.TextureLoader();
const ddsLoader = new DDSLoader();
const TDSloader = new TDSLoader();
TDSloader.setResourcePath("static/moons/textures/");

const marsNormalMap = ddsLoader.load("static/textures/Mars-16k-normalmap.dds");
// const marsNormalTexture = ddsLoader.load("static/textures/Mars-16k-050104.dds");
const marsNormalTexture = ddsLoader.load("static/textures/Mars-Shaded-16K.dds");

const phobosTexture = textureLoader.load("static/moons/textures/phobos.png");
const phobosNormalTexture = textureLoader.load(
  "static/moons/extra_material_for_play/phobos_normal.jpg"
);

const deimosTexture = textureLoader.load("static/moons/textures/deimos.png");
const deimosNormalTexture = textureLoader.load(
  "static/moons/extra_material_for_play/deimos_normal.jpg"
);

const marsMaterial = new THREE.MeshPhongMaterial({
  emissive: new THREE.Color("#000000"),
  specular: new THREE.Color("#1a1a1a"),
  shininess: 0.001,
  map: marsNormalTexture,
  normalMap: marsNormalMap,
  // normalScale: new Vector2(1.25, 1.25),
});

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.close();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// scene.background = new THREE.CubeTextureLoader()
//   .setPath("static/textures/cubemaps/nasa/8k/compressed/")
//   .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

scene.background = new THREE.CubeTextureLoader()
  .setPath("static/textures/cubemaps/nasa/8k/compressed/edited/")
  .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

// scene.background = new THREE.CubeTextureLoader()
//   .setPath("static/textures/cubemaps/ksp/compressed/")
//   .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

// console.log(scene.background);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(2)
  .step(0.001)
  .name("Ambient Light");
// scene.add(ambientLight);

// Directional light

const directionalLightColor = new THREE.Color("#ffcec8");

const directionalLight = new THREE.DirectionalLight(
  directionalLightColor,
  1.25
);
directionalLight.position.set(3, 1.5, 3.5);
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(2)
  .step(0.001)
  .name("Directional Light");
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

const pointlight = new THREE.PointLight(0x000000, 0, 100);
pointlight.position.set(2, 2, 3.5);
// scene.add(pointlight);

/**
 * Materials
 */

const surfaceMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib["lights"],
    {
      globeTexture: { type: "t", value: null },
    },
  ]),
  transparent: true,
  blending: THREE.AdditiveBlending,
  lights: true,
});
// surfaceMaterial.uniforms.globeTexture.value = marsNormalTexture;

const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,

  // lights: true,
});

/**
 * Objects
 */

const sizeFactor = 10000;

const marsRadiusActual = 3390;
const marsRadius = marsRadiusActual / sizeFactor;

// const jupiterRadius = 1;
// let marsRadiusJupiter = 0.048489079;

const phobosRadiusActual = 11;
const phobosRadius = phobosRadiusActual / sizeFactor;

let phobos = null;

const marsGroup = new THREE.Group();

TDSloader.load("static/moons/models/phobos.3DS", function (object) {
  phobos = object.children[0];
  let semiMajorAxis = 9376 / sizeFactor;

  phobos.position.x = semiMajorAxis;
  // phobos.position.`` = semiMajorAxis;
  const phobosMaterial = new THREE.MeshPhongMaterial({
    emissive: new THREE.Color("#000305"),
    specular: new THREE.Color("#0c0a08"),
    shininess: 0.005,
    map: phobosTexture,
    normalMap: phobosNormalTexture,
    // normalScale: new Vector2(1.5, 1.5),
  });
  phobos.material = phobosMaterial;
  phobos.scale.set(phobosRadius, phobosRadius, phobosRadius);

  marsGroup.add(phobos);
});

const deimosRadiusActual = 6;
const deimosRadius = deimosRadiusActual / sizeFactor;

let deimos = null;

TDSloader.load("static/moons/models/deimos.3ds", function (object) {
  deimos = object.children[0];
  let semiMajorAxis = 23463 / sizeFactor;

  deimos.position.x = -semiMajorAxis;
  // phobos.position.`` = semiMajorAxis;
  const deimosMaterial = new THREE.MeshPhongMaterial({
    emissive: new THREE.Color("#000305"),
    specular: new THREE.Color("#0c0a08"),
    shininess: 0.005,
    map: deimosTexture,
    normalMap: deimosNormalTexture,
    // normalScale: new Vector2(1.5, 1.5),
  });
  deimos.material = deimosMaterial;
  deimos.scale.set(deimosRadius, deimosRadius, deimosRadius);

  marsGroup.add(deimos);
});

const marsGeometry = new THREE.SphereBufferGeometry(marsRadius, 64, 64);
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
// const mars = new THREE.Mesh(marsGeometry, surfaceMaterialNew);

marsGroup.add(mars);

const marsSurfaceAtmosphere = new THREE.Mesh(marsGeometry, surfaceMaterial);
marsSurfaceAtmosphere.scale.set(1.0025, 1.0025, 1.0025);
marsGroup.add(marsSurfaceAtmosphere);

const marsAtmopshere = new THREE.Mesh(marsGeometry, atmosphereMaterial);
marsAtmopshere.scale.set(1.1, 1.1, 1.1);
marsGroup.add(marsAtmopshere);

const shadowMaterial = new THREE.MeshPhysicalMaterial();
shadowMaterial.transparent = true;
shadowMaterial.opacity = 0.5;
shadowMaterial.blending = THREE.MultiplyBlending;

const shadowMesh = new THREE.Mesh(marsGeometry, shadowMaterial);
shadowMesh.scale.set(1.003, 1.003, 1.003);
shadowMesh.receiveShadow = true;
marsGroup.add(shadowMesh);

scene.add(marsGroup);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  20,
  sizes.width / sizes.height,
  0.1,
  10000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1.5;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 0.45;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.autoClear = false;

const postprocessing = {};

function initPostprocessing() {
  const renderPass = new RenderPass(scene, camera);

  const bokehPass = new BokehPass(scene, camera, {
    focus: 100,
    aperture: 0.6,
    maxblur: 0.001,
    width: sizes.width,
    height: sizes.height,
  });

  const composer = new EffectComposer(renderer);

  composer.addPass(renderPass);
  composer.addPass(bokehPass);

  postprocessing.composer = composer;
  postprocessing.bokeh = bokehPass;
}

initPostprocessing();

const effectController = {
  focus: 100,
  aperture: 0.6,
  maxblur: 0.001,
};

const matChanger = function () {
  postprocessing.bokeh.uniforms["focus"].value = effectController.focus;
  postprocessing.bokeh.uniforms["aperture"].value =
    effectController.aperture * 0.00001;
  postprocessing.bokeh.uniforms["maxblur"].value = effectController.maxblur;
};

gui.add(effectController, "focus", 0.0, 3000.0, 10).onChange(matChanger);
gui.add(effectController, "aperture", 0, 10, 0.1).onChange(matChanger);
gui.add(effectController, "maxblur", 0.0, 0.01, 0.001).onChange(matChanger);
gui.close();

matChanger();

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  mars.rotation.y += 0.00005;

  // Render
  // renderer.render(scene, camera);
  postprocessing.composer.render(0.1);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
