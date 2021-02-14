import { Moved, IMovedRegistry } from '@civ-clone/core-unit/Rules/Moved';
import {
  MovementCost,
  IMovementCostRegistry,
} from '@civ-clone/core-unit/Rules/MovementCost';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Plains from '@civ-clone/base-terrain-plains/Plains';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
export class ClearForest extends DelayedAction {
  #terrainFeatureRegistry: TerrainFeatureRegistry;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
    turn: Turn = turnInstance
  ) {
    super(from, to, unit, ruleRegistry, turn);

    this.#terrainFeatureRegistry = terrainFeatureRegistry;
  }

  perform(): void {
    const [
      moveCost,
    ]: number[] = (this.ruleRegistry() as IMovementCostRegistry)
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(moveCost, (): void => {
      const terrain = new Plains(),
        features = this.#terrainFeatureRegistry.getByTerrain(
          this.from().terrain()
        );

      this.#terrainFeatureRegistry.register(
        ...features.map(
          (feature: TerrainFeature): TerrainFeature => feature.clone(terrain)
        )
      );
      this.#terrainFeatureRegistry.unregister(...features);

      this.from().setTerrain(terrain);
    });

    (this.ruleRegistry() as IMovedRegistry).process(Moved, this.unit(), this);
  }
}

export default ClearForest;
