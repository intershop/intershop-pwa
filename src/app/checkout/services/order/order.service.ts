import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService, resolveLink, resolveLinks, unpackEnvelope } from '../../../core/services/api/api.service';
import { Basket } from '../../../models/basket/basket.model';
import { Link } from '../../../models/link/link.model';
import { OrderData } from '../../../models/order/order.interface';
import { OrderMapper } from '../../../models/order/order.mapper';
import { Order } from '../../../models/order/order.model';

/**
 * The Order Service handles the interaction with the REST API concerning orders.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private apiService: ApiService) {}

  /**
   * Creates an order based on the given basket.
   * @param basket                    The (current) basket.
   * @param acceptTermsAndConditions  indicates whether the user has accepted terms and conditions
   * @returns                         The order.
   */
  createOrder(basket: Basket, acceptTermsAndConditions: boolean = false): Observable<Order> {
    return this.apiService
      .post<Order>('orders', {
        basketID: basket.id,
        acceptTermsAndConditions: acceptTermsAndConditions,
      })
      .pipe(
        resolveLink<Order>(this.apiService),
        map(OrderMapper.fromData)
      );
  }

  /**
   * Gets the orders of the logged-in user
   * @param amount The count of items which should be fetched.
   * @returns      A list of the user's orders
   */
  getOrders(amount: number = 30): Observable<Order[]> {
    return this.apiService.get<Order>(`orders?amount=${amount}`).pipe(
      unpackEnvelope<Link>(),
      resolveLinks<OrderData>(this.apiService),
      map(orders => orders.map(order => OrderMapper.fromData(order)))
    );
  }
}
