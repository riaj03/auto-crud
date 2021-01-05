import { ModelConfig } from '../strategies/modelConfig.types';

export interface CRUDGeneratorStrategy {
  makeRest: (porjectDBPath: string, model: ModelConfig) => {};
}
