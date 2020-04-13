import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { SelectOrderTemplateModalComponent } from '../../order-templates/select-order-template-modal/select-order-template-modal.component';

@Component({
  selector: 'ish-product-add-to-order-template',
  templateUrl: './product-add-to-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Product Add To Order Template Component adds a product to a order template.
 *
 * @example
 * <ish-product-add-to-order-template
 *               [product]=product
 *               displayType="icon"
 * ></ish-product-add-to-order-template>
 */
export class ProductAddToOrderTemplateComponent {
  @Input() product: Product;
  @Input() quantity: number;
  @Input() displayType?: 'icon' | 'link' | 'animated' = 'link';
  @Input() class?: string;
  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private accountFacade: AccountFacade,
    private router: Router
  ) {}

  /**
   * if the user is not logged in display login dialog, else open select order template dialog
   */
  openModal(modal: SelectOrderTemplateModalComponent) {
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

  addProductToOrderTemplate(orderTemplate: { id: string; title: string }) {
    if (!orderTemplate.id) {
      this.orderTemplatesFacade.addProductToNewOrderTemplate(orderTemplate.title, this.product.sku, this.quantity);
    } else {
      this.orderTemplatesFacade.addProductToOrderTemplate(orderTemplate.id, this.product.sku, this.quantity);
    }
  }
}
