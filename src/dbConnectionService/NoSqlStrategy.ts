import { Driver } from './Interfaces/driver.interface';

export class NoSqlStrategy implements Driver {
  connect(data: string[]): void {
    throw new Error('Method not implemented.');
  }
}
