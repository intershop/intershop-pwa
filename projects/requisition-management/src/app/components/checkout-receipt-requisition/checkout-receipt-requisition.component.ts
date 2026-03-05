import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { Basket } from 'ish-core/models/basket/basket.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { BasketApprovalInfoComponent } from 'ish-shared/components/basket/basket-approval-info/basket-approval-info.component';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@GenerateLazyComponent()
@Component({
  selector: 'ish-checkout-receipt-requisition',
  templateUrl: './checkout-receipt-requisition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgIf, ServerHtmlDirective, TranslatePipe, BasketApprovalInfoComponent, RouterLink],
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
