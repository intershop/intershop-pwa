import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-views';

export function categoryTree(categories?: Category[]): CategoryTree {
  const tree = CategoryTreeHelper.empty();
  if (categories) {
    return categories.reduce((acc, cat) => CategoryTreeHelper.add(acc, cat), tree);
  }
  return tree;
}

export const createSimplePageletView = (pagelet: ContentPagelet): ContentPageletView =>
  createContentPageletView(pagelet.id, { [pagelet.id]: pagelet });
