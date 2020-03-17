import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getLoggedInCustomer } from 'ish-core/store/user';

import { ShippingMethodData } from './shipping-method.interface';
import { ShippingMethodMapper } from './shipping-method.mapper';

describe('Shipping Method Mapper', () => {
  let shippingMethodMapper: ShippingMethodMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ selectors: [{ selector: getLoggedInCustomer, value: {} }] }),
        ShippingMethodMapper,
      ],
    });

    shippingMethodMapper = TestBed.get(ShippingMethodMapper);
  });

  describe('fromData', () => {
    const shippingMethodData = {
      id: '4711',
      name: 'StdGround',
      description: 'Standard ground',
      shippingCosts: {
        gross: {
          value: 43.34,
          currency: 'USD',
        },
        net: {
          value: 40.34,
          currency: 'USD',
        },
      },
    } as ShippingMethodData;

    it(`should return ShippingMethod when getting a ShippingMethodData`, () => {
      const shippingMethod = shippingMethodMapper.fromData(shippingMethodData);

      expect(shippingMethod).toBeTruthy();
      expect(shippingMethod.name).toEqual('StdGround');
      expect(shippingMethod.shippingCosts.value).toBePositive();
    });

    it(`should return shippingTimeMin and Max when getting a ShippingMethodData`, () => {
      shippingMethodData.deliveryTimeMin = 'P6D';
      shippingMethodData.deliveryTimeMax = 'P14D';
      const shippingMethod = shippingMethodMapper.fromData(shippingMethodData);

      expect(shippingMethod.shippingTimeMin).toEqual(6);
      expect(shippingMethod.shippingTimeMax).toEqual(14);
    });

    it(`should not return shippingTimeMin and Max if shipping time is not a day in period format`, () => {
      shippingMethodData.deliveryTimeMin = '6';
      shippingMethodData.deliveryTimeMax = 'P14D12H';
      const shippingMethod = shippingMethodMapper.fromData(shippingMethodData);

      expect(shippingMethod.shippingTimeMin).toBeUndefined();
      expect(shippingMethod.shippingTimeMax).toBeUndefined();
    });
  });
});
