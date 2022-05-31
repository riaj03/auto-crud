import { exists, writeFileSync } from 'fs';
import { plural } from 'pluralize';
import { fileRead, writeCodeFile } from '../../services/commonServices';
import { ModelConfig } from '../../strategies/modelConfig.types';
import { routesSnipets } from '../snipets/typeScriptSnipets/typescriptRoutesSnipets';

export class TypescriptRoutes {
  private model: ModelConfig;
  private projectDbPath: string;
  private modifyModelName: string;
  private fileName: string;

  constructor(projectDbPath: string, model: ModelConfig) {
    this.model = model;
    this.projectDbPath = projectDbPath;

    this.modifyModelName = plural(this.model.name.charAt(0).toLowerCase() + this.model.name.slice(1));
    this.fileName = this.modifyModelName
      .replace(/([A-Z])/g, '-$1')
      .trim()
      .toLowerCase();
  }

  private attachRoutesInFile(file: string, model: ModelConfig) {
    let routes = '';

    model.routes.forEach((obj) => {
      let route = routesSnipets.statements[obj.method];

      switch (obj.method) {
        case 'getModels':
          {
            route = route.replace(/@{ALL_CAP_PLEURAL_MODEL}/g, plural(model.name).toUpperCase());
            route = route.replace(/@{PLEURAL_MODEL}/g, plural(model.name));
            route = route.replace(
              /@{SMALL_PLEURAL_MODEL}/g,
              plural(model.name).charAt(0).toLowerCase() + plural(model.name).substring(1)
            );

            routes +=
              route +
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
            route = route.replace(/@{ALL_CAP_MODEL}/g, model.name.toUpperCase());
            route = route.replace(/@{MODEL}/g, model.name);
            route = route.replace(
              /@{SMALL_PLEURAL_MODEL}/g,
              plural(model.name).charAt(0).toLowerCase() + plural(model.name).substring(1)
            );
            routes +=
              route +
              `
`;
          }
          break;
      }
    });

    file = file.replace(/@{ATTACH_ROUTES}/g, routes);
    return file;
  }

  private routesFileDir() {
    let fileDir = `${this.projectDbPath}/../routes/api/`;

    const modifyModelName = plural(this.model.name.charAt(0).toLowerCase() + this.model.name.slice(1));
    const fileName = modifyModelName
      .replace(/([A-Z])/g, '-$1')
      .trim()
      .toLowerCase();

    if ('routes_dir_name' in this.model && this.model.routes_dir_name.length > 0) {
      fileDir += `${fileName}/`;
    }

    return fileDir;
  }

  private routesIndexFileDir() {
    const routesIndexFileDir = `${this.projectDbPath}../routes`;
    return routesIndexFileDir;
  }

  private createRoutesFileContents(model: ModelConfig) {
    let file = routesSnipets.body;

    file = file.replace(
      /@{SMALL_PLEURAL_MODEL}/g,
      plural(model.name).charAt(0).toLowerCase() + plural(model.name).substring(1)
    );
    file = file.replace(/@{PLEURAL_MODEL}/g, plural(model.name));

    // Set required directory level ups for associated controller
    let relative_controller_dir_change = '../..';
    let relative_urls_dir_change = '..';
    let dirUps = '';
    const noOfDirUps = model.routes_dir_name.split('/').filter((dir) => dir.length > 0).length;
    for (let index = 0; index < noOfDirUps; index++) {
      dirUps += '../';
    }
    relative_controller_dir_change = dirUps + relative_controller_dir_change;
    relative_urls_dir_change = dirUps + relative_urls_dir_change;
    // set dir up levels relative to model
    file = file.replace('@{RELATIVE_CONTROLLER_DIR_CHANGE}', relative_controller_dir_change);
    file = file.replace('@{RELATIVE_URLS_DIR_CHANGE}', relative_urls_dir_change);
    // set controller dir
    file = file.replace(
      '@{CONTROLLER_DIR}',
      model.controller_dir_name
        .trim()
        .split('/')
        .filter((dir) => dir.length > 0)
        .join('/')
    );

    // attach routes
    file = this.attachRoutesInFile(file, model);
    return file;
  }

