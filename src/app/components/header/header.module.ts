import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { ProductCompareStatusComponent } from './product-compare-status/product-compare-status.component';
import { MiniCartComponent } from './mini-cart/mini-cart.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { WishListComponent } from './wishlist-status/wishlist-status.component';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { HeaderNavigationComponent } from './header-navigation/header-navigation.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { AccountLoginApiService, AccountLoginMockService, AccountLoginService } from '../../services/account-login';
import { SharedModule } from '../../modules/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CategoriesService } from '../../services/categories/categories.service';
import { CategoriesMockService } from '../../services/categories/categories.service.mock';
import { CategoriesApiService } from '../../services/categories/categories.service.api';
import { SearchBoxApiService } from '../../services/suggest/search-box.service.api';
import { SearchBoxMockService } from '../../services/suggest/search-box.service.mock';
import { SearchBoxService } from '../../services/suggest/search-box.service';
import { WishListService } from '../../services/wishlists/wishlists.service';

@NgModule({
  imports: [
    SharedModule,
    CollapseModule,
    BsDropdownModule
  ],
  exports: [
    HeaderComponent,
    ProductCompareStatusComponent
  ],
  declarations: [
    HeaderComponent,
    ProductCompareStatusComponent,
    MiniCartComponent,
    SearchBoxComponent,
    WishListComponent,
    LanguageSwitchComponent,
    HeaderNavigationComponent,
    LoginStatusComponent
  ],
  providers: [AccountLoginApiService, AccountLoginMockService, AccountLoginService,
    CategoriesService, CategoriesMockService, CategoriesApiService,
    SearchBoxApiService, SearchBoxMockService, SearchBoxService,
    WishListService
  ]
})

export class HeaderModule {

}
