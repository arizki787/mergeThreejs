import * as THREE from 'three';
import Stats from 'stats.js';

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize stats.js for performance monitoring
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms/frame, 2: memory
document.body.appendChild(stats.dom);

// Create a material for the cubes
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create the geometry for a single cube
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Number of cubes
const numCubes = 20000;

// Create an InstancedMesh
const instancedMesh = new THREE.InstancedMesh(geometry, material, numCubes);

// Set up the instancing
const dummy = new THREE.Object3D(); // A dummy object to set the position, rotation, and scale of each instance
for (let i = 0; i < numCubes; i++) {
    const x = (i % 100) * 2 - 100; // Spread cubes over the X axis
    const y = Math.floor(i / 100) * 2 - 100; // Spread cubes over the Y axis
    const z = (Math.random() - 0.5) * 50; // Random spread in Z axis
    
    dummy.position.set(x, y, z);
    dummy.updateMatrix(); // Update the transformation matrix of the dummy object
    instancedMesh.setMatrixAt(i, dummy.matrix); // Apply the transformation to the i-th instance
}

scene.add(instancedMesh);

// Add some lights
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(1, 1, 1).normalize();
scene.add(light1);

const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ambient light
scene.add(ambientLight);

// Animation loop
function animate() {
    stats.begin(); // Start measuring performance

    // Rotate the instanced mesh for some animation effect
    instancedMesh.rotation.x += 0.01;
    instancedMesh.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);

    stats.end(); // End measuring performance
    requestAnimationFrame(animate);
}

animate();
