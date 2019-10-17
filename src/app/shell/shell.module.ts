import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ClickOutsideDirective } from 'ish-core/directives/click-outside.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';

import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';

import { FooterComponent } from './footer/components/footer/footer.component';
import { HeaderCheckoutComponent } from './header/components/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from './header/components/header-default/header-default.component';
import { HeaderSimpleComponent } from './header/components/header-simple/header-simple.component';
import { LoginStatusComponent } from './header/components/login-status/login-status.component';
import { LogoutComponent } from './header/components/logout/logout.component';
import { MiniBasketComponent } from './header/components/mini-basket/mini-basket.component';
import { ProductImageComponent } from './header/components/product-image/product-image.component';
import { SearchBoxComponent } from './header/components/search-box/search-box.component';
import { SubCategoryNavigationComponent } from './header/components/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/components/user-information-mobile/user-information-mobile.component';
import { HeaderNavigationContainerComponent } from './header/containers/header-navigation/header-navigation.container';
import { HeaderContainerComponent } from './header/containers/header/header.container';
import { LanguageSwitchContainerComponent } from './header/containers/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from './header/containers/login-status/login-status.container';
import { MiniBasketContainerComponent } from './header/containers/mini-basket/mini-basket.container';
import { ProductCompareStatusContainerComponent } from './header/containers/product-compare-status/product-compare-status.container';
import { SearchBoxContainerComponent } from './header/containers/search-box/search-box.container';

const exportedComponents = [
  FooterComponent,
  HeaderContainerComponent,
  ProductImageComponent,
  SearchBoxContainerComponent,
  ServerHtmlDirective,
];

@NgModule({
  imports: [
    CommonModule,
    FeatureToggleModule,
    IconModule,
    NgbCollapseModule,
    NgbDropdownModule,
    PipesModule.forRoot(),
    QuotingExportsModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    ...exportedComponents,
    ClickOutsideDirective,
    HeaderCheckoutComponent,
    HeaderDefaultComponent,
    HeaderNavigationContainerComponent,
    HeaderSimpleComponent,
    LanguageSwitchContainerComponent,
    LoginStatusComponent,
    LoginStatusContainerComponent,
    LogoutComponent,
    MiniBasketComponent,
    MiniBasketContainerComponent,
    ProductCompareStatusContainerComponent,
    SearchBoxComponent,
    SubCategoryNavigationComponent,
    UserInformationMobileComponent,
  ],
  exports: [...exportedComponents],
})
export class ShellModule {}
