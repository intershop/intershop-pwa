import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { Observable, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { selectRouteParam } from 'ish-core/store/core/router';

import {
  ProductNotification,
  ProductNotificationType,
} from '../models/product-notification/product-notification.model';
import {
  getProductNotificationBySku,
  getProductNotificationsByType,
  getProductNotificationsError,
  getProductNotificationsLoading,
  loadProductNotifications,
} from '../store/product-notification';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class ProductNotificationsFacade {
  constructor(private store: Store) {}

  private productNotifications$(type: ProductNotificationType) {
    this.store.dispatch(loadProductNotifications({ type }));
    return this.store.pipe(select(getProductNotificationsByType(type)));
  }

  // TODO: remove mock data and get real product notification
  productNotification$(): Observable<ProductNotification> {
    // return of({
    //   id: '1',
    //   type: 'stock',
    //   sku: '12345',
    //   notificationMailAddress: 'bboldner@test.intershop.de',
    // });

    return of(undefined);
  }

  productNotificationBySku$(sku: string, type: ProductNotificationType) {
    this.store.dispatch(loadProductNotifications({ type }));

    return this.store.pipe(select(getProductNotificationBySku(sku, type))).pipe(
      map(notifications => (notifications?.length ? notifications[0] : undefined)),
      distinctUntilChanged(isEqual)
    );
  }

  productNotificationsLoading$: Observable<boolean> = this.store.pipe(select(getProductNotificationsLoading));
  productNotificationsError$: Observable<HttpError> = this.store.pipe(select(getProductNotificationsError));

  productNotificationsByRoute$ = this.store
    .pipe(
      select(selectRouteParam('notificationType')),
      distinctUntilChanged(),
      map(type => type || 'price')
    )
    .pipe(switchMap(type => this.productNotifications$(type as ProductNotificationType)));
}
