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
import ClearingForest from './Rules/ClearingForest';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import MovementCost from '@civ-clone/core-unit/Rules/MovementCost';
import Plains from '@civ-clone/base-terrain-plains/Plains';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import registerDelayedAction from '@civ-clone/core-unit/registerDelayedAction';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';

export const COMPLETE = 'base-unit-action-clear-forest:complete';

// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
export class ClearForest extends DelayedAction {
  private _terrainFeatureRegistry: TerrainFeatureRegistry;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
    turn: Turn = turnInstance
  ) {
    super(from, to, unit, ruleRegistry, turn);

    this._terrainFeatureRegistry = terrainFeatureRegistry;
  }

  perform(): void {
    const [moveCost]: number[] = this.ruleRegistry()
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(moveCost, COMPLETE, ClearingForest);

    this.ruleRegistry().process(Moved, this.unit(), this);
  }
}

// Registered here rather than passed to `perform` as a closure: a closure
// cannot be written to a file, which is why a unit part-way through this could
// not be saved. `this.from()` becomes `unit.tile()` — the same tile, since
// `isCurrentTile` is one of this action's criteria — and the registries come
// from their singletons rather than the action instance.
registerDelayedAction({
  BusyRule: ClearingForest,
  handler: COMPLETE,
  action: (unit: Unit) => new ClearForest(unit.tile(), unit.tile(), unit),
  complete: (unit: Unit) => {
    const terrain = new Plains(),
      features = terrainFeatureRegistryInstance.getByTerrain(
        unit.tile().terrain()
      );

    terrainFeatureRegistryInstance.register(
      ...features.map(
        (feature: TerrainFeature): TerrainFeature => feature.clone(terrain)
      )
    );
    terrainFeatureRegistryInstance.unregister(...features);

    unit.tile().setTerrain(terrain);
  },
});

export default ClearForest;
