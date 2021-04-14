export interface ContentPageletTreeElement {
  uniqueId: string;
  name: string;
  contentPageId: string;
  path?: string[];
}

export interface ContentPageletTree {
  nodes: { [id: string]: ContentPageletTreeElement };
  rootIds: string[];
  edges: { [id: string]: string[] };
}

