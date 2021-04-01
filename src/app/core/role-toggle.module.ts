import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotRoleToggleDirective } from './directives/not-role-toggle.directive';
import { whenTruthy } from './utils/operators';
import { RoleToggleService, checkRole } from './utils/role-toggle/role-toggle.service';

@NgModule({
  declarations: [NotRoleToggleDirective],
  exports: [NotRoleToggleDirective],
})
export class RoleToggleModule {
  private static roleIds = new ReplaySubject<string[]>(1);

  static forTesting(...roleIds: string[]): ModuleWithProviders<RoleToggleModule> {
    RoleToggleModule.switchTestingRoles(...roleIds);
    return {
      ngModule: RoleToggleModule,
      providers: [
        {
          provide: RoleToggleService,
          useValue: {
            hasRole: (roleId: string | string[]) =>
              RoleToggleModule.roleIds.pipe(
                whenTruthy(),
                map(roles => checkRole(roles, roleId))
              ),
          },
        },
      ],
    };
  }

  static switchTestingRoles(...roleIds: string[]) {
    RoleToggleModule.roleIds.next(roleIds);
  }
}

export { RoleToggleService } from './utils/role-toggle/role-toggle.service';
