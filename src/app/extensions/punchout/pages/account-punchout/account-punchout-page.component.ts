import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.punchoutUsers$ = this.punchoutFacade.punchoutUsers$();
    this.loading$ = this.punchoutFacade.punchoutLoading$;
    this.error$ = this.punchoutFacade.punchoutError$;
  }
}
