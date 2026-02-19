import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LoginFormComponent } from 'ish-shared/components/login/login-form/login-form.component';

@Component({
  template: `
    <div class="container">
      <h1>{{ 'account.requisitions.management' | translate }}</h1>
      <ish-login-form loginType="email" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LoginFormComponent, TranslateModule],
})
export class LoginComponent {}
