export interface ContentPageTreeElement {
  name: string;
  contentPageId: string;
  path: string[];
}

export interface ContentPageTree {
  nodes: { [id: string]: ContentPageTreeElement };
  edges: { [id: string]: string[] };
  rootIds: string[];
}
