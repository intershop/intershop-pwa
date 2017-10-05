import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryListComponent } from '../components/category-list/category-list.component';
import { CategoryNavigationComponent } from '../components/category-navigation/category-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent
  ],
  exports: [
    CategoryListComponent,
    CategoryNavigationComponent
  ]
})
export class ShoppingModule { }
