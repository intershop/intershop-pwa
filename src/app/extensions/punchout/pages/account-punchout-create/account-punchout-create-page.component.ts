import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutType, PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutUserFormComponent } from '../../shared/punchout-user-form/punchout-user-form.component';

@Component({
  selector: 'ish-account-punchout-create-page',
  templateUrl: './account-punchout-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ErrorMessageComponent, LoadingComponent, PunchoutUserFormComponent, TranslatePipe],
})
export class AccountPunchoutCreatePageComponent implements OnInit {
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;
  selectedType$: Observable<PunchoutType>;

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.loading$ = this.punchoutFacade.punchoutLoading$;
    this.error$ = this.punchoutFacade.punchoutError$;
    this.selectedType$ = this.punchoutFacade.selectedPunchoutType$;
  }

  submitForm(user: PunchoutUser) {
    const email = user.login + uuid();
    this.punchoutFacade.addPunchoutUser({ ...user, email });
  }
}
