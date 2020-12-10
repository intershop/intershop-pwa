import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-requisition-widget',
  templateUrl: './requisition-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class RequisitionWidgetComponent implements OnInit {
  numPendingRequisitions$: Observable<number>;
  totalAmountRequisitons$: Observable<Price>;

  requisitionsLoading$: Observable<boolean>;

  constructor(private requisitionFacade: RequisitionManagementFacade) {}

  ngOnInit() {
    const pendingRequisitions$ = this.requisitionFacade.requisitions$('buyer', 'PENDING');

    this.numPendingRequisitions$ = pendingRequisitions$.pipe(
      startWith([] as Requisition[]),
      map(reqs => reqs.length)
    );
    this.totalAmountRequisitons$ = pendingRequisitions$.pipe(
      map(reqs => reqs?.map(req => PriceItemHelper.selectType(req.totals?.total, 'gross'))),
      map(prices => {
        if (prices.length > 0) {
          return prices?.reduce(
            (curr: Price, acc: Price) => PriceHelper.sum(curr, acc),
            PriceHelper.empty(prices[0].currency ?? undefined)
          );
        } else {
          return PriceHelper.empty();
        }
      })
    );

    this.requisitionsLoading$ = this.requisitionFacade.requisitionsLoading$;
  }
}
