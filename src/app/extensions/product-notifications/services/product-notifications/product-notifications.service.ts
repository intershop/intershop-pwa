import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, switchMap, take } from 'rxjs';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { ProductNotification } from '../../models/product-notification/product-notification.model';

@Injectable({ providedIn: 'root' })
export class ProductNotificationsService {
  constructor(private apiService: ApiService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  getProductNotifications$(): Observable<ProductNotification[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get(
            customer.isBusinessCustomer
              ? `customers/${customer.customerNo}/users/-/notifications/stock`
              : `users/-/notifications/stock`
          )
          .pipe(unpackEnvelope<Link>(), this.apiService.resolveLinks<ProductNotification>())
      )
    );
  }
}
