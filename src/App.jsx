import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Tile from "./componets/Map/Tile";
import { useWindowSize } from "./hooks/useWindowSize"; // Assuming this hook provides window dimensions
import Player from "./componets/Player/player";
import Enemy from "./componets/Enemy/Enemy";

const App = () => {
  const { width, height } = useWindowSize();
  // const [tiles, setTiles] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const mapWidth = 100; // Number of tiles across the map
  const mapHeight = 100; // Number of tiles down the map
  const tileSize = 2; // Size of each tile in the map
  const [enemies, setEnemies] = useState([]);
  const aspectRatio = width / height;
  const frustumSize = 13; // This controls how much of the world is visible

  const screenBounds = {
    minX: -(frustumSize * aspectRatio) / 2,
    maxX: (frustumSize * aspectRatio) / 2,
    minY: -frustumSize / 2,
    maxY: frustumSize / 2,
  };

  useEffect(() => {
    const spawnEnemies = () => {
      const numberOfEnemies = 5; // Adjust as needed
      const newEnemies = [];

      for (let i = 0; i < numberOfEnemies; i++) {
        // Random position away from player
        const randomPosition = {
          x:
            screenBounds.minX +
            Math.random() * (screenBounds.maxX - screenBounds.minX),
          y:
            screenBounds.minY +
            Math.random() * (screenBounds.maxY - screenBounds.minY),
        };

        // Ensure enemy spawns at least 10 units away from player
        const distanceToPlayer = Math.sqrt(
          Math.pow(randomPosition.x - playerPosition.x, 2) +
            Math.pow(randomPosition.y - playerPosition.y, 2)
        );

        if (distanceToPlayer > 3) {
          newEnemies.push({
            id: i,
            position: randomPosition,
          });
        }
      }
      console.log(screenBounds);

      setEnemies(newEnemies);
    };

    spawnEnemies();
  }, []);

  // useEffect(() => {
  //   // Generate the map tiles (you can customize this part)
  //   const generatedTiles = [];
  //   for (let y = 0; y < mapHeight; y++) {
  //     for (let x = 0; x < mapWidth; x++) {
  //       generatedTiles.push({ x, y });
  //     }
  //   }
  //   setTiles(generatedTiles);
  // }, [mapWidth, mapHeight]);

  return (
    <Canvas
      style={{
        width: "100vw", // Set the canvas width to 100% of the viewport width
        height: "100vh", // Set the canvas height to 100% of the viewport height
        position: "absolute",
        top: 0,
        left: 0,
      }}
      camera={{
        position: [0, 0, 10], // Set the camera position for 2D map view
        zoom: 1,
      }}
    >
      {/* Light for better visibility */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Map tiles */}
      {/* {tiles.map((tile, index) => (
        <Tile key={index} x={tile.x * tileSize} y={tile.y * tileSize} />
      ))} */}
      <Player
        position={playerPosition}
        setPosition={setPlayerPosition}
        screenBounds={screenBounds}
      />
      {/* {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          position={enemy.position}
          playerPosition={playerPosition}
          screenBounds={screenBounds}
        />
      ))} */}
    </Canvas>
  );
};

export default App;
