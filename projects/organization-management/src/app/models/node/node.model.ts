export interface Node {
  id: string;
  name: string;
  description?: string;
  organization?: string;
}

export interface NodeTree {
  nodes: { [id: string]: Node };
  edges: { [id: string]: string[] };
  rootIds: string[];
}
