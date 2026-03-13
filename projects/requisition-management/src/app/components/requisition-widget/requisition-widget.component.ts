import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-requisition-widget',
  templateUrl: './requisition-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, InfoBoxComponent, LoadingComponent, NgIf, PricePipe, TranslatePipe, RouterLink],
})
export class RequisitionWidgetComponent implements OnInit {
  numPendingRequisitions$: Observable<number>;
  totalAmountRequisitions$: Observable<Price>;

  requisitionsLoading$: Observable<boolean>;

  constructor(private requisitionFacade: RequisitionManagementFacade) {}

  ngOnInit() {
    const pendingRequisitions$ = this.requisitionFacade.requisitions$('buyer', 'PENDING');

    this.numPendingRequisitions$ = pendingRequisitions$.pipe(
      startWith([] as Requisition[]),
      map(requisitions => requisitions.length)
    );
    this.totalAmountRequisitions$ = pendingRequisitions$.pipe(
      map(requisitions => requisitions?.map(req => PriceItemHelper.selectType(req.totals?.total, 'gross'))),
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
