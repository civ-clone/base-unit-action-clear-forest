"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearForest = void 0;
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Plains_1 = require("@civ-clone/base-terrain-plains/Plains");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
class ClearForest extends DelayedAction_1.default {
    perform() {
        const [moveCost,] = this.ruleRegistry()
            .process(MovementCost_1.MovementCost, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, () => {
            const terrain = new Plains_1.Plains(), features = TerrainFeatureRegistry_1.instance.getByTerrain(this.from().terrain());
            TerrainFeatureRegistry_1.instance.register(...features.map((feature) => feature.clone(terrain)));
            TerrainFeatureRegistry_1.instance.unregister(...features);
            this.from().setTerrain(terrain);
        });
        this.ruleRegistry().process(Moved_1.Moved, this.unit(), this);
    }
}
exports.ClearForest = ClearForest;
exports.default = ClearForest;
//# sourceMappingURL=ClearForest.js.map