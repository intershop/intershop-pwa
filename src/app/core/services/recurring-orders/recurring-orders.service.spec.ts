import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';

import { RecurringOrdersService } from './recurring-orders.service';

describe('Recurring Orders Service', () => {
  let recurringOrdersService: RecurringOrdersService;
  let apiServiceMock: ApiService;
  let store$: MockStore;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);

    when(apiServiceMock.encodeResourceId(anything())).thenCall(id => id);

    when(apiServiceMock.get(anything(), anything())).thenReturn(
      of({
        data: [
          {
            id: '1',
            startDate: '2023-01-01',
            buyer: {
              costumerNo: '4711',
              firstName: 'Bernhard',
              lastName: 'Boldner',
              login: 'bboldner',
            },
            totalGross: {},
            totalNet: {},
          },
        ],
      })
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
            {
              selector: getLoggedInUser,
              value: {
                login: 'bboldner',
              } as User,
            },
          ],
        }),
      ],
    });
    recurringOrdersService = TestBed.inject(RecurringOrdersService);
    store$ = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(recurringOrdersService).toBeTruthy();
  });

  describe('getRecurringOrders', () => {
    it('should call apiService.get with the correct URL for business customers', done => {
      recurringOrdersService.getRecurringOrders('MY').subscribe(() => {
        verify(apiServiceMock.get('customers/4711/users/bboldner/recurringorders', anything())).once();
        done();
      });
    });

    it('should call apiService.get with the correct URL for private customers', done => {
      store$.overrideSelector(getLoggedInCustomer, { customerNo: '4711', isBusinessCustomer: false } as Customer);
      store$.refreshState();

      recurringOrdersService.getRecurringOrders('MY').subscribe(() => {
        verify(apiServiceMock.get('privatecustomers/4711/recurringorders', anything())).once();
        done();
      });
    });

    it('should return recurring orders', done => {
      recurringOrdersService.getRecurringOrders('MY').subscribe(orders => {
        expect(orders).toBeTruthy();
        expect(orders).toHaveLength(1);
        expect(orders[0].recurrence.startDate).toBe('2023-01-01');
        done();
      });
    });
  });

  describe('getRecurringOrder', () => {
    it('should call apiService.get with the correct URL for a specific recurring order', done => {
      recurringOrdersService.getRecurringOrder('1', 'MY').subscribe(() => {
        verify(apiServiceMock.get('customers/4711/users/bboldner/recurringorders/1', anything())).once();
        done();
      });
    });

    it('should return a specific recurring order', done => {
      when(apiServiceMock.get(anything(), anything())).thenReturn(
        of({
          data: { id: '1' },
        })
      );

      recurringOrdersService.getRecurringOrder('1', 'MY').subscribe(order => {
        expect(order).toBeTruthy();
        expect(order.id).toBe('1');
        done();
      });
    });
  });

  describe('updateRecurringOrder', () => {
    it('should return an error when called without a id', done => {
      when(apiServiceMock.patch(anything(), anything())).thenReturn(of({}));

      recurringOrdersService.updateRecurringOrder(undefined, true, 'MY').subscribe({
        next: fail,
        error: err => {
          expect(err).toMatchInlineSnapshot(`[Error: updateRecurringOrder() called without recurringOrderId]`);
          done();
        },
      });
      verify(apiServiceMock.patch(anything(), anything())).never();
    });

    it('should call apiService.patch with the correct URL and payload', done => {
      when(apiServiceMock.patch(anything(), anything(), anything())).thenReturn(of({ data: undefined }));

      recurringOrdersService.updateRecurringOrder('1', false, 'MY').subscribe(() => {
        verify(apiServiceMock.patch('customers/4711/users/bboldner/recurringorders/1', anything(), anything())).once();
        expect(capture(apiServiceMock.patch).last()[1]).toEqual({ active: false });
        done();
      });
    });
  });

  describe('deleteRecurringOrder', () => {
    it('should return an error when called without a id', done => {
      when(apiServiceMock.delete(anything(), anything())).thenReturn(of({}));

      recurringOrdersService.deleteRecurringOrder(undefined, 'MY').subscribe({
        next: fail,
        error: err => {
          expect(err).toMatchInlineSnapshot(`[Error: deleteRecurringOrder() called without recurringOrderId]`);
          done();
        },
      });

      verify(apiServiceMock.delete(anything(), anything())).never();
    });

    it('should call apiService.delete with the correct URL', done => {
      when(apiServiceMock.delete(anything(), anything())).thenReturn(of({}));

      recurringOrdersService.deleteRecurringOrder('1', 'MY').subscribe(() => {
        verify(apiServiceMock.delete('customers/4711/users/bboldner/recurringorders/1', anything())).once();
        done();
      });
    });
  });
});
