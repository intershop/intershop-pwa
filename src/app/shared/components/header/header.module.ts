import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderSlotComponent } from './header.component';
import { ProductCompareComponent } from './productCompare/productCompare.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MiniCartComponent } from './miniCart/miniCart.component';
import { SearchBoxComponent } from './searchBox/searchBox.component';
import { CompareDetailsComponent } from './productCompare/compareDetails.component';
import { WishListComponent } from './wishList/wishList.component';
import { LogoComponent } from './logo/logo.component';
import { LanguageSwitchComponent } from './languageSwitch/languageSwitch.component';
import { HeaderNavigationComponent } from './headerNavigation/headerNavigation.component';
import { LoginStatusComponent } from './loginStatus/loginStatus.component';
import { AccountLoginApiService, AccountLoginMockService, AccountLoginService } from '../../../pages/accountLogin/accountLoginService';
import { SharedModule } from '../../sharedModules/shared.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    CollapseModule
  ],
  exports: [
    HeaderSlotComponent, ProductCompareComponent
  ],
  declarations: [HeaderSlotComponent, ProductCompareComponent, MiniCartComponent,
    SearchBoxComponent, CompareDetailsComponent, WishListComponent, LogoComponent,
    LanguageSwitchComponent, HeaderNavigationComponent, LoginStatusComponent
  ],
  providers: [AccountLoginApiService, AccountLoginMockService, AccountLoginService]
})

export class HeaderModule {

}
