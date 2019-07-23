import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, mapTo } from 'rxjs/operators';

import { Basket } from 'ish-core/models/basket/basket.model';
import { OrderData } from 'ish-core/models/order/order.interface';
import { OrderMapper } from 'ish-core/models/order/order.mapper';
import { Order } from 'ish-core/models/order/order.model';
import { ApiService } from 'ish-core/services/api/api.service';

export declare type OrderIncludeType =
  | 'invoiceToAddress'
  | 'commonShipToAddress'
  | 'commonShippingMethod'
  | 'discounts'
  | 'lineItems_discounts'
  | 'lineItems'
  | 'payments'
  | 'payments_paymentMethod'
  | 'payments_paymentInstrument';

/**
 * The Order Service handles the interaction with the REST API concerning orders.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private apiService: ApiService) {}

  // declare http header for Order API v1
  private orderHeaders = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Accept', 'application/vnd.intershop.order.v1+json');

  private allOrderIncludes: OrderIncludeType[] = [
    'invoiceToAddress',
    'commonShipToAddress',
    'commonShippingMethod',
    'discounts',
    'lineItems_discounts',
    'lineItems',
    'payments',
    'payments_paymentMethod',
    'payments_paymentInstrument',
  ];

  /**
   * Creates an order based on the given basket.
   * @param basket                      The (current) basket.
   * @param termsAndConditionsAccepted  indicates whether the user has accepted terms and conditions
   * @returns                           The order.
   */
  createOrder(basket: Basket, termsAndConditionsAccepted: boolean = false): Observable<Order> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    return this.apiService
      .post<OrderData>(
        'orders',
        {
          basket: basket.id,
          termsAndConditionsAccepted,
        },
        {
          headers: this.orderHeaders,
          params,
        }
      )
      .pipe(
        map(OrderMapper.fromData),
        concatMap(order => {
          if (
            order.orderCreation &&
            order.orderCreation.status === 'STOPPED' &&
            order.orderCreation.stopAction.type === 'Workflow' &&
            order.orderCreation.stopAction.exitReason === 'redirect_urls_required'
          ) {
            const body = {
              orderCreation: {
                redirect: {
                  cancelUrl: `${location.origin}/checkout/payment?redirect=cancel&orderId=${order.id}`,
                  failureUrl: `${location.origin}/checkout/payment?redirect=failure&orderId=${order.id}`,
                  successUrl: `${location.origin}/checkout/receipt?redirect=success&orderId=${order.id}`,
                },
                status: 'CONTINUE',
              },
            };
            return this.apiService
              .patch(`orders/${order.id}`, body, {
                headers: this.orderHeaders,
              })
              .pipe(map(OrderMapper.fromData));
          } else {
            return of(order);
          }
        })
      );
  }

  /**
   * Gets the orders of the logged-in user
   * @param amount The count of items which should be fetched.
   * @returns      A list of the user's orders
   */
  getOrders(amount: number = 30): Observable<Order[]> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    return this.apiService
      .get<OrderData>(`orders?page[limit]=${amount}`, {
        headers: this.orderHeaders,
        params,
      })
      .pipe(map(OrderMapper.fromListData));
  }

  /**
   * Get a logged-in user's order with the given id
   * @param orderId The (uuid) of the order.
   * @returns       The order
   */
  getOrder(orderId: string): Observable<Order> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    if (!orderId) {
      return throwError('getOrder() called without orderId');
    }

    return this.apiService
      .get<OrderData>(`orders/${orderId}`, {
        headers: this.orderHeaders,
        params,
      })
      .pipe(map(OrderMapper.fromData));
  }

  /**
   * Updates a payment for an order. Used to set redirect query parameters and status after redirect.
   * If cancel/failure is sent back as redirect status, the order doesn't exist any more.
   * @param orderId      The (uuid) of the order.
     @param queryParams  The payment redirect information (parameters and status).
   * @returns            The orderId
   */
  updateOrderPayment(orderId: string, queryParams: Params): Observable<string> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    if (!orderId) {
      return throwError('updateOrderPayment() called without orderId');
    }

    if (!queryParams) {
      return throwError('updateOrderPayment() called without query parameter data');
    }

    if (!queryParams.redirect) {
      return throwError('updateOrderPayment() called without redirect parameter data');
    }

    const orderCreation = {
      status: 'CONTINUE',
      redirect: {
        status: queryParams.redirect.toUpperCase(),
        parameters: Object.entries(queryParams)
          .filter(([name]) => name !== 'redirect')
          .map(([name, value]) => ({ name, value })),
      },
    };

    return this.apiService
      .patch<OrderData>(
        `orders/${orderId}`,
        { orderCreation },
        {
          headers: this.orderHeaders,
          params,
        }
      )
      .pipe(mapTo(orderId));
  }
}
