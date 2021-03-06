import { Category } from 'ish-core/models/category/category.model';
import { Product, VariationProduct, VariationProductMaster } from 'ish-core/models/product/product.model';

export type ProductView = Partial<SimpleProductView> &
  Partial<Omit<VariationProductView, 'type'>> &
  Partial<Omit<VariationProductMasterView, 'type'>>;

interface SimpleProductView extends Product {
  defaultCategory: Category;
}

interface VariationProductView extends VariationProduct, SimpleProductView {
  type: VariationProduct['type'];
  variations: VariationProduct[];
  productMaster: VariationProductMaster;
}

interface VariationProductMasterView extends VariationProductMaster, SimpleProductView {
  type: VariationProductMaster['type'];
  variations: VariationProduct[];
  defaultVariationSKU: string;
}

export function createProductView(product: Product, defaultCategory?: Category): SimpleProductView {
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
