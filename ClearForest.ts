import { Moved, IMovedRegistry } from '@civ-clone/core-unit/Rules/Moved';
import {
  MovementCost,
  IMovementCostRegistry,
} from '@civ-clone/core-unit/Rules/MovementCost';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import { Plains } from '@civ-clone/base-terrain-plains/Plains';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import { instance as terrainFeatureRegistryInstance } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';

// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
export class ClearForest extends DelayedAction {
  perform() {
    const [
      moveCost,
    ]: number[] = (this.ruleRegistry() as IMovementCostRegistry)
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(moveCost, (): void => {
      const terrain = new Plains(),
        features = terrainFeatureRegistryInstance.getByTerrain(
          this.from().terrain()
        );

      terrainFeatureRegistryInstance.register(
        ...features.map(
          (feature: TerrainFeature): TerrainFeature => feature.clone(terrain)
        )
      );
      terrainFeatureRegistryInstance.unregister(...features);

      this.from().setTerrain(terrain);
    });

    (this.ruleRegistry() as IMovedRegistry).process(Moved, this.unit(), this);
  }
}

export default ClearForest;
