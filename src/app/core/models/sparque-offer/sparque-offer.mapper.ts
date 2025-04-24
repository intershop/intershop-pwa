import { Injectable } from '@angular/core';

import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';

import { SparqueOffer } from './sparque-offer.interface';

/**
 * Class responsible for mapping Sparque offers to product price details.
 */
@Injectable({ providedIn: 'root' })
export class SparqueOfferMapper {
  /**
   * Maps an array of Sparque products to an array of `ProductPriceDetails` object for a given SKU array.
   *
   * @param products - The array of sparque products for which the offers are being mapped.
   * @returns An array `ProductPriceDetails` object containing the mapped price details.
   */
  mapOffers(products: SparqueProduct[]): ProductPriceDetails[] {
    return products
      ? products
          .filter(product => product.offers?.length > 0)
          .map(product => this.mapOffer(product.offers, product.sku))
      : undefined;
  }

  private mapOffer(offers: SparqueOffer[], sku: string): ProductPriceDetails {
    const priceItems = this.mapOffersToPriceItems(offers).sort((a, b) => a.gross - b.gross);
    const summarizedPriceItem = priceItems.reduce(
      (acc, item) => ({
        type: 'PriceItem',
        gross: acc.gross + item.gross,
        net: acc.net + item.net,
        currency: item.currency,
      }),
      { type: 'PriceItem', gross: 0, net: 0, currency: priceItems[0]?.currency || '' }
    );
    return {
      sku,
      prices: {
        salePrice: priceItems.length ? priceItems[0] : undefined,
        listPrice: priceItems.length ? priceItems[0] : undefined,
        scaledPrices: [],
        minSalePrice: priceItems.length ? priceItems[0] : undefined,
        minListPrice: priceItems.length ? priceItems[0] : undefined,
        maxSalePrice: priceItems.length ? priceItems[priceItems.length - 1] : undefined,
        maxListPrice: priceItems.length ? priceItems[priceItems.length - 1] : undefined,
        summedUpSalePrice: summarizedPriceItem,
        summedUpListPrice: summarizedPriceItem,
      },
    };
  }

  private mapOffersToPriceItems(offers: SparqueOffer[]): PriceItem[] {
    return offers.map(offer => this.mapOfferToPriceItem(offer));
  }

  private mapOfferToPriceItem(offer: SparqueOffer): PriceItem {
    return {
      type: 'PriceItem',
      gross: offer.priceIncVat,
      net: offer.priceExclVat,
      currency: offer.currency,
    };
  }
}
