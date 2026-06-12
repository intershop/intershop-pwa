import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutType, PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-page',
  templateUrl: './account-punchout-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutPageComponent implements OnInit {
  punchoutTypes$: Observable<PunchoutType[]>;
  punchoutUsers$: Observable<PunchoutUser[]>;
  selectedPunchoutType$: Observable<PunchoutType>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  cxmlPunchoutUrl$: Observable<string>;
  ociPunchoutUrl$: Observable<string>;

  constructor(
    private accountFacade: AccountFacade,
    private appFacade: AppFacade,
    private punchoutFacade: PunchoutFacade
  ) {}

  ngOnInit() {
    this.punchoutUsers$ = this.punchoutFacade
      .punchoutUsersByRoute$()
      .pipe(map(users => users.sort((u1, u2) => (u1.login > u2.login ? 1 : -1))));
    this.punchoutTypes$ = this.punchoutFacade.supportedPunchoutTypes$;
    this.selectedPunchoutType$ = this.punchoutFacade.selectedPunchoutType$;
    this.loading$ = this.punchoutFacade.punchoutLoading$;
    this.error$ = this.punchoutFacade.punchoutError$ || this.punchoutFacade.punchoutTypesError$;
    this.cxmlPunchoutUrl$ = this.appFacade.getRestEndpoint$.pipe(
      withLatestFrom(this.accountFacade.customer$),
      map(([url, customer]) => `${url}/customers/${customer?.customerNo}/punchouts/cxml1.2/setuprequest`)
    );
    this.ociPunchoutUrl$ = this.appFacade.getPipelineEndpoint$.pipe(
      map(url => `${url}/ViewOCICatalogPWA-Start?USERNAME=<USERNAME>&PASSWORD=<PASSWORD>&HOOK_URL=<HOOK_URL>`)
    );
  }

  deleteUser(user: PunchoutUser) {
    this.punchoutFacade.deletePunchoutUser(user);
  }
}
