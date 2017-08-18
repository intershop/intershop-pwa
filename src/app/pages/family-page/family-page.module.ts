import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FamilyPageComponent } from './family-page.component';
import { FilterListComponent } from '../../shared/components/filter-list/filter-list.component';
import { CategoryComponent } from '../../shared/components/category/category.component';
import { FamilyPageListComponent } from './family-page-list/family-page-list.component';
import { BreadcrumbComponent } from '../../shared/components/bread-crumb/bread-crumb.component';
import { ProductTileComponent } from '../../shared/components/product-tile/product-tile.component';
import { ProductListService, ProductListApiService, ProductListMockService } from './family-page-list/product-list-service';
import { SharedModule } from '../../shared/shared-modules/shared.module';
import { FilterListService, FilterListMockService, FilterListApiService } from '../../shared/components/filter-list/filter-list-service';
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
    CategoryComponent,
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
