import { ThreeElements } from '@react-three/fiber';
import React, { useState } from 'react';

function Block(props: ThreeElements['mesh']) {
  const [isHovering, setIsHovering] = useState(false);

  // use isHovering to highlight block

  return (
    <mesh {...props}
      onPointerOver={() => setIsHovering(true)}
      onPointerOut={() => setIsHovering(false)}>
    </mesh>
  )
}

export { Block };
