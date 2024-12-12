import { useCallback, useRef } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { useGame } from "../context/GameContext";

export const usePlayerAttacks = (playerPosition) => {
  const lastAttackTimes = useRef({
    quick: 0,
    heavy: 0,
    area: 0,
  });
  const { setEnemies, enemies } = useGame();

  //   // Quick Attack - Fast, medium damage
  //   const quickAttack = useCallback(() => {
  //     const currentTime = Date.now();
  //     if (currentTime - lastAttackTimes.current.quick < GAME_CONFIG.QUICK_ATTACK_COOLDOWN) {
  //       return;
  //     }

  //     setEnemies(prev => prev.map(enemy => {
  //       const dx = playerPosition.x - enemy.x;
  //       const dy = playerPosition.y - enemy.y;
  //       const distance = Math.sqrt(dx * dx + dy * dy);

  //       if (distance <= GAME_CONFIG.QUICK_ATTACK_RANGE) {
  //         return {
  //           ...enemy,
  //           health: Math.max(0, enemy.health - GAME_CONFIG.QUICK_ATTACK_DAMAGE)
  //         };
  //       }
  //       return enemy;
  //     }).filter(enemy => enemy.health > 0));

  //     lastAttackTimes.current.quick = currentTime;
  //   }, [playerPosition, setEnemies]);

  // Heavy Attack - Slow, high damage
  //   const heavyAttack = useCallback(() => {
  //     const currentTime = Date.now();
  //     if (currentTime - lastAttackTimes.current.heavy < GAME_CONFIG.HEAVY_ATTACK_COOLDOWN) {
  //       return;
  //     }

  //     setEnemies(prev => prev.map(enemy => {
  //       const dx = playerPosition.x - enemy.x;
  //       const dy = playerPosition.y - enemy.y;
  //       const distance = Math.sqrt(dx * dx + dy * dy);

  //       if (distance <= GAME_CONFIG.HEAVY_ATTACK_RANGE) {
  //         return {
  //           ...enemy,
  //           health: Math.max(0, enemy.health - GAME_CONFIG.HEAVY_ATTACK_DAMAGE)
  //         };
  //       }
  //       return enemy;
  //     }).filter(enemy => enemy.health > 0));

  //     lastAttackTimes.current.heavy = currentTime;
  //   }, [playerPosition, setEnemies]);

  // Area Attack - Medium speed, hits all enemies in larger range
  const areaAttack = useCallback((enemy) => {
    const currentTime = Date.now();
    if (
      currentTime - lastAttackTimes.current.area <
      GAME_CONFIG.AREA_ATTACK_COOLDOWN
    ) {
      return;
    }

    setEnemies((prev) =>
      prev
        .map((enemy) => {
          const dx = playerPosition.x - enemy.x;
          const dy = playerPosition.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= GAME_CONFIG.AREA_ATTACK_RANGE) {
            return {
              ...enemy,
              health: Math.max(
                0,
                enemy.health - GAME_CONFIG.AREA_ATTACK_DAMAGE
              ),
            };
          }

          return enemy;
        })
        .filter((enemy) => enemy.health > 0)
    );

    lastAttackTimes.current.area = currentTime;
  }, []);

  // Get cooldown status for UI
  const getCooldowns = useCallback(() => {
    const currentTime = Date.now();
    return {
      //   quick: Math.max(0, GAME_CONFIG.QUICK_ATTACK_COOLDOWN - (currentTime - lastAttackTimes.current.quick)),
      //   heavy: Math.max(0, GAME_CONFIG.HEAVY_ATTACK_COOLDOWN - (currentTime - lastAttackTimes.current.heavy)),
      area: Math.max(
        0,
        GAME_CONFIG.AREA_ATTACK_COOLDOWN -
          (currentTime - lastAttackTimes.current.area)
      ),
    };
  }, []);

  return {
    areaAttack,
    getCooldowns,
  };
};
