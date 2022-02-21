import { PriceItem, ScaledPriceItem } from 'ish-core/models/price-item/price-item.model';

export interface ProductPriceDetails {
  sku: string;
  prices: {
    salePrice: PriceItem;
    listPrice: PriceItem;
    scaledPrices: ScaledPriceItem[];
  };
}
