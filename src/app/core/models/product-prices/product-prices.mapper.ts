import { Injectable } from '@angular/core';

import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceItem, ScaledPriceItem } from 'ish-core/models/price-item/price-item.model';

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

function getScaledPriceItem(priceItem: ProductPriceItemData): ScaledPriceItem {
  if (priceItem) {
    return {
      ...PriceItemMapper.fromPriceItem(priceItem),
      minQuantity: priceItem?.minQuantity?.value,
    };
  }
  return;
}

@Injectable({ providedIn: 'root' })
export class ProductPricesMapper {
  static fromData(data: ProductPriceDetailsData): ProductPriceDetails {
    const scaledPrices = data?.prices?.SalePrice?.map(priceItem => getScaledPriceItem(priceItem))
      .filter(priceItem => priceItem.minQuantity !== 1)
      .sort((a, b) => a.minQuantity - b.minQuantity);
    return {
      sku: data?.sku,
      prices: {
        salePrice: getSinglePrice(data?.prices?.SalePrice) ?? getSinglePrice(data?.prices?.ListPrice),
        listPrice: getSinglePrice(data?.prices?.ListPrice),
        scaledPrices,
        minSalePrice: getSinglePrice(data?.prices?.MinSalePrice) ?? getSinglePrice(data?.prices?.MinListPrice),
        minListPrice: getSinglePrice(data?.prices?.MinListPrice),
        maxSalePrice: getSinglePrice(data?.prices?.MaxSalePrice) ?? getSinglePrice(data?.prices?.MaxListPrice),
        maxListPrice: getSinglePrice(data?.prices?.MaxListPrice),
        summedUpSalePrice:
          getSinglePrice(data?.prices?.SummedUpSalePrice) ?? getSinglePrice(data?.prices?.SummedUpListPrice),
        summedUpListPrice: getSinglePrice(data?.prices?.SummedUpListPrice),
      },
    };
  }
}