  private getMethodName(method: string): string {
    let methodName = '';
    switch (method) {
      case 'createModel':
        methodName = 'POST';
        break;

      case 'updateModel':
        methodName = 'PUT';
        break;

      case 'patchModel':
        methodName = 'PATCH';
        break;

      case 'getModels':
        methodName = 'GET';
        break;

      case 'getModel':
        methodName = 'GET';
        break;

      case 'deleteModel':
        methodName = 'DELETE';
        break;

      default:
        break;
    }
    return methodName;
  }
  private async updateRouteUrls() {
    const urlFile = `${this.projectDbPath}../routes/urls.ts`;
    let urlContents = fileRead(urlFile);

    const urlsSinpet = {
      bodyStart: `export const @{PLURAL_MODEL_LOWER} = {`,
      url: `@{METHOD}_@{MODEL_UPPER}: '@{URL}'`
    };

    // makes frist letter small
    let urls = urlsSinpet.bodyStart.replace(
      '@{PLURAL_MODEL_LOWER}',
      plural(this.model.name.charAt(0).toLowerCase() + this.model.name.slice(1))
    );

    for (let index = 0; index < this.model.routes.length; index++) {
      let routeUrl = urlsSinpet.url.replace('@{METHOD}', this.getMethodName(this.model.routes[index].method));
      routeUrl = routeUrl.replace(
        '@{MODEL_UPPER}',
        this.model.routes[index].method === 'getModels'
          ? plural(this.model.name.toUpperCase())
          : this.model.name.toUpperCase()
      );
      routeUrl = routeUrl.replace('@{URL}', `${this.model.routes[index].url}`);
      routeUrl += ',';
      urls += routeUrl;
    }

    urls += `}`;

    if (urlContents.indexOf(urls) < 0) {
      urlContents += urls;
      urlContents += `;`;
      writeCodeFile(`${this.projectDbPath}../routes/`, 'urls', 'ts', urlContents);
    } else {
      console.log('Urls already exists');
    }
  }

  private updateRouteIndex() {
    // TODO: make dynamic dir
    const routeDir = `./api/${plural(this.fileName)}/${plural(this.fileName)}`;

    const routeIndexFildeDir = this.routesIndexFileDir();
    let routeIndexContent = fileRead(`${routeIndexFildeDir}/index.ts`);

    if (routeIndexContent.length === 0) {
      routeIndexContent = routeIndexContent.replace(
        '',
        `import { NodeServer } from 'lib-node-server';
const nodeServer = NodeServer.server(); 

// add new route\n


// use new route
        `
      );
    }
    //check if router is exists or not
    const checkImportExist = `import ${this.modifyModelName}Router from '${routeDir}'`;
    const checkUseRouter = `nodeServer.use(${this.modifyModelName}Router)`;

    const importRouteIndexContent = routeIndexContent.replace(
      '// add new route',
      `${checkImportExist};` + '\n' + `// add new route`
    );

    const useRouteIndexContent = routeIndexContent.replace(
      '// use new route',
      `${checkUseRouter};` + '\n' + `// use new route`
    );

    if (routeIndexContent.indexOf(checkImportExist) > 0 && routeIndexContent.indexOf(checkUseRouter) > 0) {
      console.log('Your router is already declered');
    } else if (routeIndexContent.indexOf(checkImportExist) > 0 && routeIndexContent.indexOf(checkUseRouter) < 1) {
      writeCodeFile(`${routeIndexFildeDir}/`, 'index', 'ts', useRouteIndexContent);
    } else if (routeIndexContent.indexOf(checkUseRouter) > 0 && routeIndexContent.indexOf(checkImportExist) < 1) {
      writeCodeFile(`${routeIndexFildeDir}/`, 'index', 'ts', importRouteIndexContent);
    } else {
      routeIndexContent = routeIndexContent.replace(
        '// use new route',
        `nodeServer.use(${this.modifyModelName}Router);` + '\n' + `// use new route`
      );
      routeIndexContent = routeIndexContent.replace(
        '// add new route',
        `${checkImportExist};` + '\n' + `// add new route`
      );
      writeCodeFile(`${routeIndexFildeDir}/`, 'index', 'ts', routeIndexContent);
    }
  }

  public constructRoutesFile() {
    const file = this.createRoutesFileContents(this.model);
    const routesFileName = plural(this.fileName);

    const fileDir = this.routesFileDir();
    writeCodeFile(fileDir, routesFileName, 'ts', file);
    this.updateRouteIndex();
    this.updateRouteUrls();
  }
}
