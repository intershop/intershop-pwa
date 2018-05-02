import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PipesModule } from '../shared/pipes.module';
import { SharedProductModule } from '../shared/shared-product.module';
import { SharedSearchModule } from '../shared/shared-search.module';
import { HeaderNavigationComponent } from './components/header/header-navigation/header-navigation.component';
import { SubCategoryNavigationComponent } from './components/header/header-navigation/sub-category-navigation/sub-category-navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSwitchComponent } from './components/header/language-switch/language-switch.component';
import { LoginStatusComponent } from './components/header/login-status/login-status.component';
import { MiniBasketComponent } from './components/header/mini-basket/mini-basket.component';
import { MobileBasketComponent } from './components/header/mobile-basket/mobile-basket.component';
import { ProductCompareStatusComponent } from './components/header/product-compare-status/product-compare-status.component';
import { HeaderNavigationContainerComponent } from './containers/header/header-navigation/header-navigation.container';
import { LanguageSwitchContainerComponent } from './containers/header/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from './containers/header/login-status/login-status.container';
import { MiniBasketContainerComponent } from './containers/header/mini-basket/mini-basket.container';
import { MobileBasketContainerComponent } from './containers/header/mobile-basket/mobile-basket.container';
import { ProductCompareStatusContainerComponent } from './containers/header/product-compare-status/product-compare-status.container';
import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    BsDropdownModule,
    CollapseModule,
    ReactiveFormsModule,
    PipesModule,
    SharedProductModule,
    SharedSearchModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    HeaderComponent,
    ProductCompareStatusComponent,
    ProductCompareStatusContainerComponent,
    MiniBasketComponent,
    MiniBasketContainerComponent,
    MobileBasketComponent,
    MobileBasketContainerComponent,
    LanguageSwitchComponent,
    LanguageSwitchContainerComponent,
    HeaderNavigationComponent,
    HeaderNavigationContainerComponent,
    SubCategoryNavigationComponent,
    LoginStatusComponent,
    LoginStatusContainerComponent,
    ClickOutsideDirective,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
