import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

@Component({
  selector: 'ish-account-product-notifications-page',
  templateUrl: './account-product-notifications-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProductNotificationsPageComponent implements OnInit {
  productNotifications$: Observable<ProductNotification[]>;

  constructor(private productNotificationsFacade: ProductNotificationsFacade) {}

  ngOnInit() {
    this.productNotifications$ = this.productNotificationsFacade.productNotifications$;
  }
}
