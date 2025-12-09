import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CompareExportsModule } from 'src/app/extensions/compare/exports/compare-exports.module';
import { QuickorderExportsModule } from 'src/app/extensions/quickorder/exports/quickorder-exports.module';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';

import { WishlistsExportsModule } from '../../../extensions/wishlists/exports/wishlists-exports.module';

@Component({
  selector: 'ish-user-information-mobile',
  templateUrl: './user-information-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LoginStatusComponent,
    FeatureToggleModule,
    CompareExportsModule,
    QuickorderExportsModule,
    WishlistsExportsModule,
    LanguageSwitchComponent,
    TranslateModule,
  ],
})
export class UserInformationMobileComponent {}
