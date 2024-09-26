import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, filter, map, switchMap, take, throwError } from 'rxjs';

import { RecurringOrderData, RecurringOrderListData } from 'ish-core/models/recurring-order/recurring-order.interface';
import { RecurringOrderMapper } from 'ish-core/models/recurring-order/recurring-order.mapper';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';

/**
 * The Recurring Orders Service handles the interaction with the REST API concerning recurring orders.
 */
@Injectable({ providedIn: 'root' })
export class RecurringOrdersService {
  constructor(private apiService: ApiService, private store: Store) {}

  private recurringOrderHeaderV2 = new HttpHeaders({ Accept: 'application/vnd.intershop.recurringorder.v2+json' });

  private currentCustomerAndUser$ = combineLatest([
    this.store.pipe(select(getLoggedInCustomer)),
    this.store.pipe(select(getLoggedInUser)),
  ]).pipe(
    filter(([customer, user]) => !!customer && !!user),
    take(1)
  );

  /**
   * Returns the REST API endpoint for recurring orders of the customer or the logged-in user.
   *
   * @param context  This value decides whether the recurring orders of the customer or the logged-in user are returned.
   *                 In case of a business customer and the context 'ADMIN' the endpoint for the customer, otherwise the endpoint of the logged-in user (B2B/ B2C) is returned.
   * @returns        The endpoint for the recurring orders.
   */
  // TODO: move into api.service ???
  private getRecurringOrdersEndpoint(context?: string) {
    return this.currentCustomerAndUser$.pipe(
      map(([customer, user]) => {
        let apiEndpoint: string = undefined;
        if (customer.isBusinessCustomer) {
          if (context === 'ADMIN') {
            apiEndpoint = `customers/${this.apiService.encodeResourceId(customer.customerNo)}/recurringorders`;
            // admin users could request user specific recurring orders - not used in UI yet
            // } else if (context) {
            //   apiEndpoint = `customers/${this.apiService.encodeResourceId(
            //     customer.customerNo
            //   )}/users/${this.apiService.encodeResourceId(context)}/recurringorders`;
          } else {
            apiEndpoint = `customers/${this.apiService.encodeResourceId(
              customer.customerNo
            )}/users/${this.apiService.encodeResourceId(user.login)}/recurringorders`;
          }
        } else {
          apiEndpoint = `privatecustomers/${this.apiService.encodeResourceId(customer.customerNo)}/recurringorders`;
        }
        return apiEndpoint;
      })
    );
  }

  /**
   * Get all recurring orders of the customer or the logged-in user.
   *
   * @param context  This value decides whether the recurring orders of the customer or the logged-in user are returned.
   * @returns        A list of recurring orders.
   */
  getRecurringOrders(context?: string) {
    return this.getRecurringOrdersEndpoint(context).pipe(
      switchMap(apiEndpoint =>
        this.apiService.get(apiEndpoint, { headers: this.recurringOrderHeaderV2 }).pipe(
          unpackEnvelope<RecurringOrderListData>('data'),
          map(data => RecurringOrderMapper.fromListData(data))
        )
      )
    );
  }

  /**
   * Get a specific recurring order .
   *
   * @param recurringOrderId  The ID of the recurring order.
   * @param context           The value indicates whether the recurring order that should be searched for is an order of the customer or the logged-in user.
   * @returns                 The recurring order.
   */
  getRecurringOrder(recurringOrderId: string, context?: string) {
    return this.getRecurringOrdersEndpoint(context).pipe(
      switchMap(apiEndpoint =>
        this.apiService
          .get<{ data: RecurringOrderData }>(`${apiEndpoint}/${this.apiService.encodeResourceId(recurringOrderId)}`, {
            headers: this.recurringOrderHeaderV2,
          })
          .pipe(map(data => RecurringOrderMapper.fromData(data.data)))
      )
    );
  }

  /**
   * Updates a recurring order.
   *
   * @param recurringOrderId  The recurring order id.
   * @param context           The value indicates whether the recurring order that should be updated is an order of the customer or the logged-in user.
   * @returns                 The updated recurring order.
   */
  updateRecurringOrder(recurringOrderId: string, active: boolean, context?: string) {
    if (!recurringOrderId) {
      return throwError(() => new Error('updateRecurringOrder() called without recurringOrderId'));
    }

    return this.getRecurringOrdersEndpoint(context).pipe(
      switchMap(apiEndpoint =>
        this.apiService
          .patch<{ data: RecurringOrderData }>(
            `${apiEndpoint}/${this.apiService.encodeResourceId(recurringOrderId)}`,
            { active },
            { headers: this.recurringOrderHeaderV2 }
          )
          .pipe(map(data => RecurringOrderMapper.fromData(data.data)))
      )
    );
  }

  /**
   * Deletes a recurring order
   * @param recurringOrderId  The recurring order id.
   * @param context           The value indicates whether the recurring order that should be deleted is an order of the customer or the logged-in user.
   */
  deleteRecurringOrder(recurringOrderId: string, context?: string) {
    if (!recurringOrderId) {
      return throwError(() => new Error('deleteRecurringOrder() called without recurringOrderId'));
    }

    return this.getRecurringOrdersEndpoint(context).pipe(
      switchMap(apiEndpoint =>
        this.apiService.delete(`${apiEndpoint}/${this.apiService.encodeResourceId(recurringOrderId)}`, {
          headers: this.recurringOrderHeaderV2,
        })
      )
    );
  }
}
