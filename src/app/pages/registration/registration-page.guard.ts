import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { RegistrationPageComponent } from './registration-page.component';
import { RegistrationFormConfigurationService } from './services/registration-form-configuration/registration-form-configuration.service';

export function canDeactivateRegistrationPage(
  _: RegistrationPageComponent,
  currentRoute: ActivatedRouteSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  const registrationConfigurationService = inject(RegistrationFormConfigurationService);

  return registrationConfigurationService.canDeactivate(registrationConfigurationService.extractConfig(currentRoute));
}
