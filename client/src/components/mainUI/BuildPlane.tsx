import * as THREE from 'three';
import { createMesh, Cuboid, Coordinates } from '../../utils/building_plane_utils.js';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import grassTop from '../../assets/grass_top.png';
import React from 'react';

/* ==== STAIRS ==== */
const tosFroms: Cuboid[] = [
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
 * @param {*} setScene - function to set the scene
 * @returns {Component} A div element with the id 'build-plane' to render the 3D plane.
 */
export default function BuildPlane({ sceneState, setToSave, progressPicture, isViewMode }: { sceneState: any, setToSave: any, progressPicture: any, isViewMode: boolean}): React.ReactNode {
  //use ref is a react hok that lets you refernce a value that's not needed for rendering
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentGeometry = createMesh(tosFroms);
    const container = refContainer.current;
    const buildPlane = document.getElementById('build-plane');

    if (!container) return;


    const width = container.clientWidth;
    const height = container.clientHeight;

    let scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75, width / height, 0.1, 1000);
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

    var ambLight = new THREE.AmbientLight(0xffffff, 0.5);



    var pointLightLeft = new THREE.PointLight(0xff8833, 1);
    pointLightLeft.position.set(-2, 1, 2);



    var pointLightRight = new THREE.PointLight(0x33ff77, 1);
    pointLightRight.position.set(3, 2, 2);



    const grassTexture = new THREE.TextureLoader().load(grassTop, function (texture) {
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

    // Add a GridHelper to align with the texture
    const gridHelper = new THREE.GridHelper(30, 30);

    const highlightMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
      })
    );
    highlightMesh.rotateX(-Math.PI / 2);
    highlightMesh.position.set(0.5, 0, 0.5);
    if (!sceneState.current || Object.keys(sceneState.current).length == 0) {
      scene.add(plane);
    } else {
      scene = new THREE.ObjectLoader().parse( JSON.parse( JSON.stringify(sceneState.current) ) );
    }
    scene.add(gridHelper);
    scene.add(highlightMesh);
    scene.add(ambLight);
    scene.add(pointLightLeft);
    scene.add(pointLightRight);

    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let intersects: THREE.Intersection[];
    const objects: THREE.Object3D[] = [];


    console.log(`View mode: ${isViewMode}`);

    /**
     * Finds the height of the highest block in the stack at a given x and z
     * @param {Coordinates} highLightPos Object holding the normalized coordinates of the highlight
     * @returns {number} Height of the highest block at a given x and z coordinate
     */
    function computeHighestY(highLightPos: Coordinates): number {
      let highestY = 0;
      // Find all cubes that exist at the same X, Z position
      objects.forEach((object) => {
        if (
          object.position.x === highLightPos.x &&
          object.position.z === highLightPos.z
        ) {
          highestY = Math.max(highestY, object.position.y + 1);
        }
      });
      return highestY;
    }

    /**
     * Places block at the highlighted position
     * @param {Coordinates} highLightPos Object holding the normalized coordinates of the highlight
     */
    function placeBlock(highLightPos: Coordinates) {
      // Keep track of the highest cube at this X, Z
      const highestY = computeHighestY(highLightPos);

      // Create a new cube and place it
      const geometryClone = currentGeometry.clone();

      scene.add(geometryClone);
      geometryClone.position.set(
        highLightPos.x,
        highestY,
        highLightPos.z
      );
      geometryClone.name = 'block';
      objects.push(geometryClone);
      console.log(highLightPos, highestY, geometryClone)
    }

    /**
     * Removes block at the highlighted position
     * @param {Coordinates} highLightPos Object holding the normalized coordinates of the highlight 
     */
    function removeBlock(highLightPos: Coordinates) {
      const objIndex = objects.findIndex(o => {
        return o.position.x === highLightPos.x &&
          o.position.y === highLightPos.y &&
          o.position.z === highLightPos.z;
      });

      if (objIndex !== -1) {
        const [delElem] = objects.splice(objIndex, 1);
        scene.remove(delElem);
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      console.log("I am inside mouse move");
      // Get container position
      const rect = container.getBoundingClientRect();
      mousePosition.x = (e.clientX - rect.left) / rect.width * 2 - 1;
      mousePosition.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObjects(scene.children);
      intersects.forEach(function (intersect) {
        if (intersect.object.name === 'block' || intersect.object.name === 'ground') {
          const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
          highlightMesh.position.set(highlightPos.x, highlightPos.y - 0.5, highlightPos.z);
        }
      });
    }

    const onMouseDown = (e: MouseEvent) => {
      console.log("I am inside mouse down")
      console.log(scene.children.filter(c => c.name === 'block'))

      const highLightPos = {
        x: highlightMesh.position.x - 0.5,
        y: highlightMesh.position.y,
        z: highlightMesh.position.z - 0.5
      };

      if (e.button === 2) {
        placeBlock(highLightPos);
      } else if (e.button === 0) {
        removeBlock(highLightPos);
      }
    };


    console.log(scene)
    if (!isViewMode && buildPlane) {
      console.log("Adding mouse events on window");
      buildPlane.addEventListener('mousemove', onMouseMove);
      buildPlane.addEventListener('mousedown', onMouseDown);
    }



    /* eslint-disable no-unused-vars */
    document.getElementsByClassName('save-button')[0].addEventListener('click', (e) => {
      // ensure scene is rendered before capture
      camera.position.set(15, 15, 15);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      const canvas = renderer.domElement;
      animate();
      const imageURL = canvas.toDataURL('image/png');
      progressPicture.current = imageURL;
      sceneState.current = scene.toJSON();
      setToSave(true);
    });


    /**
     * Animation loop to render the scene.
     */
    function animate() {
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);


    // return () => {
    //   if (buildPlane) {
    //     console.log("Clean up function: Removing event listeners.");
    //     buildPlane.removeEventListener('mousemove', onMouseMove);
    //     buildPlane.removeEventListener('mousedown', onMouseDown);
    //   }
    // }

  }, [isViewMode, sceneState, setToSave, progressPicture]);

  return (
    <div id="build-plane" ref={refContainer}></div>
  );
}