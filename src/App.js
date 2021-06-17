import './App.css';
import * as React from "react";
import * as THREE from 'three'
import fbxFile from './fbx/uitlbiaga_LOD5.fbx'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const Stats = require('stats.js/src/Stats')

function App() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x66ccff)
  const camera= new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 200);
  // 迪迦
  const hemisphereLight = new THREE.AmbientLight(0xffffff,1)
  // hemisphereLight.position.set(0, 50, 60);
  scene.add(hemisphereLight)


  React.useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.style.width = '1000px'
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.font = '26px sans-serif'
    ctx.fillText('Pink Sword version 1.0', 10, 50)
    ctx.scale(10,10);
    ctx.strokeStyle = '#66ccff'
    // document.querySelector('#fps').appendChild(canvas)
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(60, 30, 1)
    sprite.position.set(-40, 0 , 0)
    scene.add(sprite)
    // 跟我画线！
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0))
    points.push(new THREE.Vector3(7, 0, 0))
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, lineMaterial)
    line.scale.set(5, 5, 1)
    line.position.set(-39, 0 , 0)
    scene.add(line)
    // 统计
    const stats = new Stats.default()
    stats.setMode(0);
    document.getElementById("fps").appendChild(stats.domElement)
    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => {
      renderer.render(scene, camera);
      stats.update();
    })
    controls.minDistance = 1
    controls.maxDistance = 2000
    controls.enableRotate = true
    // 限制旋转轴向
    // controls.minPolarAngle = 1.57
    // controls.maxPolarAngle = 1.57
    // 添加渲染dom
    document.getElementById('frame').appendChild(renderer.domElement)
    // 加载fbx
    const loader = new FBXLoader()
    loader.load(fbxFile, (fbx) => {
      const mesh = fbx.children[0].clone()
      mesh.material = new THREE.MeshPhongMaterial({
        color: 'lightpink'
      })
      scene.add(mesh)
      renderer.render(scene, camera)
      stats.update();
    }, ({ loaded, total }) => {
      console.log(`${(loaded/total*100).toFixed(2)}%`)
    })
  })

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.render(scene, camera);

  return (
    <div className="App">
      <div id="fps"></div>
      <div id="frame"></div>
    </div>
  );
}

export default App;
