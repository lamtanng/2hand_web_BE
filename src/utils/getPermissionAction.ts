import { ModelAction } from '../types/enum/modelAction.enum';

const getModelAction = (action: string, modelName: string) =>
  `${action}_${modelName}`.toLowerCase();
export const getReadAction = (modelName: string) => getModelAction(ModelAction.Read, modelName);
export const getCreateAction = (modelName: string) => getModelAction(ModelAction.Create, modelName);
export const getUpdateAction = (modelName: string) => getModelAction(ModelAction.Update, modelName);
export const getDeleteAction = (modelName: string) => getModelAction(ModelAction.Delete, modelName);
export const generateModelAction = (modelName: string) => {
  return {
    Read: getReadAction(modelName),
    Create: getCreateAction(modelName),
    Update: getUpdateAction(modelName),
    Delete: getDeleteAction(modelName),
  };
};
