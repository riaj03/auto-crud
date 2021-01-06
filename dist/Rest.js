"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const sequelizeMigrationStrategy_1 = require("./migration/sequelizeMigrationStrategy");
const migrator_1 = require("./migration/migrator");
const CRUDGenerator_1 = require("./crud/CRUDGenerator");
const typescriptCrud_1 = require("./typeScript/typescriptCrud/typescriptCrud");
const child_process_1 = require("child_process");
class Rest {
    constructor(dbType, porjectPath, language) {
        this.porjectDBPath = porjectPath;
        this.dbType = dbType;
        this.language = language;
    }
    crudGeneratorStrategy(model) {
        if (this.language === 'typescript') {
            this.crud = new CRUDGenerator_1.CRUDGenerator(this.porjectDBPath, model, new typescriptCrud_1.TypescriptCrudStrategy());
        }
    }
    migrateSchema(model) {
        if (this.dbType === 'sql') {
            const schemaMigrationStrategy = new sequelizeMigrationStrategy_1.SequelizeMigrationStrategy();
            const migrator = new migrator_1.Migrator(schemaMigrationStrategy);
            migrator.migrate(this.porjectDBPath, model);
        }
    }
    createRest(models) {
        models.forEach((model) => {
            // migrateting
            this.migrateSchema(model);
            // crud generate
            this.crudGeneratorStrategy(model);
            this.crud.generate();
        });
    }
    pretifyCodes() {
        child_process_1.execSync('npm run format', { cwd: `/home/riajul/Documents/groots/otusuki-dental/od-backend` });
    }
    generate(restConfig) {
        this.createRest(restConfig.models);
        // TODO:: pertify all codes
        //this.pretifyCodes();
    }
}
exports.Rest = Rest;
