import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketMerchantMessageViewComponent } from 'ish-shared/components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { RequisitionRejectDialogComponent } from '../../components/requisition-reject-dialog/requisition-reject-dialog.component';
import { RequisitionContextFacade } from '../../facades/requisition-context.facade';
import { Requisition } from '../../models/requisition/requisition.model';

import { RequisitionBuyerApprovalComponent } from './requisition-buyer-approval/requisition-buyer-approval.component';
import { RequisitionCostCenterApprovalComponent } from './requisition-cost-center-approval/requisition-cost-center-approval.component';
import { RequisitionSummaryComponent } from './requisition-summary/requisition-summary.component';

@Component({
  selector: 'ish-requisition-detail-page',
  templateUrl: './requisition-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequisitionContextFacade],
  standalone: true,
  imports: [
    AddressComponent,
    AsyncPipe,
    AuthorizationToggleDirective,
    BasketCostSummaryComponent,
    BasketMerchantMessageViewComponent,
    BasketShippingMethodComponent,
    ErrorMessageComponent,
    InfoBoxComponent,
    LineItemListComponent,
    NgIf,
    NgTemplateOutlet,
    RequisitionBuyerApprovalComponent,
    RequisitionCostCenterApprovalComponent,
    RequisitionSummaryComponent,
    RouterModule,
    ServerSettingPipe,
    TranslateModule,
    RequisitionRejectDialogComponent,
    LoadingComponent,
  ],
})
export class RequisitionDetailPageComponent implements OnInit {
  requisition$: Observable<Requisition>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  view$: Observable<'buyer' | 'approver'>;

  constructor(private context: RequisitionContextFacade) {}

  ngOnInit() {
    this.requisition$ = this.context.select('entity');
    this.loading$ = this.context.select('loading');
    this.error$ = this.context.select('error');
    this.view$ = this.context.select('view');
  }

  approveRequisition() {
    this.context.approveRequisition$();
  }

  rejectRequisition(comment: string) {
    this.context.rejectRequisition$(comment);
    return false;
  }
}
