type sequelizePool = {
  min?: number;
  max?: number;
  acquire?: number;
  idle?: number;
};

export type sequelizeDbConfig = {
  port: number;
  dbname: string;
  password: string;
  username: string;
  host: string;
  dialect: 'mysql' | 'mariadb' | 'postgres' | 'mssql';
  pool?: sequelizePool;
  retry?: any;
};

export type DBType = 'sql' | 'nosql';
