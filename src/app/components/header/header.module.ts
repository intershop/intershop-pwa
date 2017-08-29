import { NgModule } from '@angular/core';
import { HeaderSlotComponent } from './header.component';
import { ProductCompareStatusComponent } from './product-compare-status/product-compare-status.component';
import { MiniCartComponent } from './mini-cart/mini-cart.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { WishListComponent } from './wishlist-status/wishlist-status.component';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { HeaderNavigationComponent } from './header-navigation/header-navigation.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { AccountLoginApiService, AccountLoginMockService, AccountLoginService } from 'app/services/account-login';
import { SharedModule } from 'app/modules/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CategoryService } from 'app/services/categories/category.service';
import { CategoryMockService } from 'app/services/categories/category.service.mock';
import { CategoryApiService } from 'app/services/categories/category.service.api';
import { SearchBoxApiService } from 'app/services/suggest/search-box.service.api';
import { SearchBoxMockService } from 'app/services/suggest/search-box.service.mock';
import { SearchBoxService } from 'app/services/suggest/search-box.service';
import { WishListService } from 'app/services/wishlists/wishlists.service';

@NgModule({
  imports: [
    SharedModule,
    CollapseModule,
    BsDropdownModule
  ],
  exports: [
    HeaderSlotComponent,
    ProductCompareStatusComponent
  ],
  declarations: [
    HeaderSlotComponent,
    ProductCompareStatusComponent,
    MiniCartComponent,
    SearchBoxComponent,
    WishListComponent,
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
