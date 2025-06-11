import DBModelBuilder from '../DBModelBuilder';
import { ModelConfig } from '../strategies/modelConfig.types';
import { DBModelStrategy } from '../strategies/DBModelStrategy.interface';

describe('DBModelBuilder', () => {
  it('should call buildDBModel on the strategy with the correct config', () => {
    // Create a mock DBModelStrategy
    const mockStrategy: DBModelStrategy = {
      buildDBModel: jest.fn(),
    };

    // Instantiate DBModelBuilder with the mock strategy
    const dbModelBuilder = new DBModelBuilder(mockStrategy);

    // Define a sample ModelConfig
    const sampleConfig: ModelConfig = {
      modelName: 'TestModel',
      attributes: {
        id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
        name: { type: 'STRING' },
      },
      instanceMethods: {},
      classMethods: {},
      hooks: {},
      schema: {},
      modelOptions: {},
      associations: [],
    };

    // Expected result from the mock strategy
    const expectedResult = 'mocked db model content';
    (mockStrategy.buildDBModel as jest.Mock).mockReturnValue(expectedResult);

    // Call dbModelBuilder.buildDBModel
    const result = dbModelBuilder.buildDBModel(sampleConfig);

    // Assert that the mock strategy's buildDBModel method was called once with sampleConfig
    expect(mockStrategy.buildDBModel).toHaveBeenCalledTimes(1);
    expect(mockStrategy.buildDBModel).toHaveBeenCalledWith(sampleConfig);

    // Assert that the result returned by dbModelBuilder.buildDBModel is the same as the result
    // returned by the mock strategy's buildDBModel method
    expect(result).toBe(expectedResult);
  });
});
