import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, switchMap, take, throwError } from 'rxjs';

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
              : `privatecustomers/-/notifications/${notificationType}`
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

  /**
   * Creates a product notification for a given product and user.
   *
   * @param sku                       The product sku.
   * @param notificationType          The type of the notification.
   * @param notificationMailAddress   The email of the notification.
   * @param price                     Optional: The price of the notification.
   * @param currency                  Optional: The price currency.
   * @returns                         The created product notification.
   */
  createProductNotification(
    sku: string,
    notificationType: ProductNotificationType,
    notificationMailAddress: string,
    price?: number,
    currency?: string
  ) {
    if (!sku) {
      return throwError(() => new Error('createProductNotification() called without sku'));
    }
    if (!notificationType) {
      return throwError(() => new Error('createProductNotification() called without notificationType'));
    }
    if (!notificationMailAddress) {
      return throwError(() => new Error('createProductNotification() called without notificationMailAddress'));
    }

    // if no price is passed, the body should not include it
    const notificationBody =
      price === undefined
        ? {
            sku,
            notificationMailAddress,
          }
        : {
            sku,
            notificationMailAddress,
            price: {
              value: price,
              currency,
            },
          };

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post(
            customer.isBusinessCustomer
              ? `customers/${customer.customerNo}/users/-/notifications/${notificationType}`
              : `privatecustomers/-/notifications/${notificationType}`,
            notificationBody
          )
          .pipe(
            this.apiService.resolveLink<ProductNotificationData>()
            // map(data =>
            //   data.map(notificationData => ProductNotificationMapper.fromData(notificationData, notificationType))
            // )
          )
      )
    );
  }

  /**
   * Deletes a product notification for a given product and user.
   *
   * @param sku                       The product sku.
   * @param notificationType          The type of the notification.
   * @returns                         The deleted product notification.
   */
  deleteProductNotification(sku: string, notificationType: ProductNotificationType) {
    if (!sku) {
      return throwError(() => new Error('deleteProductNotification() called without sku'));
    }
    if (!notificationType) {
      return throwError(() => new Error('deleteProductNotification() called without notificationType'));
    }

    return this.currentCustomer$.pipe(
      switchMap(
        customer =>
          this.apiService.delete(
            customer.isBusinessCustomer
              ? `customers/${customer.customerNo}/users/-/notifications/${notificationType}/${sku}`
              : `privatecustomers/-/notifications/${notificationType}/${sku}`
          )
        // .pipe(
        //   log(),
        //   this.apiService.resolveLink<ProductNotificationData>()
        //   map(data =>
        //     data.map(notificationData => ProductNotificationMapper.fromData(notificationData, notificationType))
        //   )
        // )
      )
    );
  }
}
