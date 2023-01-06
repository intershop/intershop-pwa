import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { SelectOrderTemplateModalComponent } from '../select-order-template-modal/select-order-template-modal.component';

/**
 * The Product Add To Order Template Component adds a product to a order template.
 *
 * @example
 * <ish-product-add-to-order-template
 *               displayType="icon"
 * ></ish-product-add-to-order-template>
 */
@Component({
  selector: 'ish-product-add-to-order-template',
  templateUrl: './product-add-to-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductAddToOrderTemplateComponent implements OnDestroy, OnInit {
  @Input() displayType: 'icon' | 'link' | 'animated' = 'link';
  @Input() cssClass: string;

  disabled$: Observable<boolean>;
  visible$: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private accountFacade: AccountFacade,
    private router: Router,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    this.disabled$ = this.context.select('hasQuantityError');
    this.visible$ = this.context.select('displayProperties', 'addToOrderTemplate');
  }

  /**
   * if the user is not logged in display login dialog, else open select order template dialog
   */
  openModal(modal: SelectOrderTemplateModalComponent) {
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

  addProductsToOrderTemplate(orderTemplate: { id: string; title: string }) {
    if (!orderTemplate.id) {
      this.orderTemplatesFacade.addProductsToNewOrderTemplate(
        orderTemplate.title,
        this.context.getItems().filter(item => !!item.quantity)
      );
    } else {
      this.orderTemplatesFacade.addProductsToOrderTemplate(
        orderTemplate.id,
        this.context.getItems().filter(item => !!item.quantity)
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
