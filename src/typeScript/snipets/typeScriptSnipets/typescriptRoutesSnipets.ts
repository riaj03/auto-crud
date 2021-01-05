export const routesSnipets: any = {
  body: `
import express from 'express';
const   router  =   express.Router();
import { @{SMALL_PLEURAL_MODEL} } from '@{RELATIVE_URLS_DIR_CHANGE}/urls';
const controller = require("@{RELATIVE_CONTROLLER_DIR_CHANGE}/app/controller/@{CONTROLLER_DIR}/@{PLEURAL_MODEL}Controller");
@{ATTACH_ROUTES}
module.exports = router
`,
  statements: {
    getModel: `router.get(@{SMALL_PLEURAL_MODEL}.GET_@{ALL_CAP_MODEL}, controller.get@{MODEL});`,
    getModels: `router.get(@{SMALL_PLEURAL_MODEL}.GET_@{ALL_CAP_PLEURAL_MODEL}, controller.get@{PLEURAL_MODEL});`,
    createModel: `router.post(@{SMALL_PLEURAL_MODEL}.POST_@{ALL_CAP_MODEL}, controller.create@{MODEL});`,
    updateModel: `router.put(@{SMALL_PLEURAL_MODEL}.PUT_@{ALL_CAP_MODEL}, controller.update@{MODEL});`,
    patchModel: `router.patch(@{SMALL_PLEURAL_MODEL}.PATCH_@{ALL_CAP_MODEL}, controller.patch@{MODEL});`,
    deleteModel: `router.delete(@{SMALL_PLEURAL_MODEL}.DELETE_@{ALL_CAP_MODEL}, controller.delete@{MODEL});`
  }
};
