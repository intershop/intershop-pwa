import { NgModule } from '@angular/core';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { WishListService } from '../../../core/services/wishlists/wishlists.service';
import { RemoveHostDirective } from '../../../shared/directives/remove-host.directive';
import { CategoriesService } from '../../../shared/services/categories/categories.service';
import { SuggestService } from '../../../shared/services/suggest/suggest.service';
import { SharedModule } from '../../../shared/shared.module';
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
    SharedModule
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
  providers: [AccountLoginService, CategoriesService, SuggestService,
    WishListService
  ]
})

export class HeaderModule { }
