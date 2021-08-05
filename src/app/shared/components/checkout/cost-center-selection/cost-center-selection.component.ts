import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'ish-cost-center-selection',
  templateUrl: './cost-center-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterSelectionComponent implements OnInit {
  costCenters$: Observable<CostCenter[]>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.costCenters$ = this.checkoutFacade.getCostCentersForBusinessUser$();
  }
}
