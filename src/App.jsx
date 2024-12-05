import { useEffect, useState } from "react";
import { Stage, Text } from "@pixi/react";
import { useWindowSize } from "./hooks/useWindowSize";
import { useMovement } from "./hooks/useMovemet";
import { useEnemySystem } from "./hooks/useEnemySystem";
import Player from "./componets/Player/player";
import EnemyList from "./componets/Enemy/EnemyList";
import SurvivalTimer from "./componets/UI/SurvivalTimer";

const App = () => {
  const { width, height } = useWindowSize();
  const [playerPosition, handleKeyPress] = useMovement({
    x: width / 2,
    y: height / 2,
  });

  const [playerHealth, setPlayerHealth] = useState(100);
  const [survivalTime, setSurvivalTime] = useState(0);

  const { enemies, spawnEnemy, moveEnemies } = useEnemySystem(
    playerPosition,
    {
      width,
      height,
    },
    setPlayerHealth
  );
  // const survivalTimeRef = useRef(0);
  // Handle keyboard events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Spawn initial enemies
  useEffect(() => {
    spawnEnemy(5);
  }, [spawnEnemy]);

  useEffect(() => {
    console.log("playerHealth", playerHealth);

    // if (playerHealth <= 0) return;

    const interval = setInterval(() => {
      setSurvivalTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [playerHealth]);

  return (
    <Stage width={width} height={height} options={{ background: 0x1099bb }}>
      <Player position={playerPosition} />
      <EnemyList enemies={enemies} />
      <SurvivalTimer time={survivalTime} />
      <Text
        text={`Health: ${playerHealth}`}
        style={{ fill: "white", fontSize: 24 }}
      />
    </Stage>
  );
};

export default App;
