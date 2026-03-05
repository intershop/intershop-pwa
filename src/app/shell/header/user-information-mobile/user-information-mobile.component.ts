import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductCompareStatusComponent } from 'src/app/extensions/compare/shared/product-compare-status/product-compare-status.component';
import { QuickorderLinkComponent } from 'src/app/extensions/quickorder/shared/quickorder-link/quickorder-link.component';
import { WishlistsLinkComponent } from 'src/app/extensions/wishlists/shared/wishlists-link/wishlists-link.component';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';

@Component({
  selector: 'ish-user-information-mobile',
  templateUrl: './user-information-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LoginStatusComponent,
    FeatureToggleModule,
    ProductCompareStatusComponent,
    QuickorderLinkComponent,
    WishlistsLinkComponent,
    TranslatePipe,
  ],
})
export class UserInformationMobileComponent {}
