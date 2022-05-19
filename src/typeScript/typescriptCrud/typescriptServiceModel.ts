import { plural } from 'pluralize';
import { writeCodeFile } from '../../services/commonServices';
import { ModelConfig } from '../../strategies/modelConfig.types';
import { serviceModelSnipets } from '../snipets/typeScriptSnipets/seviceModelSnipets';
export class TypescriptServiceModel {
  private model: ModelConfig;
  private filePath: string;
  constructor(model: ModelConfig, filePath: string) {
    this.model = model;
    this.filePath = filePath;
  }

  private modelClassFileDir(projectDbPath: string, model: ModelConfig) {
    let fileDir = `${projectDbPath}/../model/`;
    if ('model_dir_name' in model && model?.model_dir_name.length > 0) fileDir += `${model.model_dir_name}/`;
    // filePath += `${fileName}.js`
    return fileDir;
  }

  private getURLParamNames(url: string) {
    const parts = url.split('/');
    const params = parts.filter((part) => part.startsWith(':'));
    return params;
  }

  private createModelClassFunctions(file: string, model: ModelConfig) {
    let functionsCode = '';

    model.routes.forEach((route) => {
      // eslint-disable-next-line
      let func: string = serviceModelSnipets.functions.methods[route.method];
      // console.log(`Function for method: ${route.method}`);
      switch (route['method']) {
        case 'getModel':
          {
            func = func.replace(/@{MODEL}/g, model.name);
            const params = this.getURLParamNames(route['url']);
            // console.log("URL params:");
            // console.log(params);

            let statements = '';
            if (params.length > 1 || params.includes(':id') === false) {
              statements += `${serviceModelSnipets.functions.statements.mergeParamsInQuery}
        ${serviceModelSnipets.functions.statements.getModel.replace(/@{MODEL}/g, model.name)}`;
            } else {
              statements += `${serviceModelSnipets.functions.statements.getModelById.replace(/@{MODEL}/g, model.name)}`;
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
            func = func.replace(/@{PLEURAL_MODEL}/g, plural(model.name));

            const params = this.getURLParamNames(route['url']);
            // console.log("URL params:");
            // console.log(params);

            let statements = '';
            if (params.length > 1) {
              statements += `${serviceModelSnipets.functions.statements.mergeParamsInQuery}
    `;
            }
            let getModels = serviceModelSnipets.functions.statements.getModels.replace(/@{MODEL}/g, model.name);
            getModels = getModels.replace(/@{PLEURAL_MODEL}/g, plural(model.name));
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

  private createModelClassFileContents(model: ModelConfig) {
    let file = serviceModelSnipets.body;

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
    file = file.replace(/@{MODEL}/g, plural(model.name));
    file = file.replace(/@{PLEURAL_MODEL}/g, plural(model.name));
    // create model operation functions
    file = this.createModelClassFunctions(file, model);
    return file;
  }

  public constructModelClass(projectDbPath: string) {
    const file = this.createModelClassFileContents(this.model);
    // console.log("Model Class File Content: ");
    // console.log(file);

    const modelClassFileName = plural(this.model.name).charAt(0).toLowerCase() + plural(this.model.name).substring(1);
    const fileDir = this.modelClassFileDir(projectDbPath, this.model);
    // console.log(`File Dir: ${fileDir}`);

    writeCodeFile(fileDir, modelClassFileName, 'ts', file);
  }
}
