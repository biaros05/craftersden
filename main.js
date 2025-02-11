import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import mcBackground from './flat_land.jpg';
import wood from './wood_plank.jpg';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ConvexGeometry } from 'three/examples/jsm/Addons.js';

//To display anything with three.js, need the following:
//scene, camera, renderer, so we can render scene with camera.

// SAMPLE DATA
/* ==== STAIRS ==== */
// const tos_froms = [
//   {
//     from: [0, 0, 0],
//     to: [1, 0.5, 1],
//   },
//   {
//     from: [0.5, 0.5, 0],
//     to: [1, 1, 1],
//   }
// ];

/* ==== SLABS BOTTOM ==== */
// const tos_froms = [
//   {
//     from: [0, 0, 0],
//     to: [1, 0.5, 1],
//   }
// ];

/* ==== SLABS TOP ==== */
// const tos_froms = [
//   {
//     from: [0, 0.5, 0],
//     to: [1, 1, 1],
//   }
// ];

/* ==== BLOCKS ==== */
// const tos_froms = [
//   {
//     from: [0, 0, 0],
//     to: [1, 1, 1],
//   }
// ];

/* ==== LADDER ==== */
// const tos_froms = [
//   {
//     from: [0, 0, 0.95],
//     to: [1, 1, 0.95],
//   }
// ];

/* ==== FENCE POST ==== */
// const tos_froms = [
//   {
//     from: [0.375, 0, 0.375],
//     to: [0.625, 1, 0.625],
//   }
// ];

/* ==== FENCE GATE ==== */
// const tos_froms = [
//   {
//     from: [0, 0.3125, 0.4375],
//     to: [0.125, 1, 0.5625],
//   },
//   {
//     from: [0.875, 0.3125, 0.4375],
//     to: [1, 1, 0.5625],
//   },
//   {
//     from: [0.375, 0.375, 0.4375],
//     to: [0.5, 0.9375, 0.5625],
//   },
//   {
//     from: [0.5, 0.375, 0.4375],
//     to: [0.625, 0.9375, 0.5625],
//   },
//   {
//     from: [0.125, 0.375, 0.4375],
//     to: [0.375, 0.5625, 0.5625],
//   },
//   {
//     from: [0.125, 0.75, 0.4375],
//     to: [0.375, 0.9375, 0.5625],
//   },
//   {
//     from: [0.625, 0.375, 0.4375],
//     to: [0.875, 0.5625, 0.5625],
//   },
//   {
//     from: [0.625, 0.75, 0.4375],
//     to: [0.875, 0.9375, 0.5625],
//   },
// ];

/* ==== CROSS ==== */
const tos_froms = [
  {
    "from": [
      0.05,
      0,
      0.5
    ],
    "to": [
      0.95,
      1,
      0.5
    ],
  },
  {
    "from": [
      0.5,
      0,
      0.05
    ],
    "to": [
      0.5,
      1,
      0.95
    ],
  },
]

/* ==== FLOWER POT ==== */
// const tos_froms = [
//   {
//     "from": [
//       0.3125,
//       0,
//       0.3125
//     ],
//     "to": [
//       0.375,
//       0.375,
//       0.6875
//     ],
//   },
//   {
//     "from": [
//       0.625,
//       0,
//       0.3125
//     ],
//     "to": [
//       0.6875,
//       0.375,
//       0.6875
//     ],
//   },
//   {
//     "from": [
//       0.375,
//       0,
//       0.3125
//     ],
//     "to": [
//       0.625,
//       0.375,
//       0.375
//     ],
//   },
//   {
//     "from": [
//       0.375,
//       0,
//       0.625
//     ],
//     "to": [
//       0.625,
//       0.375,
//       0.6875
//     ],
//   },
//   {
//     "from": [
//       0.375,
//       0,
//       0.375
//     ],
//     "to": [
//       0.625,
//       0.25,
//       0.625
//     ],
//   },
// ];

/**
 * Creates an array of cuboids that get merged into a
 * single geometry.
 * 
 * @param {Object[]} tos_froms Array of objects that contain a to and from for each cuboid
 * @returns Merged geometry built from cuboids
 */
function createGeometry(tos_froms) {
  const geos = tos_froms.map(tf => {
    const to = new THREE.Vector3(...tf.to);
    const from = new THREE.Vector3(...tf.from);

    // Calculate size
    const size = new THREE.Vector3().subVectors(to, from);
  
    // Calculate center position
    const center = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  
    // Create first box and translate it
    const boxGeom = new THREE.BoxGeometry(size.x, size.y, size.z);
    boxGeom.translate(center.x, center.y, center.z); // Apply translation

    return boxGeom;
  });
  
  const geo = BufferGeometryUtils.mergeGeometries(geos);
  return geo;
}

function createMesh(tos_froms, material) {
  const geometry = createGeometry(tos_froms);
  
  if (!material){
    material = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, wireframe: false });
  }

  const mesh = new THREE.Mesh(geometry, material);
  
  return mesh;
}

const currentGeometry = createMesh(tos_froms);

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

window.addEventListener('mousemove', (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach(function (intersect) {
    if (intersect.object.name === 'ground') {
      const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
      highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
    }
  })
})
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

window.addEventListener('mousedown', () => {
  let highestY = 0; // Keep track of the highest cube at this X, Z

  // Find all cubes that exist at the same X, Z position
  objects.forEach((object) => {
    if (
      object.position.x === highlightMesh.position.x &&
      object.position.z === highlightMesh.position.z
    ) {
      highestY = Math.max(highestY, object.position.y);
    }
  });

  // Create a new cube and place it one unit above the highest cube found
  const geometryClone = currentGeometry.clone();
  // xhfj
  geometryClone.position.set(highlightMesh.position.x - 0.5, highestY, highlightMesh.position.z - 0.5);
  // cubeClone.position.set(0,0.25,0);
  scene.add(geometryClone);
  objects.push(geometryClone);
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