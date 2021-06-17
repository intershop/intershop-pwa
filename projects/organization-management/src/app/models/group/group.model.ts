export interface Group {
  id: string;
  name: string;
  description?: string;
  organization?: string;
}

export interface GroupTree {
  groups: { [id: string]: Group };
  edges: { [id: string]: string[] };
  rootIds: string[];
}
