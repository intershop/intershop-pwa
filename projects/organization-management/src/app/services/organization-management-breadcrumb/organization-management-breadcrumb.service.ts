import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Injectable({ providedIn: 'root' })
export class OrganizationManagementBreadcrumbService {
  constructor(
    private appFacade: AppFacade,
    private organizationManagementFacade: OrganizationManagementFacade,
    private translateService: TranslateService
  ) {}

  breadcrumb$(prefix: string): Observable<BreadcrumbItem[]> {
    return this.appFacade.routingInProgress$.pipe(
      whenFalsy(),
      withLatestFrom(this.appFacade.path$.pipe(whenTruthy())),
      switchMap(([, path]) => {
        if (path.endsWith('users')) {
          return of([{ key: 'account.organization.user_management' }]);
        } else if (path.endsWith('users/create')) {
          return of([
            { key: 'account.organization.user_management', link: prefix + '/users' },
            { key: 'account.user.breadcrumbs.new_user.text' },
          ]);
        } else if (/users\/:B2BCustomerLogin(\/(profile|roles|budget))?$/.test(path)) {
          return this.organizationManagementFacade.selectedUser$.pipe(
            whenTruthy(),
            withLatestFrom(this.translateService.get('account.organization.user_management.user_detail.breadcrumb')),
            map(([user, translation]) =>
              path.endsWith('profile') || path.endsWith('roles') || path.endsWith('budget')
                ? // edit user detail
                  [
                    { key: 'account.organization.user_management', link: prefix + '/users' },
                    {
                      text: `${translation} - ${user.firstName} ${user.lastName}`,
                      link: `${prefix}/users/${user.login}`,
                    },
                    {
                      key: `account.user.update_${path.substr(path.lastIndexOf('/') + 1)}.heading`,
                    },
                  ]
                : // user detail
                  [
                    { key: 'account.organization.user_management', link: prefix + '/users' },
                    { text: translation + ` - ${user.firstName} ${user.lastName}` },
                  ]
            )
          );
        }
        return EMPTY;
      })
    );
  }
}
