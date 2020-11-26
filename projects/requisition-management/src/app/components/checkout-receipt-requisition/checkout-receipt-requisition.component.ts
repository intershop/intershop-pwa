import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@GenerateLazyComponent()
@Component({
  selector: 'ish-checkout-receipt-requisition',
  templateUrl: './checkout-receipt-requisition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptRequisitionComponent implements OnInit {
  @Input() basket: Basket;

  requisition$: Observable<Requisition>;

  constructor(private requisitionManagementFacade: RequisitionManagementFacade) {}

  ngOnInit() {
    if (this.basket) {
      this.requisition$ = this.requisitionManagementFacade.requisition$(this.basket.id);
    }
  }
}
