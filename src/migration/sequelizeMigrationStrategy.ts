import { ModelConfig } from '../strategies/modelConfig.types';
import { SchemaMigartionStrategy } from './schemaMigrationStrategy.interface';
import { execSync } from 'child_process';
import { ifExists } from '../services/commonServices';
import { writeFileSync } from 'fs';
import { modelsSnipets } from '../typeScript/snipets/typeScriptSnipets/modelsSnipets';
import { migrationsSnipets } from '../typeScript/snipets/typeScriptSnipets/migrationsSnipets';
import { ASSOSIATION_KEYS, DATA_TYPES } from '../types/dataTypes';

export class SequelizeMigrationStrategy implements SchemaMigartionStrategy {
  porjectDBPath!: string;
  private model!: ModelConfig;
  private async runMigration() {
    try {
      //sequelize initialize
      const sequlizeConfigExist = ifExists(this.porjectDBPath + 'config/config.json');
      if (!sequlizeConfigExist) {
        const sequelizeInit = `sequelize init`;
        execSync(sequelizeInit, { cwd: `${this.porjectDBPath}` });
      }

      const modelsExist = ifExists(this.porjectDBPath + `models/${this.model.name.toLocaleLowerCase()}.ts`);
      let modelContent = modelsSnipets.modelHeader.replace(/@{MODEL}/g, this.model.name);
      let migrationContent = migrationsSnipets.migrationsStart.replace(/@{MODEL}/g, this.model.name);

      //TODO: assosiation
      // let dbInstance = require('/home/zahirul/groots/waris-backend/src/packages/user/db/models/');

      this.model.associations?.forEach((association: any) => {
        const exists = ifExists(
          `/home/zahirul/groots/waris-backend/src/packages/user/db/models/${association.associated_model.toLocaleLowerCase()}.ts`
        );

        if (association.associated_model && exists) {
          modelContent += `${this.model.name}.${association.method}(models.${association.associated_model},{`;
          association.attributes.forEach((attribute: any) => {
            modelContent += `${attribute.name}:"${attribute.value}",`;
          });
          modelContent += `});`;
        }
      });

      modelContent += modelsSnipets.assosiationEnd.replace(/@{MODEL}/g, this.model.name);

      // create models & migrations
      this.model.attributes.forEach((attr: any) => {
        if (!DATA_TYPES.includes(attr.type)) attr.type = 'STRING';
        modelContent += `${attr.name}: DataTypes.${attr.type.toUpperCase()},\n`;

        migrationContent += `${attr.name}:{`;
        migrationContent += `type:Sequelize.${attr.type.toUpperCase()},\n`;
        migrationContent += `isRequired:${attr.isRequired},\n`;

        attr.properties?.forEach((property: any) => {
          migrationContent += `${property.name}:${property.value},\n`;
        });
        migrationContent += '},';
      });

      //model
      if (!modelsExist) {
        modelContent += modelsSnipets.modelMethods.replace(/@{MODEL}/g, this.model.name);
        writeFileSync(`${this.porjectDBPath}models/${this.model.name.toLowerCase()}.js`, modelContent);
      }

      //migration
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
