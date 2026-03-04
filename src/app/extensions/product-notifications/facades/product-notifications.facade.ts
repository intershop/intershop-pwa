import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { Observable, distinctUntilChanged, map, switchMap } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { selectRouteParam } from 'ish-core/store/core/router';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

import {
  ProductNotification,
  ProductNotificationType,
} from '../models/product-notification/product-notification.model';
import {
  getProductNotificationBySku,
  getProductNotificationsByType,
  getProductNotificationsError,
  getProductNotificationsLoading,
  productNotificationsActions,
} from '../store/product-notification';

@Injectable({ providedIn: 'root' })
export class ProductNotificationsFacade {
  private moduleLoader = inject(ModuleLoaderService);

  constructor(private store: Store) {}

  private productNotifications$(type: ProductNotificationType) {
    return this.moduleLoader.whenLoaded('productNotifications', () => {
      this.store.dispatch(productNotificationsActions.loadProductNotifications({ type }));
      return this.store.pipe(select(getProductNotificationsByType(type)));
    });
  }

  // get a product notification by sku and the type
  productNotificationBySku$(sku: string, type: ProductNotificationType) {
    return this.moduleLoader.whenLoaded('productNotifications', () => {
      this.store.dispatch(productNotificationsActions.loadProductNotifications({ type }));

      return this.store.pipe(select(getProductNotificationBySku(sku, type))).pipe(
        map(notifications => (notifications?.length ? notifications[0] : undefined)),
        distinctUntilChanged(isEqual)
      );
    });
  }

  // create a product notification
  createProductNotification(productNotification: ProductNotification) {
    void this.moduleLoader.ensureLoaded('productNotifications').then(() =>
      this.store.dispatch(productNotificationsActions.createProductNotification({ productNotification }))
    );
  }

  // update a product notification
  updateProductNotification(sku: string, productNotification: ProductNotification) {
    void this.moduleLoader.ensureLoaded('productNotifications').then(() =>
      this.store.dispatch(productNotificationsActions.updateProductNotification({ sku, productNotification }))
    );
  }

  // delete a product notification
  deleteProductNotification(
    sku: string,
    productNotificationType: ProductNotificationType,
    productNotificationId: string
  ) {
    void this.moduleLoader.ensureLoaded('productNotifications').then(() =>
      this.store.dispatch(
        productNotificationsActions.deleteProductNotification({ sku, productNotificationType, productNotificationId })
      )
    );
  }

  productNotificationsLoading$: Observable<boolean> = this.moduleLoader.whenLoaded('productNotifications', () =>
    this.store.pipe(select(getProductNotificationsLoading))
  );
  productNotificationsError$: Observable<HttpError> = this.moduleLoader.whenLoaded('productNotifications', () =>
    this.store.pipe(select(getProductNotificationsError))
  );

  productNotificationType$ = this.store.pipe(
    select(selectRouteParam('notificationType')),
    distinctUntilChanged(),
    map(type => type || 'price')
  );

  productNotificationsByRoute$ = this.productNotificationType$.pipe(
    switchMap(type => this.productNotifications$(type as ProductNotificationType))
  );
}
