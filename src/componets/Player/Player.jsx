import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import playerSpriteSheet from "../../assets/Soldier-Attack01.png";

const Player = ({ position, setPosition, screenBounds }) => {
  const spriteRef = useRef();
  const keys = useRef({});
  const speed = 0.1;
  const spriteScale = [3, 3, 3];
  // Animation settings
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const frameCount = 6;
  const animationSpeed = 0.1;
  const frameTime = useRef(0);

  // Load the sprite sheet
  const texture = useLoader(TextureLoader, playerSpriteSheet);

  useEffect(() => {
    if (texture) {
      // Fix pixelation
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;

      // Important: Clone the texture for each frame to prevent stretching
      texture.repeat.set(1 / frameCount, 1);
      texture.offset.x = 0;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      setIsMoving(true);
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
      if (
        ![
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].some((key) => keys.current[key])
      ) {
        setIsMoving(false);
        setCurrentFrame(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!spriteRef.current || !texture) return;
    let newPosition = { ...position };

    if (keys.current["w"] || keys.current["arrowup"]) {
      newPosition.y = Math.min(newPosition.y + speed, screenBounds.maxY);
    }
    if (keys.current["s"] || keys.current["arrowdown"]) {
      newPosition.y = Math.max(newPosition.y - speed, screenBounds.minY);
    }
    if (keys.current["a"] || keys.current["arrowleft"]) {
      newPosition.x = Math.max(newPosition.x - speed, screenBounds.minX);

      spriteRef.current.scale.x = -1; // Flip sprite left
    }
    if (keys.current["d"] || keys.current["arrowright"]) {
      newPosition.x = Math.min(newPosition.x + speed, screenBounds.maxX);

      spriteRef.current.scale.x = 1; // Flip sprite right
    }
    if (newPosition.x !== position.x || newPosition.y !== position.y) {
      setPosition(newPosition); // Update position state
    }
    // setPosition({ x: newX, y: newY });
    // Update position
    spriteRef.current.position.x = position.x;
    spriteRef.current.position.y = position.y;

    // Handle animation
    if (isMoving) {
      frameTime.current += delta;
      if (frameTime.current >= animationSpeed) {
        frameTime.current = 0;
        setCurrentFrame((prev) => (prev + 1) % frameCount);

        // Update texture offset for the current frame
        texture.offset.x = currentFrame / frameCount;
      }
    } else {
      // Reset to idle frame
      texture.offset.x = 0;
    }
  });

  return (
    <mesh ref={spriteRef} position={[position.x, position.y, 1]}>
      <planeGeometry args={[3, 3]} />{" "}
      {/* Use plane geometry for better texture mapping */}
      <meshBasicMaterial
        attach="material"
        map={texture}
        transparent={true}
        opacity={1}
      />
    </mesh>
  );
};

export default Player;
