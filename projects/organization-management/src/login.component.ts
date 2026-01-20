import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoginFormComponent } from 'ish-shared/components/login/login-form/login-form.component';

@Component({
  template: `
    <div class="container">
      <h1>Organization Management</h1>
      <ish-login-form loginType="email" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LoginFormComponent],
})
export class LoginComponent {}
