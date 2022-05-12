export const routesSnipets: any = {
  body: `
import { @{SMALL_PLEURAL_MODEL} } from '@{RELATIVE_URLS_DIR_CHANGE}/urls';
import { NodeServer, IRouter } from 'lib-node-server';
const @{SMALL_PLEURAL_MODEL}Router: IRouter = new NodeServer().getRouter();
const controller = require("@{RELATIVE_CONTROLLER_DIR_CHANGE}/app/controller/@{CONTROLLER_DIR}/@{PLEURAL_MODEL}Controller");
@{ATTACH_ROUTES}
export default @{SMALL_PLEURAL_MODEL}Router;
`,
  statements: {
    getModel: `@{SMALL_PLEURAL_MODEL}Router.get(@{SMALL_PLEURAL_MODEL}.GET_@{ALL_CAP_MODEL}, controller.get@{MODEL});`,
    getModels: `@{SMALL_PLEURAL_MODEL}Router.get( @{SMALL_PLEURAL_MODEL}.GET_@{ALL_CAP_PLEURAL_MODEL}, controller.get@{PLEURAL_MODEL});`,
    createModel: `@{SMALL_PLEURAL_MODEL}Router.post( @{SMALL_PLEURAL_MODEL}.POST_@{ALL_CAP_MODEL}, controller.create@{MODEL});`,
    updateModel: `@{SMALL_PLEURAL_MODEL}Router.put( @{SMALL_PLEURAL_MODEL}.PUT_@{ALL_CAP_MODEL}, controller.update@{MODEL});`,
    patchModel: `@{SMALL_PLEURAL_MODEL}Router.patch( @{SMALL_PLEURAL_MODEL}.PATCH_@{ALL_CAP_MODEL}, controller.patch@{MODEL});`,
    deleteModel: `@{SMALL_PLEURAL_MODEL}Router.delete( @{SMALL_PLEURAL_MODEL}.DELETE_@{ALL_CAP_MODEL}, controller.delete@{MODEL});`
  }
};
