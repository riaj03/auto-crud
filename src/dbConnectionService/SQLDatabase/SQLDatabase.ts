import { Sequelize } from 'sequelize';
import { Database } from '../Interfaces/database.interface';

export class SQLDatabase implements Database {
  private sequelizeConnection: any;
  private config: any;
  private dbName: any;

  constructor(dbName: any, sequelizeConfig: any) {
    this.config = sequelizeConfig;
    this.dbName = dbName;
  }

  setDialect() {
    this.config.dialect = this.dbName;
  }

  connect() {
    this.setDialect();
    this.sequelizeConnection = new Sequelize(this.config);
  }

  connection() {
    return this.sequelizeConnection;
  }
}
