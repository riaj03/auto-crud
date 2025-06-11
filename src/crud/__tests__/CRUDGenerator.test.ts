import { CRUDGenerator } from '../CRUDGenerator';
import { ModelConfig } from '../../strategies/modelConfig.types';
import { CRUDGeneratorStrategy } from '../CRUDGeneratorStrategy.interface';

describe('CRUDGenerator', () => {
  it('should call makeRest on the strategy with correct arguments and return its result', () => {
    // Create a mock implementation of CRUDGeneratorStrategy
    const mockStrategy: CRUDGeneratorStrategy = {
      makeRest: jest.fn(),
    };

    // Define a sample ModelConfig
    const sampleModelConfig: ModelConfig = {
      name: 'TestModel',
      attributes: [{ name: 'id', type: 'integer' }], // Corrected based on ModelAttributes type
      model_dir_name: 'models',
      routes: [], // Assuming any[] is fine for this test
      controller_dir_name: 'controllers',
      routes_dir_name: 'routes',
      // associations can be omitted as it's optional
    };

    // Define a dummy project path
    const projectPath = '/test/project';

    // Define an expected result that the mock makeRest will return
    const expectedResult = { success: true, data: 'generated_rest_artefacts' };

    // Configure the mock makeRest to return this expected result
    (mockStrategy.makeRest as jest.Mock).mockReturnValue(expectedResult);

    // Instantiate CRUDGenerator: constructor(porjectDBPath: string, model: ModelConfig, CRUDGeneratorStrategy: CRUDGeneratorStrategy)
    const generator = new CRUDGenerator(projectPath, sampleModelConfig, mockStrategy);

    // Call generator.generate()
    const result = generator.generate();

    // Assert that mockStrategy.makeRest was called once with projectPath and sampleModelConfig
    expect(mockStrategy.makeRest).toHaveBeenCalledTimes(1);
    expect(mockStrategy.makeRest).toHaveBeenCalledWith(projectPath, sampleModelConfig);

    // Assert that the result of generator.generate() is equal to the expected result
    expect(result).toEqual(expectedResult);
  });
});
