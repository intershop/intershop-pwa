import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HeaderSlotComponent } from './header.component'
import { ProductCompareComponent } from './ProductCompare/ProductCompare.component'
import { RouterModule } from '@angular/router'
import { SearchBox } from "app/shared/components/header/searchbox/searchbox.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MiniCartComponent } from "app/shared/components/header/miniCart/miniCart.component";
import { CompareDetailsComponent } from "app/shared/components/header/productCompare/compareDetails.component";
import { WishListComponent } from "app/shared/components/header/wishList/wishList.component";
import { LogoComponent } from "app/shared/components/header/logo/logo.component";
import { LanguageSwitchComponent } from "app/shared/components/header/languageSwitch/languageSwitch.component";
import { HeaderNavigationComponent } from "app/shared/components/header/headerNavigation/headerNavigation.component";
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
        LanguageSwitchComponent, HeaderNavigationComponent, LoginStatusComponent
    ],
    providers: [AccountLoginApiService, AccountLoginMockService, AccountLoginService]
})

export class HeaderModule {

}
