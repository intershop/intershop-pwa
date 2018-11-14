import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ProductImageSharedModule } from '../shared/product/product-image.module';
import { SearchBoxSharedModule } from '../shared/search/search-box.module';

import { HeaderCheckoutComponent } from './components/header/header-checkout/header-checkout.component';
import { HeaderNavigationComponent } from './components/header/header-navigation/header-navigation.component';
import { SubCategoryNavigationComponent } from './components/header/header-navigation/sub-category-navigation/sub-category-navigation.component';
import { HeaderSimpleComponent } from './components/header/header-simple/header-simple.component';
import { HeaderStickyComponent } from './components/header/header-sticky/header-sticky.component';
import { HeaderComponent } from './components/header/header/header.component';
import { LanguageSwitchComponent } from './components/header/language-switch/language-switch.component';
import { LoginStatusComponent } from './components/header/login-status/login-status.component';
import { LogoutComponent } from './components/header/logout/logout.component';
import { MiniBasketComponent } from './components/header/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from './components/header/product-compare-status/product-compare-status.component';
import { UserInformationMobileComponent } from './components/header/user-information-mobile/user-information-mobile.component';
import { HeaderNavigationContainerComponent } from './containers/header/header-navigation/header-navigation.container';
import { HeaderContainerComponent } from './containers/header/header/header.container';
import { LanguageSwitchContainerComponent } from './containers/header/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from './containers/header/login-status/login-status.container';
import { MiniBasketContainerComponent } from './containers/header/mini-basket/mini-basket.container';
import { ProductCompareStatusContainerComponent } from './containers/header/product-compare-status/product-compare-status.container';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FeatureToggleModule } from './feature-toggle.module';
import { IconModule } from './icon.module';
import { PipesModule } from './pipes.module';

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
    ReactiveFormsModule,
    RouterModule,
    SearchBoxSharedModule,
    TranslateModule,
  ],
  declarations: [
    ClickOutsideDirective,
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
  exports: [HeaderCheckoutComponent, HeaderComponent, HeaderContainerComponent],
})
export class HeaderModule {}
