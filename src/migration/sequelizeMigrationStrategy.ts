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

      const modelsExist = ifExists(this.porjectDBPath + `models/${this.model.name.toLocaleLowerCase()}.ts`);
      let modelContent = modelsSnipets.modelHeader.replace(/@{MODEL}/g, this.model.name);

      // create models & migrations
      let migrationContent = migrationsSnipets.migrationsStart.replace(/@{MODEL}/g, this.model.name);

      //assosiations

      // Booking.hasMany(models.TreatmentFeedback, {
      //   as: ASSOCIATION_ALIASES.TREATMENT_FEEDBACK.BOOKING_TO_TREATMENT_FEEDBACK,
      //   foreignKey: 'bookingId',
      //   sourceKey: 'id'
      // });

      // this.model.associations?.forEach((association: any) => {
      //   let assosiation = `${this.model.name}.${association.method}(models.${association.associated_model},{as: ${association.as},})`;
      //   console.log(association.method);
      // });

      this.model.attributes.forEach((attr: any) => {
        migrationContent += `${attr.name}:{`;
        attr.types.forEach((prpperty: any) => {
          if (prpperty.name === 'type') {
            modelContent += `${attr.name}: DataTypes.${prpperty.value.toUpperCase()},\n`;
            migrationContent += `${prpperty.name}:Sequelize.${prpperty.value.toUpperCase()},\n`;
          } else {
            migrationContent += `${prpperty.name}:${prpperty.value},\n`;
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
