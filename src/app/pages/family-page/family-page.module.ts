import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FamilyPageComponent } from './family-page.component';
import { FamilyPageListComponent } from './family-page-list/family-page-list.component';
import { ProductListService, ProductListApiService, ProductListMockService } from '../../services/products';
import { FilterListService, FilterListMockService, FilterListApiService } from '../../components/filter-list/filter-list-service';
import { FamilyPageRoute } from './family-page.routes';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FilterListComponent } from '../../components/filter-list/filter-list.component';
import { ProductTileComponent } from '../../components/product-tile/product-tile.component';
import { SharedModule } from '../../modules/shared.module';
import { DisableIconDirective } from '../../directives/disable-icon.directive';

@NgModule({
  imports: [
    RouterModule.forChild(FamilyPageRoute),
    SharedModule,
    CollapseModule
  ],
  declarations: [
    FamilyPageComponent,
    FilterListComponent,
    FamilyPageListComponent,
    ProductTileComponent,
    DisableIconDirective
  ],
  providers: [
    ProductListService,
    ProductListMockService,
    ProductListApiService,
    FilterListService,
    FilterListApiService,
    FilterListMockService
  ]
})

export class FamilyPageModule {

}
