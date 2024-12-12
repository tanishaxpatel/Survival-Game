// import { useEffect, useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
// import { useLoader } from "@react-three/fiber";
// import { TextureLoader } from "three";
// import * as THREE from "three";
// import enemySprite from "../../assets/Soldier-Attack01.png";

// const Enemy = ({ position, playerPosition }) => {
//   const spriteRef = useRef();
//   const [currentPosition, setCurrentPosition] = useState(position);

//   // Animation settings
//   const [currentFrame, setCurrentFrame] = useState(0);
//   const [isAttacking, setIsAttacking] = useState(false);
//   const frameCount = 6;
//   const animationSpeed = 0.1;
//   const frameTime = useRef(0);

//   // Enemy settings
//   const moveSpeed = 0.05; // Slower than player
//   const attackRange = 3; // Distance at which enemy stops and attacks
//   const spriteScale = [3, 3, 1];

//   // Load the sprite sheet
//   const texture = useLoader(TextureLoader, enemySprite);

//   useEffect(() => {
//     if (texture) {
//       texture.magFilter = THREE.NearestFilter;
//       texture.minFilter = THREE.NearestFilter;
//       texture.generateMipmaps = false;
//       texture.repeat.set(1 / frameCount, 1);
//       texture.offset.x = 0;
//       texture.needsUpdate = true;
//     }
//   }, [texture]);

//   useFrame((state, delta) => {
//     if (!spriteRef.current || !texture) return;

//     // Calculate distance to player
//     const distanceToPlayer = Math.sqrt(
//       Math.pow(playerPosition.x - currentPosition.x, 2) +
//         Math.pow(playerPosition.y - currentPosition.y, 2)
//     );

//     // Determine if should attack or move
//     if (distanceToPlayer <= attackRange) {
//       setIsAttacking(true);
//     } else {
//       setIsAttacking(false);
//       // Move towards player
//       const directionX = playerPosition.x - currentPosition.x;
//       const directionY = playerPosition.y - currentPosition.y;

//       // Normalize direction
//       const length = Math.sqrt(
//         directionX * directionX + directionY * directionY
//       );
//       const normalizedX = directionX / length;
//       const normalizedY = directionY / length;

//       // Update position
//       setCurrentPosition((prev) => ({
//         x: prev.x + normalizedX * moveSpeed,
//         y: prev.y + normalizedY * moveSpeed,
//       }));

//       // Flip sprite based on movement direction
//       if (directionX < 0) {
//         spriteRef.current.scale.x = -Math.abs(spriteScale[0]);
//       } else {
//         spriteRef.current.scale.x = Math.abs(spriteScale[0]);
//       }
//     }

//     // Update sprite position
//     spriteRef.current.position.x = currentPosition.x;
//     spriteRef.current.position.y = currentPosition.y;

//     // Handle animation
//     frameTime.current += delta;
//     if (frameTime.current >= animationSpeed) {
//       frameTime.current = 0;
//       setCurrentFrame((prev) => (prev + 1) % frameCount);
//       texture.offset.x = currentFrame / frameCount;
//       texture.needsUpdate = true;
//     }
//   });

//   return (
//     <sprite
//       ref={spriteRef}
//       position={[currentPosition.x, currentPosition.y, 1]}
//       scale={spriteScale}
//     >
//       <spriteMaterial
//         attach="material"
//         map={texture}
//         transparent={true}
//         opacity={1}
//         depthTest={false}
//         alphaTest={0.001}
//       />
//     </sprite>
//   );
// };

// export default Enemy;
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import enemySprite from "../../assets/Soldier-Attack01.png";

const Enemy = ({ position, playerPosition, screenBounds }) => {
  const spriteRef = useRef();
  const [currentPosition, setCurrentPosition] = useState(position);

  // Animation settings
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAttacking, setIsAttacking] = useState(false);
  const frameCount = 6;
  const animationSpeed = 0.3;
  const frameTime = useRef(0);

  // Enemy settings
  const moveSpeed = 0.05; // Slower than player
  const attackRange = 1; // Distance at which enemy stops and attacks
  const spriteScale = [3, 3, 1];

  // Load the sprite sheet
  const texture = useLoader(TextureLoader, enemySprite);

  useEffect(() => {
    if (texture) {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      texture.repeat.set(1 / frameCount, 1);
      texture.offset.x = 0;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useFrame((state, delta) => {
    if (!spriteRef.current || !texture) return;

    // Calculate distance to player
    const distanceToPlayer = Math.sqrt(
      Math.pow(playerPosition.x - currentPosition.x, 2) +
        Math.pow(playerPosition.y - currentPosition.y, 2)
    );

    // Determine if should attack or move
    if (distanceToPlayer <= attackRange) {
      setIsAttacking(true);
      // Handle attack animation
      frameTime.current += delta;
      if (frameTime.current >= animationSpeed) {
        frameTime.current = 0;
        setCurrentFrame((prev) => (prev + 1) % frameCount);
        texture.offset.x = currentFrame / frameCount;
        texture.needsUpdate = true;
      }
    } else {
      setIsAttacking(false);
      // Move towards player
      const directionX = playerPosition.x - currentPosition.x;
      const directionY = playerPosition.y - currentPosition.y;

      // Normalize direction
      const length = Math.sqrt(
        directionX * directionX + directionY * directionY
      );
      const normalizedX = directionX / length;
      const normalizedY = directionY / length;

      // Update position with boundary checks
      const newX = Math.max(
        screenBounds.minX,
        Math.min(screenBounds.maxX, currentPosition.x + normalizedX * moveSpeed)
      );

      const newY = Math.max(
        screenBounds.minY,
        Math.min(screenBounds.maxY, currentPosition.y + normalizedY * moveSpeed)
      );

      setCurrentPosition({ x: newX, y: newY });

      // Flip sprite based on movement direction
      if (directionX < 0) {
        spriteRef.current.scale.x = -Math.abs(spriteScale[0]);
      } else {
        spriteRef.current.scale.x = Math.abs(spriteScale[0]);
      }

      // Reset animation frame when not attacking
      texture.offset.x = 0;
      texture.needsUpdate = true;
    }

    // Update sprite position
    spriteRef.current.position.x = currentPosition.x;
    spriteRef.current.position.y = currentPosition.y;
  });

  return (
    <sprite
      ref={spriteRef}
      position={[currentPosition.x, currentPosition.y, 1]}
      scale={spriteScale}
    >
      <spriteMaterial
        attach="material"
        map={texture}
        transparent={true}
        opacity={1}
        depthTest={false}
        alphaTest={0.001}
      />
    </sprite>
  );
};

export default Enemy;
