import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RemoveHostDirective } from '../../directives/remove-host.directive';
import { SharedModule } from '../../modules/shared.module';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { SearchBoxService } from '../../services/suggest/search-box.service';
import { WishListService } from '../../services/wishlists/wishlists.service';
import { HeaderNavigationComponent } from './header-navigation/header-navigation.component';
import { SubCategoryNavigationComponent } from './header-navigation/subcategory-navigation/subcategory-navigation.component';
import { HeaderComponent } from './header.component';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { MiniCartComponent } from './mini-cart/mini-cart.component';
import { ProductCompareStatusComponent } from './product-compare-status/product-compare-status.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { WishListComponent } from './wishlist-status/wishlist-status.component';

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
    LoginStatusComponent,
    SubCategoryNavigationComponent,
    RemoveHostDirective
  ],
  providers: [AccountLoginService, CategoriesService, SearchBoxService,
    WishListService
  ]
})

export class HeaderModule {

}
