export const controllerSnipets: any = {
  body: `
import {@{PLEURAL_MODEL}} from '@{RELATIVE_MODEL_DIR_CHANGE}/model/@{MODEL_DIR}/@{SMALL_PLEURAL_MODEL}';
`,
  functions: {
    methods: {
      getModel: `export const get@{MODEL} = (req: any, res: any) => {
return (new @{PLEURAL_MODEL}()).get@{MODEL}(req)
.then((@{SMALL_MODEL}: any) => {
  if(@{SMALL_MODEL} === null) {
      res.status(404).send({
          success: false,
          message: "@{MODEL} reference not found."
      })
  }
  else {
      res.status(200).send({
          success: true,
          message: "@{MODEL} fetch succeeded.",
          data: @{SMALL_MODEL}
      })
  }
})
.catch((errors: any) => {
  res.status(400).send({
      success: false,
      message: "@{MODEL} fetch failed.",
      errors: Array.isArray(errors) === true ? errors : [{msg: errors.message}]
  })
})
};`,
      getModels: `export const get@{PLEURAL_MODEL} = (req: any, res: any) => {
return (new @{PLEURAL_MODEL}()).get@{PLEURAL_MODEL}(req)
.then((@{SMALL_PLEURAL_MODEL}: any) => {
  res.status(200).send({
      success: true,
      message: "@{PLEURAL_MODEL} fetch succeeded.",
      data: @{SMALL_PLEURAL_MODEL}
  })
})
.catch((errors: any) => {
  res.status(400).send({
      success: false,
      message: "@{PLEURAL_MODEL} fetch failed.",
      errors: Array.isArray(errors) === true ? errors : [{msg: errors.message}]
  })
})
};`,
      createModel: `export const create@{MODEL} = (req: any, res: any) => {
return (new @{PLEURAL_MODEL}()).create@{MODEL}(req)
.then((@{SMALL_MODEL} : any) => {
  res.status(200).send({
      success: true,
      message: "@{MODEL} creation succeeded.",
      data: @{SMALL_MODEL}
  })
})
.catch((errors: any) => {
  res.status(400).send({
      success: false,
      message: "@{MODEL} creation failed.",
      errors: Array.isArray(errors) === true ? errors : [{msg: errors.message}]
  })
})
};`,
      updateModel: `export const update@{MODEL} = (req: any, res: any) => {
return (new @{PLEURAL_MODEL}()).update@{MODEL}(req)
.then((@{SMALL_MODEL}: any) => {
  if(@{SMALL_MODEL} === null) {
      res.status(404).send({
          success: false,
          message: "@{MODEL} reference not found."
      })
  }
  else {
      res.status(200).send({
          success: true,
          message: "@{MODEL} update succeeded.",
          data: @{SMALL_MODEL}
      })
  }
})
.catch((errors: any) => {
  res.status(400).send({
      success: false,
      message: "@{MODEL} update failed.",
      errors: Array.isArray(errors) === true ? errors : [{msg: errors.message}]
  })
})
};`,
      patchModel: `export const patch@{MODEL} = (req: any, res: any) => {
return (new @{PLEURAL_MODEL}()).patch@{MODEL}(req)
.then((@{SMALL_MODEL}: any) => {
  if(@{SMALL_MODEL} === null) {
      res.status(404).send({
          success: false,
          message: "@{MODEL} reference not found."
      })
  }
  else {
      res.status(200).send({
          success: true,
          message: "@{MODEL} patch succeeded.",
          data: @{SMALL_MODEL}
      })
  }
})
.catch((errors: any) => {
  res.status(400).send({
      success: false,
      message: "@{MODEL} patch failed.",
      errors: Array.isArray(errors) === true ? errors : [{msg: errors.message}]
  })
})
};`,
      deleteModel: `export const delete@{MODEL} = (req: any, res: any) => {
return (new @{PLEURAL_MODEL}()).delete@{MODEL}(req)
.then((deleted: boolean) => {
  if(deleted == false) {
      res.status(404).send({
          success: false,
          message: "@{MODEL} reference not found."
      })
  }
  else {
      res.status(200).send({
          success: true,
          message: "@{MODEL} delete succeeded."
      })
  }
})
.catch((errors: any) => {
  res.status(400).send({
      success: false,
      message: "@{MODEL} delete failed.",
      errors: Array.isArray(errors) === true ? errors : [{msg: errors.message}]
  })
})
};`
    }
  }
};
