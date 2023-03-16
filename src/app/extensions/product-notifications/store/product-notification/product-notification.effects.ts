import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, mergeMap, switchMap } from 'rxjs';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { ProductNotificationsService } from '../../services/product-notifications/product-notifications.service';

import { productNotificationsActions, productNotificationsApiActions } from './product-notification.actions';

@Injectable()
export class ProductNotificationEffects {
  constructor(private actions$: Actions, private productNotificationsService: ProductNotificationsService) {}

  loadProductNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productNotificationsActions.loadProductNotifications),
      mapToPayloadProperty('type'),
      switchMap(type =>
        this.productNotificationsService.getProductNotifications(type).pipe(
          map(productNotifications =>
            productNotificationsApiActions.loadProductNotificationsSuccess({ productNotifications, type })
          ),
          mapErrorToAction(productNotificationsApiActions.loadProductNotificationsFail)
        )
      )
    )
  );

  createProductNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productNotificationsActions.createProductNotification),
      mapToPayload(),
      whenTruthy(),
      mergeMap(payload =>
        this.productNotificationsService.createProductNotification(payload.productNotification).pipe(
          mergeMap(productNotification => [
            productNotificationsApiActions.createProductNotificationSuccess({ productNotification }),
            displaySuccessMessage({
              message: 'product.notification.create.success.message',
            }),
          ]),
          mapErrorToAction(productNotificationsApiActions.createProductNotificationFail)
        )
      )
    )
  );

  updateProductNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productNotificationsActions.updateProductNotification),
      mapToPayload(),
      whenTruthy(),
      concatMap(payload =>
        this.productNotificationsService.updateProductNotification(payload.sku, payload.productNotification).pipe(
          mergeMap(productNotification => [
            productNotificationsApiActions.updateProductNotificationSuccess({ productNotification }),
            displaySuccessMessage({
              message: 'product.notification.update.success.message',
            }),
          ]),
          mapErrorToAction(productNotificationsApiActions.updateProductNotificationFail)
        )
      )
    )
  );

  deleteProductNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productNotificationsActions.deleteProductNotification),
      mapToPayload(),
      mergeMap(payload =>
        this.productNotificationsService.deleteProductNotification(payload.sku, payload.productNotificationType).pipe(
          mergeMap(() => [
            productNotificationsApiActions.deleteProductNotificationSuccess({
              productNotificationId: payload.productNotificationId,
            }),
            displaySuccessMessage({
              message: 'product.notification.delete.success.message',
            }),
          ]),
          mapErrorToAction(productNotificationsApiActions.deleteProductNotificationFail)
        )
      )
    )
  );

  displayProductNotificationErrorMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        productNotificationsApiActions.loadProductNotificationsFail,
        productNotificationsApiActions.createProductNotificationFail,
        productNotificationsApiActions.deleteProductNotificationFail
      ),
      mapToPayloadProperty('error'),
      map(error =>
        displayErrorMessage({
          message: error.message,
        })
      )
    )
  );
}
