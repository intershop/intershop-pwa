import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate, OrderTemplateItem } from '../../../models/order-template/order-template.model';
import { OrderTemplateAddToCartItemComponent } from '../order-template-add-to-cart-item/order-template-add-to-cart-item.component';

@Component({
  selector: 'ish-order-template-add-to-cart-dialog',
  templateUrl: './order-template-add-to-cart-dialog.component.html',
  styleUrls: ['./order-template-add-to-cart-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OrderTemplateAddToCartItemComponent, SharedModule],
  providers: [ProductContextFacade],
})
export class OrderTemplateAddToCartDialogComponent implements OnInit {
  readonly orderTemplate = input<OrderTemplate>();
  orderTemplateItems$: Observable<OrderTemplateItem[]>;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private ngbModal: NgbModal,
    private orderTemplatesFacade: OrderTemplatesFacade,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    // Configure the dialog's context to show addToBasket and provide initial parts.
    // The button (without its own ishProductContext) uses this context directly.
    // addToBasket() checks: children (registered after debounceTime(0)) → parts (our fallback) → self
    this.context.config = { addToBasket: true };

    this.orderTemplateItems$ = this.orderTemplatesFacade.orderTemplates$.pipe(
      map(orderTemplates => {
        const template = orderTemplates.find(t => t.id === this.orderTemplate().id);
        if (template && template.itemsCount !== template.items?.length) {
          this.orderTemplatesFacade.loadOrderTemplateDetails(this.orderTemplate().id);
        }
        return template.items || [];
      })
    );

    // Connect parts on the dialog's context as fallback for addToBasket().
    // Once children register (after debounceTime(0)), addToBasket() will prefer children over parts.
    this.context.connect(
      'parts',
      this.orderTemplateItems$.pipe(
        map(items => items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value })))
      )
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
