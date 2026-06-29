import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';

@Component({
  selector: 'ish-header-checkout',
  imports: [LoginStatusComponent, RouterLink, TranslatePipe],
  standalone: true,
  templateUrl: './header-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderCheckoutComponent {}
