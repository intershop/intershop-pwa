import {
  ContentPageletTree,
  ContentPageletTreeElement,
} from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.model';

/**
 * View on a {@link ContentPageletTreeElement } with additional methods for navigating to sub elements or sub paths
 */
export interface ContentPageletTreeView extends ContentPageletTreeElement {
  children: string[];
}

export function createContentPageletTreeView(tree: ContentPageletTree, contentPageId: string): ContentPageletTreeView {
  if (!tree || !contentPageId || !tree.nodes[contentPageId]) {
    return;
  }

  return {
    ...tree.nodes[contentPageId],
    children: tree.edges[contentPageId] || [],
  };
}
