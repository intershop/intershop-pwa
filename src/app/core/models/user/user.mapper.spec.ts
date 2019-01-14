import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { Address } from '../address/address.model';
import { Customer } from '../customer/customer.model';

import { UserData } from './user.interface';
import { UserMapper } from './user.mapper';

describe('User Mapper', () => {
  describe('fromCustomer', () => {
    it(`should return User when getting a customer`, () => {
      const customer = {
        firstName: 'Patricia',
        lastName: 'Miller',
        preferredInvoiceToAddress: BasketMockData.getAddress(),
        preferredShipToAddress: { urn: 'urn:1234' } as Address,
      } as Customer;
      const user = UserMapper.fromCustomer(customer);

      expect(user).toBeTruthy();
      expect(user.firstName).toBe(customer.firstName);
      expect(user.lastName).toBe(customer.lastName);
      expect(user.preferredInvoiceToAddressUrn).toBe(BasketMockData.getAddress().urn);
      expect(user.preferredShipToAddressUrn).toBe('urn:1234');
    });
  });

  describe('fromData', () => {
    it(`should return User when getting  UserData`, () => {
      const userData = {
        firstName: 'Patricia',
        lastName: 'Miller',
        preferredInvoiceToAddress: BasketMockData.getAddress(),
        preferredShipToAddress: { urn: 'urn:1234' } as Address,
      } as UserData;
      const user = UserMapper.fromData(userData);

      expect(user).toBeTruthy();
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.preferredInvoiceToAddressUrn).toBe(BasketMockData.getAddress().urn);
      expect(user.preferredShipToAddressUrn).toBe('urn:1234');
    });
  });
});
