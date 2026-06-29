import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationSettingsCompanyComponent } from './organization-settings-company/organization-settings-company.component';

/**
 * The Organization Settings Company Page Component renders a page where the (business) user can change the company data.
 */
@Component({
  selector: 'ish-organization-settings-company-page',
  imports: [AsyncPipe, LoadingComponent, OrganizationSettingsCompanyComponent],
  standalone: true,
  templateUrl: './organization-settings-company-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationSettingsCompanyPageComponent implements OnInit {
  currentCustomer$: Observable<Customer>;
  userError$: Observable<HttpError>;
  userLoading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.currentCustomer$ = this.accountFacade.customer$;
    this.userError$ = this.accountFacade.userError$;
    this.userLoading$ = this.accountFacade.userLoading$;
  }

  updateCompanyProfile(customer: Customer) {
    this.accountFacade.updateCustomerProfile(customer, { message: 'account.profile.update_company_profile.message' });
  }
}
