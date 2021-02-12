import { Category } from 'ish-core/models/category/category.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product } from 'ish-core/models/product/product.model';

/**
 * View on a {@link Product} with additional methods for default category
 */
export interface ProductView extends Product {
  defaultCategory: Category;
}

export interface VariationProductView extends VariationProduct, ProductView {
  type: 'VariationProduct';
  variations: VariationProduct[];
  productMaster: VariationProductMaster;
}

export interface VariationProductMasterView extends VariationProductMaster, ProductView {
  type: 'VariationProductMaster';
  variations: VariationProduct[];
  defaultVariationSKU: string;
}

export function createProductView(product: Product, defaultCategory?: Category): ProductView {
  return product && { ...product, defaultCategory };
}

export function createVariationProductMasterView(
  product: VariationProductMaster,
  defaultVariationSKU: string,
  variations: VariationProduct[],
  defaultCategory?: Category
): VariationProductMasterView {
  return (
    product &&
    variations?.length && {
      ...createProductView(product, defaultCategory),
      type: 'VariationProductMaster',
      defaultVariationSKU,
      variations,
    }
  );
}

export function createVariationProductView(
  product: VariationProduct,
  variations: VariationProduct[],
  productMaster: VariationProductMaster,
  defaultCategory?: Category
): VariationProductView {
  return (
    product &&
    productMaster &&
    variations?.length && {
      ...createProductView(product, defaultCategory),
      type: 'VariationProduct',
      variations,
      productMaster,
    }
  );
}
