import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    <div class="container">
      <h1>{{ 'account.requisitions.management' | translate }}</h1>
      <ish-login-form loginType="email" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
