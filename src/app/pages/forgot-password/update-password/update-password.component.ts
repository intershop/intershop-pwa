import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Update Password Component handles the interaction for updating a password via password reminder email link.
 * See also {@link UpdatePasswordFormComponent}.
 */
@Component({
  selector: 'ish-update-password',
  templateUrl: './update-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  userID: string;
  secureCode: string;

  errorTranslationCode: string;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.error$ = this.accountFacade.passwordReminderError$;
    this.loading$ = this.accountFacade.userLoading$;

    this.accountFacade.resetPasswordReminder();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: { uid: string; Hash: string }) => {
      this.userID = params.uid;
      this.secureCode = params.Hash;
    });

    this.accountFacade.passwordReminderSuccess$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
      this.router.navigate(['/login'], { queryParams: { forcePageView: true, returnUrl: '/account' } });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  requestPasswordChange(data: { password: string }) {
    this.accountFacade.requestPasswordReminderUpdate({ ...data, userID: this.userID, secureCode: this.secureCode });
  }
}
