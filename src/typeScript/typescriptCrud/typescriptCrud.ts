import { CRUDGeneratorStrategy } from '../../crud/CRUDGeneratorStrategy.interface';
import { readFileSync, writeFile } from 'fs';
import { ModelConfig } from '../../strategies/modelConfig.types';
import { sequelizeDbModel } from '../snipets/typeScriptSnipets/sequelizeDbModelSnipets';
const isWin = process.platform === 'win32';
import { plural } from 'pluralize';

export class TypescriptCrudStrategy implements CRUDGeneratorStrategy {
  private porjectDBPath!: string;
  private readFile(file: string) {
    let content = readFileSync(file, 'utf8');
    if (isWin) content = content.replace(/\r/g, '');
    return content;
  }

  private lowerCaseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private addModelAssociations(file: string, model: ModelConfig) {
    // REPLACE `// associations can be defined here`
    let associationsCode = '';

    model?.associations?.forEach((association) => {
      switch (association.method) {
        case 'belongsTo':
          {
            let ascModel = association.associated_model;
            let lowerAscModel =
              association.associated_model.charAt(0).toLowerCase() + association.associated_model.substring(1);
            associationsCode += `${model.name}.belongsTo(models.${ascModel}, {as: '${lowerAscModel}'});
    `;
          }
          break;
        case 'hasOne':
          {
            let ascModel = association.associated_model;
            let foreignKey =
              'foreignkey' in association
                ? association['foreignkey']
                : model.name.charAt(0).toLowerCase() + model.name.substring(1) + 'Id';
            let sourceKey = 'sourcekey' in association ? association['sourcekey'] : 'id';
            let as = 'as' in association ? association?.as : this.lowerCaseFirstLetter(association['associated_model']);
            associationsCode += `${model.name}.hasOne(models.${ascModel}, {foreignKey: '${foreignKey}', sourceKey: '${sourceKey}', as: '${as}'});
    `;
          }
          break;

        // @{MODEL}.hasMany(models.@{ASSOCIATED_MODEL}, {foreignKey: @{FOREIGNKEY}, sourceKey: @{SOURCEKEY}, as: @{AS});
        case 'hasMany':
          {
            let ascModel = association.associated_model;
            let foreignKey =
              'foreignkey' in association
                ? association['foreignkey']
                : model.name.charAt(0).toLowerCase() + model.name.substring(1) + 'Id';
            let sourceKey = 'sourcekey' in association ? association['sourcekey'] : 'id';
            let as =
              'as' in association ? association.as : this.lowerCaseFirstLetter(association['associated_model']) + 's';
            associationsCode += `${model.name}.hasMany(models.${ascModel}, {foreignKey: '${foreignKey}', sourceKey: '${sourceKey}', as: '${as}'});
    `;
          }
          break;
      }
    });
    if (associationsCode.length > 0) {
      file = file.replace(sequelizeDbModel.associations.commentText, associationsCode);
    }

    return file;
  }

  private addModelCRUDFunctions(dbModelContents: string, model: ModelConfig) {
    let functionsCode = '';

    // getModelById()
    functionsCode +=
      sequelizeDbModel.functions.methods.getModelById.replace(/@{MODEL}/g, model.name) +
      `
    `;

    // getModel()
    functionsCode +=
      sequelizeDbModel.functions.methods.getModel.replace(/@{MODEL}/g, model.name) +
      `
    `;

    // getModels()
    let getModelsSnippet = sequelizeDbModel.functions.methods.getModels.replace(/@{MODEL}/g, model.name);
    getModelsSnippet = getModelsSnippet.replace('@{PLEURAL_MODEL}', plural(model.name));
    functionsCode +=
      getModelsSnippet +
      `
    `;

    // createModel()
    let createModelSnippet = sequelizeDbModel.functions.methods.createModel.replace(/@{MODEL}/g, model.name);
    let assignments = '';
    model.attributes.forEach((attribute) => {
      assignments +=
        sequelizeDbModel.functions.statements.assignToModel.replace(/@{ATTRIBUTE}/g, attribute.name) +
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
    let updateModelSnippet = sequelizeDbModel.functions.methods.updateModel.replace(/@{MODEL}/g, model.name);
    if (assignments.length > 0) {
      updateModelSnippet = updateModelSnippet.replace('@{ASSIGN_TO_MODEL}', assignments);
    }
    functionsCode +=
      updateModelSnippet +
      `
    `;

    // deleteModel()
    functionsCode +=
      sequelizeDbModel.functions.methods.deleteModel.replace(/@{MODEL}/g, model.name) +
      `
    `;

    if (functionsCode.length > 0) {
      // return Model;
      functionsCode += `return ${model.name};`;
      dbModelContents = dbModelContents.replace(`return ${model.name};`, functionsCode);
    }

    return dbModelContents;
  }

  private updateDbModel(dbModelContents: string, model: ModelConfig): any {
    dbModelContents = this.addModelAssociations(dbModelContents, model);
    dbModelContents = this.addModelCRUDFunctions(dbModelContents, model);
    writeFile(`${this.porjectDBPath}/models/${model.name.toLowerCase()}.js`, dbModelContents, function (err) {
      if (err) console.log('Error: ', err);
      else console.log('SequelizeDBModel File updated successfully!');
    });
  }

  private makeServiceModel(snipet: any): any {}
  private makeController(snipet: any): any {}
  private makeRoute(snipet: any): any {}

  public makeRest(porjectDBPath: string, model: ModelConfig): any {
    this.porjectDBPath = porjectDBPath;
    let dbModelContents = this.readFile(`${porjectDBPath}/models/${model.name.toLowerCase()}.js`);
    this.updateDbModel(dbModelContents, model);
    this.makeServiceModel();
  }
}
