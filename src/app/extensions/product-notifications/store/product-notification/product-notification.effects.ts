import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';

import { mapErrorToAction } from 'ish-core/utils/operators';

import { ProductNotificationsService } from '../../services/product-notifications/product-notifications.service';

import {
  loadProductNotifications,
  loadProductNotificationsFail,
  loadProductNotificationsSuccess,
} from './product-notification.actions';

@Injectable()
export class ProductNotificationEffects {
  constructor(private actions$: Actions, private productNotificationsService: ProductNotificationsService) {}

  loadProductNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductNotifications),
      switchMap(() =>
        this.productNotificationsService.getProductNotifications().pipe(
          map(productNotifications => loadProductNotificationsSuccess({ productNotifications })),
          mapErrorToAction(loadProductNotificationsFail)
        )
      )
    )
  );
}
