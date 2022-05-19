import { plural } from 'pluralize';
import { fileRead, writeCodeFile } from '../../services/commonServices';
import { ModelConfig } from '../../strategies/modelConfig.types';
import { routesSnipets } from '../snipets/typeScriptSnipets/typescriptRoutesSnipets';

export class TypescriptRoutes {
  private model: ModelConfig;
  private projectDbPath: string;
  constructor(projectDbPath: string, model: ModelConfig) {
    this.model = model;
    this.projectDbPath = projectDbPath;
  }
  private attachRoutesInFile(file: string, model: ModelConfig) {
    let routes = '';

    model.routes.forEach((obj) => {
      let route = routesSnipets.statements[obj.method];
      // console.log(`Route for method: ${obj.method}`);
      // console.log(route);

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
    if ('routes_dir_name' in this.model && this.model.routes_dir_name.length > 0)
      fileDir += `${this.model.routes_dir_name}/`;
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
  private updateRouteUrls() {
    const urlFile = `${this.projectDbPath}../routes/urls.ts`;
    let urlContents = fileRead(urlFile);
    const urlsSinpet = {
      bodyStart: `export const @{PLURAL_MODEL_LOWER} = {`,
      url: `@{METHOD}_@{MODEL_UPPER}: '@{URL}'`
    };

    let urls = urlsSinpet.bodyStart.replace('@{PLURAL_MODEL_LOWER}', plural(this.model.name.toLowerCase()));

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

    urlContents += urls;
    urlContents += `};`;
    writeCodeFile(`${this.projectDbPath}../routes/`, 'urls', 'ts', urlContents);
  }

  private updateRouteIndex() {
    // TODO: make dynamic dir
    const routeDir = `./api/${plural(this.model.name.toLowerCase())}/${plural(this.model.name.toLowerCase())}`;

    const routeIndexFildeDir = this.routesIndexFileDir();
    let routeIndexContent = fileRead(`${routeIndexFildeDir}/index.ts`);
    routeIndexContent = routeIndexContent.replace(
      '// add new route',
      `import ${this.model.name.toLowerCase()}Router from '${routeDir}';` + '\n' + `// add new route`
    );
    routeIndexContent = routeIndexContent.replace(
      '// use new route',
      `nodeServer.use(${this.model.name.toLowerCase()});` + '\n' + `// use new route`
    );
    writeCodeFile(`${routeIndexFildeDir}/`, 'index', 'ts', routeIndexContent);
  }
  public constructRoutesFile() {
    const file = this.createRoutesFileContents(this.model);
    const routesFileName = plural(this.model.name).charAt(0).toLowerCase() + plural(this.model.name).substring(1);
    const fileDir = this.routesFileDir();
    writeCodeFile(fileDir, routesFileName, 'ts', file);
    this.updateRouteIndex();
    this.updateRouteUrls();
  }
}
