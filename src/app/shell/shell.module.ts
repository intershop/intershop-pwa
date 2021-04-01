import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { DirectivesModule } from 'ish-core/directives.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

import { QuickorderExportsModule } from '../extensions/quickorder/exports/quickorder-exports.module';
import { SentryExportsModule } from '../extensions/sentry/exports/sentry-exports.module';
import { SeoExportsModule } from '../extensions/seo/exports/seo-exports.module';
import { TrackingExportsModule } from '../extensions/tracking/exports/tracking-exports.module';
import { WishlistsExportsModule } from '../extensions/wishlists/exports/wishlists-exports.module';

import { CookiesBannerComponent } from './application/cookies-banner/cookies-banner.component';
import { FooterComponent } from './footer/footer/footer.component';
import { HeaderCheckoutComponent } from './header/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from './header/header-default/header-default.component';
import { HeaderNavigationComponent } from './header/header-navigation/header-navigation.component';
import { HeaderSimpleComponent } from './header/header-simple/header-simple.component';
import { HeaderComponent } from './header/header/header.component';
import { LanguageSwitchComponent } from './header/language-switch/language-switch.component';
import { LoginStatusComponent } from './header/login-status/login-status.component';
import { MiniBasketComponent } from './header/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from './header/product-compare-status/product-compare-status.component';
import { SubCategoryNavigationComponent } from './header/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/user-information-mobile/user-information-mobile.component';
import { LazyContentIncludeComponent } from './shared/lazy-content-include/lazy-content-include.component';
import { LazyMiniBasketContentComponent } from './shared/lazy-mini-basket-content/lazy-mini-basket-content.component';
import { LazySearchBoxComponent } from './shared/lazy-search-box/lazy-search-box.component';

const exportedComponents = [CookiesBannerComponent, FooterComponent, HeaderComponent];

@NgModule({
  imports: [
    AuthorizationToggleModule,
    CommonModule,
    DirectivesModule,
    FeatureToggleModule,
    IconModule,
    NgbCollapseModule,
    NgbDropdownModule,
    PipesModule,
    QuickorderExportsModule,
    RoleToggleModule,
    RouterModule,
    SentryExportsModule,
    SeoExportsModule,
    TrackingExportsModule,
    TranslateModule,
    WishlistsExportsModule,
  ],
  declarations: [
    ...exportedComponents,
    CookiesBannerComponent,
    HeaderCheckoutComponent,
    HeaderDefaultComponent,
    HeaderNavigationComponent,
    HeaderSimpleComponent,
    LanguageSwitchComponent,
    LazyContentIncludeComponent,
    LazyMiniBasketContentComponent,
    LazySearchBoxComponent,
    LoginStatusComponent,
    MiniBasketComponent,
    ProductCompareStatusComponent,
    SubCategoryNavigationComponent,
    UserInformationMobileComponent,
  ],
  exports: [...exportedComponents],
})
export class ShellModule {
  constructor(moduleLoader: ModuleLoaderService, injector: Injector) {
    moduleLoader.init(injector);
  }
}
