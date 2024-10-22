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
        } else if (path.endsWith('settings')) {
          return of([{ key: 'account.organization.org_settings' }]);
        } else if (path.endsWith('settings/company')) {
          return of([
            { key: 'account.organization.org_settings', link: `${prefix}/settings` },
            { key: 'account.company_profile.heading' },
          ]);
        } else if (path.endsWith('cost-centers')) {
          return of([{ key: 'account.organization.cost_center_management' }]);
        } else if (path.endsWith('users/create')) {
          return of([
            { key: 'account.organization.user_management', link: `${prefix}/users` },
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
                    { key: 'account.organization.user_management', link: `${prefix}/users` },
                    {
                      text: `${translation} - ${user.firstName} ${user.lastName}`,
                      link: `${prefix}/users/${user.login}`,
                    },
                    {
                      key: `account.user.update_${path.substring(path.lastIndexOf('/') + 1)}.heading`,
                    },
                  ]
                : // user detail
                  [
                    { key: 'account.organization.user_management', link: `${prefix}/users` },
                    { text: `${translation} - ${user.firstName} ${user.lastName}` },
                  ]
            )
          );
        } else if (path.endsWith('cost-centers/create')) {
          return of([
            { key: 'account.organization.cost_center_management', link: `${prefix}/cost-centers` },
            { key: 'account.costcenter.create.heading' },
          ]);
        } else if (/cost-centers\/:CostCenterId(\/(edit|buyers))?$/.test(path)) {
          return this.organizationManagementFacade.selectedCostCenter$.pipe(
            whenTruthy(),
            map(cc =>
              path.endsWith('edit') || path.endsWith('buyers')
                ? [
                    { key: 'account.organization.cost_center_management', link: `${prefix}/cost-centers` },
                    {
                      text: `${cc.name}`,
                      link: `${prefix}/cost-centers/${cc.id}`,
                    },
                    {
                      key: `account.costcenter.details.${path.substring(path.lastIndexOf('/') + 1)}.heading`,
                    },
                  ]
                : [
                    { key: 'account.organization.cost_center_management', link: `${prefix}/cost-centers` },
                    { text: cc.name },
                  ]
            )
          );
        }
        return EMPTY;
      })
    );
  }
}
