import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, map, race, timer } from 'rxjs';

import { isServerConfigurationLoaded } from 'ish-core/store/core/server-config';
import { whenTruthy } from 'ish-core/utils/operators';

import { RegistrationPageComponent } from './registration-page.component';
import { RegistrationFormConfigurationService } from './services/registration-form-configuration/registration-form-configuration.service';

export function registrationPageGuard(): Observable<boolean | UrlTree> {
  const store = inject(Store);

  // wait until the server-configuration is loaded, otherwise the newsletter-subscription
  // component won't be rendered when reloading the page
  return race(
    store.pipe(
      select(isServerConfigurationLoaded),
      whenTruthy(),
      map(() => true)
    ),
    timer(2000).pipe(map(() => true))
  );
}

export function canDeactivateRegistrationPage(
  _: RegistrationPageComponent,
  currentRoute: ActivatedRouteSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  const registrationConfigurationService = inject(RegistrationFormConfigurationService);

  return registrationConfigurationService.canDeactivate(registrationConfigurationService.extractConfig(currentRoute));
}
