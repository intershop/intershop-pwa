import { TestBed } from '@angular/core/testing';

import { StoreData } from './store.interface';
import { StoreMapper } from './store.mapper';

describe('Store Mapper', () => {
  let storeMapper: StoreMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    storeMapper = TestBed.inject(StoreMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => storeMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: StoreData = {
        uuid: 'test',
        name: 'test',
        address: 'test',
        city: 'test',
        postalCode: 'test',
        country: 'test',
        countryCode: 'test',
        email: 'test',
        fax: 'test',
        phoneBusiness: 'test',
        latitude: '1',
        longitude: '1',
      };
      const mapped = storeMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).toHaveProperty('name', 'test');
      expect(mapped).toHaveProperty('address', 'test');
      expect(mapped).toHaveProperty('city', 'test');
      expect(mapped).toHaveProperty('postalCode', 'test');
      expect(mapped).toHaveProperty('country', 'test');
      expect(mapped).toHaveProperty('countryCode', 'test');
      expect(mapped).toHaveProperty('email', 'test');
      expect(mapped).toHaveProperty('fax', 'test');
      expect(mapped).toHaveProperty('phone', 'test');
      expect(mapped).toHaveProperty('latitude', 1);
      expect(mapped).toHaveProperty('longitude', 1);
    });
  });
});
