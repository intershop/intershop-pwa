export interface ContentPageTreeElement {
  name: string;
  contentPageId: string;
  path: string[];
}

export interface ContentPageTree {
  nodes: Record<string, ContentPageTreeElement>;
  edges: Record<string, string[]>;
  rootIds: string[];
}
