import { useState, useCallback, useEffect } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { useGame } from "../context/GameContext";

export const useEnemySystem = (
  playerPosition,
  canvasSize
  // setPlayerHealth,
  // playerHealth
) => {
  // const [enemies, setEnemies] = useState([]);
  // const [isMoving, setIsMoving] = useState(true);
  const { setEnemies, enemies, playerHealth, setPlayerHealth } = useGame();
  const spawnEnemy = useCallback((count) => {
    const newEnemies = Array.from({ length: count }, () => ({
      id: Math.random(),
      x: Math.random() * (canvasSize.width - 50),
      y: Math.random() * (canvasSize.height - 50),
      health: 100,
      lastAttackTime: 0,
    }));

    setEnemies((prev) => [...newEnemies]);
  }, []);

  const moveEnemies = useCallback(() => {
    const {
      ENEMY_SPEED,
      MIN_DISTANCE,
      ATTACK_DAMAGE,
      ATTACK_RANGE,
      ATTACK_COOLDOWN,
    } = GAME_CONFIG;
    const currentTime = Date.now();
    setEnemies((prev) =>
      prev.map((enemy) => {
        const dx = playerPosition.x - enemy.x;
        const dy = playerPosition.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > MIN_DISTANCE) {
          const moveX = (dx / distance) * ENEMY_SPEED;
          const moveY = (dy / distance) * ENEMY_SPEED;

          // setIsMoving(true);
          return {
            ...enemy,
            x: enemy.x + moveX,
            y: enemy.y + moveY,
            // lastAttackTime: currentTime,
          };
        } else {
          // setIsMoving(false);
          if (currentTime - enemy.lastAttackTime >= ATTACK_COOLDOWN) {
            setPlayerHealth((prev) => Math.max(0, prev - ATTACK_DAMAGE));
            return {
              ...enemy,
              lastAttackTime: currentTime,
            };
          }
        }

        return enemy;
      })
    );
  }, [playerPosition, setPlayerHealth, playerHealth]);

  // Handle movement interval internally
  useEffect(() => {
    if (enemies.length === 0 || playerHealth <= 0) return;

    const interval = setInterval(moveEnemies, 16);
    return () => clearInterval(interval);
  }, [moveEnemies, enemies.length]);

  return { spawnEnemy }; // No need to expose moveEnemies anymore
};
