"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearForest = exports.COMPLETE = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const ClearingForest_1 = require("./Rules/ClearingForest");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const Plains_1 = require("@civ-clone/base-terrain-plains/Plains");
const registerDelayedAction_1 = require("@civ-clone/core-unit/registerDelayedAction");
exports.COMPLETE = 'base-unit-action-clear-forest:complete';
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
        super.perform(moveCost, exports.COMPLETE, ClearingForest_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
}
exports.ClearForest = ClearForest;
// Registered here rather than passed to `perform` as a closure: a closure
// cannot be written to a file, which is why a unit part-way through this could
// not be saved. `this.from()` becomes `unit.tile()` — the same tile, since
// `isCurrentTile` is one of this action's criteria — and the registries come
// from their singletons rather than the action instance.
(0, registerDelayedAction_1.default)({
    BusyRule: ClearingForest_1.default,
    handler: exports.COMPLETE,
    action: (unit) => new ClearForest(unit.tile(), unit.tile(), unit),
    complete: (unit) => {
        const terrain = new Plains_1.default(), features = TerrainFeatureRegistry_1.instance.getByTerrain(unit.tile().terrain());
        TerrainFeatureRegistry_1.instance.register(...features.map((feature) => feature.clone(terrain)));
        TerrainFeatureRegistry_1.instance.unregister(...features);
        unit.tile().setTerrain(terrain);
    },
});
exports.default = ClearForest;
//# sourceMappingURL=ClearForest.js.map