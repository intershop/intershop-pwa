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
  static invert(price: Price): Price {
    return { ...price, value: price.value * -1 };
  }

  static min(p1: Price, p2: Price): Price {
    PriceHelper.sanityChecks(p1, p2);
    return {
      type: p1.type,
      currency: p1.currency,
      value: Math.round(Math.min(p1.value, p2.value) * 100) / 100,
    };
  }

  static max(p1: Price, p2: Price): Price {
    PriceHelper.sanityChecks(p1, p2);
    return {
      type: p1.type,
      currency: p1.currency,
      value: Math.round(Math.max(p1.value, p2.value) * 100) / 100,
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
}
