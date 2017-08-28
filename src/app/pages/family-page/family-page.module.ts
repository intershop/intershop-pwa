import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FamilyPageComponent } from './family-page.component';
import { FilterListComponent } from 'app/components/filter-list/filter-list.component';
import { FamilyPageListComponent } from './family-page-list/family-page-list.component';
import { BreadcrumbComponent } from 'app/components/breadcrumb/breadcrumb.component';
import { ProductTileComponent } from 'app/components/product-tile/product-tile.component';
import { ProductListService, ProductListApiService, ProductListMockService } from 'app/services/products';
import { SharedModule } from 'app/modules/shared.module';
import { FilterListService, FilterListMockService, FilterListApiService } from 'app/components/filter-list/filter-list-service';
import { FamilyPageRoute } from './family-page.routes';
import { CollapseModule } from 'ngx-bootstrap/collapse';

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
    BreadcrumbComponent,
    ProductTileComponent
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
