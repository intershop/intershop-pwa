import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';

@Component({
  selector: 'ish-header-checkout',
  templateUrl: './header-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LoginStatusComponent, RouterLink, TranslateModule],
})
export class HeaderCheckoutComponent {}
