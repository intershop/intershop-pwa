import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    <div class="container">
      <h1>Organization Management</h1>
      <ish-login-form loginType="email"></ish-login-form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
