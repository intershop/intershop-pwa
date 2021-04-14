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

export function createContentPageletTreeView(tree: ContentPageletTree, uniqueId: string): ContentPageletTreeView {
  if (!tree || !uniqueId) {
    return;
  }

  if (!tree.nodes[uniqueId]) {
    // given uniqueId could be specified as content page id in nodes
    const selectedTreeElement = Object.keys(tree.nodes)
      .map(key => tree.nodes[key])
      .find(e => e.contentPageId === uniqueId);

    return selectedTreeElement
      ? {
          ...selectedTreeElement,
          children: tree.edges[selectedTreeElement?.uniqueId],
        }
      : undefined;
  }

  return {
    ...tree.nodes[uniqueId],
    children: tree.edges[uniqueId] || [],
  };
}
