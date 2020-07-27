export interface NodeDocument {
  data: NodeData[];
}

export interface NodeData extends NodeResourceIdentifier {
  attributes: NodeAttributes;
  relationships: NodeRelationships;
}

interface NodeAttributes {
  name: string;
  description?: string;
}

interface NodeRelationships {
  childNodes?: { data: NodeResourceIdentifier[] };
  organization: { data: NodeResourceIdentifier };
  parentNode?: { data: NodeResourceIdentifier };
}

export interface NodeResourceIdentifier {
  id: string;
}
