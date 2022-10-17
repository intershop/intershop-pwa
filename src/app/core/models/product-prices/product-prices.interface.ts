import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';

export interface ProductPriceDetailsData {
  sku: string;
  prices: {
    SalePrice?: ProductPriceItemData[];
    ListPrice?: ProductPriceItemData[];
    MinSalePrice?: ProductPriceItemData[];
    MinListPrice?: ProductPriceItemData[];
    MaxSalePrice?: ProductPriceItemData[];
    MaxListPrice?: ProductPriceItemData[];
    SummedUpSalePrice?: ProductPriceItemData[];
    SummedUpListPrice?: ProductPriceItemData[];
  };
}

export interface ProductPriceItemData extends PriceItemData {
  minQuantity: { value: number };
  priceQuantity: { value: number };
}
