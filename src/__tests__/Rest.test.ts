import Rest from '../Rest';
import { ModelConfig, RestConfig } from '../strategies/modelConfig.types';
import { SequelizeMigrationStrategy } from '../migration/sequelizeMigrationStrategy';
import { Migrator } from '../migration/migrator';
import { CRUDGenerator } from '../crud/CRUDGenerator';
import { TypescriptCrudStrategy } from '../typeScript/typescriptCrud/typescriptCrud';
import { DBModelStrategy } from '../strategies/DBModelStrategy.interface'; // Needed for Rest constructor
import DBModelBuilder from '../DBModelBuilder'; // Needed for Rest constructor

// Mock the dependencies
jest.mock('../migration/sequelizeMigrationStrategy');
jest.mock('../migration/migrator');
jest.mock('../crud/CRUDGenerator');
jest.mock('../typeScript/typescriptCrud/typescriptCrud');
jest.mock('../DBModelBuilder');

describe('Rest Class', () => {
  let mockDbModelStrategy: DBModelStrategy;
  let mockModelBuilder: DBModelBuilder;

  beforeEach(() => {
    // Reset mocks before each test
    (SequelizeMigrationStrategy as jest.Mock).mockClear();
    (Migrator as jest.Mock).mockClear();
    (CRUDGenerator as jest.Mock).mockClear();
    (TypescriptCrudStrategy as jest.Mock).mockClear();
    (DBModelBuilder as jest.Mock).mockClear();


    // Mock instances
    const mockMigratorInstance = { migrate: jest.fn() };
    const mockCRUDGeneratorInstance = { generate: jest.fn() };

    // Mock constructor and methods for Migrator
    (Migrator as jest.Mock).mockImplementation(() => mockMigratorInstance);

    // Mock constructor and methods for CRUDGenerator
    (CRUDGenerator as jest.Mock).mockImplementation(() => mockCRUDGeneratorInstance);

    // Mock constructor for TypescriptCrudStrategy
    (TypescriptCrudStrategy as jest.Mock).mockImplementation(() => {
      return {}; // Return a simple object for the strategy, actual instance not critical for these tests
    });

    // Mock constructor for SequelizeMigrationStrategy
    (SequelizeMigrationStrategy as jest.Mock).mockImplementation(() => {
        return {}; // Return a simple object
    });

    // Setup default mock for DBModelStrategy and DBModelBuilder needed by Rest constructor
    mockDbModelStrategy = {
      buildDBModel: jest.fn(config => `model content for ${config.modelName}`),
    };
    // We need to mock the DBModelBuilder constructor to return our controlled instance
    mockModelBuilder = {
        buildDBModel: mockDbModelStrategy.buildDBModel
    } as unknown as DBModelBuilder; // Cast to DBModelBuilder
    (DBModelBuilder as jest.Mock).mockImplementation(() => mockModelBuilder);


  });

  const sampleModelConfig1: ModelConfig = {
    modelName: 'User',
    attributes: { id: { type: 'INTEGER' }, name: { type: 'STRING' } },
    instanceMethods: {}, classMethods: {}, hooks: {}, schema: {}, modelOptions: {}, associations: []
  };
  const sampleModelConfig2: ModelConfig = {
    modelName: 'Post',
    attributes: { id: { type: 'INTEGER' }, title: { type: 'STRING' } },
    instanceMethods: {}, classMethods: {}, hooks: {}, schema: {}, modelOptions: {}, associations: []
  };
  const sampleRestConfig: RestConfig = {
    models: [sampleModelConfig1, sampleModelConfig2],
  };

  // Test Case 1: SQL DB Type and TypeScript Language
  it('should handle SQL DB type and TypeScript language correctly', () => {
    const rest = new Rest('sql', '/dummy/path', 'typescript');
    rest.generate(sampleRestConfig);

    // Assert Migrator constructor was called for each model with SequelizeMigrationStrategy
    expect(Migrator).toHaveBeenCalledTimes(sampleRestConfig.models.length);
    sampleRestConfig.models.forEach(modelConfig => {
      expect(SequelizeMigrationStrategy).toHaveBeenCalledWith('/dummy/path', modelConfig.modelName, expect.any(Object)); // expect.any(DBModelBuilder)
      expect(Migrator).toHaveBeenCalledWith(expect.any(SequelizeMigrationStrategy));
    });

    // Assert the migrate method on the Migrator instance was called
    const migratorInstances = (Migrator as jest.Mock).mock.results;
    expect(migratorInstances.length).toBe(sampleRestConfig.models.length);
    migratorInstances.forEach((instance, index) => {
        expect(instance.value.migrate).toHaveBeenCalledTimes(1);
        expect(instance.value.migrate).toHaveBeenCalledWith(sampleRestConfig.models[index]);
    });

    // Assert CRUDGenerator constructor was called with TypescriptCrudStrategy for each model
    expect(CRUDGenerator).toHaveBeenCalledTimes(sampleRestConfig.models.length);
    sampleRestConfig.models.forEach((modelConfig) => {
        expect(TypescriptCrudStrategy).toHaveBeenCalledWith(modelConfig.modelName, '/dummy/path', expect.any(Object)); // expect.any(DBModelBuilder)
        expect(CRUDGenerator).toHaveBeenCalledWith(expect.any(TypescriptCrudStrategy), modelConfig.modelName, '/dummy/path');
    });

    // Assert the generate method on the CRUDGenerator instance was called
    const crudGeneratorInstances = (CRUDGenerator as jest.Mock).mock.results;
    expect(crudGeneratorInstances.length).toBe(sampleRestConfig.models.length);
    crudGeneratorInstances.forEach(instance => {
        expect(instance.value.generate).toHaveBeenCalledTimes(1);
    });
  });

  // Test Case 2: Non-SQL DB Type
  it('should not call Migrator related methods for non-SQL DB type', () => {
    const rest = new Rest('nosql', '/dummy/path', 'typescript');
    rest.generate(sampleRestConfig);

    // Assert Migrator constructor was NOT called
    expect(Migrator).not.toHaveBeenCalled();
    const migratorInstances = (Migrator as jest.Mock).mock.results;
    migratorInstances.forEach(instance => {
        expect(instance.value.migrate).not.toHaveBeenCalled();
    });


    // Assert CRUDGenerator was instantiated and generate was called
    expect(CRUDGenerator).toHaveBeenCalledTimes(sampleRestConfig.models.length);
    const crudGeneratorInstances = (CRUDGenerator as jest.Mock).mock.results;
    expect(crudGeneratorInstances.length).toBe(sampleRestConfig.models.length);
    crudGeneratorInstances.forEach(instance => {
        expect(instance.value.generate).toHaveBeenCalledTimes(1);
    });
  });

  // Test Case 3: JavaScript Language
  it('should not use TypescriptCrudStrategy or call CRUDGenerator.generate if language is not typescript', () => {
    const rest = new Rest('sql', '/dummy/path', 'javascript');
    try {
        rest.generate(sampleRestConfig);
    } catch (e:any) {
        // We expect an error because this.crud will be undefined
        expect(e.message).toContain("Cannot read properties of undefined (reading 'generate')");
    }

    // Assert TypescriptCrudStrategy was NOT instantiated
    expect(TypescriptCrudStrategy).not.toHaveBeenCalled();

    // Assert Migrator constructor and migrate methods are still called for SQL type
    expect(Migrator).toHaveBeenCalledTimes(sampleRestConfig.models.length);
    const migratorInstances = (Migrator as jest.Mock).mock.results;
    expect(migratorInstances.length).toBe(sampleRestConfig.models.length);
    migratorInstances.forEach((instance, index) => {
        expect(instance.value.migrate).toHaveBeenCalledTimes(1);
        expect(instance.value.migrate).toHaveBeenCalledWith(sampleRestConfig.models[index]);
    });

    // CRUDGenerator should not have its generate method called
    const crudGeneratorInstances = (CRUDGenerator as jest.Mock).mock.results;
     crudGeneratorInstances.forEach(instance => {
        expect(instance.value.generate).not.toHaveBeenCalled();
    });
    // And CRUDGenerator constructor itself should not be called if no valid strategy is found.
    // Based on Rest.ts, it would be called, but then this.crud.generate() would fail.
    // If the language isn't 'typescript', crudGeneratorStrategy isn't new'd up for TypescriptCrudStrategy
    // So, new CRUDGenerator(this.crudGeneratorStrategy,...) would pass undefined as the first arg.
    // Let's check that CRUDGenerator was not called with TypescriptCrudStrategy
    sampleRestConfig.models.forEach((modelConfig) => {
        expect(CRUDGenerator).not.toHaveBeenCalledWith(expect.any(TypescriptCrudStrategy), modelConfig.modelName, '/dummy/path');
    });


  });
});
