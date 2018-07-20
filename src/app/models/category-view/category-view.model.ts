import { CategoryTree } from '../category-tree/category-tree.model';
import { Category } from '../category/category.model';

/**
 * View on a {@link Category} with additional methods for navigating to sub categories or category path
 */
export interface CategoryView extends Category {
  children: () => CategoryView[];
  hasChildren: () => boolean;
  pathCategories: () => CategoryView[];
}

export function createCategoryView(tree: CategoryTree, uniqueId: string): CategoryView {
  if (!tree || !uniqueId) {
    return;
  }
  if (!tree.nodes[uniqueId]) {
    return;
  }

  return {
    ...tree.nodes[uniqueId],
    hasChildren: () => !!tree.edges[uniqueId] && !!tree.edges[uniqueId].length,
    children: () => (tree.edges[uniqueId] || []).map(id => createCategoryView(tree, id)),
    pathCategories: () => tree.nodes[uniqueId].categoryPath.map(id => createCategoryView(tree, id)),
  };
}
