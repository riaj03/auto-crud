"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrator = void 0;
class Migrator {
    constructor(schemaMigrationStrategy) {
        this.schemaMigrationStrategy = schemaMigrationStrategy;
    }
    migrate(porjectDBPath, model) {
        return this.schemaMigrationStrategy.migrate(porjectDBPath, model);
    }
}
exports.Migrator = Migrator;
