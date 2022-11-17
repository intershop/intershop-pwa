import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ProductNotificationType } from '../models/product-notification/product-notification.model';
import {
  getProductNotificationsByType,
  getProductNotificationsError,
  getProductNotificationsLoading,
  loadProductNotifications,
} from '../store/product-notification';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class ProductNotificationsFacade {
  constructor(private store: Store) {}

  productNotifications$(type: ProductNotificationType) {
    this.store.dispatch(loadProductNotifications({ type }));
    return this.store.pipe(select(getProductNotificationsByType(type)));
  }

  productNotificationsLoading$: Observable<boolean> = this.store.pipe(select(getProductNotificationsLoading));
  productNotificationsError$: Observable<HttpError> = this.store.pipe(select(getProductNotificationsError));
}
