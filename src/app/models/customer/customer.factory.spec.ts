import { FormControl, FormGroup } from '@angular/forms';
import { CustomerFactory } from './customer.factory';
import { CustomerData } from './customer.interface';
import { Customer } from './customer.model';

describe('Customer Factory', () => {
  describe('fromData', () => {
    it(`should return Customer when getting a RawCustomer`, () => {
      expect(CustomerFactory.fromData({ id: '1' } as CustomerData)).toBeTruthy();
    });
  });

  describe('toData', () => {
    it(`should return CustomerData when getting a Customer`, () => {
      const customer = new Customer();
      customer.id = '12345';
      const customerdata = CustomerFactory.toData(customer);
      expect(customerdata.id).toEqual('12345', 'customerData id is returned');
    });
  });

  describe('fromValue', () => {
    const regForm = new FormGroup({
      birthday: new FormControl(''),
    });
    const addressForm = new FormGroup({
      countryCode: new FormControl('DE'),
      firstName: new FormControl('John'),
      lastName: new FormControl('Doe'),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      postalCode: new FormControl(''),
      phoneHome: new FormControl('1234567890'),
      city: new FormControl('')
    });

    regForm.addControl('address', addressForm);

    it(`should return customer data when getting a customer (registration) form value`, () => {
      expect(CustomerFactory.fromValue(regForm.value)).toBeTruthy();
    });

    it(`should preset some fields on customerData when getting a customer (registration) form with an address`, () => {
      const customer = CustomerFactory.fromValue(regForm.value);
      expect(customer.firstName).toEqual('John', 'First name is written from address to customer, if it is empty');
      expect(customer.lastName).toEqual('Doe', 'Last name is written from address to customer, if it is empty');
      expect(customer.phoneHome).toEqual('1234567890', 'Phone home from address is written to customer, if it is empty');
      expect(customer instanceof Customer).toBeTruthy('customer is an object of class Customer');
    });

    it(`should return null when getting no customer (registration) form`, () => {
      expect(CustomerFactory.fromFormValueToData(null)).toBeFalsy();
    });
  });

  describe('fromFormValueToData', () => {
    it(`should return CustomerData when getting form value`, () => {
      const regForm = new FormGroup({
        birthday: new FormControl(''),
      });
      expect(CustomerFactory.fromFormValueToData(regForm.value)).toBeTruthy();
    });
  });
});

