import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplatePreferencesDialogComponent } from '../order-template-preferences-dialog/order-template-preferences-dialog.component';

@Component({
  selector: 'ish-basket-create-order-template',
  templateUrl: './basket-create-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Basket Create Order Template displays a button which adds the current cart to to a new order template.
 */

@GenerateLazyComponent()
export class BasketCreateOrderTemplateComponent implements OnDestroy {
  @Input() products: LineItemView[];
  @Input() class?: string;
  private destroy$ = new Subject();

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private accountFacade: AccountFacade,
    private router: Router
  ) {}
  /**
   * if the user is not logged in display login dialog, else open select order template dialog
   */
  openModal(modal: OrderTemplatePreferencesDialogComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        modal.show();
      } else {
        // stay on the same page after login
        const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'ordertemplates' };
        this.router.navigate(['/login'], { queryParams });
      }
    });
  }

  createOrderTemplate(orderTemplate: OrderTemplate) {
    this.orderTemplatesFacade.addBasketToNewOrderTemplate(orderTemplate);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
