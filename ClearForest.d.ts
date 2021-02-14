import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
export declare class ClearForest extends DelayedAction {
  #private;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry?: RuleRegistry,
    terrainFeatureRegistry?: TerrainFeatureRegistry,
    turn?: Turn
  );
  perform(): void;
}
export default ClearForest;
