import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';
import { ContentPageTreeHelper } from 'ish-core/models/content-page-tree/content-page-tree.helper';
import { ContentPageTree, ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';

export function categoryTree(categories?: Category[]): CategoryTree {
  const tree = CategoryTreeHelper.empty();
  if (categories) {
    return categories.reduce((acc, cat) => CategoryTreeHelper.add(acc, cat), tree);
  }
  return tree;
}

export function pageTree(elements?: ContentPageTreeElement[]): ContentPageTree {
  const tree = ContentPageTreeHelper.empty();
  if (elements) {
    return elements.reduce((acc, cat) => ContentPageTreeHelper.add(acc, cat), tree);
  }
  return tree;
}
