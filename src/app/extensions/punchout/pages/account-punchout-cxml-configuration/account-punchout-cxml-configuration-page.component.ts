import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { CxmlConfiguration } from '../../models/cxml-configuration/cxml-configuration.model';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-cxml-configuration-page',
  standalone: false,
  templateUrl: './account-punchout-cxml-configuration-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutCxmlConfigurationPageComponent implements OnDestroy, OnInit {
  selectedUser$: Observable<PunchoutUser>;
  cxmlConfiguration$: Observable<CxmlConfiguration[]>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.selectedUser$ = this.punchoutFacade.selectedPunchoutUser$;
    this.cxmlConfiguration$ = this.punchoutFacade.cxmlConfiguration$();
    this.loading$ = this.punchoutFacade.cxmlConfigurationLoading$;
    this.error$ = this.punchoutFacade.cxmlConfigurationError$;
  }

  ngOnDestroy() {
    this.punchoutFacade.resetCxmlConfiguration();
  }
}
