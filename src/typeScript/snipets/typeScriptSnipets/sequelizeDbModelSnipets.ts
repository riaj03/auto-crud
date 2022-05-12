export const sequelizeDbModel = {
  associations: {
    commentText: '// define association here',
    statements: {
      belongsTo: `@{MODEL}.belongsTo(models.@{ASSOCIATED_MODEL}, {as: '@{LOWER_ASSOCIATED_MODEL}'});`,
      hasOne: `@{MODEL}.hasOne(models.@{ASSOCIATED_MODEL}, {foreignKey: '@{FOREIGNKEY}', sourceKey: '@{SOURCEKEY}', as: '@{AS}');`,
      hasMany: `@{MODEL}.hasMany(models.@{ASSOCIATED_MODEL}, {foreignKey: '@{FOREIGNKEY}', sourceKey: '@{SOURCEKEY}', as: '@{AS}');`
    }
  },

  functions: {
    methods: {
      getModelById: `@{MODEL}.get@{MODEL}ById = (id, include = null) => {
    return @{MODEL}.findByPk(id, { include });
  };`,
      getModel: `@{MODEL}.get@{MODEL} = (query) => {
    return @{MODEL}.findOne(query)
  };`,
      getModels: `@{MODEL}.get@{PLEURAL_MODEL} = (query) => {
    return @{MODEL}.findAndCountAll(query);
  };`,
      createModel: `@{MODEL}.create@{MODEL} = (data) => {
    var model = {};
    @{ASSIGN_TO_MODEL}
    return @{MODEL}.create(model);
  };`,
      updateModel: `@{MODEL}.update@{MODEL} = (model, data) => {
    @{ASSIGN_TO_MODEL}
    return model.save();
  };`,
      deleteModel: `@{MODEL}.delete@{MODEL} = (where) => {
    return @{MODEL}.destroy({where});
  };`
    },
    statements: {
      assignToModel: `if (data.@{ATTRIBUTE}) model.@{ATTRIBUTE} = data.@{ATTRIBUTE};`
    }
  }
};
