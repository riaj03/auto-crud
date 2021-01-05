"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptController = void 0;
const pluralize_1 = require("pluralize");
const commonServices_1 = require("../../services/commonServices");
const controllerSnipets_1 = require("../snipets/typeScriptSnipets/controllerSnipets");
class TypeScriptController {
    constructor(model, projectDbPath) {
        this.model = model;
        this.projectDbPath = projectDbPath;
    }
    controllerFileDir(model) {
        let fileDir = `${this.projectDbPath}/../app/controller/`;
        if ('controller_dir_name' in model && model.controller_dir_name.length > 0)
            fileDir += `${model.controller_dir_name}/`;
        return fileDir;
    }
    createControllerFunctions(file, model) {
        let functionsCode = '';
        model.routes.forEach((route) => {
            let func = controllerSnipets_1.controllerSnipets.functions.methods[route.method];
            // console.log(`Function for method: ${route.method}`);
            // console.log(func);
            switch (route.method) {
                case 'getModels':
                    {
                        func = func.replace(/@{MODEL}/g, model.name);
                        func = func.replace(/@{PLEURAL_MODEL}/g, pluralize_1.plural(model.name));
                        func = func.replace(/@{SMALL_PLEURAL_MODEL}/g, pluralize_1.plural(model.name).charAt(0).toLowerCase() + pluralize_1.plural(model.name).substring(1));
                        functionsCode +=
                            func +
                                `
                    
`;
                    }
                    break;
                case 'getModel':
                case 'createModel':
                case 'updateModel':
                case 'patchModel':
                case 'deleteModel':
                    {
                        func = func.replace(/@{MODEL}/g, model.name);
                        func = func.replace(/@{PLEURAL_MODEL}/g, pluralize_1.plural(model.name));
                        func = func.replace(/@{SMALL_MODEL}/g, model.name.charAt(0).toLowerCase() + model.name.substring(1));
                        functionsCode +=
                            func +
                                `
    
`;
                    }
                    break;
            }
        });
        file = file.concat(functionsCode);
        return file;
    }
    createControllerFileContents(model) {
        let file = controllerSnipets_1.controllerSnipets.body;
        // set model const class name
        file = file.replace(/@{PLEURAL_MODEL}/g, pluralize_1.plural(model.name));
        // Set required directory level ups for associated model class
        let relative_model_dir_change = '..';
        let dirUps = '';
        const noOfDirUps = model.controller_dir_name.split('/').filter((dir) => dir.length > 0).length;
        for (let index = 0; index < noOfDirUps; index++) {
            dirUps += '../';
        }
        relative_model_dir_change = dirUps + relative_model_dir_change;
        // set dir up levels relative to model
        file = file.replace('@{RELATIVE_MODEL_DIR_CHANGE}', relative_model_dir_change);
        // set model dir
        file = file.replace('@{MODEL_DIR}', model.model_dir_name
            .trim()
            .split('/')
            .filter((dir) => dir.length > 0)
            .join('/'));
        // replace model file name
        file = file.replace('@{SMALL_PLEURAL_MODEL}', pluralize_1.plural(model.name).charAt(0).toLowerCase() + pluralize_1.plural(model.name).substring(1));
        // create model operation functions
        file = this.createControllerFunctions(file, model);
        return file;
    }
    constructController() {
        const file = this.createControllerFileContents(this.model);
        const controllerFileName = pluralize_1.plural(this.model.name) + 'Controller';
        const fileDir = this.controllerFileDir(this.model);
        commonServices_1.writeCodeFile(fileDir, controllerFileName, 'ts', file);
    }
}
exports.TypeScriptController = TypeScriptController;
