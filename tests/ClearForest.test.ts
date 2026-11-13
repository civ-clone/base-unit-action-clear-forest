import ClearForest from '../ClearForest';
import Effect from '@civ-clone/core-rule/Effect';
import Plains from '@civ-clone/base-terrain-plains/Plains';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import World from '@civ-clone/core-world/World';
import { carryFeatures } from '@civ-clone/base-terrain-feature/lib/replaceFeatures';
import { expect } from 'chai';

class Before extends Terrain {}
class Ore extends TerrainFeature {}
class Fruit extends TerrainFeature {}

describe('ClearForest', (): void => {
  const complete = (
    ruleRegistry: RuleRegistry,
    terrainFeatureRegistry: TerrainFeatureRegistry
  ): [Tile, Terrain] => {
    const tile = new Tile(
        0,
        0,
        new Before(),
        null as unknown as World,
        ruleRegistry
      ),
      from = tile.terrain();

    terrainFeatureRegistry.register(new Ore(from), new Fruit(from));

    ClearForest.complete(
      new ClearForest(
        tile,
        tile,
        null as unknown as Unit,
        ruleRegistry,
        terrainFeatureRegistry
      )
    );

    return [tile, from];
  };

  it('should give the square a new Plains and process `TerrainChanged` once', (): void => {
    const ruleRegistry = new RuleRegistry(),
      seen: [Tile, Terrain, Terrain][] = [];

    ruleRegistry.register(
      new TerrainChanged(
        new Effect((tile: Tile, from: Terrain, to: Terrain): void => {
          seen.push([tile, from, to]);
        })
      )
    );

    const [tile, from] = complete(ruleRegistry, new TerrainFeatureRegistry());

    expect(tile.terrain()).to.instanceof(Plains);
    expect(seen).to.deep.equal([[tile, from, tile.terrain()]]);
  });

  it("should carry the square's features onto the new terrain with a `carryFeatures` rule", (): void => {
    const ruleRegistry = new RuleRegistry(),
      terrainFeatureRegistry = new TerrainFeatureRegistry();

    ruleRegistry.register(
      new TerrainChanged(new Effect(carryFeatures(terrainFeatureRegistry)))
    );

    const [tile, from] = complete(ruleRegistry, terrainFeatureRegistry);

    expect(
      terrainFeatureRegistry
        .getByTerrain(tile.terrain())
        .map((feature: TerrainFeature) => feature.constructor)
    ).to.deep.equal([Ore, Fruit]);
    expect(terrainFeatureRegistry.getByTerrain(from)).to.deep.equal([]);
  });

  it('should leave the features alone when no rule moves them', (): void => {
    const terrainFeatureRegistry = new TerrainFeatureRegistry(),
      [tile, from] = complete(new RuleRegistry(), terrainFeatureRegistry);

    expect(terrainFeatureRegistry.getByTerrain(tile.terrain())).to.deep.equal(
      []
    );
    expect(
      terrainFeatureRegistry
        .getByTerrain(from)
        .map((feature: TerrainFeature) => feature.constructor)
    ).to.deep.equal([Ore, Fruit]);
  });
});
