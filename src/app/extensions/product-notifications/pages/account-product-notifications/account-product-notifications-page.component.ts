import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';

import { AccountProductNotificationsListComponent } from './account-product-notifications-list/account-product-notifications-list.component';

@Component({
  selector: 'ish-account-product-notifications-page',
  imports: [
    AccountProductNotificationsListComponent,
    AsyncPipe,
    ErrorMessageComponent,
    LoadingComponent,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    RouterLink,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './account-product-notifications-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProductNotificationsPageComponent implements OnInit {
  productNotifications$: Observable<ProductNotification[]>;
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
