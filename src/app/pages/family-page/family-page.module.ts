import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ProductTileComponent } from '../../components/product-tile/product-tile.component';
import { DisableIconDirective } from '../../directives/disable-icon.directive';
import { SharedModule } from '../../modules/shared.module';
import { ShoppingModule } from '../../modules/shopping.module';
import { ProductListService } from '../../services/products';
import { FamilyPageListComponent } from './family-page-list/family-page-list.component';
import { FamilyPageComponent } from './family-page.component';
import { FamilyPageRoute } from './family-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(FamilyPageRoute),
    SharedModule,
    CollapseModule,
    ShoppingModule
  ],
  declarations: [
    FamilyPageComponent,
    FamilyPageListComponent,
    ProductTileComponent,
    DisableIconDirective
  ],
  providers: [
    ProductListService
  ]
})

export class FamilyPageModule {

}
