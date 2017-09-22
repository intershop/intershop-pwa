import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FilterListService } from '../../components/filter-list/filter-list-service';
import { FilterListComponent } from '../../components/filter-list/filter-list.component';
import { ProductTileComponent } from '../../components/product-tile/product-tile.component';
import { DisableIconDirective } from '../../directives/disable-icon.directive';
import { SharedModule } from '../../modules/shared.module';
import { ProductListService } from '../../services/products';
import { FamilyPageListComponent } from './family-page-list/family-page-list.component';
import { FamilyPageComponent } from './family-page.component';
import { FamilyPageRoute } from './family-page.routes';

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
