import { memo } from "react";
import PropTypes from "prop-types";
import Enemy from "./Enemy";

const EnemyList = memo(({ enemies }) => {
  return enemies.map((enemy) => <Enemy key={enemy.id} {...enemy} />);
});

EnemyList.propTypes = {
  enemies: PropTypes.arrayOf(PropTypes.object).isRequired,
};

EnemyList.displayName = "EnemyList";
export default EnemyList;
