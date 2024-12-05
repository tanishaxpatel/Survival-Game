import { useState, useCallback, useEffect } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";

export const useEnemySystem = (playerPosition, canvasSize, setPlayerHealth) => {
  const [enemies, setEnemies] = useState([]);
  const [isMoving, setIsMoving] = useState(true);

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

        if (
          distance <= ATTACK_RANGE &&
          currentTime - enemy.lastAttackTime >= ATTACK_COOLDOWN
        ) {
          setPlayerHealth((prev) => Math.max(0, prev - ATTACK_DAMAGE));
          // return enemy;
          // return {
          //   ...enemy,
          //   lastAttackTime: currentTime, // Update last attack time
          // };
        }

        if (distance > MIN_DISTANCE) {
          const moveX = (dx / distance) * ENEMY_SPEED;
          const moveY = (dy / distance) * ENEMY_SPEED;

          setIsMoving(true);
          return {
            ...enemy,
            x: enemy.x + moveX,
            y: enemy.y + moveY,
          };
        } else {
          setIsMoving(false);
        }

        return enemy;
      })
    );
  }, [playerPosition, setPlayerHealth]);

  // Handle movement interval internally
  useEffect(() => {
    if (enemies.length === 0 || !isMoving) return;

    const interval = setInterval(moveEnemies, 16);
    return () => clearInterval(interval);
  }, [moveEnemies, enemies.length, isMoving]);

  return { enemies, spawnEnemy }; // No need to expose moveEnemies anymore
};
