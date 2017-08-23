import { NgModule } from '@angular/core';
import { HeaderSlotComponent } from './header.component';
import { ProductCompareStatusComponent } from './product-compare-status/product-compare-status.component';
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
import { HeaderNavigationService } from './header-navigation/header-navigation-service/header-navigation.service';
import { HeaderNavigationMockService } from './header-navigation/header-navigation-service/header-navigation.service.mock';
import { HeaderNavigationApiService } from './header-navigation/header-navigation-service/header-navigation.service.api';
import { SearchBoxApiService } from './search-box/search-box-service/search-box.service.api';
import { SearchBoxMockService } from './search-box/search-box-service/search-box.service.mock';
import { SearchBoxService } from './search-box/search-box-service/search-box.service';

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
    LogoComponent,
    LanguageSwitchComponent,
    HeaderNavigationComponent,
    LoginStatusComponent
  ],
  providers: [AccountLoginApiService, AccountLoginMockService, AccountLoginService,
    HeaderNavigationService, HeaderNavigationMockService, HeaderNavigationApiService,
    SearchBoxApiService, SearchBoxMockService, SearchBoxService
  ]
})

export class HeaderModule {

}
