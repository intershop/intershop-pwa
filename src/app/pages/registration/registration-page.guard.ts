import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { RegistrationFormConfigurationService } from 'ish-core/services/registration-form-configuration/registration-form-configuration.service';

import { RegistrationPageComponent } from './registration-page.component';

@Injectable()
export class RegistrationPageGuard implements CanDeactivate<RegistrationPageComponent> {
  constructor(private registrationConfigurationService: RegistrationFormConfigurationService) {}

  canDeactivate(
    _: RegistrationPageComponent,
    currentRoute: ActivatedRouteSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.registrationConfigurationService.canDeactivate(
      this.registrationConfigurationService.extractConfig(currentRoute)
    );
  }
}
