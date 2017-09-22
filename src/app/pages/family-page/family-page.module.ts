import { ShoppingModule } from './../../modules/shopping.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FamilyPageComponent } from './family-page.component';
import { FamilyPageListComponent } from './family-page-list/family-page-list.component';
import { ProductTileComponent } from '../../components/product-tile/product-tile.component';
import { ProductListService, ProductListApiService, ProductListMockService } from '../../services/products';
import { SharedModule } from '../../modules/shared.module';
import { FamilyPageRoute } from './family-page.routes';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DisableIconDirective } from '../../directives/disable-icon.directive';

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
    ProductListService,
    ProductListMockService,
    ProductListApiService
  ]
})

export class FamilyPageModule {

}
