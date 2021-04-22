import { ContentPageTree, ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';

/**
 * View on a {@link ContentPageTreeElement } with additional methods for navigating to sub elements or sub paths
 */
export interface ContentPageTreeView extends ContentPageTreeElement {
  parent: string;
  children: ContentPageTreeView[];
}

function getSubTreeElements(
  tree: ContentPageTree,
  elementId: string,
  rootId: string,
  contentPageId: string
): ContentPageTreeView[] {
  if (!tree || !elementId || !tree.nodes[elementId]) {
    return;
  }

  let treeElements: ContentPageTreeView[] = [];

  if (tree.edges[elementId] && (hasPageTreeElement(tree, contentPageId, elementId) || elementId === contentPageId)) {
    treeElements = tree.edges[elementId]
      .map(child => getSubTreeElements(tree, child, rootId, contentPageId))
      .reduce((a, b) => {
        b.map(element => a.push(element));
        return a;
      });
  }

  if (rootId !== elementId) {
    const nodeParent = tree.nodes[elementId].path[tree.nodes[elementId].path.length - 2];
    treeElements.push({
      ...tree.nodes[elementId],
      parent: nodeParent,
      children: [],
    });
  }

  return treeElements;
}

function hasPageTreeElement(tree: ContentPageTree, contentPageId: string, elementId: string): boolean {
  let result = false;
  if (tree.edges[elementId]) {
    if (tree.edges[elementId].find(e => e === contentPageId)) {
      result = true;
    } else {
      result = tree.edges[elementId].map(e => hasPageTreeElement(tree, contentPageId, e)).find(res => res);
    }
  }
  return result;
}

function unflattenTree(elements: ContentPageTreeView[], rootId: string): ContentPageTreeView[] {
  const root: ContentPageTreeView[] = [];
  elements.map(element => {
    if (element.parent === rootId) {
      root.push(element);
      return;
    }

    const parentEl = elements.find(el => el.contentPageId === element.parent);
    parentEl.children = [...(parentEl.children || []), element];
  });

  return root;
}

export function createContentPageTreeView(
  tree: ContentPageTree,
  rootId: string,
  contentPageId: string
): ContentPageTreeView[] {
  if (!tree || !rootId || !tree.nodes[rootId]) {
    return;
  }

  const subTree = getSubTreeElements(tree, rootId, rootId, contentPageId);
  return unflattenTree(subTree, rootId);
}
