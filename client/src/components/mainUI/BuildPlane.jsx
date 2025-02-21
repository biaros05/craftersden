import * as THREE from 'three';
import { createMesh } from '../../utils/building_plane_utils.mjs';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import grass_top from '../../assets/grass_top.png';

/* ==== STAIRS ==== */
const tos_froms = [
  {
    from: [0, 0, 0],
    to: [1, 0.5, 1],
  },
  {
    from: [0.5, 0.5, 0],
    to: [1, 1, 1],
  }
];

export default function BuildPlane() {
  //use ref is a react hok that lets you refernce a value that's not needed for rendering
  const refContainer = useRef(null);
  useEffect(() => {
    const currentGeometry = createMesh(tos_froms);
    const container = refContainer.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75, width / height, 0.1, 1000);
    camera.position.set(15, 15, 15); // Move it back and up
    camera.lookAt(0, 0, 0); // Look at the center of the scene

    const renderer = new THREE.WebGLRenderer();

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
    renderer.setSize(width, height);

    if (!refContainer.current.hasChildNodes()) {
      refContainer.current.appendChild(renderer.domElement);
    }
    
    var ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);

    var pointLightLeft = new THREE.PointLight(0xff8833, 1);
    pointLightLeft.position.set(-2, 1, 2);
    scene.add(pointLightLeft);

    var pointLightRight = new THREE.PointLight(0x33ff77, 1);
    pointLightRight.position.set(3, 2, 2);
    scene.add(pointLightRight);

    const grassTexture = new THREE.TextureLoader().load(grass_top, function(texture) {
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
      const rect = container.getBoundingClientRect(); // Get container position
      mousePosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePosition.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObjects(scene.children);
      intersects.forEach(function (intersect) {
        if (intersect.object.name === 'ground') {
          const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
          highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
        }
      })
    })

    const objects = [];

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

    function animate() {
      renderer.render(scene, camera);
    }
    
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
    };
  }, []);
  return(
    <div id="build-plane" ref={refContainer}></div>
  );
}