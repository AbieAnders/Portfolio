import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// We must create a scene, camera and a renderer.
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Camera's frustum's (fov, aspect ratio, near plane, far plane)
camera.position.setZ(30);  // Camera originally at (0,0,0)
camera.position.setX(-3);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),  // renderer uses canvas Dom element.
});
renderer.setPixelRatio(window.devicePixelRatio);  // Sets renderer pixel ratio.
renderer.setSize(window.innerWidth, window.innerHeight);  // Sets canvas of the screen(usable real estate) to full screen.
renderer.render(scene, camera);

// We must add objects to the scene using geometry, material and a mesh.
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true} );  // Light source is not required for this particular material.
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347, wireframe: true });  // Light source is required for this particular material.
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);
// Since a light source is needed,
// PointLight is used to light up specific areas while AmbientLight is used to light up the whole thing.
// Hence both are not needed at the same time.
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 0);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// To pinpoint the location of a light source or the prespective of the camera, lightHelpers or Gridhelpers are used.
//const lightHelper = new THREE.PointLightHelper(pointLight);
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

// To move around the screen using the mouse we can use OrbitControls class.
//const controls = new OrbitControls(camera, renderer.domElement)
// Also call 'controls.update() in the animate funtion.

// Recursive function that renders 200 spheres and fills each of them into an array to simulate stars.
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const sphere = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    // Fills an array with 3 values, then maps each value to the random float spread function's returned value.
    sphere.position.set(x, y, z);
    scene.add(sphere);
}
Array(200).fill().forEach(addStar);

// Texture mapping is used to display images or other media.\
//Background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//Me
const abieTexture = new THREE.TextureLoader().load('Abie Anders Passport Sized Photo 80kb - 2024.jpg');
const abie = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: abieTexture }));
abie.position.z = -5;
abie.position.x = 2;
scene.add(abie);

//Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('moon_normal.jpg');// !!!Not Working!!!
const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture, }));
moon.position.z = 30;
moon.position.setX(-10);
scene.add(moon);

//Scroll Animation
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.01;
    moon.rotation.y += 0.005;
    moon.rotation.z += 0.01;
    abie.rotation.y == 0.01;
    abie.rotation.z == 0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
    camera.position.z = t * -0.01;
}
document.body.onscroll = moveCamera;
moveCamera();

// Recursive function to call renderer and tell the browser to animate each frame.
function animate() {
    requestAnimationFrame(animate);  // Tells the browser to animate a frame.
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    moon.rotation.x += 0.005;
    //controls.update();
    renderer.render(scene, camera);
}
animate();