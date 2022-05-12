import { ModelConfig } from '../strategies/modelConfig.types';
import { SchemaMigartionStrategy } from './schemaMigrationStrategy.interface';
import { execSync } from 'child_process';
export class SequelizeMigrationStrategy implements SchemaMigartionStrategy {
  porjectDBPath!: string;
  private model!: ModelConfig;
  private runMigration() {
    try {
      let sequelizeCmdStr = `sequelize model:generate --name ${this.model.name} --attributes `;
      this.model.attributes.forEach((attr) => {
        sequelizeCmdStr += `${attr.name}:${attr.type},`;
      });
      sequelizeCmdStr = sequelizeCmdStr.slice(0, sequelizeCmdStr.length - 1);

      execSync(sequelizeCmdStr, { cwd: `${this.porjectDBPath}` });
    } catch (error) {
      console.log('Can not run migration');
    }
  }

  public migrate = (porjectDBPath: string, model: ModelConfig) => {
    this.porjectDBPath = porjectDBPath;
    this.model = model;
    this.runMigration();
    return false;
  };
}
