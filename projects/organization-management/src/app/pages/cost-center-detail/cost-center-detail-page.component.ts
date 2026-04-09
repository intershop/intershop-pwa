import { AsyncPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { CostCenterBudgetComponent } from '../../components/cost-center-budget/cost-center-budget.component';
import { CostCenterUsersListComponent } from '../../components/cost-center-users-list/cost-center-users-list.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-detail-page',
  templateUrl: './cost-center-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    CostCenterBudgetComponent,
    CostCenterUsersListComponent,
    ErrorMessageComponent,
    OrderListComponent,
    PricePipe,
    SlicePipe,
    TranslatePipe,
    RouterLink,
  ],
})
export class CostCenterDetailPageComponent implements OnInit {
  costCenter$: Observable<CostCenter>;
  costCentersError$: Observable<HttpError>;
  user$: Observable<User>;
  isEditable$: Observable<boolean>;

  constructor(
    private accountFacade: AccountFacade,
    private organizationManagementFacade: OrganizationManagementFacade
  ) {}

  ngOnInit() {
    this.costCenter$ = this.organizationManagementFacade.selectedCostCenter$;
    this.costCentersError$ = this.organizationManagementFacade.costCentersError$;
    this.user$ = this.accountFacade.user$;

    this.isEditable$ = this.organizationManagementFacade.isCostCenterEditable(this.costCenter$);
  }
}
