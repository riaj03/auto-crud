"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBModelBuilder = void 0;
class DBModelBuilder {
    constructor(strategy) {
        this.dbModelStrategy = strategy;
    }
    // TODO: specify return type
    buildDBModel(modelConfig) {
        return this.dbModelStrategy.buildDBModel(modelConfig);
    }
}
exports.DBModelBuilder = DBModelBuilder;
