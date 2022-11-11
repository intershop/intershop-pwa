import { TestBed } from '@angular/core/testing';

import { ProductNotificatioData } from './product-notification.interface';
import { ProductNotificatioMapper } from './product-notification.mapper';

describe('Product Notificatio Mapper', () => {
  let productNotificatioMapper: ProductNotificatioMapper;

  beforeEach(() => {
    productNotificatioMapper = TestBed.inject(ProductNotificatioMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => productNotificatioMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: ProductNotificatioData = {
        incomingField: 'test',
        otherField: false,
      };
      const mapped = productNotificatioMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).not.toHaveProperty('otherField');
    });
  });
});
