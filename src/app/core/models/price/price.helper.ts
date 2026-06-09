import { PriceItem } from 'ish-core/models/price-item/price-item.model';

import { Price } from './price.model';

export class PriceHelper {
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
   *
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

  // visible-for-testing
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

  static getPrice(currency: string, value: number): Price {
    if (!currency) {
      throw new Error('getPrice cannot handle undefined currency');
    }
    if (value === undefined) {
      throw new Error('getPrice cannot handle undefined value');
    }
    return { currency, value, type: 'Money' };
  }

  /**
   * Returns the currency symbol for the given currency code in the specified format and locale.
   * This method replaces the deprecated Angular getCurrencySymbol function.
   *
   * @param code The currency code (e.g., 'USD', 'EUR')
   * @param format The format: 'wide' for full name, 'narrow' for narrow symbol, 'symbol' for standard symbol
   * @param locale The locale string (optional, defaults to undefined)
   * @returns The currency symbol or code if formatting fails
   */
  static getCurrencySymbol(code: string, format: 'narrow' | 'symbol' | 'wide', locale?: string): string {
    try {
      const currencyDisplay = format === 'narrow' ? 'narrowSymbol' : 'symbol';
      // Convert underscore locale format (en_US) to hyphen format (en-US) for Intl API
      const normalizedLocale = locale?.replace(/_/g, '-');
      const formatter = new Intl.NumberFormat(normalizedLocale, {
        style: 'currency',
        currency: code,
        currencyDisplay,
      });
      const parts = formatter.formatToParts(0);
      const symbolPart = parts.find(part => part.type === 'currency');
      return symbolPart ? symbolPart.value : code;
    } catch {
      return code;
    }
  }

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
      throw new Error('currency mismatch');
    }
  }
}
