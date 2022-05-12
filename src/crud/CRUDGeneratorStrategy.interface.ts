import { ModelConfig } from '../strategies/modelConfig.types';

export interface CRUDGeneratorStrategy {
  makeRest: (projectDBPath: string, model: ModelConfig) => {};
}
