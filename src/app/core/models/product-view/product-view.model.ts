import { Dictionary } from '@ngrx/entity';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { CategoryView, createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { AllProductTypes } from 'ish-core/models/product/product.helper';
import { Product } from 'ish-core/models/product/product.model';

/**
 * View on a {@link Product} with additional methods for default category
 */
export interface ProductView extends Product {
  defaultCategory(): CategoryView;
}

export interface VariationProductView extends VariationProduct {
  productMaster: VariationProductMaster;
  variations: VariationProduct[];
  defaultCategory(): CategoryView;
}

export interface VariationProductMasterView extends VariationProductMaster {
  variations: VariationProduct[];
  defaultCategory(): CategoryView;
}

export function createProductView(product: Product, tree: CategoryTree): ProductView {
  if (!tree || !product) {
    return;
  }

  return {
    ...product,
    attributes: product.attributes || [],
    defaultCategory: () =>
      tree.nodes[product.defaultCategoryId] ? createCategoryView(tree, product.defaultCategoryId) : undefined,
  };
}

export function createVariationProductMasterView(
  product: VariationProductMaster,
  entities: Dictionary<AllProductTypes>,
  tree: CategoryTree
): VariationProductMasterView {
  if (!tree || !product) {
    return;
  }

  return {
    ...createProductView(product, tree),
    variations: product.variationSKUs?.map(sku => entities[sku]).filter(x => !!x) || [],
  };
}

export function createVariationProductView(
  product: VariationProduct,
  entities: Dictionary<AllProductTypes>,
  tree: CategoryTree
): VariationProductView {
  if (!tree || !product) {
    return;
  }

  return {
    ...createProductView(product, tree),
    variations:
      (entities[product.productMasterSKU] as VariationProductMaster)?.variationSKUs
        ?.map(sku => entities[sku])
        .filter(x => !!x) || [],
    productMaster: entities[product.productMasterSKU],
  };
}
