import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate } from '../../../models/order-template/order-template.model';
import { OrderTemplatePreferencesDialogComponent } from '../../order-templates/order-template-preferences-dialog/order-template-preferences-dialog.component';

@Component({
  selector: 'ish-basket-create-order-template',
  templateUrl: './basket-create-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * The Basket Create Order Template displays a button which adds the current cart to to a new order template.
 */
export class BasketCreateOrderTemplateComponent {
  @Input() products: LineItemView[];
  @Input() class?: string;

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private accountFacade: AccountFacade,
    private router: Router
  ) {}
  /**
   * if the user is not logged in display login dialog, else open select order template dialog
   */
  openModal(modal: OrderTemplatePreferencesDialogComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
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
}
