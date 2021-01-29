import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-page',
  templateUrl: './account-punchout-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutPageComponent implements OnInit {
  punchoutUsers$: Observable<PunchoutUser[]>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  punchoutUrl = `${window.location.origin}/punchout?USERNAME=<USERNAME>&PASSWORD=<PASSWORD>&HOOK_URL=<HOOK_URL>`;

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.punchoutUsers$ = this.punchoutFacade
      .punchoutUsers$()
      .pipe(map(users => users.sort((u1, u2) => (u1.login > u2.login ? 1 : -1))));
    this.loading$ = this.punchoutFacade.punchoutLoading$;
    this.error$ = this.punchoutFacade.punchoutError$;
  }

  deleteUser(user: PunchoutUser) {
    this.punchoutFacade.deletePunchoutUser(user.login);
  }
}
