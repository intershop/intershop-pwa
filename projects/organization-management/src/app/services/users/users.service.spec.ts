import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { B2bUser, CustomerB2bUserType } from '../../models/b2b-user/b2b-user.model';

import { UsersService } from './users.service';

describe('Users Service', () => {
  let apiService: ApiService;
  let usersService: UsersService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything())).thenReturn(of(true));
    when(apiService.resolveLinks()).thenReturn(() => of([]));
    when(apiService.delete(anything())).thenReturn(of(true));

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    usersService = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(usersService).toBeTruthy();
  });

  it('should call the getUsers of customer API when fetching users', done => {
    usersService.getUsers().subscribe(() => {
      verify(apiService.get(anything())).once();
      expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
        Array [
          "customers/-/users",
        ]
      `);
      done();
    });
  });

  it('should call the getUser of customer API when fetching user', done => {
    usersService.getUser('pmiller@test.intershop.de').subscribe(() => {
      verify(apiService.get(anything())).once();
      expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
      Array [
        "customers/-/users/pmiller@test.intershop.de",
      ]
    `);
      done();
    });
  });

  it('should call delete method of customer API when delete user', done => {
    usersService.deleteUser('pmiller@test.intershop.de').subscribe(() => {
      verify(apiService.delete(anything())).once();
      expect(capture(apiService.delete).last()).toMatchInlineSnapshot(`
        Array [
          "customers/-/users/pmiller@test.intershop.de",
        ]
      `);
      done();
    });
  });

  it('should call the addUser for creating a new b2b user', done => {
    when(apiService.post(anyString(), anything())).thenReturn(of({}));

    const payload = {
      customer: { customerNo: '4711', isBusinessCustomer: true } as Customer,
      user: { login: 'pmiller@test.intershop.de' } as B2bUser,
    } as CustomerB2bUserType;

    usersService.addUser(payload).subscribe(() => {
      verify(apiService.post(`customers/${payload.customer.customerNo}/users`, anything())).once();
      done();
    });
  });

  it('should call the opdateUser for updating a b2b user', done => {
    when(apiService.put(anyString(), anything())).thenReturn(of({}));

    const payload = {
      customer: { customerNo: '4711', isBusinessCustomer: true } as Customer,
      user: { login: 'pmiller@test.intershop.de' } as B2bUser,
    } as CustomerB2bUserType;

    usersService.updateUser(payload).subscribe(() => {
      verify(apiService.put(`customers/${payload.customer.customerNo}/users/${payload.user.login}`, anything())).once();
      done();
    });
  });
});
