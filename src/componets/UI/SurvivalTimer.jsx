import { memo } from "react";
import { Text } from "@pixi/react";
import { useWindowSize } from "../../hooks/useWindowSize";

const SurvivalTimer = memo(({ time }) => {
  const { width } = useWindowSize();
  return (
    <Text
      text={`Time Survived: ${time}s`}
      style={{
        fill: "white",
        fontSize: 24,
      }}
      x={width / 2}
      y={10}
    />
  );
});

SurvivalTimer.displayName = "SurvivalTimer";
export default SurvivalTimer;
