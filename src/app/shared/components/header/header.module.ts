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
        SearchBox, CompareDetailsComponent, WishListComponent
        ],
    providers: []
})

export class HeaderModule {

}
