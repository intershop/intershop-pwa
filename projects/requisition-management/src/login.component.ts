import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    <div class="container">
      <h1>{{ 'account.requisitions.management' | translate }}</h1>
      <ish-login-form loginType="email"></ish-login-form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-creation-test
export class LoginComponent {}
