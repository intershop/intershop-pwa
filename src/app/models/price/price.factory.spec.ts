import { PriceFactory } from './price.factory';
import { PriceData } from './price.interface';
import { Price } from './price.model';


describe('PriceFactory', () => {
  describe('fromData', () => {
    it(`should return a Price when getting valid PriceData`, () => {
      const price: Price = PriceFactory.fromData({ type: 'ProductPrice', value: 333.33, currencyMnemonic: 'USD' } as PriceData);
      expect(price).toBeTruthy();
      expect(price instanceof Price).toBeTruthy();
      expect(price.value).toBe(333.33);
      expect(price.currencyMnemonic).toBe('USD');
    });
    it(`should return a '0' value Price when getting valid PriceData with a '0' value`, () => {
      const price: Price = PriceFactory.fromData({ type: 'ProductPrice', value: 0, currencyMnemonic: 'USD' } as PriceData);
      expect(price).toBeTruthy();
      expect(price instanceof Price).toBeTruthy();
      expect(price.value).toBe(0);
      expect(price.currencyMnemonic).toBe('USD');
    });
    it(`should return 'null' when getting PriceData with 'N/A' as currencyMnemonic`, () => {
      const price: Price = PriceFactory.fromData({ type: 'ProductPrice', value: 0, currencyMnemonic: 'N/A' } as PriceData);
      expect(price).toBeNull();
    });
  });
});
