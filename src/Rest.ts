// import { DBModelBuilder } from './DBModelBuilder';
import { ModelConfig, RestConfig } from './strategies/modelConfig.types';
import { SequelizeMigrationStrategy } from './migration/sequelizeMigrationStrategy';
import { Migrator } from './migration/migrator';
import { CRUDGenerator } from './crud/CRUDGenerator';
import { TypescriptCrudStrategy } from './typeScript/typescriptCrud/typescriptCrud';
import { execSync } from 'child_process';
export class Rest {
  private projectDBPath: string;
  private dbType: 'sql' | 'nosql';
  private language: 'javascript' | 'typescript';
  private crud!: CRUDGenerator;

  constructor(dbType: 'sql' | 'nosql', projectPath: string, language: 'javascript' | 'typescript') {
    this.projectDBPath = projectPath;
    this.dbType = dbType;
    this.language = language;
  }

  private crudGeneratorStrategy(model: ModelConfig) {
    if (this.language === 'typescript') {
      this.crud = new CRUDGenerator(this.projectDBPath, model, new TypescriptCrudStrategy());
    }
  }

  private migrateSchema(model: ModelConfig) {
    if (this.dbType === 'sql') {
      const schemaMigrationStrategy = new SequelizeMigrationStrategy();
      const migrator = new Migrator(schemaMigrationStrategy);
      migrator.migrate(this.projectDBPath, model);
    }
  }

  private createRest(models: ModelConfig[]) {
    models.forEach((model) => {
      this.migrateSchema(model);
      this.crudGeneratorStrategy(model);
      this.crud.generate();
    });
  }

  public generate(restConfig: RestConfig) {
    this.createRest(restConfig.models);
  }
}
