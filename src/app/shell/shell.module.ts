import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DeferLoadModule } from '@trademe/ng-defer-load';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { ClickOutsideDirective } from 'ish-core/directives/click-outside.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';

import { CaptchaExportsModule } from '../extensions/captcha/exports/captcha-exports.module';
import { OrderTemplatesExportsModule } from '../extensions/order-templates/exports/order-templates-exports.module';
import { QuickorderExportsModule } from '../extensions/quickorder/exports/quickorder-exports.module';
import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';
import { TactonExportsModule } from '../extensions/tacton/exports/tacton-exports.module';
import { WishlistsExportsModule } from '../extensions/wishlists/exports/wishlists-exports.module';

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
import { ProductImageComponent } from './header/product-image/product-image.component';
import { SearchBoxComponent } from './header/search-box/search-box.component';
import { SubCategoryNavigationComponent } from './header/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/user-information-mobile/user-information-mobile.component';

const importExportModules = [
  CaptchaExportsModule,
  OrderTemplatesExportsModule,
  QuickorderExportsModule,
  QuotingExportsModule,
  TactonExportsModule,
  WishlistsExportsModule,
];

const exportedComponents = [
  FooterComponent,
  HeaderComponent,
  ProductImageComponent,
  SearchBoxComponent,
  ServerHtmlDirective,
];

@NgModule({
  imports: [
    ...importExportModules,
    AuthorizationToggleModule,
    CommonModule,
    DeferLoadModule,
    FeatureToggleModule,
    IconModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    PipesModule.forRoot(),
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    ...exportedComponents,
    ClickOutsideDirective,
    HeaderCheckoutComponent,
    HeaderDefaultComponent,
    HeaderNavigationComponent,
    HeaderSimpleComponent,
    LanguageSwitchComponent,
    LoginStatusComponent,
    MiniBasketComponent,
    ProductCompareStatusComponent,
    SubCategoryNavigationComponent,
    UserInformationMobileComponent,
  ],
  exports: [...exportedComponents, ...importExportModules],
})
export class ShellModule {}
