import { CategoryTree } from '../category-tree/category-tree.model';
import { CategoryView, createCategoryView } from '../category-view/category-view.model';
import { Product } from '../product/product.model';

/**
 * View on a {@link Product} with additional methods for default category
 */
export interface ProductView extends Product {
  defaultCategory(): CategoryView;
}

export function createProductView(product: Product, tree: CategoryTree): ProductView {
  if (!tree || !product) {
    return;
  }
  if (product.defaultCategoryId && !tree.nodes[product.defaultCategoryId]) {
    return;
  }
  return {
    ...product,
    defaultCategory: () => createCategoryView(tree, product.defaultCategoryId),
  };
}
