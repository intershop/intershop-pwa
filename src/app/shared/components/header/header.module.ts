import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {HeaderSlotComponent} from './header.component'
import {ProductCompareComponent} from './ProductCompare/ProductCompare.component'
import {RouterModule} from '@angular/router'
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MiniCartComponent} from './miniCart/miniCart.component';
import {SearchBox} from './searchBox/searchBox.component';
import {CompareDetailsComponent} from './productCompare/compareDetails.component';
import {WishListComponent} from './wishList/wishList.component';
import {LogoComponent} from './logo/logo.component';
import {LanguageSwitchComponent} from './languageSwitch/languageSwitch.component';
import {HeaderNavigationComponent} from './headerNavigation/headerNavigation.component';
import { LoginStatusComponent } from './loginStatus/loginStatus.component'
import { AccountLoginApiService, AccountLoginMockService, AccountLoginService } from '../../../pages/accountLogin/accountLoginService';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  exports: [
    HeaderSlotComponent, ProductCompareComponent
  ],
  declarations: [HeaderSlotComponent, ProductCompareComponent, MiniCartComponent,
    SearchBox, CompareDetailsComponent, WishListComponent, LogoComponent,
    LanguageSwitchComponent, HeaderNavigationComponent,LoginStatusComponent
  ],
   providers: [AccountLoginApiService, AccountLoginMockService, AccountLoginService]
})

export class HeaderModule {

}
