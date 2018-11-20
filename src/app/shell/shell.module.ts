import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ClickOutsideDirective } from 'ish-core/directives/click-outside.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { ProductImageSharedModule } from '../shared/product/product-image.module';
import { SearchBoxSharedModule } from '../shared/search/search-box.module';

import { FooterComponent } from './footer/components/footer/footer.component';
import { HeaderCheckoutComponent } from './header/components/header-checkout/header-checkout.component';
import { HeaderNavigationComponent } from './header/components/header-navigation/header-navigation.component';
import { HeaderSimpleComponent } from './header/components/header-simple/header-simple.component';
import { HeaderStickyComponent } from './header/components/header-sticky/header-sticky.component';
import { HeaderComponent } from './header/components/header/header.component';
import { LanguageSwitchComponent } from './header/components/language-switch/language-switch.component';
import { LoginStatusComponent } from './header/components/login-status/login-status.component';
import { LogoutComponent } from './header/components/logout/logout.component';
import { MiniBasketComponent } from './header/components/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from './header/components/product-compare-status/product-compare-status.component';
import { SubCategoryNavigationComponent } from './header/components/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/components/user-information-mobile/user-information-mobile.component';
import { HeaderNavigationContainerComponent } from './header/containers/header-navigation/header-navigation.container';
import { HeaderContainerComponent } from './header/containers/header/header.container';
import { LanguageSwitchContainerComponent } from './header/containers/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from './header/containers/login-status/login-status.container';
import { MiniBasketContainerComponent } from './header/containers/mini-basket/mini-basket.container';
import { ProductCompareStatusContainerComponent } from './header/containers/product-compare-status/product-compare-status.container';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FeatureToggleModule,
    IconModule,
    NgbCollapseModule,
    NgbDropdownModule,
    PipesModule,
    ProductImageSharedModule,
    RouterModule,
    SearchBoxSharedModule,
    TranslateModule,
  ],
  declarations: [
    ClickOutsideDirective,
    FooterComponent,
    HeaderCheckoutComponent,
    HeaderComponent,
    HeaderContainerComponent,
    HeaderNavigationComponent,
    HeaderNavigationContainerComponent,
    HeaderSimpleComponent,
    HeaderStickyComponent,
    LanguageSwitchComponent,
    LanguageSwitchContainerComponent,
    LoginStatusComponent,
    LoginStatusContainerComponent,
    LogoutComponent,
    MiniBasketComponent,
    MiniBasketContainerComponent,
    ProductCompareStatusComponent,
    ProductCompareStatusContainerComponent,
    SubCategoryNavigationComponent,
    UserInformationMobileComponent,
  ],
  exports: [FooterComponent, HeaderCheckoutComponent, HeaderContainerComponent],
})
export class ShellModule {}
