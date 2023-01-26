import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, mergeMap } from 'rxjs';

import { log } from 'ish-core/utils/dev/operators';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { ProductNotificationsService } from '../../services/product-notifications/product-notifications.service';

import {
  createProductNotification,
  createProductNotificationFail,
  createProductNotificationSuccess,
  deleteProductNotification,
  deleteProductNotificationFail,
  deleteProductNotificationSuccess,
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

  createProductNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createProductNotification),
        log('effect'),
        mapToPayload(),
        log('payload'),
        whenTruthy(),
        mergeMap(payload =>
          this.productNotificationsService
            .createProductNotification(
              payload.sku,
              payload.type,
              payload.notificationMailAddress,
              payload.price,
              payload.currency
            )
            .pipe(
              map(productNotifications => createProductNotificationSuccess(undefined)),
              mapErrorToAction(createProductNotificationFail)
            )
        )
      ),
    { dispatch: false }
  );

  deleteProductNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteProductNotification),
        log('effect'),
        mapToPayload(),
        log('payload'),
        whenTruthy(),
        mergeMap(payload =>
          this.productNotificationsService.deleteProductNotification(payload.sku, payload.type).pipe(
            map(productNotifications => deleteProductNotificationSuccess(undefined)),
            mapErrorToAction(deleteProductNotificationFail)
          )
        )
      ),
    { dispatch: false }
  );
}
