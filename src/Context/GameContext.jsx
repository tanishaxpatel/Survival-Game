import { createContext, useContext, useState, useCallback } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [enemies, setEnemies] = useState([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const value = {
    enemies,
    setEnemies,
    playerHealth,
    setPlayerHealth,
    survivalTime,
    setSurvivalTime,
    gameOver,
    setGameOver,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
