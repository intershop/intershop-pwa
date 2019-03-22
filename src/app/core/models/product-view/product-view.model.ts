import { Dictionary } from '@ngrx/entity';
import { once } from 'lodash-es';

import { CategoryTree } from '../category-tree/category-tree.model';
import { CategoryView, createCategoryView } from '../category-view/category-view.model';
import { VariationProductMaster } from '../product/product-variation-master.model';
import { VariationProduct } from '../product/product-variation.model';
import { Product } from '../product/product.model';

/**
 * View on a {@link Product} with additional methods for default category
 */
export interface ProductView extends Product {
  defaultCategory(): CategoryView;
}

export interface VariationProductView extends VariationProduct {
  productMaster(): VariationProductMasterView;
  variations(): VariationProductView[];
  defaultCategory(): CategoryView;
}

export interface VariationProductMasterView extends VariationProductMaster {
  variations(): VariationProductView[];
  defaultCategory(): CategoryView;
}

export function createProductView(product: Product, tree: CategoryTree): ProductView {
  if (!tree || !product) {
    return;
  }

  return {
    ...product,
    defaultCategory: tree.nodes[product.defaultCategoryId]
      ? once(() => createCategoryView(tree, product.defaultCategoryId))
      : () => undefined,
  };
}

export function createVariationProductMasterView(
  product: VariationProductMaster,
  entities: Dictionary<Product | VariationProduct | VariationProductMaster>,
  tree: CategoryTree
): VariationProductMasterView {
  if (!tree || !product) {
    return;
  }

  return {
    ...createProductView(product, tree),
    variations: product.variationSKUs
      ? once(() =>
          product.variationSKUs.map(variationSKU => createVariationProductView(entities[variationSKU], entities, tree))
        )
      : () => [],
  };
}

export function createVariationProductView(
  product: VariationProduct,
  entities: Dictionary<Product | VariationProduct | VariationProductMaster>,
  tree: CategoryTree
): VariationProductView {
  if (!tree || !product) {
    return;
  }

  return {
    ...createProductView(product, tree),
    variations: entities[product.productMasterSKU]
      ? once(() => createVariationProductMasterView(entities[product.productMasterSKU], entities, tree).variations())
      : () => [],
    productMaster: once(() => createVariationProductMasterView(entities[product.productMasterSKU], entities, tree)),
  };
}
