export interface ContentPageletTreeElement {
  name: string;
  contentPageId: string;
  path?: string[];
}

export interface ContentPageletTree {
  nodes: { [id: string]: ContentPageletTreeElement };
  edges: { [id: string]: string[] };
  rootIds: string[];
}
