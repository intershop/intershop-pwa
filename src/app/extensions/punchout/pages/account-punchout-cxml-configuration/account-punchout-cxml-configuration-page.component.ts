import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { CxmlConfiguration } from '../../models/cxml-configuration/cxml-configuration.model';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-cxml-configuration-page',
  templateUrl: './account-punchout-cxml-configuration-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutCxmlConfigurationPageComponent implements OnInit {
  selectedUser$: Observable<PunchoutUser>;
  cxmlConfiguration$: Observable<CxmlConfiguration[]>;
  loading$: Observable<boolean>;

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.selectedUser$ = this.punchoutFacade.selectedPunchoutUser$;
    this.cxmlConfiguration$ = this.punchoutFacade.cxmlConfiguration$();
    this.loading$ = this.punchoutFacade.cxmlConfigurationLoading$;
  }
}
