// import { DBModelBuilder } from './DBModelBuilder';
import { ModelConfig, RestConfig } from './strategies/modelConfig.types';
import { SequelizeMigrationStrategy } from './migration/sequelizeMigrationStrategy';
import { Migrator } from './migration/migrator';
import { CRUDGenerator } from './crud/CRUDGenerator';
import { TypescriptCrudStrategy } from './typeScript/typescriptCrud/typescriptCrud';
import { execSync } from 'child_process';
export class Rest {
  private porjectDBPath: string;
  private dbType: 'sql' | 'nosql';
  private language: 'javascript' | 'typescript';
  private crud!: CRUDGenerator;
  constructor(dbType: 'sql' | 'nosql', porjectPath: string, language: 'javascript' | 'typescript') {
    this.porjectDBPath = porjectPath;
    this.dbType = dbType;
    this.language = language;
  }

  private crudGeneratorStrategy(model: ModelConfig) {
    if (this.language === 'typescript') {
      this.crud = new CRUDGenerator(this.porjectDBPath, model, new TypescriptCrudStrategy());
    }
  }

  private migrateSchema(model: ModelConfig) {
    if (this.dbType === 'sql') {
      const schemaMigrationStrategy = new SequelizeMigrationStrategy();
      const migrator = new Migrator(schemaMigrationStrategy);
      migrator.migrate(this.porjectDBPath, model);
    }
  }

  private createRest(models: ModelConfig[]) {
    models.forEach((model) => {
      // migrateting
      this.migrateSchema(model);

      // crud generate
      this.crudGeneratorStrategy(model);
      this.crud.generate();
    });
  }

  private pretifyCodes() {
    execSync('npm run format', { cwd: `/home/riajul/Documents/groots/otusuki-dental/od-backend` });
  }
  public generate(restConfig: RestConfig) {
    this.createRest(restConfig.models);
    // TODO:: pertify all codes
    //this.pretifyCodes();
  }
}
