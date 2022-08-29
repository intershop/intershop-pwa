import { PriceItem, ScaledPriceItem } from 'ish-core/models/price-item/price-item.model';

export interface ProductPriceDetails {
  sku: string;
  prices: {
    salePrice?: PriceItem;
    listPrice?: PriceItem;
    scaledPrices?: ScaledPriceItem[];
    minSalePrice?: PriceItem;
    minListPrice?: PriceItem;
    maxSalePrice?: PriceItem;
    maxListPrice?: PriceItem;
    summedUpSalePrice?: PriceItem;
    summedUpListPrice?: PriceItem;
  };
}
