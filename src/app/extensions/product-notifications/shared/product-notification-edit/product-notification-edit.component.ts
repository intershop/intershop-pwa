import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { ProductNotification } from '../../models/product-notification/product-notification.model';
import { ProductNotificationEditDialogComponent } from '../product-notification-edit-dialog/product-notification-edit-dialog.component';

/**
 * The Product Notification Edit Component shows the customer a link to open the dialog to either create,
 * edit or delete a product notification.
 *
 * @example
 * <ish-product-notification-edit
 *   cssClass="btn-link btn-tool"
 *   [productNotification]="productNotification"
 *   displayType="icon"></ish-product-notification-edit>
 */
@Component({
  selector: 'ish-product-notification-edit',
  templateUrl: './product-notification-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductNotificationEditComponent implements OnInit {
  @Input() productNotification: ProductNotification;
  @Input() displayType: 'button' | 'icon' = 'button';
  @Input() cssClass: string;

  visible$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

  constructor(private context: ProductContextFacade, private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'addToNotification');
  }

  // keep-localization-pattern: ^product\.notification\..*\.notification\.button.*
  buttonKey(key: string): Observable<string> {
    return this.context
      .select('product', 'available')
      .pipe(map(available => `product.notification.${available ? 'price' : 'stock'}.notification.button.${key}`));
  }

  // if the user is not logged in display login dialog, else open notification dialog
  openModal(modal: ProductNotificationEditDialogComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        modal.show();
      } else {
        // stay on the same page after login
        const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'productnotification' };
        this.router.navigate(['/login'], { queryParams });
      }
    });
  }
}
