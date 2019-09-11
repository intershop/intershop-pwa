import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';
import { getCurrentLocale } from 'ish-core/store/locale';
import { UpdateUser, getLoggedInUser, getUserError, getUserLoading } from 'ish-core/store/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { determineSalutations } from 'ish-shared/forms/utils/form-utils';

/**
 * The Account Profile User Page Container Component renders a page where the user can change his profile data using the {@link AccountProfileUserPageComponent}
 */
@Component({
  selector: 'ish-account-profile-user-page-container',
  templateUrl: './account-profile-user-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileUserPageContainerComponent implements OnInit {
  currentUser$ = this.store.pipe(select(getLoggedInUser));
  currentLocale$ = this.store.pipe(select(getCurrentLocale));
  userError$ = this.store.pipe(select(getUserError));
  userLoading$ = this.store.pipe(select(getUserLoading));

  titles: string[];
  currentCountryCode = '';

  constructor(private store: Store<{}>, @Inject(AVAILABLE_LOCALES) public locales: Locale[]) {}

  ngOnInit() {
    // determine default language from session and available locales
    this.currentLocale$
      .pipe(
        whenTruthy(),
        take(1)
      )
      .subscribe(locale => {
        this.currentCountryCode = locale.lang.slice(3);
        this.titles = locale.lang ? determineSalutations(this.currentCountryCode) : undefined;
      });
  }

  updateUserProfile(user: User) {
    this.store.dispatch(new UpdateUser({ user, successMessage: 'account.profile.update_profile.message' }));
  }
}
