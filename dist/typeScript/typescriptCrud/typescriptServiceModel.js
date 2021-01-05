"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptServiceModel = void 0;
const pluralize_1 = require("pluralize");
const commonServices_1 = require("../../services/commonServices");
const seviceModelSnipets_1 = require("../snipets/typeScriptSnipets/seviceModelSnipets");
class TypescriptServiceModel {
    constructor(model, filePath) {
        this.model = model;
        this.filePath = filePath;
    }
    modelClassFileDir(projectDbPath, model) {
        let fileDir = `${projectDbPath}/../app/model/`;
        if ('model_dir_name' in model && (model === null || model === void 0 ? void 0 : model.model_dir_name.length) > 0)
            fileDir += `${model.model_dir_name}/`;
        // filePath += `${fileName}.js`
        return fileDir;
    }
    getURLParamNames(url) {
        const parts = url.split('/');
        const params = parts.filter((part) => part.startsWith(':'));
        return params;
    }
    createModelClassFunctions(file, model) {
        let functionsCode = '';
        model.routes.forEach((route) => {
            // eslint-disable-next-line
            let func = seviceModelSnipets_1.serviceModelSnipets.functions.methods[route.method];
            // console.log(`Function for method: ${route.method}`);
            switch (route['method']) {
                case 'getModel':
                    {
                        func = func.replace(/@{MODEL}/g, model.name);
                        const params = this.getURLParamNames(route['url']);
                        // console.log("URL params:");
                        // console.log(params);
                        let statements = '';
                        if (params.length > 1 || params.includes(':id') == false) {
                            statements += `${seviceModelSnipets_1.serviceModelSnipets.functions.statements.mergeParamsInQuery}
        ${seviceModelSnipets_1.serviceModelSnipets.functions.statements.getModel.replace(/@{MODEL}/g, model.name)}`;
                        }
                        else {
                            statements += `${seviceModelSnipets_1.serviceModelSnipets.functions.statements.getModelById.replace(/@{MODEL}/g, model.name)}`;
                        }
                        func = func.replace('@{STATEMENTS}', statements);
                        functionsCode +=
                            func +
                                `
    
    `;
                    }
                    break;
                case 'getModels':
                    {
                        func = func.replace(/@{PLEURAL_MODEL}/g, pluralize_1.plural(model.name));
                        const params = this.getURLParamNames(route['url']);
                        // console.log("URL params:");
                        // console.log(params);
                        let statements = '';
                        if (params.length > 1) {
                            statements += `${seviceModelSnipets_1.serviceModelSnipets.functions.statements.mergeParamsInQuery}
    `;
                        }
                        let getModels = seviceModelSnipets_1.serviceModelSnipets.functions.statements.getModels.replace(/@{MODEL}/g, model.name);
                        getModels = getModels.replace(/@{PLEURAL_MODEL}/g, pluralize_1.plural(model.name));
                        statements += `${getModels}`;
                        func = func.replace('@{STATEMENTS}', statements);
                        functionsCode +=
                            func +
                                `
    
    `;
                    }
                    break;
                case 'createModel':
                case 'updateModel':
                case 'patchModel':
                case 'deleteModel':
                    {
                        func = func.replace(/@{MODEL}/g, model.name);
                        functionsCode +=
                            func +
                                `
    `;
                    }
                    break;
            }
        });
        file = file.replace('@{FUNCTIONS}', functionsCode);
        return file;
    }
    createModelClassFileContents(model) {
        let file = seviceModelSnipets_1.serviceModelSnipets.body;
        // Set required directory level ups for db and queryParser
        let relative_db_dir_change = '../..';
        let relative_qp_dir_change = '..';
        let dirUps = '';
        const noOfDirUps = model.model_dir_name.split('/').filter((dir) => dir.length > 0).length;
        for (let index = 0; index < noOfDirUps; index++) {
            dirUps += '../';
        }
        relative_db_dir_change = dirUps + relative_db_dir_change;
        relative_qp_dir_change = dirUps + relative_qp_dir_change;
        // set db relative dir
        file = file.replace('@{RELATIVE_DB_DIR_CHANGE}', relative_db_dir_change);
        // set query parser relative dir
        file = file.replace('@{RELATIVE_QP_DIR_CHANGE}', relative_qp_dir_change);
        // replace constructor function names
        file = file.replace(/@{MODEL}/g, pluralize_1.plural(model.name));
        file = file.replace(/@{PLEURAL_MODEL}/g, pluralize_1.plural(model.name));
        // create model operation functions
        file = this.createModelClassFunctions(file, model);
        return file;
    }
    constructModelClass(projectDbPath) {
        const file = this.createModelClassFileContents(this.model);
        // console.log("Model Class File Content: ");
        // console.log(file);
        const modelClassFileName = pluralize_1.plural(this.model.name).charAt(0).toLowerCase() + pluralize_1.plural(this.model.name).substring(1);
        const fileDir = this.modelClassFileDir(projectDbPath, this.model);
        // console.log(`File Dir: ${fileDir}`);
        commonServices_1.writeCodeFile(fileDir, modelClassFileName, 'ts', file);
    }
}
exports.TypescriptServiceModel = TypescriptServiceModel;
