import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import mcBackground from './flat_land.jpg';
import wood from './wood_plank.jpg';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";


//To display anything with three.js, need the following:
//scene, camera, renderer, so we can render scene with camera.



// ----------------------   STEP OF CREATING SCENE AND CAMERA ORBIT 
const scene = new THREE.Scene();

//There are different cameras in three.js
//attributes: field of view, aspect ratio, near, far, 
//may want to use different values to get better performance.
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 15); // Move it back and up
camera.lookAt(0, 0, 0); // Look at the center of the scene


const renderer = new THREE.WebGLRenderer();


const orbit = new OrbitControls(camera, renderer.domElement);
//update is called everytime we change position of camera.
orbit.update();
renderer.setSize(window.innerWidth, window.innerHeight);

// ----------------------   END 

// ---------------------- STEP OF TOGGLE BLOCK

//0 = wood, 1 = cobble
let current_block_path = "./cobblestone.jpg";
let is_wood = true;
const geometry = new THREE.BoxGeometry(1, 1, 1);
var texture = new THREE.TextureLoader().load(current_block_path);
const material = new THREE.MeshStandardMaterial({
  map: texture,
  metalness: 0.5,
  roughness: 0.3
});
let cube = new THREE.Mesh(geometry, material);

window.addEventListener('keydown', (e) => {
  if(e.key === 's'){
    is_wood = !is_wood;
    if(!is_wood){
      current_block_path = "./cobblestone.jpg";
    }
    else{
      current_block_path = "./wood_plank.jpg";
    }
    var texture = new THREE.TextureLoader().load(current_block_path);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.5,
      roughness: 0.3
    });
    cube = new THREE.Mesh(geometry, material);
  }
});


// ---------------------- END



// ----------------------   STEP OF CREATING AMBIENT LIGHTING AND LOADING TEXTURE
var ambLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambLight);

var pointLightLeft = new THREE.PointLight(0xff8833, 1);
pointLightLeft.position.set(-2, 1, 2);
scene.add(pointLightLeft);

var pointLightRight = new THREE.PointLight(0x33ff77, 1);
pointLightRight.position.set(3, 2, 2);
scene.add(pointLightRight);
//texture is jpg downloaded online

// ----------------------   END 



// ----------------------   STEP OF CREATING CUBE WITH GEOMETRY, MATERIAL, AND ADDING TO SCENE

// Define 'from' and 'to' points

// Define 'from' and 'to' points
const from = new THREE.Vector3(0, 0, 0);
const to = new THREE.Vector3(1, 0.5, 1);

// Calculate size
const size = new THREE.Vector3().subVectors(to, from);

// Calculate center position
const center = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);

// Create first box and translate it
const boxGeom = new THREE.BoxGeometry(size.x, size.y, size.z);
boxGeom.translate(center.x, center.y, center.z); // Apply translation

const from2 = new THREE.Vector3(0.5, 0.5, 0);
const to2 = new THREE.Vector3(1, 1, 1);

// Calculate size
const size2 = new THREE.Vector3().subVectors(to2, from2);

// Calculate center position
const center2 = new THREE.Vector3().addVectors(from2, to2).multiplyScalar(0.5);

// Create second box and translate it
const boxGeom2 = new THREE.BoxGeometry(size2.x, size2.y, size2.z);
boxGeom2.translate(center2.x, center2.y, center2.z); // Apply translation

// Merge geometries
const stairGeom = BufferGeometryUtils.mergeGeometries([boxGeom, boxGeom2]);

// Create the final mesh
const complexBlockMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
const stairMesh = new THREE.Mesh(stairGeom, complexBlockMaterial);

scene.add(stairMesh);


// Create the bottom step (full width, half height)
const bottomStep = new THREE.BoxGeometry(1, 0.5, 1);
// bottomStep.translate(-0.5,-0.25,-0.5);

// Create the top step (half width, full height)
const topStep = new THREE.BoxGeometry(0.5, 0.5, 1);
topStep.translate(0.25,0.5,0); // Shift it to the correct position

// Merge both geometries into one
const stairGeometry = BufferGeometryUtils.mergeGeometries([bottomStep, topStep]);

// Create a material
const stairMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, wireframe: false });

// Create the mesh
// const stairMesh = new THREE.Mesh(stairGeometry, stairMaterial);


//Object that contains all points(vertices) and fill(Faces) of cube.
//Material colour 
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//mesh: takes geometry, applies material, so that we can insert to our scene, and move freely around.
// const material = new THREE.MeshStandardMaterial({
//   map: texture,
//   metalness: 0.5,
//   roughness: 0.3
// });
// const cube = new THREE.Mesh(geometry, material);
//scene.add(): will add to the coors (0,0,0).

//cause both the cam and cube to be inside eachother. to avoid, move camera out a bit.

// ----------------------   END 


// ----------------------   STEP OF CREATING PLANE 
//the plane may be removed....

// Load the Minecraft grass texture
const grassTexture = new THREE.TextureLoader().load('./grass_top.png', function(texture) {
  texture.colorSpace = THREE.SRGBColorSpace; // Ensure correct color space
});

grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(30, 30);
grassTexture.magFilter = THREE.NearestFilter;
grassTexture.minFilter = THREE.NearestFilter;

const planeMaterial = new THREE.MeshBasicMaterial({
  map: grassTexture,
  color: 0x6F946F,  // Tint it a more vibrant green
  side: THREE.DoubleSide,
});

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// Rotate to lay flat like the ground
plane.rotation.x = -0.5 * Math.PI;
plane.name = "ground";
scene.add(plane);

