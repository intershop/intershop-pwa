import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';

/**
 * View on a {@link Category} with additional methods for navigating to sub categories or category path
 */
export interface CategoryView extends Category {
  children: string[];
  hasChildren: boolean;
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
    children: tree.edges[uniqueId] || [],
    hasChildren: !!tree.edges[uniqueId] && !!tree.edges[uniqueId].length,
  };
}
