import { ModelConfig } from '../strategies/modelConfig.types';
import { SchemaMigartionStrategy } from './schemaMigrationStrategy.interface';

export class Migrator {
  private schemaMigrationStrategy: SchemaMigartionStrategy;
  constructor(schemaMigrationStrategy: SchemaMigartionStrategy) {
    this.schemaMigrationStrategy = schemaMigrationStrategy;
  }

  public migrate(porjectDBPath: string, dbInstance: any, model: ModelConfig): any {
    return this.schemaMigrationStrategy.migrate(porjectDBPath, dbInstance, model);
  }
}
