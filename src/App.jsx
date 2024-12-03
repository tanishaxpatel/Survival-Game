import React, { useState, useEffect } from "react";
import { Stage, Sprite, Text } from "@pixi/react";
import enemy from "./assets/SoldierStand.png";

const App = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const PlayerRef = 100;
  const [playerHealth, setPlayerHealth] = useState(100);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [height, setHeight] = useState(window.innerHeight);
  const [bunnyPosition, setBunnyPosition] = useState({
    x: width / 2,
    y: height / 2,
  });
  const [enemies, setEnemies] = useState([]); // Array to store enemies
  const enemySpeed = 2; // Speed of enemy movement towards player
  const minDistance = 50;
  const attackRange = 40; // Attack range for enemies to damage player
  const attackDamage = 10; // Damage dealt by enemy
  // Update canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle WASD key events for movement
  useEffect(() => {
    const handleKeyDown = (event) => {
      const speed = 10; // Speed of bunny movement
      const newPosition = { ...bunnyPosition };

      switch (event.key) {
        case "w": // Move up
          newPosition.y -= speed;
          break;
        case "a": // Move left
          newPosition.x -= speed;
          break;
        case "s": // Move down
          newPosition.y += speed;
          break;
        case "d": // Move right
          newPosition.x += speed;
          break;
        default:
          break;
      }

      setBunnyPosition(newPosition);
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bunnyPosition]);
  useEffect(() => {
    const moveEnemies = () => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          const dx = bunnyPosition.x - enemy.x;
          const dy = bunnyPosition.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= attackRange) {
            // Attack the player
            setPlayerHealth((prevHealth) =>
              Math.max(0, prevHealth - attackDamage)
            );
          }

          // Only move the enemy if it's farther than the min distance
          if (distance > minDistance) {
            // Normalize direction
            const moveX = (dx / distance) * enemySpeed;
            const moveY = (dy / distance) * enemySpeed;

            // Move enemy towards the player
            enemy.x += moveX;
            enemy.y += moveY;
          }

          return enemy;
        })
      );
    };

    // Move enemies every frame
    const moveInterval = setInterval(moveEnemies, 16); // 60 FPS

    return () => clearInterval(moveInterval);
  }, [bunnyPosition]);

  // Function to spawn an enemy at a random position
  const spawnEnemy = (count) => {
    const newEnemies = [];
    for (let i = 0; i < count; i++) {
      const randomX = Math.random() * (width - 50); // Random X within canvas width
      const randomY = Math.random() * (height - 50); // Random Y within canvas height
      newEnemies.push({
        id: Math.random(), // Unique ID for each enemy
        x: randomX,
        y: randomY,
        health: 100,
      });
    }

    setEnemies((prevEnemies) => [...newEnemies]);
  };

  useEffect(() => {
    spawnEnemy(4); // Spawn initial 3 enemies
  }, []);

  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
  const enemyUrl = enemy;

  return (
    <Stage width={width} height={height} options={{ background: 0x1099bb }}>
      {/* Bunny */}

      <Sprite
        image={bunnyUrl}
        x={bunnyPosition.x}
        y={bunnyPosition.y}
        anchor={{ x: 0.5, y: 0.5 }}
      />

      {/* Enemies */}
      {enemies.map((enemy) => (
        <Sprite
          key={enemy.id} // Use unique key for each enemy
          image={enemyUrl}
          x={enemy.x}
          y={enemy.y}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      ))}
      <Text
        text={`Time Survived: ${survivalTime}s`}
        style={{
          fill: "white",
          fontSize: 24,
        }}
      />
    </Stage>
  );
};

export default App;
