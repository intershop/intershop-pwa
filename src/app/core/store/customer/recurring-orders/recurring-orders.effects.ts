import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { concatMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { RecurringOrdersService } from 'ish-core/services/recurring-orders/recurring-orders.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectQueryParam, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { recurringOrdersActions, recurringOrdersApiActions } from './recurring-orders.actions';
import { getRecurringOrder, getSelectedRecurringOrder } from './recurring-orders.selectors';

@Injectable()
export class RecurringOrdersEffects {
  constructor(
    private actions$: Actions,
    private recurringOrdersService: RecurringOrdersService,
    private store: Store,
    private translateService: TranslateService
  ) {}

  loadRecurringOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recurringOrdersActions.loadRecurringOrders),
      mapToPayloadProperty('context'),
      concatMap(context =>
        this.recurringOrdersService.getRecurringOrders(context).pipe(
          map(recurringOrders => recurringOrdersApiActions.loadRecurringOrdersSuccess({ recurringOrders, context })),
          mapErrorToAction(recurringOrdersApiActions.loadRecurringOrdersFail)
        )
      )
    )
  );

  loadRecurringOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recurringOrdersActions.loadRecurringOrder),
      mapToPayloadProperty('recurringOrderId'),
      concatLatestFrom(() => this.store.pipe(select(selectQueryParam('context')))),
      switchMap(([recurringOrderId, context]) =>
        this.recurringOrdersService.getRecurringOrder(recurringOrderId, context).pipe(
          map(recurringOrder => recurringOrdersApiActions.loadRecurringOrderSuccess({ recurringOrder })),
          mapErrorToAction(recurringOrdersApiActions.loadRecurringOrderFail)
        )
      )
    )
  );

  triggerLoadRecurringOrder$ = createEffect(() =>
    merge(
      this.store.pipe(select(selectRouteParam('recurringOrderId'))),
      this.store.pipe(select(selectQueryParam('recurringOrderId')))
    ).pipe(
      whenTruthy(),
      map(recurringOrderId => recurringOrdersActions.loadRecurringOrder({ recurringOrderId }))
    )
  );

  updateRecurringOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recurringOrdersActions.updateRecurringOrder),
      mapToPayload(),
      whenTruthy(),
      concatLatestFrom(payload => this.store.pipe(select(getRecurringOrder(payload.recurringOrderId)))),
      concatLatestFrom(() => this.store.pipe(select(selectQueryParam('context')))),
      mergeMap(([[payload, recurringOrder], context]) => {
        if (payload.active !== recurringOrder.active) {
          return this.recurringOrdersService
            .updateRecurringOrder(payload.recurringOrderId, payload.active, context)
            .pipe(
              mergeMap(recurringOrder => [recurringOrdersApiActions.updateRecurringOrderSuccess({ recurringOrder })]),
              mapErrorToAction(recurringOrdersApiActions.updateRecurringOrderFail)
            );
        } else {
          return [recurringOrdersApiActions.updateRecurringOrderSuccess({ recurringOrder })];
        }
      })
    )
  );

  deleteRecurringOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recurringOrdersActions.deleteRecurringOrder),
      mapToPayloadProperty('recurringOrderId'),
      concatLatestFrom(() => this.store.pipe(select(selectQueryParam('context')))),
      mergeMap(([recurringOrderId, context]) =>
        this.recurringOrdersService.deleteRecurringOrder(recurringOrderId, context).pipe(
          mergeMap(() => [
            recurringOrdersApiActions.deleteRecurringOrderSuccess({ recurringOrderId }),
            displaySuccessMessage({
              message: 'account.recurring_order.delete.confirmation',
            }),
          ]),
          mapErrorToAction(recurringOrdersApiActions.deleteRecurringOrderFail)
        )
      )
    )
  );

  setRecurringOrderBreadcrumb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMap(() =>
        this.store.pipe(
          ofUrl(/^\/account\/recurring-orders\/.*/),
          select(getSelectedRecurringOrder),
          whenTruthy(),
          concatLatestFrom(() => this.store.pipe(select(selectQueryParam('context')))),
          map(([recurringOrder, context]) =>
            setBreadcrumbData({
              breadcrumbData: [
                {
                  key: 'account.recurring_orders.breadcrumb',
                  link: '/account/recurring-orders',
                  linkParams: { context },
                },
                {
                  text: `${this.translateService.instant('account.recurring_order.details.breadcrumb')} - ${
                    recurringOrder.documentNo
                  }`,
                },
              ],
            })
          )
        )
      )
    )
  );
}
