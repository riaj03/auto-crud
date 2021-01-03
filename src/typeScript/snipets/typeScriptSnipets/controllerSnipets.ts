export const controllerSnipets: any = {
  body: `
  const db = require("@{RELATIVE_DB_DIR_CHANGE}/database/models/index");
  const queryParser = require("@{RELATIVE_QP_DIR_CHANGE}/model/queryParser");
  export class @{PLEURAL_MODEL} {
  @{FUNCTIONS}
  }
  `,
  functions: {
    // Only create methods from here that are required by the APIs in data source
    methods: {
      /**
       * Parse urls to replace @{STATEMENTS} in getModel()
       * Use statements from Model.functions.statements
       * if (url.params does not cointain {id} || url.params.count > 1)
       *      use mergeParamsInQuery statement
       *      use getModel()
       * else
       *      use getModelById()
       */
      getModel: `public async get@{MODEL}  (req: any) {
	let query = await queryParser.parse(req);
	@{STATEMENTS}
  };`,
      /**
       * Parse urls to replace @{STATEMENTS} in getModels()
       * Use statements from Model.functions.statements
       * if (url.params.count > 1)
       *      use mergeParamsInQuery statement
       * use getModels()
       */
      getModels: `public async get@{PLEURAL_MODEL}  (req: any) {
	let query = await queryParser.parse(req);
	@{STATEMENTS}
  };`,
      createModel: `public create@{MODEL}(req: any) {
	const data = {...req.body, ...req['params']}
	return db.@{MODEL}.create@{MODEL}(data);
  };`,
      updateModel: `public async update@{MODEL}  (req: any){
	let model = await this.get@{MODEL}(req);
	if (model == null) return Promise.resolve(null);
	return db.@{MODEL}.update@{MODEL}(model, req.body);
  };`,
      patchModel: `public async patch@{MODEL}  (req: any)  {
	let model = await this.get@{MODEL}(req);
	if (model == null) return Promise.resolve(null);
	return db.@{MODEL}.update@{MODEL}(model, req.body);
  };`,
      deleteModel: `public delete@{MODEL}  (req: any){
	return db.@{MODEL}.delete@{MODEL}(req.params);
  };`
    },
    statements: {
      mergeParamsInQuery: `query.where = {...query.where, ...req['params']};`,
      getModelById: `return db.@{MODEL}.get@{MODEL}ById(req?.['params']?.['id'], 'include' in query ? query.include : null);`,
      getModel: `return db.@{MODEL}.get@{MODEL}(query);`,
      getModels: `return db.@{MODEL}.get@{PLEURAL_MODEL}(query);`
    }
  }
};
