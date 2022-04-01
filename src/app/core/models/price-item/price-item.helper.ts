import { Price, Pricing, ScaledPrice } from 'ish-core/models/price/price.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';

import { PriceItem, ScaledPriceItem } from './price-item.model';

export class PriceItemHelper {
  static selectType(priceItem: PriceItem, type: 'gross' | 'net'): Price {
    if (priceItem && type) {
      return {
        type: 'Money',
        currency: priceItem.currency,
        value: priceItem[type],
      };
    }
  }

  static selectScaledPriceType(priceItem: ScaledPriceItem, type: 'gross' | 'net'): ScaledPrice {
    if (priceItem && type) {
      return {
        type: 'Money',
        currency: priceItem.currency,
        value: priceItem[type],
        minQuantity: priceItem.minQuantity,
      };
    }
  }

  static selectPricing(priceDetails: ProductPriceDetails, type: 'gross' | 'net'): Pricing {
    return {
      salePrice: PriceItemHelper.selectType(priceDetails?.prices?.salePrice, type),
      listPrice: PriceItemHelper.selectType(priceDetails?.prices?.listPrice, type),
      scaledPrices: priceDetails?.prices?.scaledPrices?.map(priceItem =>
        PriceItemHelper.selectScaledPriceType(priceItem, type)
      ),
    };
  }
}
