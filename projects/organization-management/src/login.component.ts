import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoginFormComponent } from 'ish-shared/components/login/login-form/login-form.component';

@Component({
  imports: [LoginFormComponent],
  standalone: true,
  template: `
    <div class="container">
      <h1>Organization Management</h1>
      <ish-login-form loginType="email" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
