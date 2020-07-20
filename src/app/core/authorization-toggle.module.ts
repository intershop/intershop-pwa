import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizationToggleDirective } from './directives/authorization-toggle.directive';
import { AuthorizationToggleService, checkPermission } from './utils/authorization-toggle/authorization-toggle.service';
import { whenTruthy } from './utils/operators';

@NgModule({
  declarations: [AuthorizationToggleDirective],
  exports: [AuthorizationToggleDirective],
})
export class AuthorizationToggleModule {
  private static permissions = new ReplaySubject<string[]>(1);

  static forTesting(...permissions: string[]): ModuleWithProviders<AuthorizationToggleModule> {
    AuthorizationToggleModule.switchTestingPermissions(...permissions);
    return {
      ngModule: AuthorizationToggleModule,
      providers: [
        {
          provide: AuthorizationToggleService,
          useValue: {
            isAuthorizedTo: (permission: string) =>
              AuthorizationToggleModule.permissions.pipe(
                whenTruthy(),
                map(perms => checkPermission(perms, permission))
              ),
          },
        },
      ],
    };
  }

  static switchTestingPermissions(...permissions: string[]) {
    AuthorizationToggleModule.permissions.next(permissions);
  }
}

export { AuthorizationToggleService } from './utils/authorization-toggle/authorization-toggle.service';
export { AuthorizationToggleGuard } from './guards/authorization-toggle.guard';
