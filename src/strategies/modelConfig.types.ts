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
};

for (let index = 0; index < array.length; index++) {
  const element = array[index];
}
