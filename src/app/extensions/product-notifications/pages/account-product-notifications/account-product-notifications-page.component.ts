import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

@Component({
  selector: 'ish-account-product-notifications-page',
  templateUrl: './account-product-notifications-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProductNotificationsPageComponent implements OnInit {
  productNotifications$: Observable<ProductNotification[]>;
  productNotificationsLoading$: Observable<boolean>;
  productNotificationsError$: Observable<HttpError>;

  constructor(private productNotificationsFacade: ProductNotificationsFacade) {}

  ngOnInit() {
    this.productNotifications$ = this.productNotificationsFacade.productNotifications$();
    this.productNotificationsLoading$ = this.productNotificationsFacade.productNotificationsLoading$;
    this.productNotificationsError$ = this.productNotificationsFacade.productNotificationsError$;
  }
}
