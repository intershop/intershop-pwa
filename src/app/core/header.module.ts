import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse/collapse.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown/bs-dropdown.module';
import { HeaderNavigationComponent } from './components/header/header-navigation/header-navigation.component';
import { SubCategoryNavigationComponent } from './components/header/header-navigation/subcategory-navigation/subcategory-navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSwitchComponent } from './components/header/language-switch/language-switch.component';
import { LoginStatusComponent } from './components/header/login-status/login-status.component';
import { MiniCartComponent } from './components/header/mini-cart/mini-cart.component';
import { MobileCartComponent } from './components/header/mobile-cart/mobile-cart.component';
import { ProductCompareStatusComponent } from './components/header/product-compare-status/product-compare-status.component';
import { SearchBoxComponent } from './components/header/search-box/search-box.component';
import { LanguageSwitchContainerComponent } from './containers/header/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from './containers/header/login-status/login-status.container';
import { MiniCartContainerComponent } from './containers/header/mini-cart/mini-cart.container';
import { MobileCartContainerComponent } from './containers/header/mobile-cart/mobile-cart.container';
import { ProductCompareStatusContainerComponent } from './containers/header/product-compare-status/product-compare-status.container';
import { AccountLoginService } from './services/account-login/account-login.service';
import { CategoriesService } from './services/categories/categories.service';
import { SuggestService } from './services/suggest/suggest.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    BsDropdownModule,
    CollapseModule,
  ],
  declarations: [
    HeaderComponent,
    ProductCompareStatusComponent,
    ProductCompareStatusContainerComponent,
    MiniCartComponent,
    MiniCartContainerComponent,
    MobileCartComponent,
    MobileCartContainerComponent,
    SearchBoxComponent,
    LanguageSwitchComponent,
    LanguageSwitchContainerComponent,
    HeaderNavigationComponent,
    LoginStatusComponent,
    LoginStatusContainerComponent,
    SubCategoryNavigationComponent
  ],
  providers: [
    AccountLoginService,
    CategoriesService,
    SuggestService,
  ],
  exports: [
    HeaderComponent
  ]
})

export class HeaderModule { }
