import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { Basket } from 'ish-core/models/basket/basket.model';
import { BasketApprovalInfoComponent } from 'ish-shared/components/basket/basket-approval-info/basket-approval-info.component';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-checkout-receipt-requisition',
  imports: [AsyncPipe, BasketApprovalInfoComponent, RouterLink, ServerHtmlDirective, TranslatePipe],
  standalone: true,
  templateUrl: './checkout-receipt-requisition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptRequisitionComponent implements OnInit {
  @Input({ required: true }) basket: Basket;

  requisition$: Observable<Requisition>;

  constructor(private requisitionManagementFacade: RequisitionManagementFacade) {}

  ngOnInit() {
    if (this.basket) {
      this.requisition$ = this.requisitionManagementFacade.requisition$(this.basket.id);
    }
  }
}
