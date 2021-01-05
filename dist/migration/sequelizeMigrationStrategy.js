"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeMigrationStrategy = void 0;
const child_process_1 = require("child_process");
class SequelizeMigrationStrategy {
    constructor() {
        this.migrate = (porjectDBPath, model) => {
            this.porjectDBPath = porjectDBPath;
            this.model = model;
            this.runMigration();
            return false;
        };
    }
    runMigration() {
        try {
            let sequelizeCmdStr = `sequelize model:generate --name ${this.model.name} --attributes `;
            this.model.attributes.forEach((attr) => {
                sequelizeCmdStr += `${attr.name}:${attr.type},`;
            });
            sequelizeCmdStr = sequelizeCmdStr.slice(0, sequelizeCmdStr.length - 1);
            child_process_1.execSync(sequelizeCmdStr, { cwd: `${this.porjectDBPath}` });
        }
        catch (error) {
            console.log('Can not run migration');
        }
    }
}
exports.SequelizeMigrationStrategy = SequelizeMigrationStrategy;
