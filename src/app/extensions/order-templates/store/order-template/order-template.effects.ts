import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { pick } from 'lodash-es';
import { concatMap, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import {
  distinctCompareWith,
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import { OrderTemplate, OrderTemplateHeader } from '../../models/order-template/order-template.model';
import { OrderTemplateService } from '../../services/order-template/order-template.service';

import {
  addBasketToNewOrderTemplate,
  addBasketToNewOrderTemplateFail,
  addBasketToNewOrderTemplateSuccess,
  addProductsToNewOrderTemplate,
  addProductsToOrderTemplate,
  addProductsToOrderTemplateFail,
  addProductsToOrderTemplateSuccess,
  createOrderTemplate,
  createOrderTemplateFail,
  createOrderTemplateSuccess,
  deleteOrderTemplate,
  deleteOrderTemplateFail,
  deleteOrderTemplateSuccess,
  loadOrderTemplates,
  loadOrderTemplatesFail,
  loadOrderTemplatesSuccess,
  moveItemToOrderTemplate,
  removeItemFromOrderTemplate,
  removeItemFromOrderTemplateFail,
  removeItemFromOrderTemplateSuccess,
  selectOrderTemplate,
  updateOrderTemplate,
  updateOrderTemplateFail,
  updateOrderTemplateSuccess,
} from './order-template.actions';
import {
  getOrderTemplateDetails,
  getSelectedOrderTemplateDetails,
  getSelectedOrderTemplateId,
} from './order-template.selectors';

@Injectable()
export class OrderTemplateEffects {
  constructor(private actions$: Actions, private orderTemplateService: OrderTemplateService, private store: Store) {}

  loadOrderTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderTemplates),
      withLatestFrom(this.store.pipe(select(getUserAuthorized))),
      filter(([, authorized]) => authorized),
      switchMap(() =>
        this.orderTemplateService.getOrderTemplates().pipe(
          map(orderTemplates => loadOrderTemplatesSuccess({ orderTemplates })),
          mapErrorToAction(loadOrderTemplatesFail)
        )
      )
    )
  );

  createOrderTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderTemplate),
      mapToPayloadProperty('orderTemplate'),
      mergeMap((orderTemplateData: OrderTemplateHeader) =>
        this.orderTemplateService.createOrderTemplate(orderTemplateData).pipe(
          mergeMap(orderTemplate => [
            createOrderTemplateSuccess({ orderTemplate }),
            displaySuccessMessage({
              message: 'account.order_template.new_order_template.confirmation',
              messageParams: { 0: orderTemplate.title },
            }),
          ]),
          mapErrorToAction(createOrderTemplateFail)
        )
      )
    )
  );

  addBasketToNewOrderTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBasketToNewOrderTemplate),
      mapToPayload(),
      mergeMap(payload =>
        this.orderTemplateService
          .createOrderTemplate({
            title: payload.orderTemplate.title,
          })
          .pipe(
            withLatestFrom(this.store.pipe(select(getCurrentBasket))),
            // use created order template data to dispatch addProduct action
            concatMap(([orderTemplate, currentBasket]) =>
              this.orderTemplateService
                .addProductsToOrderTemplate(
                  orderTemplate.id,
                  currentBasket.lineItems.map(lineItem => ({
                    sku: lineItem.productSKU,
                    quantity: lineItem.quantity.value,
                  }))
                )
                .pipe(
                  concatMap(newOrderTemplate => [
                    addBasketToNewOrderTemplateSuccess({ orderTemplate: newOrderTemplate }),
                    displaySuccessMessage({
                      message: 'account.order_template.new_from_basket_confirm.heading',
                      messageParams: { 0: orderTemplate.title },
                    }),
                  ]),
                  mapErrorToAction(addBasketToNewOrderTemplateFail)
                )
            )
          )
      ),
      mapErrorToAction(createOrderTemplateFail)
    )
  );

  deleteOrderTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteOrderTemplate),
      mapToPayloadProperty('orderTemplateId'),
      mergeMap(orderTemplateId => this.store.pipe(select(getOrderTemplateDetails(orderTemplateId)))),
      whenTruthy(),
      map(orderTemplate => ({ orderTemplateId: orderTemplate.id, title: orderTemplate.title })),
      mergeMap(({ orderTemplateId, title }) =>
        this.orderTemplateService.deleteOrderTemplate(orderTemplateId).pipe(
          mergeMap(() => [
            deleteOrderTemplateSuccess({ orderTemplateId }),
            displaySuccessMessage({
              message: 'account.order_template.delete_order_template.confirmation',
              messageParams: { 0: title },
            }),
          ]),
          mapErrorToAction(deleteOrderTemplateFail)
        )
      )
    )
  );

  updateOrderTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateOrderTemplate),
      mapToPayloadProperty('orderTemplate'),
      mergeMap((newOrderTemplate: OrderTemplate) =>
        this.orderTemplateService.updateOrderTemplate(newOrderTemplate).pipe(
          mergeMap(orderTemplate => [
            updateOrderTemplateSuccess({ orderTemplate }),
            displaySuccessMessage({
              message: 'account.order_templates.edit.confirmation',
              messageParams: { 0: orderTemplate.title },
            }),
          ]),
          mapErrorToAction(updateOrderTemplateFail)
        )
      )
    )
  );

  addProductsToOrderTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductsToOrderTemplate),
      mapToPayload(),
      mergeMap(payload =>
        this.orderTemplateService.addProductsToOrderTemplate(payload.orderTemplateId, payload.items).pipe(
          map(orderTemplate => addProductsToOrderTemplateSuccess({ orderTemplate })),
          mapErrorToAction(addProductsToOrderTemplateFail)
        )
      )
    )
  );

  addProductsToNewOrderTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductsToNewOrderTemplate),
      mapToPayload(),
      mergeMap(payload =>
        this.orderTemplateService
          .createOrderTemplate({
            title: payload.title,
          })
          .pipe(
            // use created order template data to dispatch addProduct action
            mergeMap(orderTemplate => [
              createOrderTemplateSuccess({ orderTemplate }),
              addProductsToOrderTemplate({
                orderTemplateId: orderTemplate.id,
                items: payload.items,
              }),
              selectOrderTemplate({ id: orderTemplate.id }),
            ]),
            mapErrorToAction(createOrderTemplateFail)
          )
      )
    )
  );

  moveItemToOrderTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveItemToOrderTemplate),
      mapToPayload(),
      mergeMap(payload => {
        if (!payload.target.id) {
          return [
            addProductsToNewOrderTemplate({
              title: payload.target.title,
              items: [pick(payload.target, 'sku', 'quantity')],
            }),
            removeItemFromOrderTemplate({
              orderTemplateId: payload.source.id,
              sku: payload.target.sku,
            }),
          ];
        } else {
          return [
            addProductsToOrderTemplate({
              orderTemplateId: payload.target.id,
              items: [pick(payload.target, 'sku', 'quantity')],
            }),
            removeItemFromOrderTemplate({
              orderTemplateId: payload.source.id,
              sku: payload.target.sku,
            }),
          ];
        }
      })
    )
  );

  removeProductFromOrderTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeItemFromOrderTemplate),
      mapToPayload(),
      mergeMap(payload =>
        this.orderTemplateService.removeProductFromOrderTemplate(payload.orderTemplateId, payload.sku).pipe(
          map(orderTemplate => removeItemFromOrderTemplateSuccess({ orderTemplate })),
          mapErrorToAction(removeItemFromOrderTemplateFail)
        )
      )
    )
  );

  routeListenerForSelectedOrderTemplate$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('orderTemplateName')),
      distinctCompareWith(this.store.pipe(select(getSelectedOrderTemplateId))),
      map(id => selectOrderTemplate({ id }))
    )
  );

  /**
   * Trigger LoadOrderTemplates action after LoginUserSuccess.
   */
  loadOrderTemplatesAfterLogin$ = createEffect(() =>
    this.store.pipe(
      select(getUserAuthorized),
      whenTruthy(),
      map(() => loadOrderTemplates())
    )
  );

  setOrderTemplateBreadcrumb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMap(() =>
        this.store.pipe(
          ofUrl(/^\/account\/order-templates\/.*/),
          select(getSelectedOrderTemplateDetails),
          whenTruthy(),
          map(orderTemplate =>
            setBreadcrumbData({
              breadcrumbData: [
                { key: 'account.ordertemplates.link', link: '/account/order-templates' },
                { text: orderTemplate.title },
              ],
            })
          )
        )
      )
    )
  );
}
