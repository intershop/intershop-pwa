import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map } from 'rxjs';

import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate, OrderTemplateItem } from '../../../models/order-template/order-template.model';
import { AccountOrderTemplateDetailLineItemComponent } from '../../account-order-template-detail/account-order-template-detail-line-item/account-order-template-detail-line-item.component';

@Component({
  selector: 'ish-account-order-template-add-to-basket-dialog',
  templateUrl: './account-order-template-add-to-basket-dialog.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule, AccountOrderTemplateDetailLineItemComponent],
})
export class AccountOrderTemplateAddToBasketDialogComponent implements OnInit {
  readonly orderTemplate = input<OrderTemplate>();
  orderTemplateItems$: Observable<OrderTemplateItem[]>;
  items$: Observable<SkuQuantityType[]>;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private ngbModal: NgbModal,
    private orderTemplatesFacade: OrderTemplatesFacade
  ) {}

  ngOnInit() {
    this.orderTemplateItems$ = this.orderTemplatesFacade.orderTemplates$.pipe(
      map(orderTemplates => {
        const template = orderTemplates.find(t => t.id === this.orderTemplate().id);
        if (template && template.itemsCount !== template.items?.length) {
          this.orderTemplatesFacade.loadOrderTemplateDetails(this.orderTemplate().id);
        }
        return template.items || [];
      })
    );
    this.items$ = this.orderTemplateItems$.pipe(
      map(items => items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value })))
    );
  }

  /** Opens the modal. */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate, {
      ariaLabelledBy: 'order-template-preferences-title',
      size: 'lg',
      scrollable: true,
    });
  }

  /** Close the modal. */
  hide() {
    if (this.modal) {
      this.modal.close();
    }
  }
}
