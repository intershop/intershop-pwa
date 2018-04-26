import { CategoryTree } from '../category-tree/category-tree.model';
import { Category } from '../category/category.model';

export interface CategoryView extends Category {
  children: () => CategoryView[];
  hasChildren: () => boolean;
}

export function createCategoryView(tree: CategoryTree, uniqueId: string): CategoryView {
  if (!tree || !uniqueId) {
    return undefined;
  }
  if (!tree.nodes[uniqueId]) {
    return undefined;
  }

  const categoryView: CategoryView = {
    ...tree.nodes[uniqueId],
    hasChildren: () => !!tree.edges[uniqueId] && !!tree.edges[uniqueId].length,
    children: () => (tree.edges[uniqueId] || []).map(id => createCategoryView(tree, id)),
  };
  return categoryView;
}
