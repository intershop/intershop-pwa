import { Price } from './price.model';

export class PriceHelper {
  static diff(p1: Price, p2: Price): Price {
    if (!p1 || !p2) {
      throw new Error('cannot handle undefined inputs');
    }
    if (!Number.isFinite(p1.value) || !Number.isFinite(p2.value)) {
      throw new Error('cannot handle undefined values');
    }
    if (!p1.currencyMnemonic || !p2.currencyMnemonic) {
      throw new Error('cannot handle undefined currencyMnemonic');
    }
    if (p1.currencyMnemonic !== p2.currencyMnemonic) {
      throw new Error('currency mispatch');
    }

    return {
      type: p1.type,
      currencyMnemonic: p1.currencyMnemonic,
      value: Math.round((p1.value - p2.value) * 100) / 100,
    };
  }
}
