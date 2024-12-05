import { useState, useCallback } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";

export const useMovement = (initialPosition) => {
  const [position, setPosition] = useState(initialPosition);

  const handleMovement = useCallback((event) => {
    const { PLAYER_SPEED } = GAME_CONFIG;

    setPosition((prev) => {
      const newPosition = { ...prev };

      switch (event.key) {
        case "w":
          newPosition.y -= PLAYER_SPEED;
          break;
        case "a":
          newPosition.x -= PLAYER_SPEED;
          break;
        case "s":
          newPosition.y += PLAYER_SPEED;
          break;
        case "d":
          newPosition.x += PLAYER_SPEED;
          break;
        default:
          break;
      }

      return newPosition;
    });
  }, []);

  return [position, handleMovement];
};
