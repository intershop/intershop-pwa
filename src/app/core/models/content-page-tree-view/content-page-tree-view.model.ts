import { ContentPageTree, ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';

/**
 * View on a {@link ContentPageTreeElement } with additional methods for navigating to sub elements or sub paths
 */
export interface ContentPageTreeView extends ContentPageTreeElement {
  parent: string;
  children: ContentPageTreeView[];
  pathElements: ContentPageTreeElement[];
}

export function createCompleteContentPageTreeView(
  tree: ContentPageTree,
  contentPageId: string,
  depth: number
): ContentPageTreeView {
  if (!tree || !contentPageId || !tree.nodes[contentPageId]) {
    return;
  }
  return unflattenTree(getCompleteContentPageTreeElements(tree, contentPageId, depth), contentPageId);
}

/**
 * @param tree
 * @param elementId element of page tree. It will be decided, if element is part of displayed navigation tree.
 * @param rootId
 * @param currentContentPageId
 * @returns Get all displayed navigation tree elements of current content page.
 */
function getContentPageTreeElements(
  tree: ContentPageTree,
  elementId: string,
  rootId: string,
  currentContentPageId: string
): ContentPageTreeView[] {
  if (!tree || !elementId || !tree.nodes[elementId]) {
    return;
  }

  let treeElements: ContentPageTreeView[] = [];

  // If current content page is part of element subtree or equals the element itself, then all children of elements should be analyzed
  if (tree.edges[elementId] && isContentPagePartOfPageTreeElement(tree, currentContentPageId, elementId)) {
    treeElements = tree.edges[elementId]
      .filter(child => child !== elementId)
      .map(child => getContentPageTreeElements(tree, child, rootId, currentContentPageId))
      .flat();
  }

  const parent = tree.nodes[elementId].path[tree.nodes[elementId].path.length - 2];

  treeElements.push({
    ...tree.nodes[elementId],
    parent,
    children: [],
    pathElements: tree.nodes[elementId].path.map(p => tree.nodes[p]),
  });

  return treeElements;
}

// Analyze if subtree of page tree element contains current content page id
function isContentPagePartOfPageTreeElement(
  tree: ContentPageTree,
  currentContentPageId: string,
  elementId: string
): boolean {
  let result = false;
  if (elementId === currentContentPageId) {
    result = true;
  } else if (tree.edges[elementId]) {
    if (tree.edges[elementId].find(e => e === currentContentPageId)) {
      result = true;
    } else {
      result = tree.edges[elementId]
        .filter(e => e !== elementId)
        .map(e => isContentPagePartOfPageTreeElement(tree, currentContentPageId, e))
        .find(res => res);
    }
  }

  return result;
}

// build page tree data based on given elements
function unflattenTree(elements: ContentPageTreeView[], rootId: string): ContentPageTreeView {
  let root: ContentPageTreeView;
  elements.map(element => {
    if (element.contentPageId === rootId) {
      root = element;
      return;
    } else {
      const parentEl = elements.find(el => el.contentPageId === element.parent);
      parentEl.children = [...(parentEl.children || []), element];
    }
  });
  return root;
}

export function createContentPageTreeView(
  tree: ContentPageTree,
  rootId: string,
  contentPageId: string
): ContentPageTreeView {
  if (!tree || !rootId || !tree.nodes[rootId] || !isContentPagePartOfPageTreeElement(tree, contentPageId, rootId)) {
    return;
  }
  return unflattenTree(getContentPageTreeElements(tree, rootId, rootId, contentPageId), rootId);
}

function getCompleteContentPageTreeElements(
  tree: ContentPageTree,
  contentPageId: string,
  depth: number,
  currentDepth = 0
): ContentPageTreeView[] {
  let treeElements: ContentPageTreeView[] = [];

  if (tree.edges[contentPageId] && (currentDepth < depth || Number.isNaN(depth))) {
    treeElements = tree.edges[contentPageId]
      .map(child => getCompleteContentPageTreeElements(tree, child, depth, currentDepth + 1))
      .flat();
  }

  const parent = tree.nodes[contentPageId].path[tree.nodes[contentPageId].path.length - 2];
  treeElements.push({
    ...tree.nodes[contentPageId],
    parent,
    children: [],
    pathElements: tree.nodes[contentPageId].path.map(p => tree.nodes[p]),
  });

  return treeElements;
}
