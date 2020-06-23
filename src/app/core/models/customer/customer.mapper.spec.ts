import { Address } from 'ish-core/models/address/address.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CustomerData } from './customer.interface';
import { CustomerMapper } from './customer.mapper';

describe('Customer Mapper', () => {
  describe('mapLoginData', () => {
    it(`should return Customer and User when getting  CustomerData of a private Customer`, () => {
      const customerData = {
        type: 'PrivateCustomer',
        customerNo: 'test',
        firstName: 'Patricia',
        lastName: 'Miller',
        preferredInvoiceToAddress: BasketMockData.getAddress(),
        preferredShipToAddress: { urn: 'urn:1234' } as Address,
        preferredPaymentInstrument: { id: '1234' } as PaymentInstrument,
      } as CustomerData;

      const loginData = CustomerMapper.mapLoginData(customerData);
      const customer = loginData.customer;
      const user = loginData.user;

      expect(customer).toBeTruthy();
      expect(customer.isBusinessCustomer).toBeFalse();
      expect(customer.customerNo).toEqual(customerData.customerNo);

      expect(user.firstName).toBe(customerData.firstName);
      expect(user.lastName).toBe(customerData.lastName);
      expect(user.preferredInvoiceToAddressUrn).toBe(BasketMockData.getAddress().urn);
      expect(user.preferredShipToAddressUrn).toBe('urn:1234');
      expect(user.preferredPaymentInstrumentId).toBe('1234');
    });

    it(`should return only Customer when getting  CustomerData of a business Customer`, () => {
      const customerData = {
        type: 'SMBCustomer',
        customerNo: 'test',
        companyName: 'test Enterprise',
        taxationID: '54711',
      } as CustomerData;
      const loginData = CustomerMapper.mapLoginData(customerData);
      const customer = loginData.customer;

      expect(customer).toBeTruthy();
      expect(customer.isBusinessCustomer).toBeTrue();
      expect(customer.customerNo).toEqual(customerData.customerNo);
      expect(customer.companyName).toEqual(customerData.companyName);
      expect(customer.taxationID).toEqual(customerData.taxationID);

      expect(loginData.user).toBeUndefined();
    });
  });

  describe('Customer Mapper', () => {
    it(`should return Customer when getting CustomerData of a private Customer`, () => {
      const customerData = {
        type: 'PrivateCustomer',
        customerNo: 'test',
      } as CustomerData;
      const customer = CustomerMapper.fromData(customerData);

      expect(customer).toBeTruthy();
      expect(customer.isBusinessCustomer).toBeFalse();
      expect(customer.customerNo).toEqual(customerData.customerNo);
      expect(customer.isBusinessCustomer).toBeFalse();
    });

    it(`should return Customer when getting CustomerData of a business Customer`, () => {
      const customerData = {
        type: 'SMBCustomer',
        customerNo: 'test',
        companyName: 'test Enterprise',
        taxationID: '54711',
      } as CustomerData;

      const customer = CustomerMapper.fromData(customerData);

      expect(customer).toBeTruthy();
      expect(customer.isBusinessCustomer).toBeTrue();
      expect(customer.customerNo).toEqual(customerData.customerNo);
      expect(customer.companyName).toEqual(customerData.companyName);
      expect(customer.taxationID).toEqual(customerData.taxationID);
      expect(customer.isBusinessCustomer).toBeTrue();
    });
  });
});
