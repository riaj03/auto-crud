export type ModelAttributes = {
  name: string;
  type: string;
};

export type ModelAssociation = {
  method: string;
  associated_model: string;
  as: string;
};

export type ModelConfig = {
  name: string;
  attributes: ModelAttributes[];
  associations?: ModelAssociation[];
  model_dir_name: string;
  routes: any[];
  controller_dir_name: string;
  routes_dir_name: string;
};

export type RestConfig = {
  projectDbPath: string;
  models: ModelConfig[];
};

export type ServiceModelMethod = {
  [key: string]: any;
};
