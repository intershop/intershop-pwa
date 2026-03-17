import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { UpdatePasswordFormComponent } from '../update-password-form/update-password-form.component';

/**
 * The Update Password Component handles the interaction for updating a password via password reminder email link.
 * See also {@link UpdatePasswordFormComponent}.
 */
@Component({
  selector: 'ish-update-password',
  templateUrl: './update-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ErrorMessageComponent, UpdatePasswordFormComponent, AsyncPipe, TranslatePipe, LoadingComponent],
})
export class UpdatePasswordComponent implements OnInit {
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  // visible-for-testing
  userID: string;
  // visible-for-testing
  secureCode: string;

  private destroyRef = inject(DestroyRef);

  constructor(
    private accountFacade: AccountFacade,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.error$ = this.accountFacade.passwordReminderError$;
    this.loading$ = this.accountFacade.userLoading$;

    this.accountFacade.resetPasswordReminder();

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: { uid: string; Hash: string }) => {
        this.userID = params.uid;
        this.secureCode = params.Hash;
      });

    this.accountFacade.passwordReminderSuccess$
      .pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/login'], { queryParams: { forcePageView: true, returnUrl: '/account' } });
      });
  }
  requestPasswordChange(data: { password: string }) {
    this.accountFacade.requestPasswordReminderUpdate({ ...data, userID: this.userID, secureCode: this.secureCode });
  }
}
