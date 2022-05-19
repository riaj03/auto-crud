import { existsSync, mkdirSync, readFileSync, writeFile, writeFileSync } from 'fs';

const isWin = process.platform === 'win32';
export const lowerCaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fileRead = (file: string) => {
  let content = readFileSync(file, 'utf8');
  if (isWin) content = content.replace(/\r/g, '');
  return content;
};

export const mkdirSyncRecursive = (directory: string) => {
  const path = directory.replace(/\/$/, '').split('/');
  for (let i = 1; i <= path.length; i++) {
    const segment = path.slice(0, i).join('/');
    segment.length > 0 && !existsSync(segment) ? mkdirSync(segment) : null;
  }
};

export const writeCodeFile = (directory: string, fileName: string, estension: 'js' | 'ts', content: string) => {
  try {
    mkdirSyncRecursive(directory);

    writeFileSync(directory + `${fileName}.${estension}`, content);
  } catch (err) {
    console.error(err);
  }
};

export const ifExists = (directory: string) => {
  return existsSync(directory);
};
