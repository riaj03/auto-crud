"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptCrudStrategy = void 0;
const fs_1 = require("fs");
const sequelizeDbModelSnipets_1 = require("../snipets/typeScriptSnipets/sequelizeDbModelSnipets");
const pluralize_1 = require("pluralize");
const typescriptServiceModel_1 = require("./typescriptServiceModel");
const commonServices_1 = require("../../services/commonServices");
const typescriptController_1 = require("./typescriptController");
const typescriptRoutes_1 = require("./typescriptRoutes");
class TypescriptCrudStrategy {
    addModelAssociations(file, model) {
        var _a;
        // REPLACE `// associations can be defined here`
        let associationsCode = '';
        (_a = model === null || model === void 0 ? void 0 : model.associations) === null || _a === void 0 ? void 0 : _a.forEach((association) => {
            switch (association.method) {
                case 'belongsTo':
                    {
                        const ascModel = association.associated_model;
                        const lowerAscModel = association.associated_model.charAt(0).toLowerCase() + association.associated_model.substring(1);
                        associationsCode += `${model.name}.belongsTo(models.${ascModel}, {as: '${lowerAscModel}'});
    `;
                    }
                    break;
                case 'hasOne':
                    {
                        const ascModel = association.associated_model;
                        const foreignKey = 'foreignkey' in association
                            ? association['foreignkey']
                            : model.name.charAt(0).toLowerCase() + model.name.substring(1) + 'Id';
                        const sourceKey = 'sourcekey' in association ? association['sourcekey'] : 'id';
                        const as = 'as' in association ? association === null || association === void 0 ? void 0 : association.as : commonServices_1.lowerCaseFirstLetter(association['associated_model']);
                        associationsCode += `${model.name}.hasOne(models.${ascModel}, {foreignKey: '${foreignKey}', sourceKey: '${sourceKey}', as: '${as}'});
    `;
                    }
                    break;
                // @{MODEL}.hasMany(models.@{ASSOCIATED_MODEL}, {foreignKey: @{FOREIGNKEY}, sourceKey: @{SOURCEKEY}, as: @{AS});
                case 'hasMany':
                    {
                        const ascModel = association.associated_model;
                        const foreignKey = 'foreignkey' in association
                            ? association['foreignkey']
                            : model.name.charAt(0).toLowerCase() + model.name.substring(1) + 'Id';
                        const sourceKey = 'sourcekey' in association ? association['sourcekey'] : 'id';
                        const as = 'as' in association ? association.as : commonServices_1.lowerCaseFirstLetter(association['associated_model']) + 's';
                        associationsCode += `${model.name}.hasMany(models.${ascModel}, {foreignKey: '${foreignKey}', sourceKey: '${sourceKey}', as: '${as}'});
    `;
                    }
                    break;
            }
        });
        if (associationsCode.length > 0) {
            file = file.replace(sequelizeDbModelSnipets_1.sequelizeDbModel.associations.commentText, associationsCode);
        }
        return file;
    }
    addModelCRUDFunctions(dbModelContents, model) {
        let functionsCode = '';
        // getModelById()
        functionsCode +=
            sequelizeDbModelSnipets_1.sequelizeDbModel.functions.methods.getModelById.replace(/@{MODEL}/g, model.name) +
                `
    `;
        // getModel()
        functionsCode +=
            sequelizeDbModelSnipets_1.sequelizeDbModel.functions.methods.getModel.replace(/@{MODEL}/g, model.name) +
                `
    `;
        // getModels()
        let getModelsSnippet = sequelizeDbModelSnipets_1.sequelizeDbModel.functions.methods.getModels.replace(/@{MODEL}/g, model.name);
        getModelsSnippet = getModelsSnippet.replace('@{PLEURAL_MODEL}', pluralize_1.plural(model.name));
        functionsCode +=
            getModelsSnippet +
                `
    `;
        // createModel()
        let createModelSnippet = sequelizeDbModelSnipets_1.sequelizeDbModel.functions.methods.createModel.replace(/@{MODEL}/g, model.name);
        let assignments = '';
        model.attributes.forEach((attribute) => {
            assignments +=
                sequelizeDbModelSnipets_1.sequelizeDbModel.functions.statements.assignToModel.replace(/@{ATTRIBUTE}/g, attribute.name) +
                    `
      `;
        });
        if (assignments.length > 0) {
            createModelSnippet = createModelSnippet.replace('@{ASSIGN_TO_MODEL}', assignments);
        }
        functionsCode +=
            createModelSnippet +
                `
    `;
        // updateModel()
        let updateModelSnippet = sequelizeDbModelSnipets_1.sequelizeDbModel.functions.methods.updateModel.replace(/@{MODEL}/g, model.name);
        if (assignments.length > 0) {
            updateModelSnippet = updateModelSnippet.replace('@{ASSIGN_TO_MODEL}', assignments);
        }
        functionsCode +=
            updateModelSnippet +
                `
    `;
        // deleteModel()
        functionsCode +=
            sequelizeDbModelSnipets_1.sequelizeDbModel.functions.methods.deleteModel.replace(/@{MODEL}/g, model.name) +
                `
    `;
        if (functionsCode.length > 0) {
            // return Model;
            functionsCode += `return ${model.name};`;
            dbModelContents = dbModelContents.replace(`return ${model.name};`, functionsCode);
        }
        return dbModelContents;
    }
    updateDbModel(dbModelContents, model) {
        dbModelContents = this.addModelAssociations(dbModelContents, model);
        dbModelContents = this.addModelCRUDFunctions(dbModelContents, model);
        fs_1.writeFile(`${this.porjectDBPath}/models/${model.name.toLowerCase()}.js`, dbModelContents, function (err) {
            if (err)
                console.log('Error: ', err);
            else
                console.log('SequelizeDBModel File updated successfully!');
        });
    }
    makeServiceModel(model) {
        const serviceModel = new typescriptServiceModel_1.TypescriptServiceModel(model, model.model_dir_name);
        serviceModel.constructModelClass(this.porjectDBPath);
    }
    makeController(model) {
        const controller = new typescriptController_1.TypeScriptController(model, this.porjectDBPath);
        controller.constructController();
    }
    makeRoute(model) {
        const route = new typescriptRoutes_1.TypescriptRoutes(this.porjectDBPath, model);
        route.constructRoutesFile();
    }
    makeRest(porjectDBPath, model) {
        this.porjectDBPath = porjectDBPath;
        const dbModelContents = commonServices_1.fileRead(`${porjectDBPath}/models/${model.name.toLowerCase()}.js`);
        this.updateDbModel(dbModelContents, model);
        this.makeServiceModel(model);
        this.makeController(model);
        this.makeRoute(model);
    }
}
exports.TypescriptCrudStrategy = TypescriptCrudStrategy;
