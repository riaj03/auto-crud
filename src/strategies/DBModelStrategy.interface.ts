import { ModelConfig } from './modelConfig.types';

export interface DBModelStrategy {
  buildDBModel: (modelConfig: ModelConfig) => {};
}
