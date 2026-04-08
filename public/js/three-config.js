import * as THREE from 'three';

// Setup scene with light gradient background
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f4ff);
scene.fog = new THREE.FogExp2(0xf0f4ff, 0.002);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create colorful particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2500;
const posArray = new Float32Array(particlesCount * 3);
const colorArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    posArray[i*3] = (Math.random() - 0.5) * 80;
    posArray[i*3+1] = (Math.random() - 0.5) * 50;
    posArray[i*3+2] = (Math.random() - 0.5) * 40;
    
    // Colors: pink, purple, blue, mint
    const colors = [
        [0.4, 0.5, 1.0], // blue
        [0.6, 0.4, 1.0], // purple
        [0.8, 0.4, 0.8], // pink
        [0.4, 0.8, 0.9], // cyan
        [0.9, 0.5, 0.7]  // light pink
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    colorArray[i*3] = color[0];
    colorArray[i*3+1] = color[1];
    colorArray[i*3+2] = color[2];
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating rings
const ringGroup = new THREE.Group();

for (let i = 0; i < 5; i++) {
    const ringGeometry = new THREE.TorusGeometry(3 + i * 0.8, 0.08, 64, 200);
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.6 + i * 0.05, 0.7, 0.6),
        emissive: new THREE.Color().setHSL(0.6 + i * 0.05, 0.5, 0.3),
        metalness: 0.8,
        roughness: 0.2
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.userData = { speed: 0.002 + i * 0.001, radius: 3 + i * 0.8 };
    ringGroup.add(ring);
}
scene.add(ringGroup);

// Create floating shapes
const shapeGroup = new THREE.Group();

// Floating hearts and stars
const starGeometry = new THREE.SphereGeometry(0.15, 8, 8);
for (let i = 0; i < 60; i++) {
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.3, 0.8, 0.6),
        emissive: new THREE.Color().setHSL(0.55 + Math.random() * 0.3, 0.6, 0.3),
        emissiveIntensity: 0.5
    });
    const shape = new THREE.Mesh(starGeometry, material);
    shape.position.x = (Math.random() - 0.5) * 35;
    shape.position.y = (Math.random() - 0.5) * 25;
    shape.position.z = (Math.random() - 0.5) * 20;
    shape.userData = {
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01,
        speedZ: (Math.random() - 0.5) * 0.01,
        scale: 0.5 + Math.random() * 0.8
    };
    shape.scale.setScalar(shape.userData.scale);
    shapeGroup.add(shape);
}
scene.add(shapeGroup);

// Main decorative torus knot
const geometry = new THREE.TorusKnotGeometry(4, 1.2, 180, 24, 3, 4);
const material = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.7
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Lighting - bright and airy
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 10, 7);
mainLight.castShadow = true;
scene.add(mainLight);

const fillLight = new THREE.PointLight(0x8b5cf6, 0.5);
fillLight.position.set(-3, 2, 4);
scene.add(fillLight);

const backLight = new THREE.PointLight(0xec4899, 0.4);
backLight.position.set(0, 0, -8);
scene.add(backLight);

const rimLight = new THREE.PointLight(0x06b6d4, 0.5);
rimLight.position.set(3, 3, 5);
scene.add(rimLight);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Animation
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.008;
    
    // Rotate main torus knot
    torusKnot.rotation.x = time * 0.2;
    torusKnot.rotation.y = time * 0.3;
    torusKnot.rotation.z = time * 0.1;
    
    // Animate rings
    ringGroup.children.forEach((ring, index) => {
        ring.rotation.z += ring.userData.speed;
        ring.rotation.x = Math.sin(time * 0.5 + index) * 0.5;
    });
    
    // Animate particles
    particlesMesh.rotation.y = time * 0.03;
    particlesMesh.rotation.x = time * 0.02;
    
    // Animate floating shapes
    shapeGroup.children.forEach(shape => {
        shape.position.x += shape.userData.speedX;
        shape.position.y += shape.userData.speedY;
        shape.position.z += shape.userData.speedZ;
        
        // Wrap around
        if (Math.abs(shape.position.x) > 20) shape.position.x *= -0.9;
        if (Math.abs(shape.position.y) > 18) shape.position.y *= -0.9;
        if (Math.abs(shape.position.z) > 15) shape.position.z *= -0.9;
        
        // Pulsing effect
        const scale = shape.userData.scale + Math.sin(time * 2) * 0.05;
        shape.scale.setScalar(scale);
    });
    
    // Mouse interaction with torus knot
    torusKnot.rotation.x += mouseY * 0.02;
    torusKnot.rotation.y += mouseX * 0.02;
    
    // Subtle camera movement based on mouse
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});