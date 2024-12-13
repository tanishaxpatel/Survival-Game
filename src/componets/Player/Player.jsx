import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import playerSpriteSheet from "../../assets/Soldier-Attack01.png";
import PlayerMove from "../../assets/player_movement.png";
import PlayerAttack from "../../assets/player-attack.png";

const Player = ({ position, setPosition, screenBounds }) => {
  const spriteRef = useRef();
  const keys = useRef({});
  const speed = 0.1;
  const spriteScale = [3, 3, 3];
  // Animation settings
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const frameCount = 6;
  const rowCount = 3;
  const animationSpeed = 0.1;
  const frameTime = useRef(0);
  //attack
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackFrame, setAttackFrame] = useState(0);
  const attackFrameCount = 4; // Your attack animation has 4 frames
  const attackRowCount = 3;
  const attackSpeed = 0.08; // Adjust this value to control attack animation speed
  const attackTimer = useRef(0);

  const [currentTexture, setCurrentTexture] = useState(null);

  // Load the sprite sheet
  const texture = useLoader(TextureLoader, PlayerMove);
  const attackTexture = useLoader(TextureLoader, PlayerAttack);
  useEffect(() => {
    if (texture) {
      // Fix pixelation
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;

      // Important: Clone the texture for each frame to prevent stretching
      // texture.repeat.set(1 / frameCount, 1);
      texture.repeat.set(1 / frameCount, 1 / rowCount);
      texture.offset.x = 0;
      texture.offset.y = 0;
      texture.needsUpdate = true;

      attackTexture.magFilter = THREE.NearestFilter;
      attackTexture.minFilter = THREE.NearestFilter;
      attackTexture.generateMipmaps = false;
      attackTexture.repeat.set(1 / attackFrameCount, 1 / attackRowCount);
      attackTexture.offset.x = 0;
      attackTexture.offset.y = 0;
      attackTexture.needsUpdate = true;
      setCurrentTexture(texture);
    }
  }, [texture, attackTexture]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "1" && !isAttacking) {
        setIsAttacking(true);
        setAttackFrame(0);
        setCurrentTexture(attackTexture);

        return;
      }

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
  }, [isAttacking]);

  useFrame((state, delta) => {
    if (!spriteRef.current || !texture) return;

    if (isAttacking) {
      // Handle attack animation
      attackTimer.current += delta;
      if (attackTimer.current >= attackSpeed) {
        attackTimer.current = 0;
        setAttackFrame((prev) => {
          if (prev >= attackFrameCount - 1) {
            setIsAttacking(false);
            setCurrentTexture(texture);
            keys.current = {};
            setIsMoving(false);
            return 0;
          }
          return prev + 1;
        });

        // Update texture offset for attack animation
        currentTexture.offset.x = attackFrame / attackFrameCount;
        // Keep the same row (direction) during attack
        currentTexture.offset.y =
          (attackRowCount - 1 - currentRow) / attackRowCount;
      }
      return; // Skip movement handling during attack
    }

    let newPosition = { ...position };
    let newRow = currentRow;

    if (keys.current["w"] || keys.current["arrowup"]) {
      newPosition.y = Math.min(newPosition.y + speed, screenBounds.maxY);
      newRow = 2; // Back row
      currentTexture.offset.y = (rowCount - 1 - 2) / rowCount; // Back row (2)
    }
    if (keys.current["s"] || keys.current["arrowdown"]) {
      newPosition.y = Math.max(newPosition.y - speed, screenBounds.minY);
      newRow = 0; // Front row
      currentTexture.offset.y = (rowCount - 1 - 0) / rowCount; // Front row (0)
    }
    if (keys.current["a"] || keys.current["arrowleft"]) {
      newPosition.x = Math.max(newPosition.x - speed, screenBounds.minX);
      newRow = 1; // Side row
      spriteRef.current.scale.x = -1; // Flip sprite left
      currentTexture.offset.y = (rowCount - 1 - 1) / rowCount; // Side row (1)
    }
    if (keys.current["d"] || keys.current["arrowright"]) {
      newPosition.x = Math.min(newPosition.x + speed, screenBounds.maxX);
      newRow = 1; // Side row
      spriteRef.current.scale.x = 1; // Flip sprite right
      currentTexture.offset.y = (rowCount - 1 - 1) / rowCount; // Side row (1)
    }
    if (newRow !== currentRow) {
      setCurrentRow(newRow);
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
        currentTexture.offset.x = currentFrame / frameCount;
        // Update texture offset for the current frame
        // texture.offset.x = currentFrame / frameCount;
      }
    } else {
      currentTexture.offset.x = 0;
      // Reset to idle frame
      // texture.offset.x = 0;
      currentTexture.offset.y = (rowCount - 1 - currentRow) / rowCount;
    }
  });

  return (
    <mesh ref={spriteRef} position={[position.x, position.y, 1]}>
      <planeGeometry args={[3, 3]} />{" "}
      {/* Use plane geometry for better texture mapping */}
      <meshBasicMaterial
        attach="material"
        map={currentTexture}
        transparent={true}
        opacity={1}
      />
    </mesh>
  );
};

export default Player;
