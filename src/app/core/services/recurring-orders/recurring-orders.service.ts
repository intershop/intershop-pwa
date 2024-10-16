import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, filter, map, switchMap, take, throwError } from 'rxjs';

import { RecurringOrderData, RecurringOrderListData } from 'ish-core/models/recurring-order/recurring-order.interface';
import { RecurringOrderMapper } from 'ish-core/models/recurring-order/recurring-order.mapper';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';

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
