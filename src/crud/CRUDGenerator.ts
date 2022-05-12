import { ModelConfig } from '../strategies/modelConfig.types';
import { CRUDGeneratorStrategy } from './CRUDGeneratorStrategy.interface';

export class CRUDGenerator {
  private projectDBPath: string;
  private CRUDGeneratorStrategy: CRUDGeneratorStrategy;
  private model: ModelConfig;
  constructor(projectDBPath: string, model: ModelConfig, CRUDGeneratorStrategy: CRUDGeneratorStrategy) {
    this.projectDBPath = projectDBPath;
    this.CRUDGeneratorStrategy = CRUDGeneratorStrategy;
    this.model = model;
  }

  public generate() {
    return this.CRUDGeneratorStrategy.makeRest(this.projectDBPath, this.model);
  }
}
