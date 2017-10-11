import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryListComponent } from '../components/category-list/category-list.component';
import { CategoryNavigationComponent } from '../components/category-navigation/category-navigation.component';
import { ProductListComponent } from '../components/product-list/product-list.component';
import { ProductTileComponent } from '../components/product-tile/product-tile.component';
import { DisableIconDirective } from '../directives/disable-icon.directive';
import { SharedModule } from './shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    DisableIconDirective,
    ProductListComponent,
    ProductTileComponent
  ],
  exports: [
    CategoryListComponent,
    CategoryNavigationComponent,
    DisableIconDirective,
    ProductListComponent,
    ProductTileComponent
  ]
})
export class ShoppingModule { }
