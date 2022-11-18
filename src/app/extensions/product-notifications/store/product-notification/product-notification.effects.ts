import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

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
      mapToPayloadProperty('type'),
      concatMap(type =>
        this.productNotificationsService.getProductNotifications(type).pipe(
          map(productNotifications => loadProductNotificationsSuccess({ productNotifications })),
          mapErrorToAction(loadProductNotificationsFail)
        )
      )
    )
  );
}
