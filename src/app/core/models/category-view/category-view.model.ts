import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';

/**
 * View on a {@link Category} with additional methods for navigating to sub categories or category path
 */
export interface CategoryView extends Category {
  children: string[];
  hasChildren: boolean;
  pathElements: Category[];
}

export function createCategoryView(tree: CategoryTree, uniqueId: string): CategoryView {
  if (!tree || !uniqueId) {
    return;
  }
  if (!tree.nodes[uniqueId] && !tree.nodes[translateRef(tree, uniqueId)]) {
    return;
  }

  return {
    ...tree.nodes[translateRef(tree, uniqueId)],
    children: tree.edges[translateRef(tree, uniqueId)] || [],
    hasChildren: !!tree.edges[translateRef(tree, uniqueId)] && !!tree.edges[translateRef(tree, uniqueId)].length,
    pathElements: (tree.nodes[translateRef(tree, uniqueId)]?.categoryPath || [])
      .map(path => tree.nodes[translateRef(tree, path)])
      .filter(x => !!x),
  };
}

/**
 * Translates a given uniqueId into a key value that can be used to retrieve category data from store.
 *
 * @param tree the category tree structure to lookup `categoryRef` translation value
 * @param uniqueId the key value, either in category-path or category-ref notation
 * @returns the key value that can be used to resolve category data
 */
export function translateRef(tree: CategoryTree, uniqueId: string): string {
  if (!tree || !uniqueId) {
    return;
  }
  return tree.categoryRefs[uniqueId] ?? uniqueId;
}
