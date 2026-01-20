import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutUserFormComponent } from '../../shared/punchout-user-form/punchout-user-form.component';

@Component({
  selector: 'ish-account-punchout-details-page',
  templateUrl: './account-punchout-details-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ErrorMessageComponent, LoadingComponent, NgIf, PunchoutUserFormComponent, TranslateModule],
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
