import * as THREE from 'three';
import Stats from 'stats.js';
import { GUI } from 'dat.gui';
// https://threejs.org/docs/#examples/en/utils/BufferGeometryUtils.mergeGeometries
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

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
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Create the material for the cubes
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

// Create the geometry for a single cube
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Number of cubes
let numCubes = 20000;

// Arrays to hold merged and individual cube meshes
let geometries = [];
let cubeMeshes = [];

// Function to create and merge geometries
function createMergedMesh(numCubes) {
    geometries = [];
    const dummy = new THREE.Object3D();
    for (let i = 0; i < numCubes; i++) {
        const x = (i % 100) * 2 - 100;
        const y = Math.floor(i / 100) * 2 - 100;
        const z = (Math.random() - 0.5) * 50;

        dummy.position.set(x, y, z);
        dummy.updateMatrix();

        const instanceGeometry = geometry.clone();
        instanceGeometry.applyMatrix4(dummy.matrix);
        geometries.push(instanceGeometry);
    }

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
    return new THREE.Mesh(mergedGeometry, material);
}

// Function to create individual cube meshes
function createIndividualCubes(numCubes) {
    cubeMeshes = [];
    for (let i = 0; i < numCubes; i++) {
        const cube = new THREE.Mesh(geometry.clone(), material);
        const x = (i % 100) * 2 - 100;
        const y = Math.floor(i / 100) * 2 - 100;
        const z = (Math.random() - 0.5) * 50;

        cube.position.set(x, y, z);
        cubeMeshes.push(cube);
        scene.add(cube);
    }
}

// Initialize the merged mesh
let mergedMesh = createMergedMesh(numCubes);
scene.add(mergedMesh);

// Add some lights
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(1, 1, 1).normalize();
scene.add(light1);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Initialize GUI
const gui = new GUI();
const params = {
    showMergedMesh: true,
    numCubes: numCubes
};

// Toggle between merged and individual cubes
gui.add(params, 'showMergedMesh').name('Use Merged Mesh').onChange((value) => {
    if (value) {
        // Switch to merged mesh
        cubeMeshes.forEach(cube => scene.remove(cube)); // Remove individual cubes
        scene.add(mergedMesh);
    } else {
        // Switch to individual cubes
        scene.remove(mergedMesh); // Remove merged mesh
        createIndividualCubes(params.numCubes);
    }
});

// Adjust the number of cubes
gui.add(params, 'numCubes', 1000, 50000).step(1000).name('Number of Cubes').onChange((value) => {
    scene.remove(mergedMesh);
    cubeMeshes.forEach(cube => scene.remove(cube));

    if (params.showMergedMesh) {
        // Recreate merged mesh
        mergedMesh = createMergedMesh(value);
        scene.add(mergedMesh);
    } else {
        // Recreate individual cubes
        createIndividualCubes(value);
    }
});

// Animation loop
function animate() {
    stats.begin();

    if (params.showMergedMesh) {
        mergedMesh.rotation.x += 0.01;
        mergedMesh.rotation.y += 0.01;
    } else {
        cubeMeshes.forEach(cube => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        });
    }

    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(animate);
}

animate();
