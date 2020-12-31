export interface Driver {
  connect(dbName: string[], dbConfig: string[]): any;
}
