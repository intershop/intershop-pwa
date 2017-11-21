import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { DisableIconDirective } from '../shared/directives/disable-icon.directive';
import { SharedModule } from '../shared/shared.module';
import { CategoryNavigationComponent } from './components/category//category-navigation/category-navigation.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    BreadcrumbComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    DisableIconDirective,
    ProductListComponent,
    ProductRowComponent,
    ProductTileComponent
  ],
  exports: [
    BreadcrumbComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    DisableIconDirective,
    ProductListComponent,
    ProductRowComponent,
    ProductTileComponent
  ]
})
export class ShoppingModule { }
