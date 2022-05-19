#!/usr/bin/env node
import { Rest } from './Rest';
const getFileNameArguments = () => {
  return process.argv.slice(2);
};
const execute = () => {
  const files = getFileNameArguments();
  if (files != null && files.length > 0) {
    files.forEach((file) => {
      const dataSource = require(`${file}`);
      const rest = new Rest('sql', dataSource.projectDbPath, 'typescript');
      rest.generate(dataSource);
    });
  } else
    throw new Error(
      'No source files specified. please provide one or more .txt source files seperated by empty space.'
    );
};
execute();
