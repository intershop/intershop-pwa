import { CategoryTree, CategoryTreeHelper } from '../../models/category-tree/category-tree.model';
import { Category } from '../../models/category/category.model';

export function categoryTree(categories?: Category[]): CategoryTree {
  const tree = CategoryTreeHelper.empty();
  if (categories) {
    return categories.reduce((acc, cat) => CategoryTreeHelper.add(acc, cat), tree);
  }
  return tree;
}
