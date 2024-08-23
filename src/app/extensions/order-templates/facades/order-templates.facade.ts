import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';

import { OrderTemplate, OrderTemplateHeader } from '../models/order-template/order-template.model';
import {
  addProductToNewOrderTemplate,
  addProductToOrderTemplate,
  createOrderTemplate,
  deleteOrderTemplate,
  getAllOrderTemplates,
  getOrderTemplateError,
  getOrderTemplateLoading,
  getSelectedOrderTemplateDetails,
  getSelectedOrderTemplateOutOfStockItems,
  moveItemToOrderTemplate,
  orderTemplatesActions,
  removeItemFromOrderTemplate,
  updateOrderTemplate,
} from '../store/order-template';

@Injectable({ providedIn: 'root' })
export class OrderTemplatesFacade {
  constructor(private store: Store) {}

  orderTemplates$: Observable<OrderTemplate[]> = this.store.pipe(select(getAllOrderTemplates));
  currentOrderTemplate$: Observable<OrderTemplate> = this.store.pipe(select(getSelectedOrderTemplateDetails));
  currentOrderTemplateOutOfStockItems$: Observable<string[]> = this.store.pipe(
    select(getSelectedOrderTemplateOutOfStockItems)
  );
  orderTemplateLoading$: Observable<boolean> = this.store.pipe(select(getOrderTemplateLoading));
  orderTemplateError$: Observable<HttpError> = this.store.pipe(select(getOrderTemplateError));

  orderTemplatesSelectOptions$(filterCurrent = true): Observable<SelectOption[]> {
    return this.orderTemplates$.pipe(
      startWith([] as OrderTemplate[]),
      map(orderTemplates =>
        orderTemplates.map(orderTemplate => ({
          value: orderTemplate.id,
          label: orderTemplate.title,
        }))
      ),
      withLatestFrom(this.currentOrderTemplate$),
      map(([orderTemplateOptions, currentOrderTemplate]) => {
        if (filterCurrent && currentOrderTemplate) {
          return orderTemplateOptions.filter(option => option.value !== currentOrderTemplate.id);
        }
        return orderTemplateOptions;
      })
    );
  }

  addOrderTemplate(orderTemplate: OrderTemplateHeader): void | HttpError {
    this.store.dispatch(createOrderTemplate({ orderTemplate }));
  }

  createOrderTemplateFromLineItems(orderTemplate: OrderTemplateHeader, lineItems: LineItem[]): void | HttpError {
    this.store.dispatch(orderTemplatesActions.createOrderTemplateFromLineItems({ orderTemplate, lineItems }));
  }

  deleteOrderTemplate(id: string): void {
    this.store.dispatch(deleteOrderTemplate({ orderTemplateId: id }));
  }

  updateOrderTemplate(orderTemplate: OrderTemplate): void {
    this.store.dispatch(updateOrderTemplate({ orderTemplate }));
  }

  addProductToNewOrderTemplate(title: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToNewOrderTemplate({ title, sku, quantity }));
  }

  addProductToOrderTemplate(orderTemplateId: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToOrderTemplate({ orderTemplateId, sku, quantity }));
  }

  moveItemToOrderTemplate(
    sourceOrderTemplateId: string,
    targetOrderTemplateId: string,
    sku: string,
    quantity: number
  ): void {
    this.store.dispatch(
      moveItemToOrderTemplate({
        source: { id: sourceOrderTemplateId },
        target: { id: targetOrderTemplateId, sku, quantity },
      })
    );
  }

  moveItemToNewOrderTemplate(sourceOrderTemplateId: string, title: string, sku: string, quantity: number): void {
    this.store.dispatch(
      moveItemToOrderTemplate({ source: { id: sourceOrderTemplateId }, target: { title, sku, quantity } })
    );
  }

  removeProductFromOrderTemplate(orderTemplateId: string, sku: string): void {
    this.store.dispatch(removeItemFromOrderTemplate({ orderTemplateId, sku }));
  }
}
