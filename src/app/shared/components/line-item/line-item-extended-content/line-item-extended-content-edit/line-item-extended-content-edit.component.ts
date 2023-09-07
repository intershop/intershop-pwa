import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';

/**
 * The Line Item Edit Dialog Component displays an edit-dialog of a line items to edit quantity and variation.
 */
@Component({
  selector: 'ish-line-item-extended-content-edit',
  templateUrl: './line-item-extended-content-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemExtendedContentEditComponent implements OnInit, OnDestroy {
  @Input() itemId: string;
  customerProductID: string;
  partialOrderNo: string;
  isFeatureEnabled = false;

  private destroy$ = new Subject<void>();

  constructor(
    private context: ProductContextFacade,
    private checkoutFacade: CheckoutFacade,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit() {
    this.isFeatureEnabled = this.featureToggleService.enabled('extendedLineItemContent');
    this.checkoutFacade.basketLineItems$.pipe(takeUntil(this.destroy$)).subscribe(lineItems =>
      lineItems
        .filter(lineItem => lineItem.id === this.itemId)
        .forEach(i => {
          this.customerProductID = i.customerProductID ? i.customerProductID : '';
          this.partialOrderNo = i.partialOrderNo ? i.partialOrderNo : '';
        })
    );
  }

  changePartialOrderNo(target: EventTarget) {
    this.context.set('partialOrderNo', () => (target as HTMLDataElement).value);
  }

  changeCustomerProductID(target: EventTarget) {
    this.context.set('customerProductID', () => (target as HTMLDataElement).value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
