import { APP_BASE_HREF } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom } from 'rxjs/operators';

import { OrderData } from 'ish-core/models/order/order.interface';
import { OrderMapper } from 'ish-core/models/order/order.mapper';
import { Order } from 'ish-core/models/order/order.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';

type OrderIncludeType =
  | 'all'
  | 'buckets'
  | 'buckets_discounts'
  | 'buckets_shipToAddress'
  | 'buckets_shippingMethod'
  | 'buyingContext'
  | 'commonShipToAddress'
  | 'commonShippingMethod'
  | 'discounts'
  | 'discounts_promotion'
  | 'invoiceToAddress'
  | 'lineItems'
  | 'lineItems_discounts'
  | 'lineItems_product'
  | 'lineItems_shipToAddress'
  | 'lineItems_shippingMethod'
  | 'lineItems_warranty'
  | 'payments'
  | 'payments_paymentInstrument'
  | 'payments_paymentMethod';

export interface OrderListQuery {
  limit: number;
  include?: OrderIncludeType[];
}

export function orderListQueryToHttpParams(query: OrderListQuery): HttpParams {
  return Object.entries(query).reduce(
    (acc, [key, value]: [keyof OrderListQuery, OrderListQuery[keyof OrderListQuery]]) => {
      if (Array.isArray(value)) {
        if (key === 'include') {
          return acc.set(key, value.join(','));
        } else {
          return value.reduce((acc, value) => acc.append(key, value.toString()), acc);
        }
      } else if (value !== undefined) {
        return acc.set(key, value.toString());
      } else {
        return acc;
      }
    },
    new HttpParams()
  );
}

/**
 * The Order Service handles the interaction with the REST API concerning orders.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private apiService: ApiService, private store: Store, @Inject(APP_BASE_HREF) private baseHref: string) {}

  private orderHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.order.v1+json',
  });

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
   * Creates an order based on the given basket. If a redirect is necessary for payment, the return URLs will be sent after order creation in case they are required.
   *
   * @param basket                      The (current) basket.
   * @param termsAndConditionsAccepted  indicates whether the user has accepted terms and conditions
   * @returns                           The order.
   */
  createOrder(basketId: string, termsAndConditionsAccepted: boolean = false): Observable<Order> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    if (!basketId) {
      return throwError(() => new Error('createOrder() called without basketId'));
    }

    return this.apiService
      .post<OrderData>(
        'orders',
        {
          basket: basketId,
          termsAndConditionsAccepted,
        },
        {
          headers: this.orderHeaders,
          params,
        }
      )
      .pipe(
        map(OrderMapper.fromData),
        withLatestFrom(this.store.pipe(select(getCurrentLocale))),
        concatMap(([order, currentLocale]) => this.sendRedirectUrlsIfRequired(order, currentLocale))
      );
  }

  /**
   *  Checks, if RedirectUrls are requested by the server and sends them if it is necessary.
   *
   * @param order           The order.
   * @param lang            The language code of the current locale, e.g. en_US
   * @returns               The (updated) order.
   */
  private sendRedirectUrlsIfRequired(order: Order, lang: string): Observable<Order> {
    if (
      order.orderCreation &&
      order.orderCreation.status === 'STOPPED' &&
      order.orderCreation.stopAction.type === 'Workflow' &&
      order.orderCreation.stopAction.exitReason === 'redirect_urls_required'
    ) {
      const loc = `${location.origin}${this.baseHref}`;
      const body = {
        orderCreation: {
          redirect: {
            cancelUrl: `${loc}/checkout/payment;lang=${lang}?redirect=cancel&orderId=${order.id}`,
            failureUrl: `${loc}/checkout/payment;lang=${lang}?redirect=failure&orderId=${order.id}`,
            successUrl: `${loc}/checkout/receipt;lang=${lang}?redirect=success&orderId=${order.id}`,
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
  }

  /**
   * Gets the orders of the logged-in user
   *
   * @param query   Additional query parameters
   *                - the number of items that should be fetched
   *                - which data should be included.
   * @returns       A list of the user's orders
   */
  getOrders(query: OrderListQuery): Observable<Order[]> {
    let params = orderListQueryToHttpParams(query);
    // for 7.10 compliance - ToDo: will be removed in PWA 6.0
    params = params.set('page[limit]', query.limit);

    return this.apiService
      .get<OrderData>('orders', {
        headers: this.orderHeaders,
        params,
      })
      .pipe(map(OrderMapper.fromListData));
  }

  /**
   * Gets a logged-in user's order with the given id
   *
   * @param orderId The (uuid) of the order.
   * @returns       The order
   */
  getOrder(orderId: string): Observable<Order> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    if (!orderId) {
      return throwError(() => new Error('getOrder() called without orderId'));
    }

    return this.apiService
      .get<OrderData>(`orders/${orderId}`, {
        headers: this.orderHeaders,
        params,
      })
      .pipe(map(OrderMapper.fromData));
  }

  /**
   * Gets an anonymous user's order with the given id using the provided apiToken.
   *
   * @param orderId  The (uuid) of the order.
   * @param apiToken The api token of the user's most recent request.
   * @returns        The order
   */
  getOrderByToken(orderId: string, apiToken: string): Observable<Order> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    if (!orderId) {
      return throwError(() => new Error('getOrderByToken() called without orderId'));
    }

    if (!apiToken) {
      return throwError(() => new Error('getOrderByToken() called without apiToken'));
    }

    return this.apiService
      .get<OrderData>(`orders/${orderId}`, {
        headers: this.orderHeaders.set(ApiService.TOKEN_HEADER_KEY, apiToken),
        params,
        skipApiErrorHandling: true,
      })
      .pipe(
        map(OrderMapper.fromData),
        catchError(() => EMPTY)
      );
  }

  /**
   * Updates a payment for an order. Used to set redirect query parameters and status after redirect.
   * If cancel/failure is sent back as redirect status, the order doesn't exist any more.
   *
   * @param orderId      The (uuid) of the order.
     @param queryParams  The payment redirect information (parameters and status).
   * @returns            The orderId
   */
  updateOrderPayment(orderId: string, queryParams: { [key: string]: string }): Observable<string> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    if (!orderId) {
      return throwError(() => new Error('updateOrderPayment() called without orderId'));
    }

    if (!queryParams) {
      return throwError(() => new Error('updateOrderPayment() called without query parameter data'));
    }

    if (!queryParams.redirect) {
      return throwError(() => new Error('updateOrderPayment() called without redirect parameter data'));
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
      .pipe(map(() => orderId));
  }
}
