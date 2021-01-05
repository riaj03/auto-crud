import { plural } from 'pluralize';
import { writeCodeFile } from '../../services/commonServices';
import { ModelConfig } from '../../strategies/modelConfig.types';
import { controllerSnipets } from '../snipets/typeScriptSnipets/controllerSnipets';
export class TypeScriptController {
  private model: ModelConfig;
  projectDbPath: string;
  constructor(model: ModelConfig, projectDbPath: string) {
    this.model = model;
    this.projectDbPath = projectDbPath;
  }
  private controllerFileDir(model: ModelConfig) {
    let fileDir = `${this.projectDbPath}/../app/controller/`;
    if ('controller_dir_name' in model && model.controller_dir_name.length > 0)
      fileDir += `${model.controller_dir_name}/`;
    return fileDir;
  }

  private createControllerFunctions(file: string, model: ModelConfig) {
    let functionsCode = '';

    model.routes.forEach((route) => {
      let func: any = controllerSnipets.functions.methods[route.method];
      // console.log(`Function for method: ${route.method}`);
      // console.log(func);

      switch (route.method) {
        case 'getModels':
          {
            func = func.replace(/@{MODEL}/g, model.name);
            func = func.replace(/@{PLEURAL_MODEL}/g, plural(model.name));
            func = func.replace(
              /@{SMALL_PLEURAL_MODEL}/g,
              plural(model.name).charAt(0).toLowerCase() + plural(model.name).substring(1)
            );

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
            func = func.replace(/@{PLEURAL_MODEL}/g, plural(model.name));
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

  private createControllerFileContents(model: ModelConfig) {
    let file = controllerSnipets.body;

    // set model const class name
    file = file.replace(/@{PLEURAL_MODEL}/g, plural(model.name));
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
    file = file.replace(
      '@{MODEL_DIR}',
      model.model_dir_name
        .trim()
        .split('/')
        .filter((dir) => dir.length > 0)
        .join('/')
    );
    // replace model file name
    file = file.replace(
      '@{SMALL_PLEURAL_MODEL}',
      plural(model.name).charAt(0).toLowerCase() + plural(model.name).substring(1)
    );

    // create model operation functions
    file = this.createControllerFunctions(file, model);
    return file;
  }

  public constructController() {
    const file = this.createControllerFileContents(this.model);

    const controllerFileName = plural(this.model.name) + 'Controller';
    const fileDir = this.controllerFileDir(this.model);

    writeCodeFile(fileDir, controllerFileName, 'ts', file);
  }
}
