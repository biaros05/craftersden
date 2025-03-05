import { ThreeElements } from '@react-three/fiber';
import React from 'react';

/**
 * Creates a mesh with the given props that gets highlighted
 * when hovered.
 * @param {ThreeElements['mesh']} props React props to be passed to the mesh
 * @returns {React.ReactNode} A mesh with the given props
 */
function Block(props: ThreeElements['mesh']): React.ReactNode {
  return (
    <mesh {...props} >
    </mesh>
  );
}

export { Block };
