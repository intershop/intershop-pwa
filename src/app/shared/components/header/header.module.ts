import { NgModule } from '@angular/core';
import { HeaderSlotComponent } from './header.component';
import { ProductCompareComponent } from './product-compare/product-compare.component';
import { RouterModule } from '@angular/router';
import { MiniCartComponent } from './mini-cart/mini-cart.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { WishListComponent } from './wishlist-status/wishlist-status.component';
import { LogoComponent } from './logo/logo.component';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { HeaderNavigationComponent } from './header-navigation/header-navigation.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { AccountLoginApiService, AccountLoginMockService, AccountLoginService } from '../../../pages/account-login/account-login-service';
import { SharedModule } from '../../shared-modules/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CategoryService } from './header-navigation/category-service/category.service';
import { CategoryMockService } from './header-navigation/category-service/category.service.mock';
import { CategoryApiService } from './header-navigation/category-service/category.service.api';
import { SearchBoxApiService } from './search-box/search-box-service/search-box.service.api';
import { SearchBoxMockService } from './search-box/search-box-service/search-box.service.mock';
import { SearchBoxService } from './search-box/search-box-service/search-box.service';
import {
  WishListService
} from '../../../pages/wish-list-page/wish-list-service/wish-list-service';

@NgModule({
  imports: [
    SharedModule,
    CollapseModule,
    BsDropdownModule
  ],
  exports: [
    HeaderSlotComponent,
    ProductCompareComponent
  ],
  declarations: [
    HeaderSlotComponent,
    ProductCompareComponent,
    MiniCartComponent,
    SearchBoxComponent,
    WishListComponent,
    LogoComponent,
    LanguageSwitchComponent,
    HeaderNavigationComponent,
    LoginStatusComponent
  ],
  providers: [AccountLoginApiService, AccountLoginMockService, AccountLoginService,
    CategoryService, CategoryMockService, CategoryApiService,
    SearchBoxApiService, SearchBoxMockService, SearchBoxService,
    WishListService
  ]
})

export class HeaderModule {

}
