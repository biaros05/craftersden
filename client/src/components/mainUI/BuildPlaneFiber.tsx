import { Canvas } from '@react-three/fiber';
import grassTop from '../../assets/grass_top.png';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import React from 'react';

const planeRotation = -0.5 * Math.PI;
// const planeRotation = 0;
export default function BuildPlaneFiber() {
    const grassTexture = new THREE.TextureLoader().load(grassTop, function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
    });

    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(30, 30);
    grassTexture.magFilter = THREE.NearestFilter;
    grassTexture.minFilter = THREE.NearestFilter;

    return <Canvas>
        <mesh rotation={[planeRotation, 0, 0]}>
            <planeGeometry args={[30, 30]} name='ground' />
            <meshBasicMaterial args={[{
                  map: grassTexture,
                  color: 0x6f946f,
                  side: THREE.DoubleSide,
                }]} />
        </mesh>
        <OrbitControls />
    </Canvas>;
}