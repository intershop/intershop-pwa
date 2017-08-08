import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderSlotComponent } from './header.component';
import { ProductCompareComponent } from './product-compare/product-compare.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MiniCartComponent } from './mini-cart/mini-cart.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { LogoComponent } from './logo/logo.component';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { HeaderNavigationComponent } from './header-navigation/header-navigation.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { AccountLoginApiService, AccountLoginMockService, AccountLoginService } from '../../../pages/account-login/account-login-service';
import { SharedModule } from '../../shared-modules/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
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
  providers: [
    AccountLoginApiService,
    AccountLoginMockService,
    AccountLoginService
  ]
})

export class HeaderModule {

}
