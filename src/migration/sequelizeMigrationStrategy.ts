import { ModelConfig } from '../strategies/modelConfig.types';
import { SchemaMigartionStrategy } from './schemaMigrationStrategy.interface';
import { execSync } from 'child_process';
import { ifExists } from '../services/commonServices';
import { writeFileSync } from 'fs';
import { modelsSnipets } from '../typeScript/snipets/typeScriptSnipets/modelsSnipets';
import { migrationsSnipets } from '../typeScript/snipets/typeScriptSnipets/migrationsSnipets';

export class SequelizeMigrationStrategy implements SchemaMigartionStrategy {
  porjectDBPath!: string;
  private model!: ModelConfig;
  private runMigration() {
    try {
      //sequelize initialize
      const sequlizeConfigExist = ifExists(this.porjectDBPath + 'config/config.json');
      if (!sequlizeConfigExist) {
        const sequelizeInit = `sequelize init`;
        execSync(sequelizeInit, { cwd: `${this.porjectDBPath}` });
      }

      //create models
      const modelsExist = ifExists(this.porjectDBPath + `models/${this.model.name.toLocaleLowerCase()}`);
      if (!modelsExist) {
        let modelContent = modelsSnipets.modelHeader.replace(/@{MODEL}/g, this.model.name);
        this.model.attributes.forEach((attr: any) => {
          modelContent += `${attr.name}:${attr.type},`;
        });
        modelContent += modelsSnipets.modelMethods.replace(/@{MODEL}/g, this.model.name);
        writeFileSync(`${this.porjectDBPath}/models/${this.model.name.toLowerCase()}.js`, modelContent);
      }

      // create migrations
      let migrationContent = migrationsSnipets.migrationsStart.replace(/@{MODEL}/g, this.model.name);
      this.model.attributes.forEach((attr: any) => {
        migrationContent += `${attr.name}:{type:Sequelize.${attr.type.toUpperCase()}},`;
      });
      migrationContent += migrationsSnipets.migrationsEnd.replace(/@{MODEL}/g, this.model.name);
      writeFileSync(
        `${this.porjectDBPath}/migrations/${Date.now()}-create-${this.model.name.toLowerCase()}.js`,
        migrationContent
      );
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
