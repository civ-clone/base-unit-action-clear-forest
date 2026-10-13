import ClearForest from '../ClearForest';
import Forest from '@civ-clone/base-terrain-forest/Forest';
import Game from '@civ-clone/base-terrain-feature-game/Game';
import Horse from '@civ-clone/base-terrain-feature-horse/Horse';
import Plains from '@civ-clone/base-terrain-plains/Plains';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';

describe('ClearForest', (): void => {
  const clear = (
    FeatureType: typeof TerrainFeature | null
  ): [Tile, TerrainFeatureRegistry] => {
    const ruleRegistry = new RuleRegistry(),
      terrainFeatureRegistry = new TerrainFeatureRegistry(),
      tile = new Tile(
        0,
        0,
        new Forest(),
        null as unknown as World,
        ruleRegistry
      );

    if (FeatureType !== null) {
      terrainFeatureRegistry.register(new FeatureType(tile.terrain()));
    }

    ClearForest.complete(
      new ClearForest(
        tile,
        tile,
        null as unknown as Unit,
        ruleRegistry,
        terrainFeatureRegistry
      )
    );

    return [tile, terrainFeatureRegistry];
  };

  it('should turn a Forest with Game into Plains with Horses (civ-clone/web-renderer#281)', (): void => {
    const [tile, terrainFeatureRegistry] = clear(Game);

    expect(tile.terrain()).to.instanceof(Plains);
    expect(
      terrainFeatureRegistry
        .getByTerrain(tile.terrain())
        .map((feature: TerrainFeature) => feature.constructor)
    ).to.deep.equal([Horse]);
  });

  it('should turn a Forest with no special into Plains with none', (): void => {
    const [tile, terrainFeatureRegistry] = clear(null);

    expect(tile.terrain()).to.instanceof(Plains);
    expect(terrainFeatureRegistry.getByTerrain(tile.terrain())).to.deep.equal(
      []
    );
  });
});