// Add a GridHelper to align with the texture
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);


// ---------------------- END 
let pointer = new THREE.Vector2();

// ----------------------  STEP OF HIGHLIGHTING ON MOUSE HOVER
const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
  })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);


const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

// window.addEventListener('mousemove', (e) => {
//   mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
//   mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
//   raycaster.setFromCamera(mousePosition, camera);
//   intersects = raycaster.intersectObjects(scene.children);
//   intersects.forEach(function (intersect) {
//     if (intersect.object.name === 'ground') {
//       const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
//       highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
//     }
//   })
// })
// ----------------------   END 

// ----------------------   STEP OF ADDING BLOCK ON CLICK

//creating empty array, push objects on for stackable 
const objects = [];

// window.addEventListener('mousedown', (intersect) => {
//   const objectExist = objects.find((object) => {
//     return (object.position.x === highlightMesh.position.x 
//       && object.position.z === highlightMesh.position.z)
//   });

//   if(!objectExist){
//     intersects.forEach(function (intersect) {
//       if (intersect.object.name === 'ground') {
//         const cubeClone = cube.clone();
//         cubeClone.position.copy(highlightMesh.position);
//         cubeClone.position.y += 0.5;
//         scene.add(cubeClone);
//         objects.push(cubeClone);
//       }
//     });
//   }
// });

// window.addEventListener('mousedown', (event) => {
//   pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

//   raycaster.setFromCamera(pointer, camera);
//   const intersects = raycaster.intersectObjects(scene.children, true);

//   if (intersects.length > 0) {
//     let intersect = intersects.find(intersect => intersect.object.name === 'ground');

//     if (intersect) {
//       // Clone stairMesh instead of reusing the same object
//       const stairClone = stairMesh.clone();
//       stairClone.scale.set(1, 1, 1); // Ensure correct scale
//       stairClone.position.copy(intersect.point).floor().addScalar(0.5); // Snap to grid
//       stairClone.position.y += 0.5; // Adjust height to sit on top of the ground

//       scene.add(stairClone);
//       objects.push(stairClone);
//     }
//   }
// });

// window.addEventListener('mousedown', (event) => {
//   pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
  
//   raycaster.setFromCamera(pointer, camera);
//   const intersects = raycaster.intersectObjects(scene.children, true);

//   if (intersects.length > 0) {
//     let intersect = intersects.find(i => i.object.type === 'Mesh' || i.object.name === 'ground');

//     if (intersect) {
//       stairMesh.scale.set(1, 1, 1);

//       // Get base grid position
//       let newPosition = new THREE.Vector3().copy(intersect.point).add(intersect.face.normal);
//       newPosition.divideScalar(30).floor().multiplyScalar(30).addScalar(16);

//       // Ensure stacking works by checking for blocks at this position
//       let maxHeight = 0;
//       objects.forEach((obj) => {
//         if (obj.position.x === newPosition.x && obj.position.z === newPosition.z) {
//           maxHeight = Math.max(maxHeight, obj.position.y);
//         }
//       });

//       newPosition.y = maxHeight + 30; // Stack block on top

//       // Clone stairMesh to prevent modifying original object
//       const newBlock = stairMesh.clone();
//       newBlock.position.copy(newPosition);

//       scene.add(newBlock);
//       objects.push(newBlock);
//     }
//   }
// });


window.addEventListener('mousedown', (event) => {

  pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

  console.log(pointer);
  raycaster.setFromCamera( pointer, camera );

  const intersects = raycaster.intersectObjects( scene.children, true );

  console.log(intersects);
  if ( intersects.length > 0 ) {

      let intersect = intersects.filter(intersect => intersect.object.type === 'Mesh' || intersect.object.name === 'ground')[0];

      stairMesh.scale.set(1, 1, 1);
      console.log(stairMesh.position);
      let newPosition = stairMesh.position.copy( intersect.point ).add( intersect.face.normal );
      console.log(newPosition);
      console.log(stairMesh.position);
      newPosition.divideScalar(  ).floor().multiplyScalar( 2 ).addScalar(-1);
      //newPosition.y+=0.5;
      console.log(stairMesh.position);
      const newBlock = stairMesh.clone();
      newBlock.position.copy(newPosition);
      scene.add( newBlock );
      objects.push( newBlock );

  }

  // let highestY = -0.5; // Keep track of the highest cube at this X, Z

  // // Find all cubes that exist at the same X, Z position
  // objects.forEach((object) => {
  //   if (
  //     object.position.x === highlightMesh.position.x &&
  //     object.position.z === highlightMesh.position.z
  //   ) {
  //     highestY = Math.max(highestY, object.position.y);
  //   }
  // });

  // // Create a new cube and place it one unit above the highest cube found
  // const cubeClone = stairMesh.clone();
  // // cubeClone.position.set(highlightMesh.position.x, highestY + 1, highlightMesh.position.z);
  // cubeClone.position.set(0,0.25,0);
  // scene.add(cubeClone);
  // objects.push(cubeClone);
});



// ----------------------  END





// ----------------------   STEP OF CREATING ANIMATION LOOP, SETANIMATIONLOOP, AND APPENDING TO DOCUMENT BODY

//The code above does not render anything yet.
//For that, require to add what's called a render or animationloop.
function animate() {
  renderer.render(scene, camera);
}

//creates a loop that causes the rerender to draw the scene everytime the screen is refershed.
//(60 times per second)
//setAnimationLoop: 
// A build in function that can be used instead of requestAnimationFrame. For WebXR projects this function must be used
//Advantage: it pasues when the user navigates to another browser tab, not wasting precious processing power.
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// ----------------------   END 