import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

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
export class AccountProductNotificationsPageComponent implements OnInit, OnDestroy {
  productNotifications$: Observable<ProductNotification[]>;
  productNotificationsPrice$: Observable<ProductNotification[]>;
  productNotificationsInStock$: Observable<ProductNotification[]>;
  productNotificationsLoading$: Observable<boolean>;
  productNotificationsError$: Observable<HttpError>;
  active$: Observable<ProductNotificationType>;

  constructor(private productNotificationsFacade: ProductNotificationsFacade) {}

  active: ProductNotificationType;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // TODO: some product notification in the state management reset before fetching the current product notifications
    this.productNotifications$ = this.productNotificationsFacade.productNotificationsByRoute$;
    this.productNotificationsLoading$ = this.productNotificationsFacade.productNotificationsLoading$;
    this.productNotificationsError$ = this.productNotificationsFacade.productNotificationsError$;

    this.active$ = this.productNotificationsFacade.productNotificationType$ as Observable<ProductNotificationType>;

    this.active$.pipe(takeUntil(this.destroy$)).subscribe(active => {
      this.active = active;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
