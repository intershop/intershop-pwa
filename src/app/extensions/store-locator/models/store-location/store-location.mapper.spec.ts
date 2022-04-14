import { TestBed } from '@angular/core/testing';

import { StoreLocationData } from './store-location.interface';
import { StoreLocationMapper } from './store-location.mapper';

describe('Store Location Mapper', () => {
  let storeLocationMapper: StoreLocationMapper;

  beforeEach(() => {
    storeLocationMapper = TestBed.inject(StoreLocationMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => storeLocationMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: StoreLocationData = {
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
      const mapped = storeLocationMapper.fromData(data);
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
