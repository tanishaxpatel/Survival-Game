import { memo } from "react";
import { Sprite } from "@pixi/react";

const Player = memo(({ position }) => {
  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";

  return (
    <Sprite
      image={bunnyUrl}
      x={position.x}
      y={position.y}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
});
Player.displayName = "Player";
export default Player;
