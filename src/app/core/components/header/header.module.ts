import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse/collapse.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown/bs-dropdown.module';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { SuggestService } from '../../services/suggest/suggest.service';
import { HeaderNavigationComponent } from './header-navigation/header-navigation.component';
import { SubCategoryNavigationComponent } from './header-navigation/subcategory-navigation/subcategory-navigation.component';
import { HeaderComponent } from './header.component';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { MiniCartComponent } from './mini-cart/mini-cart.component';
import { ProductCompareStatusComponent } from './product-compare-status/product-compare-status.component';
import { SearchBoxComponent } from './search-box/search-box.component';

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
    MiniCartComponent,
    SearchBoxComponent,
    LanguageSwitchComponent,
    HeaderNavigationComponent,
    LoginStatusComponent,
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
