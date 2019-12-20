import { HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { CustomerData } from 'ish-core/models/customer/customer.interface';
import { Customer, CustomerRegistrationType, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { UserService } from './user.service';

describe('User Service', () => {
  let userService: UserService;
  let apiServiceMock: ApiService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    userService = new UserService(instance(apiServiceMock));
  });

  describe('SignIn a user', () => {
    it('should login the user when correct credentials are entered', done => {
      const loginDetail = { login: 'patricia@test.intershop.de', password: '!InterShop00!' };
      when(apiServiceMock.get(anything(), anything())).thenReturn(of({ customerNo: 'PC' } as Customer));

      userService.signinUser(loginDetail).subscribe(data => {
        const [, options] = capture<{}, { headers: HttpHeaders }>(apiServiceMock.get).last();
        const headers = options.headers;
        expect(headers).toBeTruthy();
        expect(headers.get('Authorization')).toEqual('BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ==');

        expect(data).toHaveProperty('customer.customerNo', 'PC');
        done();
      });
    });

    it('should return error message when wrong credentials are entered', done => {
      const errorMessage = '401 and Unauthorized';
      const userDetails = { login: 'intershop@123.com', password: 'wrong' };
      when(apiServiceMock.get(anything(), anything())).thenReturn(throwError(new Error(errorMessage)));
      userService.signinUser(userDetails).subscribe(fail, error => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
        done();
      });
    });

    it('should login a user by token when requested and successful', done => {
      when(apiServiceMock.get(anything(), anything())).thenReturn(of({ email: 'test@intershop.de' } as CustomerData));

      userService.signinUserByToken('dummy').subscribe(data => {
        verify(apiServiceMock.get(anything(), anything())).once();
        const [path, options] = capture<string, { headers: HttpHeaders }>(apiServiceMock.get).last();
        expect(path).toEqual('customers/-');
        expect(options.headers.get(ApiService.TOKEN_HEADER_KEY)).toEqual('dummy');
        expect(data).toHaveProperty('user.email', 'test@intershop.de');
        done();
      });
    });

    it('should not throw errors when logging in a user by token is unsuccessful', done => {
      when(apiServiceMock.get(anything(), anything())).thenReturn(throwError(new Error()));

      userService.signinUserByToken('dummy').subscribe(fail, fail, done);
    });
  });

  describe('Register a user', () => {
    it('should return an error when called with undefined', done => {
      when(apiServiceMock.post(anything(), anything())).thenReturn(of({}));

      userService.createUser(undefined).subscribe(fail, err => {
        expect(err).toMatchInlineSnapshot(`"createUser() called without required body data"`);
        done();
      });

      verify(apiServiceMock.post(anything(), anything())).never();
    });

    it("should create a new private user when 'createUser' is called with type 'PrivateCustomer'", done => {
      when(apiServiceMock.post(anyString(), anything())).thenReturn(of({}));

      const payload = {
        customer: { customerNo: '4711', type: 'PrivateCustomer' } as Customer,
        address: {} as Address,
        credentials: {} as Credentials,
        user: {} as User,
      } as CustomerRegistrationType;

      userService.createUser(payload).subscribe(() => {
        verify(apiServiceMock.post('customers', anything())).once();
        done();
      });
    });
  });

  describe('Update a user', () => {
    it('should return an error when called with undefined', done => {
      when(apiServiceMock.put(anything(), anything())).thenReturn(of({}));

      userService.updateUser(undefined).subscribe(fail, err => {
        expect(err).toMatchInlineSnapshot(`"updateUser() called without required body data"`);
        done();
      });

      verify(apiServiceMock.put(anything(), anything())).never();
    });

    it("should update a private user when 'updateUser' is called with type 'PrivateCustomer'", done => {
      when(apiServiceMock.put(anyString(), anything())).thenReturn(of({}));

      const payload = {
        customer: { customerNo: '4711', type: 'PrivateCustomer' } as Customer,
        user: {} as User,
      } as CustomerUserType;

      userService.updateUser(payload).subscribe(() => {
        verify(apiServiceMock.put('customers/-', anything())).once();
        done();
      });
    });

    it("should update a business user when 'updateUser' is called with type 'SMBCustomer'", done => {
      when(apiServiceMock.put(anyString(), anything())).thenReturn(of({}));

      const payload = {
        customer: { customerNo: '4711', type: 'SMBCustomer' } as Customer,
        user: {} as User,
      } as CustomerUserType;

      userService.updateUser(payload).subscribe(() => {
        verify(apiServiceMock.put('customers/-/users/-', anything())).once();
        done();
      });
    });
  });

  describe('Update a user password', () => {
    it('should return an error when called and the customer parameter is missing', done => {
      userService.updateUserPassword(undefined, undefined, '123', '1234').subscribe(fail, err => {
        expect(err).toMatchInlineSnapshot(`"updateUserPassword() called without customer"`);
        done();
      });

      verify(apiServiceMock.put(anything(), anything())).never();
    });

    it('should return an error when called and the password parameter is missing', done => {
      userService.updateUserPassword({} as Customer, {} as User, '', '').subscribe(fail, err => {
        expect(err).toMatchInlineSnapshot(`"updateUserPassword() called without password"`);
        done();
      });

      verify(apiServiceMock.put(anything(), anything())).never();
    });

    it("should update a password of a private user when 'updateUserPassword' is called with type 'PrivateCustomer'", done => {
      when(apiServiceMock.put(anyString(), anything())).thenReturn(of({}));

      const customer = { customerNo: '4711', type: 'PrivateCustomer' } as Customer;
      const user = { email: 'foo@foo.bar' } as User;

      userService.updateUserPassword(customer, user, '123', '1234').subscribe(() => {
        verify(apiServiceMock.put('customers/-/credentials/password', anything())).once();
        done();
      });
    });

    it("should update a password of a business user when 'updateUser' is called with type 'SMBCustomer'", done => {
      when(apiServiceMock.put(anyString(), anything())).thenReturn(of({}));

      const customer = { customerNo: '4711', type: 'SMBCustomer' } as Customer;
      const user = { email: 'foo@foo.bar' } as User;

      userService.updateUserPassword(customer, user, '123', '1234').subscribe(() => {
        verify(apiServiceMock.put('customers/-/users/-/credentials/password', anything())).once();
        done();
      });
    });
  });

  describe('Updates a customer', () => {
    it('should return an error when called and the customer parameter is missing', done => {
      when(apiServiceMock.put(anything(), anything())).thenReturn(of({}));

      userService.updateCustomer(undefined).subscribe(fail, err => {
        expect(err).toMatchInlineSnapshot(`"updateCustomer() called without customer"`);
        done();
      });

      verify(apiServiceMock.put(anything(), anything())).never();
    });

    it('should return an error when called for a private customer', done => {
      when(apiServiceMock.put(anything(), anything())).thenReturn(of({}));

      userService.updateCustomer({ isBusinessCustomer: false } as Customer).subscribe(fail, err => {
        expect(err).toMatchInlineSnapshot(`"updateCustomer() cannot be called for a private customer)"`);
        done();
      });

      verify(apiServiceMock.put(anything(), anything())).never();
    });

    it("should update the business customer when 'updateCustomer' is called with type 'SMBCustomer'", done => {
      when(apiServiceMock.put(anyString(), anything())).thenReturn(of({}));

      const customer = {
        customerNo: '4711',
        companyName: 'xyz',
        type: 'SMBCustomer',
        isBusinessCustomer: true,
      } as Customer;

      userService.updateCustomer(customer).subscribe(() => {
        verify(apiServiceMock.put('customers/-', anything())).once();
        done();
      });
    });
  });

  it("should get company user data when 'getCompanyUserData' is called", done => {
    const userData = {
      firstName: 'patricia',
    } as User;

    when(apiServiceMock.get('customers/-/users/-')).thenReturn(of(userData));

    userService.getCompanyUserData().subscribe(data => {
      expect(data.firstName).toEqual(userData.firstName);
      verify(apiServiceMock.get('customers/-/users/-')).once();
      done();
    });
  });
});
