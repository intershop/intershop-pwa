import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';

/**
 * The Registration Approval component is shown after customer registration with a needed approval according to an ICM backoffice preference.
 */
@Component({
  selector: 'ish-registration-approval',
  templateUrl: './registration-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ServerHtmlDirective, TranslatePipe],
})
export class RegistrationApprovalComponent implements OnInit {
  email$: Observable<string>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.email$ = this.accountFacade.getCustomerApprovalEmail$;
  }
}
