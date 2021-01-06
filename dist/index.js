#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rest_1 = require("./Rest");
const getFileNameArguments = () => {
    return process.argv.slice(2);
};
const projectDbPath = '/home/riajul/Documents/groots/otusuki-dental/od-backend/src/db/';
const execute = () => {
    const files = getFileNameArguments();
    if (files != null && files.length > 0) {
        files.forEach((file) => {
            const dataSource = require(`${file}`);
            const rest = new Rest_1.Rest('sql', dataSource.projectDbPath, 'typescript');
            rest.generate(dataSource);
        });
    }
    else
        throw new Error('No source files specified. please provide one or more .txt source files seperated by empty space.');
};
execute();
