import { memo } from "react";
import { Sprite } from "@pixi/react";
import enemySprite from "../../assets/SoldierStand.png";

const Enemy = memo(({ x, y }) => {
  return <Sprite image={enemySprite} x={x} y={y} anchor={{ x: 0.5, y: 0.5 }} />;
});
Enemy.displayName = "Enemy";
export default Enemy;
