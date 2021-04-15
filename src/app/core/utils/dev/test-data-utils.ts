import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';
import { ContentPageletTreeView } from 'ish-core/models/content-pagelet-tree-view/content-pagelet-tree-view.model';
import { ContentPageletTreeHelper } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.helper';
import {
  ContentPageletTree,
  ContentPageletTreeElement,
} from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.model';

export function categoryTree(categories?: Category[]): CategoryTree {
  const tree = CategoryTreeHelper.empty();
  if (categories) {
    return categories.reduce((acc, cat) => CategoryTreeHelper.add(acc, cat), tree);
  }
  return tree;
}

export function pageTree(elements?: ContentPageletTreeElement[]): ContentPageletTree {
  const tree = ContentPageletTreeHelper.empty();
  if (elements) {
    return elements.reduce((acc, cat) => ContentPageletTreeHelper.add(acc, cat), tree);
  }
  return tree;
}

export function pageTreeView(contentPageId?: string, children?: string[]): ContentPageletTreeView {
  const tree = {} as ContentPageletTreeView;

  if (contentPageId) {
    return { contentPageId, name: `Page ${contentPageId}`, children };
  }

  return tree;
}
