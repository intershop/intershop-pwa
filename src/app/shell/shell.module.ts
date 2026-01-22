import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { DirectivesModule } from 'ish-core/directives.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { PipesModule } from 'ish-core/pipes.module';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { SearchBoxComponent } from 'ish-shared/components/search/search-box/search-box.component';

import { CompareExportsModule } from '../extensions/compare/exports/compare-exports.module';
import { OrderTemplatesExportsModule } from '../extensions/order-templates/exports/order-templates-exports.module';
import { QuickorderExportsModule } from '../extensions/quickorder/exports/quickorder-exports.module';
import { SeoExportsModule } from '../extensions/seo/exports/seo-exports.module';
import { StoreLocatorExportsModule } from '../extensions/store-locator/exports/store-locator-exports.module';
import { TrackingExportsModule } from '../extensions/tracking/exports/tracking-exports.module';
import { WishlistsExportsModule } from '../extensions/wishlists/exports/wishlists-exports.module';

import { CookiesBannerComponent } from './application/cookies-banner/cookies-banner.component';
import { FooterComponent } from './footer/footer/footer.component';
import { BackToTopComponent } from './header/back-to-top/back-to-top.component';
import { HeaderCheckoutComponent } from './header/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from './header/header-default/header-default.component';
import { HeaderSimpleComponent } from './header/header-simple/header-simple.component';
import { HeaderComponent } from './header/header/header.component';
import { LanguageSwitchComponent } from './header/language-switch/language-switch.component';
import { LoginStatusComponent } from './header/login-status/login-status.component';
import { MiniBasketComponent } from './header/mini-basket/mini-basket.component';
import { SubCategoryNavigationComponent } from './header/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/user-information-mobile/user-information-mobile.component';
import { ShellLazyComponentsModule } from './shared/shell-lazy-components.module';

const exportedComponents = [CookiesBannerComponent, FooterComponent, HeaderComponent];

@NgModule({
  imports: [
    AuthorizationToggleModule,
    BackToTopComponent,
    CommonModule,
    CompareExportsModule,
    CookiesBannerComponent,
    CookiesBannerComponent,
    DirectivesModule,
    FeatureToggleModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbPopoverModule,
    OrderTemplatesExportsModule,
    PipesModule,
    QuickorderExportsModule,
    RoleToggleModule,
    RouterModule,
    SearchBoxComponent,
    SeoExportsModule,
    ShellLazyComponentsModule,
    StoreLocatorExportsModule,
    HeaderCheckoutComponent,
    SubCategoryNavigationComponent,
    ...exportedComponents,
    TrackingExportsModule,
    TranslateModule,
    WishlistsExportsModule,
    HeaderDefaultComponent,
    HeaderSimpleComponent,
    LanguageSwitchComponent,
    LoginStatusComponent,
    MiniBasketComponent,
    UserInformationMobileComponent,
    WishlistsExportsModule,
  ],
  exports: [...exportedComponents, ShellLazyComponentsModule],
})
export class ShellModule {
  constructor(moduleLoader: ModuleLoaderService, injector: Injector) {
    moduleLoader.init(injector);
  }
}
