import * as THREE from 'three';
import { createMesh } from '../../utils/building_plane_utils.mjs';
import { Component, useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import grassTop from '../../assets/grass_top.png';

/* ==== STAIRS ==== */
const tosFroms = [
  {
    from: [0, 0, 0],
    to: [1, 0.5, 1],
  },
  {
    from: [0.5, 0.5, 0],
    to: [1, 1, 1],
  }
];

/**
 * Build plane component that renders a 3D plane with grid to build on.
 * @returns {Component} A div element with the id 'build-plane' to render the 3D plane.
 */
export default function BuildPlane({isViewMode}) {
  //use ref is a react hok that lets you refernce a value that's not needed for rendering
  const refContainer = useRef(null);
  useEffect(() => {
    const currentGeometry = createMesh(tosFroms);
    const container = refContainer.current;
    if (!container) return;
  
    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
  
    const renderer = new THREE.WebGLRenderer();
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
    renderer.setSize(width, height);
  
    window.addEventListener('resize', () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
  
    if (!container.hasChildNodes()) {
      container.appendChild(renderer.domElement);
    }
  
    const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);
  
    const pointLightLeft = new THREE.PointLight(0xff8833, 1);
    pointLightLeft.position.set(-2, 1, 2);
    scene.add(pointLightLeft);
  
    const pointLightRight = new THREE.PointLight(0x33ff77, 1);
    pointLightRight.position.set(3, 2, 2);
    scene.add(pointLightRight);
  
    const grassTexture = new THREE.TextureLoader().load(grassTop, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(30, 30);
    grassTexture.magFilter = THREE.NearestFilter;
    grassTexture.minFilter = THREE.NearestFilter;
  
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: grassTexture,
      color: 0x6f946f,
      side: THREE.DoubleSide,
    });
  
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.name = 'ground';
    scene.add(plane);
  
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
    const objects = [];
  
    const onMouseMove = (e) => {
      if (isViewMode) return;
      const rect = container.getBoundingClientRect();
      mousePosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePosition.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  
      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObjects(scene.children);
      intersects.forEach((intersect) => {
        if (intersect.object.name === 'ground') {
          const highlightPos = new THREE.Vector3()
            .copy(intersect.point)
            .floor()
            .addScalar(0.5);
          highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
        }
      });
    };
  
    const onMouseDown = () => {
      if (isViewMode) return;
      let highestY = 0;
  
      objects.forEach((object) => {
        if (
          object.position.x === highlightMesh.position.x &&
          object.position.z === highlightMesh.position.z
        ) {
          highestY = Math.max(highestY, object.position.y);
        }
      });
  
      const geometryClone = currentGeometry.clone();
      geometryClone.position.set(
        highlightMesh.position.x - 0.5,
        highestY,
        highlightMesh.position.z - 0.5
      );
      scene.add(geometryClone);
      objects.push(geometryClone);
    };
  
    // Always remove event listeners first before adding them again
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mousedown', onMouseDown);
  
    if (!isViewMode) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mousedown', onMouseDown);
    }
  
    function animate() {
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
  
    console.log(`View mode: ${isViewMode}`);
  
    // Cleanup function to remove event listeners properly
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
    };
  
  }, [isViewMode]); // Depend on `isViewMode` to re-run effect
  
  
  
  return <div id="build-plane" ref={refContainer}></div>;
  
}