"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearForest = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const ClearingForest_1 = require("./Rules/ClearingForest");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const Plains_1 = require("@civ-clone/base-terrain-plains/Plains");
// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
class ClearForest extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, turn = Turn_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        this._terrainFeatureRegistry = terrainFeatureRegistry;
    }
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.default, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, () => {
            const terrain = new Plains_1.default(), features = this._terrainFeatureRegistry.getByTerrain(this.from().terrain());
            this._terrainFeatureRegistry.register(...features.map((feature) => feature.clone(terrain)));
            this._terrainFeatureRegistry.unregister(...features);
            this.from().setTerrain(terrain);
        }, ClearingForest_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
}
exports.ClearForest = ClearForest;
exports.default = ClearForest;
//# sourceMappingURL=ClearForest.js.map