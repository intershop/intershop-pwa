import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { determineSalutations } from 'ish-shared/forms/utils/form-utils';

/**
 * The Account Profile User Page Container Component renders a page where the user can change his profile data using the {@link AccountProfileUserPageComponent}
 */
@Component({
  selector: 'ish-account-profile-user-page',
  templateUrl: './account-profile-user-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileUserPageComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User>;
  userError$: Observable<HttpError>;
  userLoading$: Observable<boolean>;
  currentLocale$: Observable<Locale>;

  titles: string[];
  currentCountryCode = '';

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.currentUser$ = this.accountFacade.user$;
    this.userError$ = this.accountFacade.userError$;
    this.userLoading$ = this.accountFacade.userLoading$;
    this.currentLocale$ = this.appFacade.currentLocale$;

    // determine default language from session and available locales
    this.currentLocale$.pipe(whenTruthy(), take(1), takeUntil(this.destroy$)).subscribe(locale => {
      this.currentCountryCode = locale.lang.slice(3);
      this.titles = locale.lang ? determineSalutations(this.currentCountryCode) : undefined;
    });
  }

  updateUserProfile(user: User) {
    this.accountFacade.updateUserProfile(user);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
