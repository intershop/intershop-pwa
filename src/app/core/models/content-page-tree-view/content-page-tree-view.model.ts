import { ContentPageTree, ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';

/**
 * View on a {@link ContentPageTreeElement } with additional methods for navigating to sub elements or sub paths
 */
export interface ContentPageTreeView extends ContentPageTreeElement {
  children: string[];
}

export function createContentPageTreeView(tree: ContentPageTree, contentPageId: string): ContentPageTreeView {
  if (!tree || !contentPageId || !tree.nodes[contentPageId]) {
    return;
  }

  return {
    ...tree.nodes[contentPageId],
    children: tree.edges[contentPageId] || [],
  };
}
