import { ContentPageTree, ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';

/**
 * View on a {@link ContentPageTreeElement } with additional methods for navigating to sub elements or sub paths
 */
export interface ContentPageTreeView extends ContentPageTreeElement {
  parent: string;
  children: ContentPageTreeView[];
}

function getSubTreeElements(tree: ContentPageTree, elementId: string): ContentPageTreeView[] {
  if (!tree || !elementId || !tree.nodes[elementId]) {
    return;
  }

  let treeElements: ContentPageTreeView[] = [];

  if (tree.edges[elementId]) {
    treeElements = tree.edges[elementId]
      .map(child => getSubTreeElements(tree, child))
      .reduce((a, b) => {
        b.map(element => a.push(element));
        return a;
      });
  }
  treeElements.push({
    ...tree.nodes[elementId],
    parent: tree.nodes[elementId].path[tree.nodes[elementId].path.length - 2],
    children: [],
  });
  return treeElements;
}

function unflattenTree(elements: ContentPageTreeView[], contentPageId: string): ContentPageTreeView {
  let root: ContentPageTreeView;
  elements.map(element => {
    if (element.contentPageId === contentPageId) {
      root = element;
      return;
    }

    const parentEl = elements.find(el => el.contentPageId === element.parent);
    parentEl.children = [...(parentEl.children || []), element];
  });

  return root;
}

export function createContentPageTreeView(tree: ContentPageTree, root: string): ContentPageTreeView[] {
  if (!tree || !root || !tree.nodes[root]) {
    return;
  }

  const subTree = getSubTreeElements(tree, root);
  return [unflattenTree(subTree, root)];
}
