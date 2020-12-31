import { Driver } from './Interfaces/driver.interface';
import { Database } from './Interfaces/database.interface';
import { SQLDatabase } from './SQLDatabase/SQLDatabase';

export class SqlStrategy implements Driver {
  private db: any;
  connect(dbName: any, dbConfig: any): Database {
    this.db = new SQLDatabase(dbName, dbConfig);
    this.db.connect();
    return this.db;
  }
}
