import { Injectable } from '@angular/core';

import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';

import { ProductPriceDetailsData, ProductPriceItemData } from './product-prices.interface';
import { ProductPriceDetails } from './product-prices.model';

// get ProductPriceItem for a single product from a set of possible prices
function getSinglePrice(prices: ProductPriceItemData[]): PriceItem {
  if (prices?.length !== 0) {
    const singlePrice = prices?.find(price => price?.minQuantity?.value === 1);
    if (singlePrice) {
      return PriceItemMapper.fromPriceItem(singlePrice);
    }
  }
  return;
}

@Injectable({ providedIn: 'root' })
export class ProductPricesMapper {
  static fromData(data: ProductPriceDetailsData): ProductPriceDetails {
    return {
      sku: data?.sku,
      prices: {
        salePrice: getSinglePrice(data?.prices?.SalePrice) ?? getSinglePrice(data?.prices?.ListPrice),
        listPrice: getSinglePrice(data?.prices?.ListPrice),
      },
    };
  }
}
