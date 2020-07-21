export interface NodeDocument {
  data: NodeData[];
}

export interface NodeData extends NodeResourceIdentifier {
  attributes: NodeAttributes;
  relationships: NodeRelationships;
}

export interface NodeAttributes {
  name: string;
  description?: string;
}

export interface NodeRelationships {
  childNodes?: { data: NodeResourceIdentifier[] };
  organization: { data: NodeResourceIdentifier };
  parentNode?: { data: NodeResourceIdentifier };
}

export interface NodeResourceIdentifier {
  id: string;
}
