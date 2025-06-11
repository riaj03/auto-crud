import { Migrator } from '../migrator';
import { ModelConfig } from '../../strategies/modelConfig.types';
import { SchemaMigartionStrategy } from '../schemaMigrationStrategy.interface';

describe('Migrator', () => {
  it('should call migrate on the strategy with correct arguments and return its result', () => {
    // Create a mock implementation of SchemaMigartionStrategy
    const mockStrategy: SchemaMigartionStrategy = {
      migrate: jest.fn(),
    };

    // Define a sample ModelConfig
    const sampleModelConfig: ModelConfig = {
      name: 'TestModel',
      attributes: [{ name: 'id', type: 'integer' }],
      // Fields required by ModelConfig type from modelConfig.types.ts
      model_dir_name: 'models',
      routes: [],
      controller_dir_name: 'controllers',
      routes_dir_name: 'routes',
    };

    // Define a dummy project path
    const projectPath = '/test/project/db';

    // Define an expected result that the mock migrate will return
    // SchemaMigartionStrategy.migrate is typed to return {}, so an object is appropriate
    const expectedResult = { migrationStatus: 'success', details: 'Mocked migration completed' };

    // Configure the mock migrate to return this expected result
    (mockStrategy.migrate as jest.Mock).mockReturnValue(expectedResult);

    // Instantiate Migrator
    const migrator = new Migrator(mockStrategy);

    // Call migrator.migrate(projectPath, sampleModelConfig)
    const result = migrator.migrate(projectPath, sampleModelConfig);

    // Assert that mockStrategy.migrate was called once with projectPath and sampleModelConfig
    expect(mockStrategy.migrate).toHaveBeenCalledTimes(1);
    expect(mockStrategy.migrate).toHaveBeenCalledWith(projectPath, sampleModelConfig);

    // Assert that the result of migrator.migrate() is equal to the expected result
    expect(result).toEqual(expectedResult);
  });
});
