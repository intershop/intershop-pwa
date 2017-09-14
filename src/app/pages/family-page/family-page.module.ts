import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FamilyPageComponent } from './family-page.component';
import { FilterListComponent } from '../../components/filter-list/filter-list.component';
import { FamilyPageListComponent } from './family-page-list/family-page-list.component';
import { BreadcrumbComponent } from 'app/components/breadcrumb/breadcrumb.component';
import { ProductTileComponent } from 'app/components/product-tile/product-tile.component';
import { ProductListService } from 'app/services/products';
import { SharedModule } from 'app/modules/shared.module';
import { FilterListService } from 'app/components/filter-list/filter-list-service';
import { FamilyPageRoute } from './family-page.routes';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DisableIconDirective } from 'app/directives/disable-icon.directive';

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
    ProductTileComponent,
    DisableIconDirective
  ],
  providers: [
    ProductListService, FilterListService
    ]
})

export class FamilyPageModule {

}
