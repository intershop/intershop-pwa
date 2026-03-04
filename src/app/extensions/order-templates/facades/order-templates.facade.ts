import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

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
  private moduleLoader = inject(ModuleLoaderService);

  constructor(private store: Store) {}

  orderTemplates$: Observable<OrderTemplate[]> = this.moduleLoader.whenLoaded('orderTemplates', () =>
    this.store.pipe(select(getAllOrderTemplates))
  );
  currentOrderTemplate$: Observable<OrderTemplate> = this.moduleLoader.whenLoaded('orderTemplates', () =>
    this.store.pipe(select(getSelectedOrderTemplateDetails))
  );
  currentOrderTemplateOutOfStockItems$: Observable<string[]> = this.moduleLoader.whenLoaded('orderTemplates', () =>
    this.store.pipe(select(getSelectedOrderTemplateOutOfStockItems))
  );
  orderTemplateLoading$: Observable<boolean> = this.moduleLoader.whenLoaded('orderTemplates', () =>
    this.store.pipe(select(getOrderTemplateLoading))
  );
  orderTemplateError$: Observable<HttpError> = this.moduleLoader.whenLoaded('orderTemplates', () =>
    this.store.pipe(select(getOrderTemplateError))
  );

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
    void this.moduleLoader
      .ensureLoaded('orderTemplates')
      .then(() => this.store.dispatch(createOrderTemplate({ orderTemplate })));
  }

  createOrderTemplateFromLineItems(orderTemplate: OrderTemplateHeader, lineItems: LineItem[]): void | HttpError {
    void this.moduleLoader.ensureLoaded('orderTemplates').then(() =>
      this.store.dispatch(orderTemplatesActions.createOrderTemplateFromLineItems({ orderTemplate, lineItems }))
    );
  }

  deleteOrderTemplate(id: string): void {
    void this.moduleLoader
      .ensureLoaded('orderTemplates')
      .then(() => this.store.dispatch(deleteOrderTemplate({ orderTemplateId: id })));
  }

  updateOrderTemplate(orderTemplate: OrderTemplate): void {
    void this.moduleLoader
      .ensureLoaded('orderTemplates')
      .then(() => this.store.dispatch(updateOrderTemplate({ orderTemplate })));
  }

  addProductToNewOrderTemplate(title: string, sku: string, quantity?: number): void {
    void this.moduleLoader
      .ensureLoaded('orderTemplates')
      .then(() => this.store.dispatch(addProductToNewOrderTemplate({ title, sku, quantity })));
  }

  addProductToOrderTemplate(orderTemplateId: string, sku: string, quantity?: number): void {
    void this.moduleLoader
      .ensureLoaded('orderTemplates')
      .then(() => this.store.dispatch(addProductToOrderTemplate({ orderTemplateId, sku, quantity })));
  }

  moveItemToOrderTemplate(
    sourceOrderTemplateId: string,
    targetOrderTemplateId: string,
    sku: string,
    quantity: number
  ): void {
    void this.moduleLoader.ensureLoaded('orderTemplates').then(() =>
      this.store.dispatch(
        moveItemToOrderTemplate({
          source: { id: sourceOrderTemplateId },
          target: { id: targetOrderTemplateId, sku, quantity },
        })
      )
    );
  }

  moveItemToNewOrderTemplate(sourceOrderTemplateId: string, title: string, sku: string, quantity: number): void {
    void this.moduleLoader.ensureLoaded('orderTemplates').then(() =>
      this.store.dispatch(
        moveItemToOrderTemplate({ source: { id: sourceOrderTemplateId }, target: { title, sku, quantity } })
      )
    );
  }

  removeProductFromOrderTemplate(orderTemplateId: string, sku: string): void {
    void this.moduleLoader
      .ensureLoaded('orderTemplates')
      .then(() => this.store.dispatch(removeItemFromOrderTemplate({ orderTemplateId, sku })));
  }
}
