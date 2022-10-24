import { Injectable } from '@angular/core';
import { of } from 'rxjs';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class ProductNotificationsFacade {
  //constructor(private store: Store) {}

  productNotifications$ = of([
    {
      sku: 'sku1',
      notificationMailAddress: 'bboldner@test.intershop.de',
    },
    {
      sku: 'sku2',
      notificationMailAddress: 'pmiller@test.intershop.de',
    },
  ]);

  /**
   * example for debugging
   */
  //productNotificationsState$ = this.store.pipe(select(getProductNotificationsState));
}
