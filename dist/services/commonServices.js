"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeCodeFile = exports.mkdirSyncRecursive = exports.fileRead = exports.lowerCaseFirstLetter = void 0;
const fs_1 = require("fs");
const isWin = process.platform === 'win32';
const lowerCaseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.lowerCaseFirstLetter = lowerCaseFirstLetter;
const fileRead = (file) => {
    let content = fs_1.readFileSync(file, 'utf8');
    if (isWin)
        content = content.replace(/\r/g, '');
    return content;
};
exports.fileRead = fileRead;
const mkdirSyncRecursive = (directory) => {
    const path = directory.replace(/\/$/, '').split('/');
    for (let i = 1; i <= path.length; i++) {
        const segment = path.slice(0, i).join('/');
        segment.length > 0 && !fs_1.existsSync(segment) ? fs_1.mkdirSync(segment) : null;
    }
};
exports.mkdirSyncRecursive = mkdirSyncRecursive;
const writeCodeFile = (directory, fileName, estension, content) => {
    try {
        exports.mkdirSyncRecursive(directory);
        fs_1.writeFile(directory + `${fileName}.${estension}`, content, function (err) {
            if (err)
                console.log('Error: ', err);
            else
                console.log(`${fileName} File constructed successfully!`);
        });
    }
    catch (err) {
        console.error(err);
    }
};
exports.writeCodeFile = writeCodeFile;
