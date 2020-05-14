import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-organization-management-root',
  template: `<div>
      <a routerLink="/logout" [queryParams]="{ returnUrl: '/login?returnUrl=/organization-management' }">Logout</a
      >&nbsp;
      <a routerLink="/organization-management/users">Users</a>
    </div>
    <hr />
    <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-creation-test
export class AppComponent {}
