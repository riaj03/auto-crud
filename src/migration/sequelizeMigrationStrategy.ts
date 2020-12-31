import { ModelConfig } from '../strategies/modelConfig.types';
import { SchemaMigartionStrategy } from './schemaMigrationStrategy.interface';
import { execSync } from 'child_process';

export class SequelizeMigrationStrategy implements SchemaMigartionStrategy {
  porjectDBPath!: string;
  dbInstance: any;
  private model!: ModelConfig;
  private runMigration() {
    let sequelizeCmdStr = `sequelize model:generate --name ${this.model.name} --attributes `;
    this.model.attributes.forEach((attr) => {
      sequelizeCmdStr += `${attr.name}:${attr.type},`;
    });
    sequelizeCmdStr = sequelizeCmdStr.slice(0, sequelizeCmdStr.length - 1);

    execSync(sequelizeCmdStr, { cwd: `${this.porjectDBPath}` });
  }

  public migrate = (porjectDBPath: string, dbInstance: any, model: ModelConfig) => {
    this.porjectDBPath = porjectDBPath;
    this.model = model;
    this.dbInstance = dbInstance;
    this.runMigration();
    return false;
  };
}
