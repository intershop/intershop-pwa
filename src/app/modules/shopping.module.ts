import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryListComponent } from '../components/category-list/category-list.component';
import { CategoryNavigationComponent } from '../components/category-navigation/category-navigation.component';
import { SubCategoryNavigationComponent } from '../components/category-navigation/subcategory-navigation/subcategory-navigation.component';
import { ProductListComponent } from '../components/product-list/product-list.component';
import { ProductTileComponent } from '../components/product-tile/product-tile.component';
import { DisableIconDirective } from '../directives/disable-icon.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    SubCategoryNavigationComponent,
    DisableIconDirective,
    ProductListComponent,
    ProductTileComponent
  ],
  exports: [
    CategoryListComponent,
    CategoryNavigationComponent,
    SubCategoryNavigationComponent,
    DisableIconDirective,
    ProductListComponent,
    ProductTileComponent
  ]
})
export class ShoppingModule { }
