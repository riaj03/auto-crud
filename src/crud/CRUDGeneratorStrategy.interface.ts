import { ModelConfig } from '../strategies/modelConfig.types';

export interface CRUDGeneratorStrategy {
  makeRest: (dbInstance: any, porjectDBPath: string, model: ModelConfig) => {};
}
