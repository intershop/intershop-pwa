import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrderTemplate, OrderTemplateHeader } from '../models/order-template/order-template.model';
import {
  addBasketToNewOrderTemplate,
  addProductToNewOrderTemplate,
  addProductToOrderTemplate,
  createOrderTemplate,
  deleteOrderTemplate,
  getAllOrderTemplates,
  getOrderTemplateError,
  getOrderTemplateLoading,
  getSelectedOrderTemplateDetails,
  moveItemToOrderTemplate,
  removeItemFromOrderTemplate,
  updateOrderTemplate,
} from '../store/order-template';

@Injectable({ providedIn: 'root' })
export class OrderTemplatesFacade {
  constructor(private store: Store) {}

  orderTemplates$: Observable<OrderTemplate[]> = this.store.pipe(select(getAllOrderTemplates));
  currentOrderTemplate$: Observable<OrderTemplate> = this.store.pipe(select(getSelectedOrderTemplateDetails));
  orderTemplateLoading$: Observable<boolean> = this.store.pipe(select(getOrderTemplateLoading));
  orderTemplateError$: Observable<HttpError> = this.store.pipe(select(getOrderTemplateError));

  addOrderTemplate(orderTemplate: OrderTemplateHeader): void | HttpError {
    this.store.dispatch(createOrderTemplate({ orderTemplate }));
  }

  addBasketToNewOrderTemplate(orderTemplate: OrderTemplateHeader): void | HttpError {
    this.store.dispatch(addBasketToNewOrderTemplate({ orderTemplate }));
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
    sourceorderTemplateId: string,
    targetorderTemplateId: string,
    sku: string,
    quantity: number
  ): void {
    this.store.dispatch(
      moveItemToOrderTemplate({
        source: { id: sourceorderTemplateId },
        target: { id: targetorderTemplateId, sku, quantity },
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
