import { ModelConfig } from '../strategies/modelConfig.types';

export interface SchemaMigartionStrategy {
  migrate: (porjectDBPath: string, model: ModelConfig) => {};
}
