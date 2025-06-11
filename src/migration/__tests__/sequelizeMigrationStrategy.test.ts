import { SequelizeMigrationStrategy } from '../sequelizeMigrationStrategy';
import { ModelConfig } from '../../strategies/modelConfig.types';
import * as childProcess from 'child_process';

// Mock child_process to spy on execSync
jest.mock('child_process');
const mockExecSync = childProcess.execSync as jest.Mock;

describe('SequelizeMigrationStrategy', () => {
  let strategy: SequelizeMigrationStrategy;
  const projectDbPath = '/path/to/db';

  beforeEach(() => {
    strategy = new SequelizeMigrationStrategy();
    mockExecSync.mockClear(); // Clear mock usage before each test
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore any spies (like console.log)
  });

  const sampleModelConfig: ModelConfig = {
    name: 'User',
    attributes: [
      { name: 'id', type: 'INTEGER' },
      { name: 'username', type: 'STRING' },
    ],
    model_dir_name: 'models',
    routes: [],
    controller_dir_name: 'controllers',
    routes_dir_name: 'routes',
  };

  // Test Case 1: "should call execSync with correct command for model generation"
  it('should call execSync with correct command for model generation', () => {
    const result = strategy.migrate(projectDbPath, sampleModelConfig);

    const expectedCommand = 'sequelize model:generate --name User --attributes id:INTEGER,username:STRING';

    expect(mockExecSync).toHaveBeenCalledTimes(1);
    expect(mockExecSync).toHaveBeenCalledWith(expectedCommand, { cwd: projectDbPath });
    expect(result).toBe(false); // As per the method's return type/behavior
  });

  // Test Case 2: "should handle execSync errors gracefully"
  it('should handle execSync errors gracefully', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('Command failed');
    });

    const consoleSpy = jest.spyOn(console, 'log');

    const result = strategy.migrate(projectDbPath, sampleModelConfig);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Can not run migration');
    expect(result).toBe(false);

    consoleSpy.mockRestore();
  });

  // Test Case 3: "should correctly format command with no attributes"
  it('should format command as "sequelize model:generate --name ModelName --attribute" with no attributes due to slice behavior', () => {
    const modelConfigNoAttrs: ModelConfig = {
      name: 'NoAttrModel',
      attributes: [], // No attributes
      model_dir_name: 'models',
      routes: [],
      controller_dir_name: 'controllers',
      routes_dir_name: 'routes',
    };

    const result = strategy.migrate(projectDbPath, modelConfigNoAttrs);

    // Due to how slice works on " --attributes ".slice(0, -1) when attributes array is empty
    const expectedCommandWithBug = 'sequelize model:generate --name NoAttrModel --attributes';
    // If the bug was fixed to correctly handle no attributes (e.g. by not adding --attributes at all, or ensuring a space is kept if command requires it)
    // this expected command would change. For now, testing current behavior.
    // A more correct command might be 'sequelize model:generate --name NoAttrModel' if the CLI supports that,
    // or it should perhaps throw an error if attributes are required.
    // The current code results in '... --attributes' (no trailing s)

    expect(mockExecSync).toHaveBeenCalledTimes(1);
    expect(mockExecSync).toHaveBeenCalledWith(expectedCommandWithBug, { cwd: projectDbPath });
    expect(result).toBe(false);
  });

  // Test Case 4: Command with single attribute (to ensure slicing is correct there)
  it('should correctly format command with a single attribute', () => {
    const modelConfigSingleAttr: ModelConfig = {
        name: 'SingleAttrModel',
        attributes: [{ name: 'prop', type: 'TEXT' }],
        model_dir_name: 'models',
        routes: [],
        controller_dir_name: 'controllers',
        routes_dir_name: 'routes',
    };

    const result = strategy.migrate(projectDbPath, modelConfigSingleAttr);

    const expectedCommand = 'sequelize model:generate --name SingleAttrModel --attributes prop:TEXT';

    expect(mockExecSync).toHaveBeenCalledTimes(1);
    expect(mockExecSync).toHaveBeenCalledWith(expectedCommand, { cwd: projectDbPath });
    expect(result).toBe(false);
  });

});
