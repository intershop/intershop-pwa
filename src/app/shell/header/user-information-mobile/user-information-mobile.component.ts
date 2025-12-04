import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitchComponent } from '../language-switch/language-switch.component';
import { WishlistsExportsModule } from '../../../extensions/wishlists/exports/wishlists-exports.module';
import { LazyQuickorderLinkComponent } from '../../../extensions/quickorder/exports/lazy-quickorder-link/lazy-quickorder-link.component';
import { LazyProductCompareStatusComponent } from '../../../extensions/compare/exports/lazy-product-compare-status/lazy-product-compare-status.component';
import { FeatureToggleModule } from '../../../core/feature-toggle.module';
import { LoginStatusComponent } from '../login-status/login-status.component';

@Component({
    selector: 'ish-user-information-mobile',
    templateUrl: './user-information-mobile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        LoginStatusComponent,
        FeatureToggleModule,
        LazyProductCompareStatusComponent,
        LazyQuickorderLinkComponent,
        WishlistsExportsModule,
        LanguageSwitchComponent,
        TranslateModule,
    ],
})
export class UserInformationMobileComponent {}
