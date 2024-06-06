import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const uniforms = {
    u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
    u_time: {type: 'f', value: 0.0}
}

const material = new THREE.ShaderMaterial ({
    uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent
});


// Canvas
const canvas = document.querySelector('canvas.webgl');


// Scene
const scene = new THREE.Scene();


// Material
const geometry = new THREE.IcosahedronGeometry(1, 10)

const mesh = new THREE.Mesh(geometry, material);
mesh.material.wireframe = true;

scene.add(mesh);


// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);


camera.position.set(0,0,3)

scene.add(camera);

// Lighting

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
directionalLight.position.set(0,0,2);
scene.add(directionalLight);

// Audio
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();

audioLoader.load('./media/fillTheVoid.mp3', function(buffer) {
    sound.setBuffer(buffer);
    window.addEventListener('click', function() {
        if (sound.isPlaying) {
            sound.pause();
        } else {
            sound.play();
        }
    });
})

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0x0f0f0f);

renderer.render(scene, camera);

const orbit = new OrbitControls(camera, renderer.domElement);

// Animation

let step = 0;
let speed = 0.002;

function animate() {
    mesh.rotation.y += 0.001
    step += speed;
    let val = Math.pow(Math.sin(step),2) + 0.5;
    mesh.scale.set(val,val,val)
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate);



// Responsiveness
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})