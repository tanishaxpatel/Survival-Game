import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import enemySprite from "../../assets/enemy_move.png";

const Enemy = ({ position, playerPosition, screenBounds }) => {
  const spriteRef = useRef();
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Animation settings
  const frameCount = 4; // 4 frames in the sprite
  const animationSpeed = 0.3;
  const frameTime = useRef(0);

  // Enemy settings
  const moveSpeed = 0.01;
  const stopRange = 1.5;
  const spriteScale = [2, 2, 2];

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

    const directionX = playerPosition.x - currentPosition.x;
    const directionY = playerPosition.y - currentPosition.y;
    const distanceToPlayer = Math.sqrt(
      directionX * directionX + directionY * directionY
    );

    if (distanceToPlayer > stopRange) {
      // Calculate movement
      const length = Math.sqrt(
        directionX * directionX + directionY * directionY
      );
      const normalizedX = directionX / length;
      const normalizedY = directionY / length;

      // Update position
      const newX = Math.max(
        screenBounds.minX,
        Math.min(screenBounds.maxX, currentPosition.x + normalizedX * moveSpeed)
      );
      const newY = Math.max(
        screenBounds.minY,
        Math.min(screenBounds.maxY, currentPosition.y + normalizedY * moveSpeed)
      );

      setCurrentPosition({ x: newX, y: newY });

      // Flip sprite based on horizontal direction
      spriteRef.current.scale.x =
        directionX < 0 ? -Math.abs(spriteScale[0]) : Math.abs(spriteScale[0]);

      // Handle animation
      frameTime.current += delta;
      if (frameTime.current >= animationSpeed) {
        frameTime.current = 0;
        setCurrentFrame((prev) => (prev + 1) % frameCount);
        texture.offset.x = currentFrame / frameCount;
        texture.needsUpdate = true;
      }
    }

    // Update position
    spriteRef.current.position.x = currentPosition.x;
    spriteRef.current.position.y = currentPosition.y;
  });

  return (
    <mesh ref={spriteRef} position={[currentPosition.x, currentPosition.y, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        transparent={true}
        opacity={1}
      />
    </mesh>
  );
};

export default Enemy;
