import { LoggerType } from '../types/loggerTypes';
import chalk from 'chalk';
export class Logger {
  text: string;
  type: LoggerType;
  constructor(text: string, type: LoggerType) {
    this.text = text;
    this.type = type;
  }
  public show() {
    const log = console.log;
    log(
      chalk.red('No source files specified. please provide one or more .json source files separated by empty space.')
    );
  }
}
