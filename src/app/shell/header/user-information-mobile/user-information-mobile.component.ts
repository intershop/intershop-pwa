import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FEATURE_TOGGLE_IMPORTS } from 'ish-core/feature-toggle';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';

import { ProductCompareStatusComponent } from '../../../extensions/compare/shared/product-compare-status/product-compare-status.component';
import { QuickorderLinkComponent } from '../../../extensions/quickorder/shared/quickorder-link/quickorder-link.component';
import { WishlistsLinkComponent } from '../../../extensions/wishlists/shared/wishlists-link/wishlists-link.component';

@Component({
  selector: 'ish-user-information-mobile',
  imports: [
    LoginStatusComponent,
    ...FEATURE_TOGGLE_IMPORTS,
    ProductCompareStatusComponent,
    QuickorderLinkComponent,
    WishlistsLinkComponent,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './user-information-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInformationMobileComponent {}
