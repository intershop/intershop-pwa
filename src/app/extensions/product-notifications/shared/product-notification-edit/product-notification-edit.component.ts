import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { ProductNotification } from '../../models/product-notification/product-notification.model';
import { ProductNotificationDialogComponent } from '../product-notification-dialog/product-notification-dialog.component';

/**
 * The Product Notification Component shows the customer a link to open the dialog to edit the product notification.
 *
 * @example
 * <ish-product-notification-edit></ish-product-notification-edit>
 */
@Component({
  selector: 'ish-product-notification-edit',
  templateUrl: './product-notification-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductNotificationEditComponent implements OnDestroy, OnInit {
  @Input() productNotification: ProductNotification;
  @Input() displayType: 'icon' | 'link' = 'link';
  @Input() cssClass: string;

  available$: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor(private context: ProductContextFacade, private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.available$ = this.context.select('product', 'available');
  }

  /**
   * if the user is not logged in display login dialog, else open notification dialog
   */
  openModal(modal: ProductNotificationDialogComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        modal.show();
      } else {
        // stay on the same page after login
        const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'productnotification' };
        this.router.navigate(['/login'], { queryParams });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}