import { Injectable } from '@angular/core';

import { ProductNotificationsService } from '../services/product-notifications/product-notifications.service';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class ProductNotificationsFacade {
  constructor(private productNotificationsService: ProductNotificationsService) {}

  productNotifications$ = this.productNotificationsService.getProductNotifications$();

  /**
   * example for debugging
   */
  //productNotificationsState$ = this.store.pipe(select(getProductNotificationsState));
}
