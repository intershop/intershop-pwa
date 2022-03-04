import { Category } from 'ish-core/models/category/category.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { Price } from 'ish-core/models/price/price.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { Product, VariationProduct, VariationProductMaster } from 'ish-core/models/product/product.model';

export type ProductView = Partial<SimpleProductView> &
  Partial<Omit<VariationProductView, 'type'>> &
  Partial<Omit<VariationProductMasterView, 'type'>>;

interface SimpleProductView extends Product {
  defaultCategory: Category;
  listPrice: Price;
  salePrice: Price;
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

export function createProductView(
  product: Product,
  productPrice: ProductPriceDetails,
  priceDisplayType: 'gross' | 'net',
  defaultCategory?: Category
): SimpleProductView {
  return (
    product && {
      ...product,
      defaultCategory,
      salePrice: PriceItemHelper.selectType(productPrice?.prices?.salePrice, priceDisplayType),
      listPrice: PriceItemHelper.selectType(productPrice?.prices?.listPrice, priceDisplayType),
    }
  );
}

export function createVariationProductMasterView(
  product: VariationProductMaster,
  defaultVariationSKU: string,
  variations: VariationProduct[],
  productPrice: ProductPriceDetails,
  priceDisplayType: 'gross' | 'net',
  defaultCategory?: Category
): VariationProductMasterView {
  return (
    product &&
    variations?.length && {
      ...createProductView(product, productPrice, priceDisplayType, defaultCategory),
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
  productPrice: ProductPriceDetails,
  priceDisplayType: 'gross' | 'net',
  defaultCategory?: Category
): VariationProductView {
  return (
    product &&
    productMaster &&
    variations?.length && {
      ...createProductView(product, productPrice, priceDisplayType, defaultCategory),
      type: 'VariationProduct',
      variations,
      productMaster,
    }
  );
}
