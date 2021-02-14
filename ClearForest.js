"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _terrainFeatureRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearForest = void 0;
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Plains_1 = require("@civ-clone/base-terrain-plains/Plains");
// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
class ClearForest extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, turn = Turn_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        _terrainFeatureRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _terrainFeatureRegistry, terrainFeatureRegistry);
    }
    perform() {
        const [moveCost,] = this.ruleRegistry()
            .process(MovementCost_1.MovementCost, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, () => {
            const terrain = new Plains_1.default(), features = __classPrivateFieldGet(this, _terrainFeatureRegistry).getByTerrain(this.from().terrain());
            __classPrivateFieldGet(this, _terrainFeatureRegistry).register(...features.map((feature) => feature.clone(terrain)));
            __classPrivateFieldGet(this, _terrainFeatureRegistry).unregister(...features);
            this.from().setTerrain(terrain);
        });
        this.ruleRegistry().process(Moved_1.Moved, this.unit(), this);
    }
}
exports.ClearForest = ClearForest;
_terrainFeatureRegistry = new WeakMap();
exports.default = ClearForest;
//# sourceMappingURL=ClearForest.js.map