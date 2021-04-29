import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutType, PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-create-page',
  templateUrl: './account-punchout-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutCreatePageComponent implements OnInit {
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;
  selectedType$: Observable<PunchoutType>;

  punchoutTypeText: string;

  constructor(private punchoutFacade: PunchoutFacade, private translateService: TranslateService) {}

  ngOnInit() {
    this.loading$ = this.punchoutFacade.punchoutLoading$;
    this.error$ = this.punchoutFacade.punchoutError$;
    this.selectedType$ = this.punchoutFacade.selectedPunchoutType$;
  }

  submitForm(user: PunchoutUser) {
    const email = user.login + UUID.UUID();
    this.punchoutFacade.addPunchoutUser({ ...user, email });
  }

  getPunchoutTypeText(punchoutType: PunchoutType): string {
    return (this.punchoutTypeText = this.translateService.instant(`account.punchout.${punchoutType}.text`));
  }
}
