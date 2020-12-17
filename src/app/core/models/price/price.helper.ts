import { PriceItem } from 'ish-core/models/price-item/price-item.model';

import { Price } from './price.model';

export class PriceHelper {
  private static sanityChecks(p1: Price, p2: Price) {
    if (!p1 || !p2) {
      throw new Error('cannot handle undefined inputs');
    }
    if (!Number.isFinite(p1.value) || !Number.isFinite(p2.value)) {
      throw new Error('cannot handle undefined values');
    }
    if (!p1.currency || !p2.currency) {
      throw new Error('cannot handle undefined currency');
    }
    if (p1.currency !== p2.currency) {
      throw new Error('currency mispatch');
    }
  }

  static diff(p1: Price, p2: Price): Price {
    PriceHelper.sanityChecks(p1, p2);
    return {
      type: p1.type,
      currency: p1.currency,
      value: Math.round((p1.value - p2.value) * 100) / 100,
    };
  }

  /**
   * Inverts the value of a price
   * @param price The price
   * @returns inverted price
   */
  static invert<T extends Price | PriceItem>(price: T): T {
    if (price) {
      if (price.type === 'Money') {
        return { ...price, value: (price as Price).value * -1 };
      }
      return { ...price, gross: (price as PriceItem).gross * -1, net: (price as PriceItem).net * -1 };
    }
  }

  static min(p1: Price, p2: Price): Price {
    PriceHelper.sanityChecks(p1, p2);
    return {
      type: p1.type,
      currency: p1.currency,
      value: Math.round(Math.min(p1.value, p2.value) * 100) / 100,
    };
  }

  static sum(p1: Price, p2: Price): Price {
    PriceHelper.sanityChecks(p1, p2);
    return {
      type: p1.type,
      currency: p1.currency,
      value: Math.round((p1.value + p2.value) * 100) / 100,
    };
  }

  static empty(currency?: string): Price {
    return {
      type: 'Money',
      value: 0,
      currency,
    };
  }
}
