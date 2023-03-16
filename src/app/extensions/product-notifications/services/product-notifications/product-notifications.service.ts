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
   * @param productNotification       The product notification.
   * @returns                         The created product notification.
   */
  createProductNotification(productNotification: ProductNotification) {
    if (!productNotification) {
      return throwError(() => new Error('createProductNotification() called without notification'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post(
            customer.isBusinessCustomer
              ? `customers/${customer.customerNo}/users/-/notifications/${productNotification.type}`
              : `privatecustomers/-/notifications/${productNotification.type}`,
            productNotification
          )
          .pipe(
            this.apiService.resolveLink<ProductNotificationData>(),
            map(notificationData => ProductNotificationMapper.fromData(notificationData, productNotification.type))
          )
      )
    );
  }

  /**
   * Updates a product notification for a given product and user.
   *
   * @param sku                       The product sku.
   * @param productNotification       The product notification.
   * @returns                         The updated product notification.
   */
  updateProductNotification(sku: string, productNotification: ProductNotification) {
    if (!sku) {
      return throwError(() => new Error('updateProductNotification() called without sku'));
    }
    if (!productNotification) {
      return throwError(() => new Error('updateProductNotification() called without notification'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .put(
            customer.isBusinessCustomer
              ? `customers/${customer.customerNo}/users/-/notifications/${productNotification.type}/${sku}`
              : `privatecustomers/-/notifications/${productNotification.type}/${sku}`,
            productNotification
          )
          .pipe(
            map((response: ProductNotification) =>
              ProductNotificationMapper.fromData(response, productNotification.type)
            )
          )
      )
    );
  }

  /**
   * Deletes a product notification for a given product and user.
   *
   * @param sku                       The product sku.
   * @param productNotificationType   The type of the product notification.
   */
  deleteProductNotification(sku: string, productNotificationType: ProductNotificationType) {
    if (!sku) {
      return throwError(() => new Error('deleteProductNotification() called without sku'));
    }
    if (!productNotificationType) {
      return throwError(() => new Error('deleteProductNotification() called without type'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.delete(
          customer.isBusinessCustomer
            ? `customers/${customer.customerNo}/users/-/notifications/${productNotificationType}/${sku}`
            : `privatecustomers/-/notifications/${productNotificationType}/${sku}`
        )
      )
    );
  }
}
