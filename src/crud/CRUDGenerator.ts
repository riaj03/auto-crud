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
  public generate(dbInstance: any) {
    return this.CRUDGeneratorStrategy.makeRest(dbInstance, this.porjectDBPath, this.model);
  }
}
