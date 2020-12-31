import { ModelConfig } from '../strategies/modelConfig.types';

export interface SchemaMigartionStrategy {
  migrate: (porjectDBPath: string, dbInstance: any, model: ModelConfig) => {};
}
