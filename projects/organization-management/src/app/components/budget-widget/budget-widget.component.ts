import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { UserBudget } from '../../models/user-budget/user-budget.model';
import { OrganizationManagementStoreModule } from '../../store/organization-management-store.module';
import { BudgetInfoComponent } from '../budget-info/budget-info.component';
import { UserBudgetComponent } from '../user-budget/user-budget.component';

@Component({
  selector: 'ish-budget-widget',
  templateUrl: './budget-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    BudgetInfoComponent,
    NgIf,
    OrganizationManagementStoreModule,
    TranslatePipe,
    UserBudgetComponent,
    ErrorMessageComponent,
    InfoBoxComponent,
    LoadingComponent,
    AuthorizationToggleDirective,
    RouterLink,
  ],
})
@GenerateLazyComponent()
export class BudgetWidgetComponent implements OnInit {
  userBudget$: Observable<UserBudget>;
  budgetLoading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.userBudget$ = this.organizationManagementFacade.loggedInUserBudget$();
    this.budgetLoading$ = this.organizationManagementFacade.loggedInUserBudgetLoading$;
    this.error$ = this.organizationManagementFacade.loggedInUserBudgetError$;
  }
}
