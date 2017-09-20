import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FamilyPageComponent } from './family-page.component';
import { FilterListComponent } from '../../components/filter-list/filter-list.component';
import { FamilyPageListComponent } from './family-page-list/family-page-list.component';
import { ProductTileComponent } from '../../components/product-tile/product-tile.component';
import { ProductListService } from '../../services/products';
import { SharedModule } from '../../modules/shared.module';
import { FilterListService } from '../../components/filter-list/filter-list-service';
import { FamilyPageRoute } from './family-page.routes';
import { CollapseModule } from 'ngx-bootstrap/collapse';
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
    ProductListService, FilterListService
  ]
})

export class FamilyPageModule {

}
