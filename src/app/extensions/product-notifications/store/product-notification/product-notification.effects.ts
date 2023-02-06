import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, mergeMap } from 'rxjs';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
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

  createProductNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProductNotification),
      mapToPayload(),
      whenTruthy(),
      mergeMap(payload =>
        this.productNotificationsService.createProductNotification(payload.productNotification).pipe(
          mergeMap(productNotification => [
            createProductNotificationSuccess({ productNotification }),
            displaySuccessMessage({
              message: 'product.notification.create.success.message',
            }),
          ]),
          mapErrorToAction(createProductNotificationFail)
        )
      )
    )
  );

  deleteProductNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProductNotification),
      mapToPayload(),
      mergeMap(payload =>
        this.productNotificationsService.deleteProductNotification(payload.sku, payload.productNotificationType).pipe(
          mergeMap(() => [
            deleteProductNotificationSuccess({ productNotificationId: payload.productNotificationId }),
            displaySuccessMessage({
              message: 'product.notification.delete.success.message',
            }),
          ]),
          mapErrorToAction(deleteProductNotificationFail)
        )
      )
    )
  );

  displayProductNotificationErrorMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductNotificationsFail, createProductNotificationFail, deleteProductNotificationFail),
      mapToPayloadProperty('error'),
      map(error =>
        displayErrorMessage({
          message: error.message,
        })
      )
    )
  );
}
