export interface NodeDocument {
  data: NodeData[];
}

export interface NodeData {
  id: string;
  attributes: NodeAttributes;
  relationships: NodeRelationships;
}

export interface NodeAttributes {
  name: string;
  description?: string;
}

export interface NodeRelationships {
  childNodes: string;
  organization: string;
  parentNode: string;
}
