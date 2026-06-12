import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';

/**
 * The Registration Approval component is shown after customer registration with a needed approval according to an ICM backoffice preference.
 */
@Component({
  selector: 'ish-registration-approval',
  templateUrl: './registration-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationApprovalComponent implements OnInit {
  email$: Observable<string>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.email$ = this.accountFacade.getCustomerApprovalEmail$;
  }
}
