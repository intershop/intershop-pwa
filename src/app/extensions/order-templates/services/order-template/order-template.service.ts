import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { OrderTemplateData } from '../../models/order-template/order-template.interface';
import { OrderTemplateMapper } from '../../models/order-template/order-template.mapper';
import { OrderTemplate, OrderTemplateHeader } from '../../models/order-template/order-template.model';

@Injectable({ providedIn: 'root' })
export class OrderTemplateService {
  constructor(private apiService: ApiService, private orderTemplateMapper: OrderTemplateMapper) {}

  /**
   * Gets a list of order template for the current user.
   * @returns           The customer's order templates.
   */
  getOrderTemplates(): Observable<OrderTemplate[]> {
    return this.apiService.get(`customers/-/users/-/wishlists`).pipe(
      unpackEnvelope(),
      map(orderTemplateData => orderTemplateData.map(this.orderTemplateMapper.fromDataToIds)),
      map(orderTemplateData => orderTemplateData.map(orderTemplate => this.getOrderTemplate(orderTemplate.id))),
      switchMap(obsArray => (obsArray.length ? forkJoin(obsArray) : of([])))
    );
  }

  /**
   * Gets a order template of the given id for the current user.
   * @param orderTemplateId  The order template id.
   * @returns           The order template.
   */
  getOrderTemplate(orderTemplateId: string): Observable<OrderTemplate> {
    if (!orderTemplateId) {
      return throwError('getOrderTemplate() called without orderTemplateId');
    }
    return this.apiService
      .get<OrderTemplateData>(`customers/-/users/-/wishlists/${orderTemplateId}`)
      .pipe(map(orderTemplateData => this.orderTemplateMapper.fromData(orderTemplateData, orderTemplateId)));
  }

  /**
   * Creates a order template for the current user.
   * @param OrderTemplateDetails   The order template data.
   * @returns                 The created order template.
   */
  createOrderTemplate(orderTemplateData: OrderTemplateHeader): Observable<OrderTemplate> {
    return this.apiService
      .post('customers/-/users/-/wishlists', orderTemplateData)
      .pipe(concatMap((response: OrderTemplateData) => this.getOrderTemplate(response.title)));
  }

  /**
   * Deletes a order template of the given id.
   * @param orderTemplateId   The order template id.
   * @returns            The order template.
   */
  deleteOrderTemplate(orderTemplateId: string): Observable<void> {
    if (!orderTemplateId) {
      return throwError('deleteOrderTemplatet() called without orderTemplateId');
    }
    return this.apiService.delete(`customers/-/users/-/wishlists/${orderTemplateId}`);
  }

  /**
   * Updates a order template of the given id.
   * @param orderTemplate   The order template to be updated.
   * @returns          The updated order template.
   */
  updateOrderTemplate(orderTemplate: OrderTemplate): Observable<OrderTemplate> {
    return this.apiService
      .put(`customers/-/users/-/wishlists/${orderTemplate.id}`, orderTemplate)
      .pipe(map((response: OrderTemplate) => this.orderTemplateMapper.fromUpdate(response, orderTemplate.id)));
  }

  /**
   * Adds a product to the order template with the given id and reloads the order template.
   * @param orderTemplate Id   The order template id.
   * @param sku           The product sku.
   * @param quantity      The product quantity (default = 1).
   * @returns             The changed order template.
   */
  addProductToOrderTemplate(orderTemplateId: string, sku: string, quantity: number): Observable<OrderTemplate> {
    if (!orderTemplateId) {
      return throwError('addProductToOrderTemplate() called without orderTemplateId');
    }
    if (!sku) {
      return throwError('addProductToOrderTemplate() called without sku');
    }
    return this.apiService
      .post(`customers/-/users/-/wishlists/${orderTemplateId}/products/${sku}?quantity=${quantity}`)
      .pipe(concatMap(() => this.getOrderTemplate(orderTemplateId)));
  }

  /**
   * Removes a product from the order template with the given id. Returns an error observable if parameters are falsy.
   * @param wishlist Id   The order template id.
   * @param sku           The product sku.
   * @returns             The changed order template.
   */
  removeProductFromOrderTemplate(orderTemplateId: string, sku: string): Observable<OrderTemplate> {
    if (!orderTemplateId) {
      return throwError('removeProductFromOrderTemplate() called without orderTemplateId');
    }
    if (!sku) {
      return throwError('removeProductFromOrderTemplate() called without sku');
    }
    return this.apiService
      .delete(`customers/-/users/-/wishlists/${orderTemplateId}/products/${sku}`)
      .pipe(concatMap(() => this.getOrderTemplate(orderTemplateId)));
  }
}
