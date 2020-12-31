import { Database } from './Interfaces/database.interface';
// import { sequelizeDbConfig } from './dbManager.types';
import { SqlStrategy } from './SqlStrategy';

export class DatabaseConnection {
  private db: any;
  private dbType: any;

  constructor(dbType: any) {
    this.dbType = dbType;
  }

  connect(clientDbConfig: any): Database {
    return new SqlStrategy().connect('mysql', clientDbConfig);
  }
}
