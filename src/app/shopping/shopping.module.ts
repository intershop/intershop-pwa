import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CategoryNavigationComponent } from './components/category//category-navigation/category-navigation.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';
import { DisableIconDirective } from './directives/disable-icon.directive';

@NgModule({
  imports: [
    SharedModule,
    // ShoppingRoutingModule // TODO: remove this import since it leads to recursive routes with category page (see Augury)
  ],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    DisableIconDirective,
    ProductListComponent,
    ProductRowComponent,
    ProductTileComponent
  ],
  exports: [
    CategoryListComponent,
    CategoryNavigationComponent,
    DisableIconDirective,
    ProductListComponent,
    ProductRowComponent,
    ProductTileComponent
  ]
})

export class ShoppingModule { }
