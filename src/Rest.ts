import { DatabaseConnection } from './dbConnectionService';
// import { DBModelBuilder } from './DBModelBuilder';
import { ModelConfig } from './strategies/modelConfig.types';
import { SequelizeMigrationStrategy } from './migration/sequelizeMigrationStrategy';
import { Migrator } from './migration/migrator';
import { CRUDGeneratorStrategy } from './crud/CRUDGeneratorStrategy.interface';
import { CRUDGenerator } from './crud/CRUDGenerator';
import { TypescriptCrudStrategy } from './typeScript/typescriptCrud/typescriptCrud';
class Rest {
  private dbInstance;
  private porjectDBPath: string;
  private dbType: 'sql' | 'nosql';
  private language: 'javascript' | 'typescript';
  private crud!: CRUDGenerator;
  constructor(dbType: 'sql' | 'nosql', dbInstance: any, porjectPath: string, language: 'javascript' | 'typescript') {
    this.dbInstance = dbInstance;
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
      migrator.migrate(this.porjectDBPath, this.dbInstance, model);
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

  public generate(models: ModelConfig[]) {
    this.createRest(models);
  }
}

const clientDbConfig = {
  username: 'root',
  password: 'root',
  database: 'Papppa',
  host: 'localhost',
  port: 3307,
  dialect: 'mysql'
};

const dbConnection = new DatabaseConnection('sql').connect(clientDbConfig);
const projectDbPath = '/home/riajul/Documents/groots/otusuki-dental/od-backend/src/db/';

const rest = new Rest('sql', dbConnection, projectDbPath, 'typescript');
const models = [
  {
    name: 'User',
    attributes: [
      { name: 'firstName', type: 'string' },
      { name: 'lastName', type: 'string' },
      { name: 'firstNameFurigana', type: 'string' },
      { name: 'lastNameFurigana', type: 'string' },
      { name: 'dob', type: 'date' },
      { name: 'email', type: 'string' },
      { name: 'isMember', type: 'boolean' }
    ],
    associations: [
      {
        method: 'belongsTo',
        associated_model: 'Role',
        as: 'role'
      }
    ],
    routes: [
      { url: '/api/activities', method: 'createModel' },
      { url: '/api/activities/:id', method: 'updateModel' },
      { url: '/api/activities/:id', method: 'patchModel' },
      { url: '/api/activities/', method: 'getModels' },
      { url: '/api/activities:id', method: 'getModel' },
      { url: '/api/activities:id', method: 'deleteModel' }
    ],
    controller_dir_name: 'user',
    model_dir_name: 'users',
    routes_dir_name: 'users'
  }
];
rest.generate(models);
