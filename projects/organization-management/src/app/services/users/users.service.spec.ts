import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { B2bRoleData } from '../../models/b2b-role/b2b-role.interface';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { UserBudgets } from '../../models/user-budgets/user-budgets.model';

import { UsersService } from './users.service';

describe('Users Service', () => {
  let apiService: ApiService;
  let usersService: UsersService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything())).thenReturn(of({}));
    when(apiService.delete(anything())).thenReturn(of({}));
    when(apiService.post(anyString(), anything())).thenReturn(of({}));
    when(apiService.put(anyString(), anything())).thenReturn(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
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
          "customers/4711/users",
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
          "customers/4711/users/pmiller@test.intershop.de",
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
          "customers/4711/users/pmiller@test.intershop.de",
        ]
      `);
      done();
    });
  });

  it('should call the addUser for creating a new b2b user', done => {
    const user = { login: 'pmiller@test.intershop.de' } as B2bUser;

    usersService.addUser(user).subscribe(() => {
      verify(apiService.post(anything(), anything())).once();
      expect(capture(apiService.post).last()[0]).toMatchInlineSnapshot(`"customers/4711/users"`);
      done();
    });
  });

  it('should call the updateUser for updating a b2b user', done => {
    const user = { login: 'pmiller@test.intershop.de' } as B2bUser;

    usersService.updateUser(user).subscribe(() => {
      verify(apiService.put(anything(), anything())).once();
      expect(capture(apiService.put).last()[0]).toMatchInlineSnapshot(
        `"customers/4711/users/pmiller@test.intershop.de"`
      );
      done();
    });
  });

  it('should put the roles onto user when calling setUserRoles', done => {
    when(apiService.put(anyString(), anything())).thenReturn(of({ userRoles: [{ roleID: 'BUYER' }] as B2bRoleData[] }));

    usersService.setUserRoles('pmiller@test.intershop.de', []).subscribe(data => {
      expect(data).toMatchInlineSnapshot(`
        Array [
          "BUYER",
        ]
      `);
      verify(apiService.put(anything(), anything())).once();
      expect(capture(apiService.put).last()).toMatchInlineSnapshot(`
        Array [
          "customers/4711/users/pmiller@test.intershop.de/roles",
          Object {
            "userRoles": Array [],
          },
        ]
      `);
      done();
    });
  });

  it('should put the budgets onto user when calling setUserBudgets', done => {
    when(apiService.put(anyString(), anything())).thenReturn(of({}));

    usersService
      .setUserBudgets('pmiller@test.intershop.de', {
        orderSpentLimit: undefined,
        budget: { value: 2000, currency: 'USD' },
        budgetPeriod: 'monthly',
      } as UserBudgets)
      .subscribe(data => {
        expect(data).toMatchInlineSnapshot(`Object {}`);
        verify(apiService.put(anything(), anything())).once();
        expect(capture(apiService.put).last()).toMatchInlineSnapshot(`
          Array [
            "customers/4711/users/pmiller@test.intershop.de/budgets",
            Object {
              "budget": Object {
                "currency": "USD",
                "value": 2000,
              },
              "budgetPeriod": "monthly",
              "orderSpentLimit": undefined,
            },
          ]
        `);
        done();
      });
  });
});
