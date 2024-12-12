import { useRef } from "react";

const Tile = ({ x, y }) => {
  const tileRef = useRef();

  return (
    <mesh ref={tileRef} position={[x, y, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
};

export default Tile;
