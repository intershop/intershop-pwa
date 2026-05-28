import { AsyncPipe, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { SelectOrderTemplateModalComponent } from '../select-order-template-modal/select-order-template-modal.component';

/**
 * The Product Add To Order Template Component adds a product to a order template.
 *
 * @example
 * <ish-product-add-to-order-template displayType="icon" />
 */
@Component({
  selector: 'ish-product-add-to-order-template',
  templateUrl: './product-add-to-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    SelectOrderTemplateModalComponent,
    TranslatePipe,
  ],
})
export class ProductAddToOrderTemplateComponent implements OnInit {
  @Input() displayType: 'icon' | 'link' | 'animated' = 'link';
  @Input() cssClass: string;
  /**
   * hidden for screen readers
   */
  @Input() ariaHidden = false;

  disabled$: Observable<boolean>;
  visible$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

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
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(isLoggedIn => {
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
      this.orderTemplatesFacade.addProductToNewOrderTemplate(
        orderTemplate.title,
        this.context.get('sku'),
        this.context.get('quantity')
      );
    } else {
      this.orderTemplatesFacade.addProductToOrderTemplate(
        orderTemplate.id,
        this.context.get('sku'),
        this.context.get('quantity')
      );
    }
  }
}
