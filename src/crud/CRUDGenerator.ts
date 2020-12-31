import { ModelConfig } from '../strategies/modelConfig.types';
import { CRUDGeneratorStrategy } from './CRUDGeneratorStrategy.interface';

export class CRUDGenerator {
  private porjectDBPath: string;
  private CRUDGeneratorStrategy: CRUDGeneratorStrategy;
  private model: ModelConfig;
  constructor(porjectDBPath: string, model: ModelConfig, CRUDGeneratorStrategy: CRUDGeneratorStrategy) {
    this.porjectDBPath = porjectDBPath;
    this.CRUDGeneratorStrategy = CRUDGeneratorStrategy;
    this.model = model;
  }
  public generate() {
    return this.CRUDGeneratorStrategy.makeRest(this.porjectDBPath, this.model);
  }
}
