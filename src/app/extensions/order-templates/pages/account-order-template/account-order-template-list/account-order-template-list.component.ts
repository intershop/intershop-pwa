import { ChangeDetectionStrategy, Component, DestroyRef, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, filter, map } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate } from '../../../models/order-template/order-template.model';

type OrderTemplateColumnsType = 'actions' | 'creationDate' | 'lineItems' | 'title';

@Component({
  selector: 'ish-account-order-template-list',
  standalone: false,
  templateUrl: './account-order-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateListComponent {
  /**
   * The list of order templates of the customer.
   */
  @Input() orderTemplates: OrderTemplate[];
  @Input() columnsToDisplay: OrderTemplateColumnsType[] = ['title', 'creationDate', 'lineItems', 'actions'];

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private translate: TranslateService
  ) {}
  /**
   * fires 'true' after add To Cart is clicked and basket is loading
   */
  displaySpinner$ = new BehaviorSubject(false);

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private shoppingFacade: ShoppingFacade,
    private translate: TranslateService,
    private destroyRef: DestroyRef
  ) {}

  /** Emits the id of the order template to delete. */
  delete(orderTemplateId: string) {
    this.orderTemplatesFacade.deleteOrderTemplate(orderTemplateId);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(orderTemplate: OrderTemplate, modal: ModalDialogComponent<string>) {
    modal.options.titleText = this.translate.instant('account.order_templates.delete_dialog.header', {
      0: orderTemplate.title,
    });
    modal.show(orderTemplate.id);
  }

  loadOrderTemplateDetails(orderTemplateId: string) {
    this.orderTemplatesFacade.loadOrderTemplateDetails(orderTemplateId);
  }

  addToBasket(orderTemplateId: string) {
    this.displaySpinner$.next(true);
    this.orderTemplatesFacade.orderTemplates$
      .pipe(
        map(orderTemplates => {
          const template = orderTemplates.find(t => t.id === orderTemplateId);
          if (template && template.itemsCount !== template.items?.length) {
            this.loadOrderTemplateDetails(orderTemplateId);
          }
          return template;
        }),
        filter(orderTemplate => orderTemplate && orderTemplate.itemsCount === orderTemplate.items?.length),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(orderTemplate => {
        this.shoppingFacade.addProductsToBasket(
          orderTemplate.items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value }))
        );
        this.displaySpinner$.next(false);
      });
  }
}
