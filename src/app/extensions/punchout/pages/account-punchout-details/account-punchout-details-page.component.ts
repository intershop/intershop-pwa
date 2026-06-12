import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-details-page',
  templateUrl: './account-punchout-details-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutDetailsPageComponent implements OnInit {
  selectedUser$: Observable<PunchoutUser>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.selectedUser$ = this.punchoutFacade.selectedPunchoutUser$;
    this.loading$ = this.punchoutFacade.punchoutLoading$;
    this.error$ = this.punchoutFacade.punchoutError$;
  }

  submitForm(user: PunchoutUser) {
    this.punchoutFacade.updatePunchoutUser({ ...user, password: user.password || undefined });
  }
}
