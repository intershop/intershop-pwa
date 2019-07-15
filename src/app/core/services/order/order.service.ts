import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      .pipe(map(OrderMapper.fromData));
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
}
