import { ThreeElements } from '@react-three/fiber';
import React, { useState } from 'react';

/**
 * Creates a mesh with the given props that gets highlighted
 * when hovered.
 * @param props React props to be passed to the mesh
 * @returns A mesh with the given props
 */
function Block(props: ThreeElements['mesh']) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <mesh {...props}
      onPointerOver={() => setIsHovering(true)}
      onPointerOut={() => setIsHovering(false)}>
    </mesh>
  )
}

export { Block };
