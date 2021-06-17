import * as THREE from '//techbrood.com/threejs/build/three.module.js';
import Stats from '//techbrood.com/threejs/examples/jsm/libs/stats.module.js';
import {OrbitControls} from '//techbrood.com/threejs/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from '//techbrood.com/threejs/examples/jsm/loaders/FBXLoader.js';

var container, stats, controls;
var camera, scene, renderer, light;

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(0, 1.6, 0);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
  light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 20, 10);
  light.castShadow = true;
  scene.add(light);

  var grid = new THREE.GridHelper(5, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);
  // model
  var loader = new FBXLoader();
  loader.load('/uploads/1911/forest/AssaultRifle_1.fbx', function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.rotation.y = Math.PI / 2;
    //object.rotation.x = -Math.PI/2 - Math.PI/12;
    object.position.set(0, -0.15, 0.3);
    console.log(object.position);
    object.scale.set(.003, .003, .003);
    scene.add(object);
  });
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  window.addEventListener('resize', onWindowResize, false);
  // stats
  stats = new Stats();
  container.appendChild(stats.dom);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  stats.update();
}