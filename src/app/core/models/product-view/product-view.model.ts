import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Product, VariationProduct, VariationProductMaster } from 'ish-core/models/product/product.model';

export type ProductView = Partial<SimpleProductView> &
  Partial<Omit<VariationProductView, 'type'>> &
  Partial<Omit<VariationProductMasterView, 'type'>>;

interface SimpleProductView extends Product {
  defaultCategory: CategoryView;
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

export function createProductView(product: Product, defaultCategory?: CategoryView): SimpleProductView {
  return (
    product && {
      ...product,
      defaultCategory,
    }
  );
}

export function createVariationProductMasterView(
  product: VariationProductMaster,
  defaultVariationSKU: string,
  variations: VariationProduct[],
  defaultCategory?: CategoryView
): VariationProductMasterView {
  return (
    product && {
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
  defaultCategory?: CategoryView
): VariationProductView {
  return (
    product && {
      ...createProductView(product, defaultCategory),
      type: 'VariationProduct',
      variations,
      productMaster,
    }
  );
}
