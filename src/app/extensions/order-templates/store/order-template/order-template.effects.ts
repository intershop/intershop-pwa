import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat } from 'rxjs';
import { concatMap, filter, last, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { getCurrentBasket } from 'ish-core/store/account/basket';
import { getUserAuthorized } from 'ish-core/store/account/user';
import { SuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { SetBreadcrumbData } from 'ish-core/store/core/viewconf';
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
  AddBasketToNewOrderTemplate,
  AddBasketToNewOrderTemplateFail,
  AddBasketToNewOrderTemplateSuccess,
  AddProductToNewOrderTemplate,
  AddProductToOrderTemplate,
  AddProductToOrderTemplateFail,
  AddProductToOrderTemplateSuccess,
  CreateOrderTemplate,
  CreateOrderTemplateFail,
  CreateOrderTemplateSuccess,
  DeleteOrderTemplate,
  DeleteOrderTemplateFail,
  DeleteOrderTemplateSuccess,
  LoadOrderTemplates,
  LoadOrderTemplatesFail,
  LoadOrderTemplatesSuccess,
  MoveItemToOrderTemplate,
  OrderTemplatesActionTypes,
  RemoveItemFromOrderTemplate,
  RemoveItemFromOrderTemplateFail,
  RemoveItemFromOrderTemplateSuccess,
  SelectOrderTemplate,
  UpdateOrderTemplate,
  UpdateOrderTemplateFail,
  UpdateOrderTemplateSuccess,
} from './order-template.actions';
import {
  getOrderTemplateDetails,
  getSelectedOrderTemplateDetails,
  getSelectedOrderTemplateId,
} from './order-template.selectors';

@Injectable()
export class OrderTemplateEffects {
  constructor(private actions$: Actions, private orderTemplateService: OrderTemplateService, private store: Store) {}

  @Effect()
  loadOrderTemplates$ = this.actions$.pipe(
    ofType<LoadOrderTemplates>(OrderTemplatesActionTypes.LoadOrderTemplates),
    withLatestFrom(this.store.pipe(select(getUserAuthorized))),
    filter(([, authorized]) => authorized),
    switchMap(() =>
      this.orderTemplateService.getOrderTemplates().pipe(
        map(orderTemplates => new LoadOrderTemplatesSuccess({ orderTemplates })),
        mapErrorToAction(LoadOrderTemplatesFail)
      )
    )
  );

  @Effect()
  createOrderTemplate$ = this.actions$.pipe(
    ofType<CreateOrderTemplate>(OrderTemplatesActionTypes.CreateOrderTemplate),
    mapToPayloadProperty('orderTemplate'),
    mergeMap((orderTemplateData: OrderTemplateHeader) =>
      this.orderTemplateService.createOrderTemplate(orderTemplateData).pipe(
        mergeMap(orderTemplate => [
          new CreateOrderTemplateSuccess({ orderTemplate }),
          new SuccessMessage({
            message: 'account.order_template.new_order_template.confirmation',
            messageParams: { 0: orderTemplate.title },
          }),
        ]),
        mapErrorToAction(CreateOrderTemplateFail)
      )
    )
  );

  @Effect()
  addBasketToNewOrderTemplate$ = this.actions$.pipe(
    ofType<AddBasketToNewOrderTemplate>(OrderTemplatesActionTypes.AddBasketToNewOrderTemplate),
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
            concat(
              ...currentBasket.lineItems.map(lineItem =>
                this.orderTemplateService.addProductToOrderTemplate(
                  orderTemplate.id,
                  lineItem.productSKU,
                  lineItem.quantity.value
                )
              )
            ).pipe(
              last(),
              concatMap(newOrderTemplate => [
                new AddBasketToNewOrderTemplateSuccess({ orderTemplate: newOrderTemplate }),
                new SuccessMessage({
                  message: 'account.order_template.new_from_basket_confirm.heading',
                  messageParams: { 0: orderTemplate.title },
                }),
              ]),
              mapErrorToAction(AddBasketToNewOrderTemplateFail)
            )
          )
        )
    ),
    mapErrorToAction(CreateOrderTemplateFail)
  );

  @Effect()
  deleteOrderTemplate$ = this.actions$.pipe(
    ofType<DeleteOrderTemplate>(OrderTemplatesActionTypes.DeleteOrderTemplate),
    mapToPayloadProperty('orderTemplateId'),
    mergeMap(orderTemplateId => this.store.pipe(select(getOrderTemplateDetails, { id: orderTemplateId }))),
    whenTruthy(),
    map(orderTemplate => ({ orderTemplateId: orderTemplate.id, title: orderTemplate.title })),
    mergeMap(({ orderTemplateId, title }) =>
      this.orderTemplateService.deleteOrderTemplate(orderTemplateId).pipe(
        mergeMap(() => [
          new DeleteOrderTemplateSuccess({ orderTemplateId }),
          new SuccessMessage({
            message: 'account.order_template.delete_order_template.confirmation',
            messageParams: { 0: title },
          }),
        ]),
        mapErrorToAction(DeleteOrderTemplateFail)
      )
    )
  );

  @Effect()
  updateOrderTemplate$ = this.actions$.pipe(
    ofType<UpdateOrderTemplate>(OrderTemplatesActionTypes.UpdateOrderTemplate),
    mapToPayloadProperty('orderTemplate'),
    mergeMap((newOrderTemplate: OrderTemplate) =>
      this.orderTemplateService.updateOrderTemplate(newOrderTemplate).pipe(
        mergeMap(orderTemplate => [
          new UpdateOrderTemplateSuccess({ orderTemplate }),
          new SuccessMessage({
            message: 'account.order_templates.edit.confirmation',
            messageParams: { 0: orderTemplate.title },
          }),
        ]),
        mapErrorToAction(UpdateOrderTemplateFail)
      )
    )
  );

  @Effect()
  addProductToOrderTemplate$ = this.actions$.pipe(
    ofType<AddProductToOrderTemplate>(OrderTemplatesActionTypes.AddProductToOrderTemplate),
    mapToPayload(),
    mergeMap(payload =>
      this.orderTemplateService.addProductToOrderTemplate(payload.orderTemplateId, payload.sku, payload.quantity).pipe(
        map(orderTemplate => new AddProductToOrderTemplateSuccess({ orderTemplate })),
        mapErrorToAction(AddProductToOrderTemplateFail)
      )
    )
  );

  @Effect()
  addProductToNewOrderTemplate$ = this.actions$.pipe(
    ofType<AddProductToNewOrderTemplate>(OrderTemplatesActionTypes.AddProductToNewOrderTemplate),
    mapToPayload(),
    mergeMap(payload =>
      this.orderTemplateService
        .createOrderTemplate({
          title: payload.title,
        })
        .pipe(
          // use created order template data to dispatch addProduct action
          mergeMap(orderTemplate => [
            new CreateOrderTemplateSuccess({ orderTemplate }),
            new AddProductToOrderTemplate({
              orderTemplateId: orderTemplate.id,
              sku: payload.sku,
              quantity: payload.quantity,
            }),
            new SelectOrderTemplate({ id: orderTemplate.id }),
          ]),
          mapErrorToAction(CreateOrderTemplateFail)
        )
    )
  );

  @Effect()
  moveItemToOrderTemplate$ = this.actions$.pipe(
    ofType<MoveItemToOrderTemplate>(OrderTemplatesActionTypes.MoveItemToOrderTemplate),
    mapToPayload(),
    mergeMap(payload => {
      if (!payload.target.id) {
        return [
          new AddProductToNewOrderTemplate({
            title: payload.target.title,
            sku: payload.target.sku,
            quantity: payload.target.quantity,
          }),
          new RemoveItemFromOrderTemplate({
            orderTemplateId: payload.source.id,
            sku: payload.target.sku,
          }),
        ];
      } else {
        return [
          new AddProductToOrderTemplate({
            orderTemplateId: payload.target.id,
            sku: payload.target.sku,
            quantity: payload.target.quantity,
          }),
          new RemoveItemFromOrderTemplate({
            orderTemplateId: payload.source.id,
            sku: payload.target.sku,
          }),
        ];
      }
    })
  );

  @Effect()
  removeProductFromOrderTemplate$ = this.actions$.pipe(
    ofType<RemoveItemFromOrderTemplate>(OrderTemplatesActionTypes.RemoveItemFromOrderTemplate),
    mapToPayload(),
    mergeMap(payload =>
      this.orderTemplateService.removeProductFromOrderTemplate(payload.orderTemplateId, payload.sku).pipe(
        map(orderTemplate => new RemoveItemFromOrderTemplateSuccess({ orderTemplate })),
        mapErrorToAction(RemoveItemFromOrderTemplateFail)
      )
    )
  );

  @Effect()
  routeListenerForSelectedOrderTemplate$ = this.store.pipe(
    select(selectRouteParam('orderTemplateName')),
    distinctCompareWith(this.store.pipe(select(getSelectedOrderTemplateId))),
    map(id => new SelectOrderTemplate({ id }))
  );

  /**
   * Trigger LoadOrderTemplates action after LoginUserSuccess.
   */
  @Effect()
  loadOrderTemplatesAfterLogin$ = this.store.pipe(
    select(getUserAuthorized),
    whenTruthy(),
    mapTo(new LoadOrderTemplates())
  );

  @Effect()
  setOrderTemplateBreadcrumb$ = this.store.pipe(
    select(getSelectedOrderTemplateDetails),
    whenTruthy(),
    map(
      orderTemplate =>
        new SetBreadcrumbData({
          breadcrumbData: [
            { key: 'account.ordertemplates.link', link: '/account/order-templates' },
            { text: orderTemplate.title },
          ],
        })
    )
  );
}
