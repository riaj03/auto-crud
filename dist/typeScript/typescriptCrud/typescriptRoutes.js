"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptRoutes = void 0;
const pluralize_1 = require("pluralize");
const commonServices_1 = require("../../services/commonServices");
const typescriptRoutesSnipets_1 = require("../snipets/typeScriptSnipets/typescriptRoutesSnipets");
class TypescriptRoutes {
    constructor(projectDbPath, model) {
        this.model = model;
        this.projectDbPath = projectDbPath;
    }
    attachRoutesInFile(file, model) {
        let routes = '';
        model.routes.forEach((obj) => {
            let route = typescriptRoutesSnipets_1.routesSnipets.statements[obj.method];
            // console.log(`Route for method: ${obj.method}`);
            // console.log(route);
            switch (obj.method) {
                case 'getModels':
                    {
                        route = route.replace('@{ALL_CAP_PLEURAL_MODEL}', pluralize_1.plural(model.name).toUpperCase());
                        route = route.replace('@{PLEURAL_MODEL}', pluralize_1.plural(model.name));
                        route = route.replace('@{SMALL_PLEURAL_MODEL}', pluralize_1.plural(model.name).charAt(0).toLowerCase() + pluralize_1.plural(model.name).substring(1));
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
                        route = route.replace('@{ALL_CAP_MODEL}', model.name.toUpperCase());
                        route = route.replace('@{MODEL}', model.name);
                        route = route.replace('@{SMALL_PLEURAL_MODEL}', pluralize_1.plural(model.name).charAt(0).toLowerCase() + pluralize_1.plural(model.name).substring(1));
                        routes +=
                            route +
                                `
`;
                    }
                    break;
            }
        });
        file = file.replace('@{ATTACH_ROUTES}', routes);
        return file;
    }
    routesFileDir() {
        let fileDir = `${this.projectDbPath}/../routes/api/`;
        if ('routes_dir_name' in this.model && this.model.routes_dir_name.length > 0)
            fileDir += `${this.model.routes_dir_name}/`;
        return fileDir;
    }
    routesIndexFileDir() {
        const routesIndexFileDir = `${this.projectDbPath}../routes`;
        return routesIndexFileDir;
    }
    createRoutesFileContents(model) {
        let file = typescriptRoutesSnipets_1.routesSnipets.body;
        file = file.replace(/@{SMALL_PLEURAL_MODEL}/g, pluralize_1.plural(model.name).charAt(0).toLowerCase() + pluralize_1.plural(model.name).substring(1));
        file = file.replace(/@{PLEURAL_MODEL}/g, pluralize_1.plural(model.name));
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
        file = file.replace('@{CONTROLLER_DIR}', model.controller_dir_name
            .trim()
            .split('/')
            .filter((dir) => dir.length > 0)
            .join('/'));
        // attach routes
        file = this.attachRoutesInFile(file, model);
        return file;
    }
    getMethodName(method) {
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
    updateRouteUrls() {
        const urlFile = `${this.projectDbPath}../routes/urls.ts`;
        let urlContents = commonServices_1.fileRead(urlFile);
        const urlsSinpet = {
            bodyStart: `export const @{PLURAL_MODEL_LOWER} = {`,
            url: `@{METHOD}_@{MODEL_UPPER}: '@{URL}'`
        };
        let urls = urlsSinpet.bodyStart.replace('@{PLURAL_MODEL_LOWER}', pluralize_1.plural(this.model.name.toLowerCase()));
        for (let index = 0; index < this.model.routes.length; index++) {
            let routeUrl = urlsSinpet.url.replace('@{METHOD}', this.getMethodName(this.model.routes[index].method));
            routeUrl = routeUrl.replace('@{MODEL_UPPER}', this.model.routes[index].method === 'getModels'
                ? pluralize_1.plural(this.model.name.toUpperCase())
                : this.model.name.toUpperCase());
            routeUrl = routeUrl.replace('@{URL}', `${this.model.routes[index].url}`);
            routeUrl += ',';
            urls += routeUrl;
        }
        urlContents += urls;
        urlContents += `};`;
        commonServices_1.writeCodeFile(`${this.projectDbPath}../routes/`, 'urls', 'ts', urlContents);
    }
    updateRouteIndex() {
        // TODO: make dynamic dir
        const routeDir = `./api/${pluralize_1.plural(this.model.name.toLowerCase())}/${pluralize_1.plural(this.model.name.toLowerCase())}`;
        const routeIndexFildeDir = this.routesIndexFileDir();
        let routeIndexContent = commonServices_1.fileRead(`${routeIndexFildeDir}/index.ts`);
        routeIndexContent = routeIndexContent.replace('// add new route', `const ${this.model.name.toLowerCase()} = require('${routeDir}');` + '\n' + `// add new route`);
        routeIndexContent = routeIndexContent.replace('// use new route', `this.routes.use(${this.model.name.toLowerCase()});` + '\n' + `// use new route`);
        commonServices_1.writeCodeFile(`${routeIndexFildeDir}/`, 'index', 'ts', routeIndexContent);
    }
    constructRoutesFile() {
        const file = this.createRoutesFileContents(this.model);
        const routesFileName = pluralize_1.plural(this.model.name).charAt(0).toLowerCase() + pluralize_1.plural(this.model.name).substring(1);
        const fileDir = this.routesFileDir();
        commonServices_1.writeCodeFile(fileDir, routesFileName, 'ts', file);
        this.updateRouteIndex();
        this.updateRouteUrls();
    }
}
exports.TypescriptRoutes = TypescriptRoutes;
