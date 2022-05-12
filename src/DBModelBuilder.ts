import { DBModelStrategy } from './strategies/DBModelStrategy.interface';
import { ModelConfig } from './strategies/modelConfig.types';

export class DBModelBuilder implements DBModelStrategy {
  private dbModelStrategy: DBModelStrategy;
  constructor(strategy: DBModelStrategy) {
    this.dbModelStrategy = strategy;
  }
  // TODO: specify return type
  buildDBModel(modelConfig: ModelConfig): any {
    return this.dbModelStrategy.buildDBModel(modelConfig);
  }
}
