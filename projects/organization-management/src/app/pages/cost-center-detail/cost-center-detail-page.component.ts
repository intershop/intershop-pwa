import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-detail-page',
  templateUrl: './cost-center-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
