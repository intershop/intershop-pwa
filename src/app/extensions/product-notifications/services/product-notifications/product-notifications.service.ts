import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, switchMap, take } from 'rxjs';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { ProductNotificationData } from '../../models/product-notification/product-notification.interface';
import { ProductNotificationMapper } from '../../models/product-notification/product-notification.mapper';
import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';

@Injectable({ providedIn: 'root' })
export class ProductNotificationsService {
  constructor(private apiService: ApiService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  /**
   * Get all product notifications of a specific type from a customer.
   *
   * @param notificationType  The type of the product notifications.
   *                          Possible types are 'price' (a specific product price is reached) and 'stock' (product is back in stock)
   * @returns                 All product notifications of a specific type from the customer.
   */
  getProductNotifications(notificationType: ProductNotificationType): Observable<ProductNotification[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get(
            customer.isBusinessCustomer
              ? `customers/${customer.customerNo}/users/-/notifications/${notificationType}`
              : `users/-/notifications/${notificationType}`
          )
          .pipe(
            unpackEnvelope<Link>(),
            this.apiService.resolveLinks<ProductNotificationData>(),
            map(data =>
              data.map(notificationData => ProductNotificationMapper.fromData(notificationData, notificationType))
            )
          )
      )
    );
  }
}
