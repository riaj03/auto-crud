export const modelsSnipets: any = {
  modelHeader: `
    'use strict';
    const { Model } = require('sequelize');
    module.exports = (sequelize, DataTypes) => {
    class @{MODEL} extends Model {
        static associate(models) {
  `,
  assosiationEnd: `
}
}
@{MODEL}.init({
  `,
  modelMethods: `
    },{
    sequelize,
    modelName: '@{MODEL}'
}
);
@{MODEL}.get@{MODEL}ById = (id, include = null) => {
return @{MODEL}.findByPk(id, { include });
};
@{MODEL}.get@{MODEL} = (query) => {
return @{MODEL}.findOne(query);
};
@{MODEL}.get@{MODEL}s = (query) => {
return @{MODEL}.findAndCountAll(query);
};
@{MODEL}.create@{MODEL} = (data) => {
var model = {};
if (data.tag) model.tag = data.tag;
if (data.name) model.name = data.name;

return @{MODEL}.create(model);
};
@{MODEL}.update = (model, data) => {
if (data.tag) model.tag = data.tag;
if (data.name) model.name = data.name;

return model.save();
};
@{MODEL}.delete@{MODEL} = (where) => {
return @{MODEL}.destroy({ where });
};
return @{MODEL};
}
  `
};
