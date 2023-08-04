import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';

@Component({
  selector: 'ish-account-product-notifications-page',
  templateUrl: './account-product-notifications-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProductNotificationsPageComponent implements OnInit {
  productNotifications$: Observable<ProductNotification[]>;
  productNotificationsPrice$: Observable<ProductNotification[]>;
  productNotificationsInStock$: Observable<ProductNotification[]>;
  productNotificationsLoading$: Observable<boolean>;
  productNotificationsError$: Observable<HttpError>;
  active$: Observable<ProductNotificationType>;

  constructor(private productNotificationsFacade: ProductNotificationsFacade) {}

  active: ProductNotificationType;
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.productNotifications$ = this.productNotificationsFacade.productNotificationsByRoute$;
    this.productNotificationsLoading$ = this.productNotificationsFacade.productNotificationsLoading$;
    this.productNotificationsError$ = this.productNotificationsFacade.productNotificationsError$;

    this.active$ = this.productNotificationsFacade.productNotificationType$ as Observable<ProductNotificationType>;

    this.active$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(active => {
      this.active = active;
    });
  }
}
