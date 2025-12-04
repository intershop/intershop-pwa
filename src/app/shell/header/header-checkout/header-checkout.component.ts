import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { LoginStatusComponent } from '../login-status/login-status.component';

@Component({
    selector: 'ish-header-checkout',
    templateUrl: './header-checkout.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        LoginStatusComponent,
        RouterLink,
        TranslateModule,
    ],
})
export class HeaderCheckoutComponent {}
