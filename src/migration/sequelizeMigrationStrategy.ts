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
  private runMigration() {
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
      this.model.associations?.forEach((association: any) => {
        modelContent += `${this.model.name}.${association.method}(models.${association.associated_model},{`;
        association.attributes.forEach((attribute: any) => {
          modelContent += `${attribute.name}:"${attribute.value}",`;

          // if (ASSOSIATION_KEYS.includes(attribute.name)) modelContent += `${attribute.name}:"${attribute.value}",`;
          // else console.log(`${this.model.name}s assosiation keys are wrong`);
        });
        modelContent += `});`;
      });

      modelContent += modelsSnipets.assosiationEnd.replace(/@{MODEL}/g, this.model.name);

      // create models & migrations
      this.model.attributes.forEach((attr: any) => {
        migrationContent += `${attr.name}:{`;
        attr.types.forEach((property: any) => {
          if (property.name === 'type') {
            if (!DATA_TYPES.includes(property.value)) property.value = 'STRING';

            modelContent += `${attr.name}: DataTypes.${property.value.toUpperCase()},\n`;
            migrationContent += `${property.name}:Sequelize.${property.value.toUpperCase()},\n`;
          } else {
            migrationContent += `${property.name}:${property.value},\n`;
          }
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
